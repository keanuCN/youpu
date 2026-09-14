import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import type { OutboxConsumer, OutboxRow } from '../outbox.types';

/**
 * rating.changed / favorite.changed → 重算产品聚合回写（写时聚合，读路径零计算）
 * 重算完成后追加 product.updated 事件，让 ES 同步自动跟进（一条链路解决三件事）
 */
@Injectable()
export class RatingRecountConsumer implements OutboxConsumer {
  readonly types = ['rating.changed', 'favorite.changed', 'recount.required'];
  private readonly logger = new Logger(RatingRecountConsumer.name);

  constructor(private readonly prisma: PrismaService) {}

  async handle(event: OutboxRow): Promise<void> {
    const productId = event.aggregateId;

    const [ratings, favoriteCount] = await Promise.all([
      this.prisma.rating.findMany({
        where: { productId, status: 'published' },
        select: { overall: true, sub: true },
      }),
      this.prisma.favorite.count({ where: { productId } }),
    ]);

    const ratingCount = ratings.length;
    const ratingOverall =
      ratingCount === 0
        ? null
        : round2(ratings.reduce((sum, r) => sum + Number(r.overall), 0) / ratingCount);
    const ratingSub = averageSubDimensions(ratings.map((r) => (r.sub ?? {}) as Record<string, unknown>));

    await this.prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: productId },
        data: { ratingOverall, ratingCount, ratingSub, favoriteCount },
      });
      await tx.outboxEvent.create({
        data: {
          aggregate: 'product',
          aggregateId: productId,
          type: 'product.updated',
          payload: { reason: 'rating.recount' },
        },
      });
    });

    this.logger.debug(
      `重算完成 product=${productId} rating=${ratingOverall ?? '-'}(${ratingCount}) favorites=${favoriteCount}`,
    );
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function averageSubDimensions(subs: Array<Record<string, unknown>>): Record<string, number> {
  const sums = new Map<string, { total: number; count: number }>();
  for (const sub of subs) {
    for (const [key, value] of Object.entries(sub)) {
      if (typeof value !== 'number' || !Number.isFinite(value)) continue;
      const entry = sums.get(key) ?? { total: 0, count: 0 };
      entry.total += value;
      entry.count += 1;
      sums.set(key, entry);
    }
  }
  const out: Record<string, number> = {};
  for (const [key, { total, count }] of sums) {
    if (count > 0) out[key] = round2(total / count);
  }
  return out;
}
