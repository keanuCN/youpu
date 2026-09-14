import { Injectable, Logger } from '@nestjs/common';
import type { OutboxConsumer, OutboxRow } from '../outbox.types';

/**
 * notification.created 消费骨架（M3 随社区流接入：新回复 / 被点赞 → 站内通知）
 * M1 阶段只登记事件类型与日志，避免链路缺口。
 */
@Injectable()
export class NotificationConsumer implements OutboxConsumer {
  readonly types = ['notification.created'];
  private readonly logger = new Logger(NotificationConsumer.name);

  async handle(event: OutboxRow): Promise<void> {
    this.logger.debug(`通知事件待处理（M3 接入）：${event.aggregateId}`);
  }
}
