import 'dotenv/config';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ProductEsSyncConsumer } from '../outbox/consumers/product-es-sync.consumer';
import { ElasticService } from './elastic.service';

/** ES 全量重建：pnpm --filter @youpu/api es:reindex（复用 es-sync consumer，无逻辑分叉） */
async function main(): Promise<void> {
  const logger = new Logger('es:reindex');
  const prisma = new PrismaService();
  const elastic = new ElasticService();
  elastic.onModuleInit();

  if (!elastic.enabled) {
    logger.error('未配置 ES_NODE，退出');
    process.exitCode = 1;
    return;
  }

  try {
    await elastic.ensureIndex();
    const products = await prisma.product.findMany({
      where: { status: 'published' },
      select: { id: true },
    });
    logger.log(`待重建 ${products.length} 个产品`);

    const consumer = new ProductEsSyncConsumer(prisma, elastic);
    let done = 0;
    for (const product of products) {
      await consumer.handle({
        id: 0n,
        aggregate: 'product',
        aggregateId: product.id,
        type: 'product.updated',
        payload: { reason: 'reindex' },
        attempts: 0,
      });
      done += 1;
    }
    logger.log(`ES 重建完成：${done} 个产品`);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
