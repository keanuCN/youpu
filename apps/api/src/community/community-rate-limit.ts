import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import type Redis from 'ioredis';
import { REDIS } from '../common/redis.module';

const LIMITS = {
  rating: { seconds: 300, key: 'rating' },
  reply: { seconds: 30, key: 'reply' },
  report: { seconds: 60, key: 'report' },
  helpful: { seconds: 5, key: 'helpful' },
} as const;

export type CommunityRateLimitScope = keyof typeof LIMITS;

export class TooManyRequestsException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}

@Injectable()
export class CommunityRateLimit {
  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  async assertAllowed(accountId: string, scope: CommunityRateLimitScope): Promise<void> {
    const limit = LIMITS[scope];
    const accepted = await this.redis.set(`community:${limit.key}:${accountId}`, '1', 'EX', limit.seconds, 'NX');
    if (accepted !== 'OK') throw new TooManyRequestsException('操作过于频繁，请稍后再试');
  }
}
