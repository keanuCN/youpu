import { Inject, Injectable, Logger } from '@nestjs/common';
import type Redis from 'ioredis';
import { sanitizeEventProps, type EventBatch } from '@youpu/schema';
import { REDIS } from '../common/redis.module';

export const EVENTS_STREAM = 'events:raw';

interface RawEntry {
  anonId: string;
  accountId?: string;
  name: string;
  props: Record<string, unknown>;
  ts: number;
  path?: string;
}

/** 写路径：POST /api/events → 校验 + props 白名单裁剪 → Redis Stream（§12.1） */
@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  async ingest(batch: EventBatch, accountId?: string): Promise<number> {
    const entries: RawEntry[] = [];
    for (const event of batch.events) {
      const props = sanitizeEventProps(event.name, event.props);
      if (props === null) {
        this.logger.debug(`丢弃非法埋点：${event.name}`);
        continue;
      }
      entries.push({
        anonId: batch.anonId,
        accountId,
        name: event.name,
        props,
        ts: event.ts,
        path: event.path,
      });
    }
    if (entries.length === 0) return 0;

    try {
      const pipeline = this.redis.pipeline();
      for (const entry of entries) {
        // MAXLEN ~ 10000：埋点可容忍丢弃，防 Redis 内存无界增长
        pipeline.xadd(EVENTS_STREAM, 'MAXLEN', '~', 10000, '*', 'payload', JSON.stringify(entry));
      }
      await pipeline.exec();
    } catch (err) {
      // 埋点不阻断主流程：上报失败只告警
      this.logger.warn(`埋点写入 Redis 失败：${(err as Error).message}`);
    }
    return entries.length;
  }
}
