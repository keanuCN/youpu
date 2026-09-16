import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { toJsonInput } from '../../common/json';
import type { OutboxConsumer, OutboxRow } from '../outbox.types';

/**
 * notification.created → 写入站内通知表。
 * 社区写入业务数据与 outbox 在同一事务内完成，通知在 worker 中异步落库。
 */
@Injectable()
export class NotificationConsumer implements OutboxConsumer {
  readonly types = ['notification.created'];
  private readonly logger = new Logger(NotificationConsumer.name);

  constructor(private readonly prisma: PrismaService) {}

  async handle(event: OutboxRow): Promise<void> {
    const accountId = stringValue(event.payload.accountId);
    const type = stringValue(event.payload.type);
    if (!accountId || !type) {
      this.logger.warn(`通知事件缺少 accountId/type：${event.id}`);
      return;
    }
    const actorId = stringValue(event.payload.actorId);
    const targetType = stringValue(event.payload.targetType);
    const targetId = stringValue(event.payload.targetId);
    const payload = event.payload.payload && typeof event.payload.payload === 'object'
      ? event.payload.payload
      : {};
    await this.prisma.notification.create({
      data: {
        accountId,
        type,
        actorId: actorId || null,
        targetType: targetType || null,
        targetId: targetId || null,
        payload: toJsonInput(payload),
      },
    });
    this.logger.debug(`通知已写入 account=${accountId} type=${type}`);
  }
}

function stringValue(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}
