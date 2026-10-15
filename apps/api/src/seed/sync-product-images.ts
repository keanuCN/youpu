import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { productSeedSchema } from '@youpu/schema';
import { PrismaService } from '../common/prisma.service';
import { uuidv7 } from '../common/uuid';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const files = args.filter((value) => !value.startsWith('--'));
  if (!files.length) throw new Error('用法：seed:images -- <产品 YAML 路径...> [--apply]');

  const seeds = files.map((file) => productSeedSchema.parse(parseYaml(readFileSync(resolve(file), 'utf8'))));
  if (seeds.some((seed) => seed.images.length === 0)) throw new Error('图片同步清单包含无图商品');
  if (new Set(seeds.map((seed) => seed.slug)).size !== seeds.length) throw new Error('图片同步清单包含重复 slug');

  const prisma = new PrismaService();
  try {
    const products = await prisma.product.findMany({
      where: { slug: { in: seeds.map((seed) => seed.slug) } },
      include: {
        category: { select: { slug: true } },
        brand: { select: { slug: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
    const productBySlug = new Map(products.map((product) => [product.slug, product]));
    const changes = seeds.map((seed) => {
      const product = productBySlug.get(seed.slug);
      if (!product) throw new Error(`线上商品不存在：${seed.slug}`);
      if (product.category.slug !== seed.category || product.brand.slug !== seed.brand || product.model !== seed.model || product.year !== seed.year) {
        throw new Error(`线上商品身份与种子不符：${seed.slug}`);
      }
      const currentImages = product.images.map((image) => ({ url: image.url, kind: image.kind, sortOrder: image.sortOrder, alt: image.alt, source: image.source }));
      const desiredImages = seed.images.map((image) => ({ url: image.url, kind: image.kind, sortOrder: image.sort_order, alt: image.alt ?? null, source: image.source ?? null }));
      return {
        seed,
        product,
        changed: product.coverUrl !== seed.images[0]!.url || JSON.stringify(currentImages) !== JSON.stringify(desiredImages),
      };
    }).filter((item) => item.changed);

    console.log(JSON.stringify({
      mode: apply ? 'apply' : 'preview',
      checked: seeds.length,
      changed: changes.map(({ seed, product }) => ({ slug: seed.slug, previousImageCount: product.images.length, nextImageCount: seed.images.length })),
      protected: ['price', 'specs', 'editorial scores', 'community ratings and reviews', 'favorites', 'product statistics', 'accounts'],
    }, null, 2));
    if (!apply || changes.length === 0) return;

    await prisma.$transaction(async (tx) => {
      for (const { seed, product } of changes) {
        await tx.product.update({ where: { id: product.id }, data: { coverUrl: seed.images[0]!.url } });
        await tx.productImage.deleteMany({ where: { productId: product.id } });
        await tx.productImage.createMany({ data: seed.images.map((image) => ({
          id: uuidv7(),
          productId: product.id,
          url: image.url,
          kind: image.kind,
          sortOrder: image.sort_order,
          alt: image.alt,
          source: image.source,
        })) });
        await tx.outboxEvent.create({
          data: {
            aggregate: 'product',
            aggregateId: product.id,
            type: 'product.updated',
            payload: { reason: 'product-image-sync', fields: ['images'] },
          },
        });
      }
    }, { isolationLevel: 'Serializable', timeout: 120000 });
    console.log(`商品图片同步完成：更新 ${changes.length} 款；商品价格、规格和社区数据保持不变。`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
