import { Injectable, Logger } from '@nestjs/common';
import type { OutboxConsumer, OutboxRow } from '../outbox.types';

/**
 * config.changed 消费骨架（M3 随配置中心接入：进程内缓存失效，规则调整分钟级生效）
 * M1 阶段只登记事件类型与日志。
 */
@Injectable()
export class ConfigChangedConsumer implements OutboxConsumer {
  readonly types = ['config.changed'];
  private readonly logger = new Logger(ConfigChangedConsumer.name);

  async handle(event: OutboxRow): Promise<void> {
    this.logger.debug(`配置变更待处理（M3 接入缓存失效）：${JSON.stringify(event.payload)}`);
  }
}
