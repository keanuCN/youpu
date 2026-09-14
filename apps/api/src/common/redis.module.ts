import { Global, Injectable, Logger, Module, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { env } from '../config/env';

export const REDIS = Symbol('REDIS');

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  readonly client: Redis;

  constructor() {
    this.client = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 2,
      lazyConnect: false,
      retryStrategy: (times) => Math.min(times * 500, 5000),
    });
    this.client.on('error', (err) => this.logger.warn(`Redis 连接异常：${err.message}`));
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit().catch(() => undefined);
  }
}

@Global()
@Module({
  providers: [RedisService, { provide: REDIS, useFactory: (svc: RedisService) => svc.client, inject: [RedisService] }],
  exports: [RedisService, REDIS],
})
export class RedisModule {}
