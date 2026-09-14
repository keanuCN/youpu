import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.module';
import { ElasticService } from '../search/elastic.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly elastic: ElasticService,
  ) {}

  @Get()
  async check() {
    const [db, redis, es] = await Promise.all([
      this.checkDb(),
      this.checkRedis(),
      this.elastic.ping(),
    ]);
    return { status: db && redis ? 'ok' : 'degraded', db, redis, es };
  }

  private async checkDb(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  private async checkRedis(): Promise<boolean> {
    try {
      return (await this.redis.client.ping()) === 'PONG';
    } catch {
      return false;
    }
  }
}
