import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from './db';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit(): Promise<void> {
    await this.$connect();
    await this.ensureCurrentEventPartition();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  /** 保证当月 event 分区存在（DDL 见 migrations 的 ensure_event_partition） */
  private async ensureCurrentEventPartition(): Promise<void> {
    try {
      await this.$executeRawUnsafe(`SELECT ensure_event_partition(now())`);
    } catch (err) {
      this.logger.warn(`event 分区检查失败（迁移是否已执行？）：${(err as Error).message}`);
    }
  }
}
