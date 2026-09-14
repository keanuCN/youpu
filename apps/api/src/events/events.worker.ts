import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type Redis from 'ioredis';
import type { Prisma } from '../common/db';
import { PrismaService } from '../common/prisma.service';
import { toJsonInput } from '../common/json';
import { REDIS } from '../common/redis.module';
import { EVENTS_STREAM } from './events.service';

const GROUP = 'ingest';
const BATCH_SIZE = 200;

type StreamEntries = Array<[string, Array<[string, string[]]>]>;

/** 读路径：Redis Stream → 批量落 PG event 表（按月分区，见 migrations） */
@Injectable()
export class EventsIngestWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EventsIngestWorker.name);
  private readonly consumer = `api-${process.pid}`;
  private stopping = false;
  private loopPromise: Promise<void> | null = null;

  constructor(
    @Inject(REDIS) private readonly redis: Redis,
    private readonly prisma: PrismaService,
  ) {}

  onModuleInit(): void {
    this.loopPromise = this.start();
  }

  async onModuleDestroy(): Promise<void> {
    this.stopping = true;
    await this.loopPromise;
  }

  private async start(): Promise<void> {
    await this.ensureGroup();
    while (!this.stopping) {
      try {
        const got = (await this.redis.xreadgroup(
          'GROUP',
          GROUP,
          this.consumer,
          'COUNT',
          BATCH_SIZE,
          'BLOCK',
          2000,
          'STREAMS',
          EVENTS_STREAM,
          '>',
        )) as StreamEntries | null;
        if (!got || got.length === 0) continue;
        await this.flush(got[0]?.[1] ?? []);
      } catch (err) {
        if (this.stopping) return;
        this.logger.warn(`埋点摄取循环异常：${(err as Error).message}`);
        await sleep(2000);
      }
    }
  }

  private async ensureGroup(): Promise<void> {
    try {
      await this.redis.xgroup('CREATE', EVENTS_STREAM, GROUP, '$', 'MKSTREAM');
      this.logger.log(`已创建消费组 ${EVENTS_STREAM}/${GROUP}`);
    } catch (err) {
      const msg = (err as Error).message;
      if (!msg.includes('BUSYGROUP')) this.logger.warn(`消费组检查失败：${msg}`);
    }
  }

  private async flush(entries: Array<[string, string[]]>): Promise<void> {
    if (entries.length === 0) return;
    const ids: string[] = [];
    const rows: Array<{
      anonId: string;
      accountId: string | null;
      name: string;
      props: Prisma.InputJsonValue;
      createdAt: Date;
    }> = [];

    for (const [id, fields] of entries) {
      ids.push(id);
      const payloadIndex = fields.indexOf('payload');
      const payloadRaw = payloadIndex >= 0 ? fields[payloadIndex + 1] : undefined;
      if (!payloadRaw) continue;
      try {
        const parsed = JSON.parse(payloadRaw) as {
          anonId: string;
          accountId?: string;
          name: string;
          props: Record<string, unknown>;
          ts: number;
        };
        rows.push({
          anonId: parsed.anonId,
          accountId: parsed.accountId ?? null,
          name: parsed.name,
          props: toJsonInput(parsed.props),
          // 客户端时间可能不可信，created_at 由服务端接收时间生成（ts 留 props 备查）
          createdAt: new Date(),
        });
      } catch {
        this.logger.debug(`丢弃无法解析的埋点条目 ${id}`);
      }
    }

    try {
      if (rows.length > 0) await this.prisma.event.createMany({ data: rows });
    } catch (err) {
      // 埋点数据可容忍丢弃：落库失败也 ACK，避免毒丸条目阻塞循环
      this.logger.error(`埋点落库失败（丢弃 ${rows.length} 条）：${(err as Error).message}`);
    }

    const pipeline = this.redis.pipeline();
    for (const id of ids) {
      pipeline.xack(EVENTS_STREAM, GROUP, id);
      pipeline.xdel(EVENTS_STREAM, id);
    }
    await pipeline.exec();
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
