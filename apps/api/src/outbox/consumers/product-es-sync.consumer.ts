import { Injectable, Logger } from '@nestjs/common';
import { computeComposite, parseSpecSchema } from '@youpu/schema';
import { PrismaService } from '../../common/prisma.service';
import { ElasticService } from '../../search/elastic.service';
import type { OutboxConsumer, OutboxRow } from '../outbox.types';

/** product.* → ES 文档同步；ES 未就绪时抛错，由 outbox 重试（5 次后转死信） */
@Injectable()
export class ProductEsSyncConsumer implements OutboxConsumer {
  readonly types = ['product.created', 'product.updated', 'product.deleted'];
  private readonly logger = new Logger(ProductEsSyncConsumer.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly elastic: ElasticService,
  ) {}

  async handle(event: OutboxRow): Promise<void> {
    if (!this.elastic.enabled) {
      this.logger.debug('ES 未配置，跳过同步');
      return;
    }
    await this.elastic.ensureIndex();

    if (event.type === 'product.deleted') {
      await this.elastic.deleteProduct(event.aggregateId);
      return;
    }

    const product = await this.prisma.product.findUnique({
      where: { id: event.aggregateId },
      include: { brand: true, category: true, stat: true },
    });
    if (!product) {
      await this.elastic.deleteProduct(event.aggregateId);
      return;
    }
    if (product.status !== 'published') {
      await this.elastic.deleteProduct(product.id);
      return;
    }

    const categoryPath = await this.categoryPath(product.categoryId);
    const specSchema = product.category.specSchema ? parseSpecSchema(product.category.specSchema) : null;
    const rawSpecs = (product.specs ?? {}) as Record<string, unknown>;

    // 只把参与筛选的字段拍平进 ES（聚合分面来源），nested 字段不进索引
    const flatSpecs: Record<string, unknown> = {};
    for (const field of specSchema?.fields ?? []) {
      if (field.filter === false || field.type === 'nested') continue;
      if (rawSpecs[field.key] !== undefined) flatSpecs[field.key] = rawSpecs[field.key];
    }

    await this.elastic.indexProduct({
      id: product.id,
      title: product.title,
      brandName: product.brand.nameCn ?? product.brand.name,
      categoryPath,
      year: product.year,
      priceMin: product.priceMin === null ? null : Number(product.priceMin),
      rating: product.ratingOverall === null ? null : Number(product.ratingOverall),
      composite: specSchema
        ? computeComposite(specSchema, (product.editorialScores ?? null) as Record<string, number> | null)
        : null,
      ratingCount: product.ratingCount,
      view7d: product.stat?.view7d ?? 0,
      oneLiner: product.oneLiner,
      specs: flatSpecs,
    } satisfies Record<string, unknown> & { id: string });
  }

  /** ltree path 走 raw 查询（Prisma 不支持 ltree 读） */
  private async categoryPath(categoryId: string): Promise<string[]> {
    const rows = await this.prisma.$queryRaw<Array<{ path: string | null }>>`
      SELECT path::text AS path FROM category WHERE id = ${categoryId}::uuid
    `;
    const path = rows[0]?.path;
    return path ? path.split('.') : [];
  }
}
