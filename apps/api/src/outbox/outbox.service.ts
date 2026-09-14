import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import type { OutboxConsumer, OutboxRow } from './outbox.types';
import { ConfigChangedConsumer } from './consumers/config-changed.consumer';
import { NotificationConsumer } from './consumers/notification.consumer';
import { ProductEsSyncConsumer } from './consumers/product-es-sync.consumer';
import { RatingRecountConsumer } from './consumers/rating-recount.consumer';

const POLL_INTERVAL_MS = 2000;
const BATCH_SIZE = 50;
const MAX_ATTEMPTS = 5;

/**
 * outbox 发件箱 worker（DB 设计 §7.2）：
 * 业务写 PG 的同事务内 insert 事件 → 本 worker 轮询消费 → 聚合重算 / ES 同步 / 通知。
 * 单实例单 worker 顺序处理，无并发竞争；多实例部署时需改为 SKIP LOCKED 抢占（预留字段已够）。
 */
@Injectable()
export class OutboxService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxService.name);
  private readonly registry = new Map<string, OutboxConsumer>();
  private timer: NodeJS.Timeout | null = null;
  private ticking = false;
  private stopping = false;

  constructor(
    private readonly prisma: PrismaService,
    esSync: ProductEsSyncConsumer,
    recount: RatingRecountConsumer,
    notification: NotificationConsumer,
    configChanged: ConfigChangedConsumer,
  ) {
    for (const consumer of [esSync, recount, notification, configChanged]) {
      for (const type of consumer.types) {
        this.registry.set(type, consumer);
      }
    }
  }

  onModuleInit(): void {
    this.timer = setInterval(() => void this.tick(), POLL_INTERVAL_MS);
    this.logger.log(`outbox worker 启动，已注册 ${this.registry.size} 种事件：${[...this.registry.keys()].join(', ')}`);
  }

  async onModuleDestroy(): Promise<void> {
    this.stopping = true;
    if (this.timer) clearInterval(this.timer);
  }

  private async tick(): Promise<void> {
    if (this.ticking || this.stopping) return;
    this.ticking = true;
    try {
      await this.processBatch();
    } catch (err) {
      this.logger.warn(`outbox 轮询异常：${(err as Error).message}`);
    } finally {
      this.ticking = false;
    }
  }

  private async processBatch(): Promise<void> {
    const rows = await this.prisma.outboxEvent.findMany({
      where: { processedAt: null },
      orderBy: { id: 'asc' },
      take: BATCH_SIZE,
    });

    for (const row of rows) {
      if (this.stopping) return;
      const event: OutboxRow = {
        id: row.id,
        aggregate: row.aggregate,
        aggregateId: row.aggregateId,
        type: row.type,
        payload: (row.payload ?? {}) as Record<string, unknown>,
        attempts: row.attempts,
      };
      const consumer = this.registry.get(event.type);
      if (!consumer) {
        this.logger.debug(`无消费者的事件类型 ${event.type}，直接标记已处理`);
        await this.markProcessed(event.id);
        continue;
      }
      try {
        await consumer.handle(event);
        await this.markProcessed(event.id);
      } catch (err) {
        const attempts = event.attempts + 1;
        const message = (err as Error).message;
        if (attempts >= MAX_ATTEMPTS) {
          this.logger.error(`事件 ${event.type}#${event.id} 重试 ${attempts} 次仍失败，转死信：${message}`);
          await this.markProcessed(event.id, attempts);
        } else {
          this.logger.warn(`事件 ${event.type}#${event.id} 处理失败（第 ${attempts} 次）：${message}`);
          await this.prisma.outboxEvent.update({ where: { id: event.id }, data: { attempts } });
        }
      }
    }
  }

  private async markProcessed(id: bigint, attempts?: number): Promise<void> {
    await this.prisma.outboxEvent.update({
      where: { id },
      data: { processedAt: new Date(), ...(attempts !== undefined ? { attempts } : {}) },
    });
  }
}
