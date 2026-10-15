import 'dotenv/config';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse } from 'yaml';
import {
  categorySeedSchema,
  parseSpecSchema,
  productSeedSchema,
  validateSpecs,
} from '@youpu/schema';
import { PrismaService } from '../common/prisma.service';
import { toJsonInput } from '../common/json';
import { uuidv7 } from '../common/uuid';

const legacySlugMap = new Map([
  ['salomon-qst-92-2027', 'salomon-qst-92-2024'],
  ['salomon-qst-98-2027', 'salomon-qst-98-2024'],
]);
const imageSyncSlugs = new Set(['head-easy-joy-r-2026']);

async function main(): Promise<void> {
  const apply = process.argv.includes('--apply');
  const dataDir = resolve(process.cwd(), process.env.DATA_DIR ?? '../../data');
  const categorySeeds = (parse(readFileSync(join(dataDir, 'categories.yaml'), 'utf8')) as unknown[])
    .map(value => categorySeedSchema.parse(value));
  const categorySeed = categorySeeds.find(value => value.slug === 'skis');
  if (!categorySeed?.spec_schema) throw new Error('双板类目模板缺失');
  const specSchema = parseSpecSchema(categorySeed.spec_schema);
  const seeds = readdirSync(join(dataDir, 'skis'))
    .filter(file => file.endsWith('.yaml'))
    .map(file => productSeedSchema.parse(parse(readFileSync(join(dataDir, 'skis', file), 'utf8'))));
  if (seeds.length !== 39 || new Set(seeds.map(seed => seed.slug)).size !== seeds.length) {
    throw new Error(`双板清单数量或 slug 异常：${seeds.length}`);
  }
  for (const seed of seeds) {
    if (seed.category !== 'skis') throw new Error(`非双板数据混入：${seed.slug}`);
    const result = validateSpecs(specSchema, seed.specs);
    if (!result.ok) throw new Error(`${seed.slug}: ${JSON.stringify(result.issues)}`);
  }

  const seedBySlug = new Map(seeds.map(seed => [seed.slug, seed]));
  for (const slug of imageSyncSlugs) {
    const seed = seedBySlug.get(slug);
    if (!seed?.images.length || !seed.images[0]?.url.includes('/316265/')) {
      throw new Error(`指定图片必须匹配 article 316265：${slug}`);
    }
  }
  for (const newSlug of legacySlugMap.values()) {
    if (!seedBySlug.has(newSlug)) throw new Error(`缺少改年款后的双板 seed：${newSlug}`);
  }

  const prisma = new PrismaService();
  try {
    const category = await prisma.category.findUnique({ where: { slug: 'skis' }, select: { id: true, specSchema: true } });
    if (!category?.specSchema) throw new Error('生产双板类目或规格模板缺失');
    const online = await prisma.product.findMany({
      where: { slug: { in: [...seeds.map(seed => seed.slug), ...legacySlugMap.keys()] } },
      include: { brand: { select: { slug: true } }, images: { orderBy: { sortOrder: 'asc' } } },
    });
    const bySlug = new Map(online.map(product => [product.slug, product]));
    const remaps = new Map<string, (typeof online)[number]>();
    for (const [oldSlug, newSlug] of legacySlugMap) {
      const old = bySlug.get(oldSlug);
      if (!old) throw new Error(`生产旧版草稿不存在，拒绝猜测迁移对象：${oldSlug}`);
      if (bySlug.has(newSlug)) throw new Error(`生产新 slug 已存在：${newSlug}`);
      if (old.categoryId !== category.id || old.brand.slug !== 'salomon' || old.status !== 'draft' ||
          old.model !== (newSlug.includes('qst-92') ? 'QST 92' : 'QST 98') || old.year !== 2027 ||
          old.ratingCount !== 0 || old.favoriteCount !== 0) {
        throw new Error(`旧版草稿身份或状态与预期不符：${oldSlug}`);
      }
      remaps.set(newSlug, old);
    }

    const updates = [] as Array<{ seed: (typeof seeds)[number]; product: (typeof online)[number]; remap: boolean; syncImages: boolean }>;
    for (const seed of seeds) {
      const mapped = remaps.get(seed.slug);
      const product = mapped ?? bySlug.get(seed.slug);
      if (!product) throw new Error(`生产商品缺失：${seed.slug}`);
      if (product.categoryId !== category.id || product.brand.slug !== seed.brand) throw new Error(`生产商品分类/品牌不符：${seed.slug}`);
      if (!mapped && (product.model !== seed.model || product.year !== seed.year)) throw new Error(`生产商品型号/年款不符：${seed.slug}`);
      if (mapped && (product.status !== 'draft' || seed.status !== 'draft')) throw new Error(`历史 QST 必须保持草稿：${seed.slug}`);
      if (imageSyncSlugs.has(seed.slug) && (product.status !== 'published' || seed.status !== 'draft')) {
        throw new Error(`Easy Joy R 线上发布状态异常，拒绝覆盖：${seed.slug}`);
      }
      updates.push({ seed, product, remap: Boolean(mapped), syncImages: imageSyncSlugs.has(seed.slug) });
    }

    const imageUpdate = updates.find(update => update.syncImages)!;
    const oldImageUrls = imageUpdate.product.images.map(image => image.url);
    console.log(JSON.stringify({
      mode: apply ? 'apply' : 'preview',
      category: 'skis',
      products: updates.length,
      sizeSpecsChanged: updates.filter(({ seed, product }) => JSON.stringify(seed.specs.sizeSpecs ?? []) !== JSON.stringify((product.specs as Record<string, unknown>).sizeSpecs ?? [])).map(({ seed }) => seed.slug),
      slugRemaps: [...legacySlugMap.entries()],
      imageSync: { slug: imageUpdate.seed.slug, from: oldImageUrls, to: imageUpdate.seed.images.map(image => image.url) },
      statusesPreserved: true,
      pricesAndCommunityPreserved: true,
    }));
    if (!apply) return;

    await prisma.$transaction(async tx => {
      await tx.category.update({ where: { id: category.id }, data: { specSchema: toJsonInput(specSchema) } });
      for (const { seed, product, remap, syncImages } of updates) {
        const updated = await tx.product.update({
          where: { id: product.id },
          data: remap
            ? { slug: seed.slug, model: seed.model, year: seed.year, title: seed.title, oneLiner: seed.one_liner, specs: toJsonInput(seed.specs) }
            : { specs: toJsonInput(seed.specs), ...(syncImages ? { coverUrl: seed.images[0]?.url ?? null } : {}) },
          select: { id: true },
        });
        if (syncImages) {
          await tx.productImage.deleteMany({ where: { productId: updated.id } });
          await tx.productImage.createMany({ data: seed.images.map(image => ({
            id: uuidv7(), productId: updated.id, url: image.url, kind: image.kind,
            sortOrder: image.sort_order, alt: image.alt, source: image.source,
          })) });
        }
        await tx.outboxEvent.create({ data: {
          aggregate: 'product', aggregateId: updated.id, type: 'product.updated',
          payload: { reason: 'ski.content-sync', fields: [
            'specs', ...(remap ? ['slug', 'model', 'year', 'title', 'oneLiner'] : []), ...(syncImages ? ['coverUrl', 'images'] : []),
          ] },
        } });
      }
    }, { isolationLevel: 'Serializable', timeout: 60000 });
    console.log(`双板内容同步完成：${updates.length} 款；2 款草稿改归档年款；Easy Joy R 图片已更新。`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
