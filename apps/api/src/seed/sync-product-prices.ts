import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { productSeedSchema } from '@youpu/schema';
import { PrismaService } from '../common/prisma.service';
import { toJsonInput } from '../common/json';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const files = args.filter((value) => !value.startsWith('--'));
  if (!files.length) throw new Error('用法：seed:prices -- <产品 YAML 路径...> [--apply]');

  const seeds = files.map((file) => productSeedSchema.parse(parseYaml(readFileSync(resolve(file), 'utf8'))));
  if (seeds.some((seed) => !seed.price)) throw new Error('清单中存在没有已核验价格的商品');
  if (new Set(seeds.map((seed) => seed.slug)).size !== seeds.length) throw new Error('价格同步清单包含重复 slug');

  const prisma = new PrismaService();
  try {
    const products = await prisma.product.findMany({
      where: { slug: { in: seeds.map((seed) => seed.slug) } },
      include: { category: { select: { slug: true } }, brand: { select: { slug: true } } },
    });
    const productBySlug = new Map(products.map((product) => [product.slug, product]));
    const changes = seeds.map((seed) => {
      const product = productBySlug.get(seed.slug);
      if (!product) throw new Error(`线上商品不存在：${seed.slug}`);
      if (product.category.slug !== seed.category || product.brand.slug !== seed.brand || product.model !== seed.model || product.year !== seed.year) {
        throw new Error(`线上商品身份与种子不符：${seed.slug}`);
      }
      const changed = Number(product.priceMin) !== seed.price!.min
        || Number(product.priceMax) !== seed.price!.max
        || product.priceCurrency !== seed.price!.currency
        || (product.specs as Record<string, unknown>).priceSource !== seed.specs.priceSource
        || (product.specs as Record<string, unknown>).priceStatus !== seed.specs.priceStatus;
      return { seed, product, changed };
    }).filter((item) => item.changed);

    console.log(JSON.stringify({
      mode: apply ? 'apply' : 'preview',
      checked: seeds.length,
      changed: changes.map(({ seed, product }) => ({
        slug: seed.slug,
        previousPrice: { min: product.priceMin?.toString() ?? null, max: product.priceMax?.toString() ?? null, currency: product.priceCurrency },
        nextPrice: { min: seed.price!.min, max: seed.price!.max, currency: seed.price!.currency },
      })),
      protected: ['images', 'technical specs', 'editorial scores', 'community ratings and reviews', 'favorites', 'product statistics', 'accounts'],
    }, null, 2));
    if (!apply || changes.length === 0) return;

    await prisma.$transaction(async (tx) => {
      for (const { seed, product } of changes) {
        await tx.product.update({
          where: { id: product.id },
          data: {
            priceMin: seed.price!.min,
            priceMax: seed.price!.max,
            priceCurrency: seed.price!.currency,
            specs: toJsonInput({ ...(product.specs as Record<string, unknown>), priceSource: seed.specs.priceSource, priceStatus: seed.specs.priceStatus }),
          },
        });
        await tx.outboxEvent.create({
          data: {
            aggregate: 'product',
            aggregateId: product.id,
            type: 'product.updated',
            payload: { reason: 'product-price-sync', fields: ['priceMin', 'priceMax', 'priceCurrency', 'specs.priceSource', 'specs.priceStatus'] },
          },
        });
      }
    }, { isolationLevel: 'Serializable', timeout: 120000 });
    console.log(`价格同步完成：更新 ${changes.length} 款；图片、规格和社区数据保持不变。`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
