import 'dotenv/config';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse } from 'yaml';
import { normalizePriceRange, productSeedSchema } from '@youpu/schema';
import { PrismaService } from '../common/prisma.service';
import { uuidv7 } from '../common/uuid';

async function main(): Promise<void> {
  const apply = process.argv.includes('--apply');
  const dataDir = resolve(process.cwd(), process.env.DATA_DIR ?? '../../data');
  const seeds = readdirSync(join(dataDir, 'skis'))
    .filter(file => file.endsWith('.yaml'))
    .map(file => productSeedSchema.parse(parse(readFileSync(join(dataDir, 'skis', file), 'utf8'))))
    .filter(seed => seed.price !== undefined);
  if (seeds.length === 0 || seeds.some(seed => seed.category !== 'skis')) {
    throw new Error('双板价格清单为空或混入其他类目');
  }

  const prisma = new PrismaService();
  try {
    const category = await prisma.category.findUnique({ where: { slug: 'skis' }, select: { id: true } });
    if (!category) throw new Error('生产双板类目不存在');
    const products = await prisma.product.findMany({
      where: { slug: { in: seeds.map(seed => seed.slug) } },
      include: { brand: { select: { slug: true } } },
    });
    const bySlug = new Map(products.map(product => [product.slug, product]));
    const skippedMissing = seeds.filter(seed => !bySlug.has(seed.slug)).map(seed => seed.slug);
    const updates = seeds.map(seed => {
      const product = bySlug.get(seed.slug);
      if (!product) return undefined;
      if (product.categoryId !== category.id || product.brand.slug !== seed.brand ||
          product.model !== seed.model || product.year !== seed.year) {
        throw new Error(`生产商品身份与 seed 不符：${seed.slug}`);
      }
      const price = normalizePriceRange(seed.price!);
      return { seed, product, price };
    }).filter((update): update is NonNullable<typeof update> => update !== undefined);
    if (updates.length === 0) throw new Error('生产目录中没有可同步的双板商品');
    console.log(JSON.stringify({
      mode: apply ? 'apply' : 'preview',
      category: 'skis',
      products: updates.length,
      skippedMissing,
      changed: updates.filter(({ product, price }) =>
        Number(product.priceMin) !== price.min || Number(product.priceMax) !== price.max || product.priceCurrency !== price.currency,
      ).map(({ seed, product, price }) => ({
        slug: seed.slug,
        from: { min: product.priceMin === null ? null : Number(product.priceMin), max: product.priceMax === null ? null : Number(product.priceMax), currency: product.priceCurrency },
        to: price,
      })),
      protected: ['specs', 'images', 'status', 'editorialScores', 'ratings', 'favorites'],
    }, null, 2));
    if (!apply) return;
    await prisma.$transaction(async tx => {
      for (const { seed, product, price } of updates) {
        const updated = await tx.product.update({
          where: { id: product.id },
          data: { priceMin: price.min, priceMax: price.max, priceCurrency: price.currency },
          select: { id: true },
        });
        await tx.outboxEvent.create({ data: {
          aggregate: 'product',
          aggregateId: updated.id,
          type: 'product.updated',
          payload: { reason: 'ski.price-sync', fields: ['priceMin', 'priceMax', 'priceCurrency'] },
        } });
      }
    }, { isolationLevel: 'Serializable', timeout: 60000 });
    console.log(`双板价格同步完成：${updates.length} 款；规格、图片、发布状态与社区数据保持不变。`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
