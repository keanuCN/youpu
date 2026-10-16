import 'dotenv/config';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse } from 'yaml';
import {
  brandSeedSchema,
  categorySeedSchema,
  normalizePriceRange,
  parseSpecSchema,
  productSeedSchema,
  validateSpecs,
} from '@youpu/schema';
import { PrismaService } from '../common/prisma.service';
import { toJsonInput } from '../common/json';
import { uuidv7 } from '../common/uuid';
import type { Prisma } from '../common/db';

const CATEGORIES = ['snowboard', 'snowboard-binding', 'snowboard-boot', 'skis', 'skiing-apparel', 'ski-protection'];

/**
 * Synchronize curated winter-sports catalog fields from YAML while preserving
 * community ratings, reviews, favorites, and user accounts.
 * Missing drafts are deliberately ignored; missing published products are
 * inserted only after their category and brand have been verified.
 */
async function main(): Promise<void> {
  const apply = process.argv.includes('--apply');
  const dataDir = resolve(process.cwd(), process.env.DATA_DIR ?? '../../data');
  const categorySeeds = (parse(readFileSync(join(dataDir, 'categories.yaml'), 'utf8')) as unknown[])
    .map((value) => categorySeedSchema.parse(value))
    .filter((seed) => CATEGORIES.includes(seed.slug));
  if (categorySeeds.length !== CATEGORIES.length) throw new Error('滑雪类目模板不完整');
  const brandSeeds = (parse(readFileSync(join(dataDir, 'brands.yaml'), 'utf8')) as unknown[])
    .map((value) => brandSeedSchema.parse(value));

  const products = CATEGORIES.flatMap((category) => readdirSync(join(dataDir, category))
    .filter((file) => file.endsWith('.yaml'))
    .map((file) => productSeedSchema.parse(parse(readFileSync(join(dataDir, category, file), 'utf8')))));
  if (products.some((product) => !CATEGORIES.includes(product.category))) throw new Error('滑雪商品清单包含范围外类目');
  if (new Set(products.map((product) => product.slug)).size !== products.length) throw new Error('滑雪商品 slug 重复');

  const schemaByCategory = new Map(categorySeeds.map((seed) => {
    if (!seed.spec_schema) throw new Error(`类目模板缺失：${seed.slug}`);
    return [seed.slug, parseSpecSchema(seed.spec_schema)] as const;
  }));
  for (const product of products) {
    const schema = schemaByCategory.get(product.category);
    if (!schema) throw new Error(`商品类目模板缺失：${product.slug}`);
    const validation = validateSpecs(schema, product.specs);
    if (!validation.ok) throw new Error(`${product.slug}: ${JSON.stringify(validation.issues)}`);
    JSON.stringify(product.specs);
  }

  const prisma = new PrismaService();
  try {
    const onlineCategories = await prisma.category.findMany({
      where: { slug: { in: CATEGORIES } },
      select: { id: true, slug: true, specSchema: true },
    });
    if (onlineCategories.length !== CATEGORIES.length) throw new Error('生产滑雪类目缺失');
    const schemaUpdates = categorySeeds.flatMap((seed) => {
      const live = onlineCategories.find((item) => item.slug === seed.slug)!;
      return canonical(live.specSchema) === canonical(seed.spec_schema)
        ? []
        : [{ seed, category: live }];
    });
    const onlineProducts = await prisma.product.findMany({
      where: { slug: { in: products.map((product) => product.slug) } },
      include: { brand: { select: { slug: true } }, images: { orderBy: { sortOrder: 'asc' } } },
    });
    const onlineBySlug = new Map(onlineProducts.map((product) => [product.slug, product]));
    const updates: Array<{ seed: (typeof products)[number]; product: (typeof onlineProducts)[number]; fields: string[] }> = [];
    const skippedDrafts: string[] = [];
    const newProducts = products.filter((seed) => seed.status === 'published' && !onlineBySlug.has(seed.slug));
    const onlineBrands = await prisma.brand.findMany({ where: { slug: { in: [...new Set(products.map((product) => product.brand))] } }, select: { id: true, slug: true } });
    const brandBySlug = new Map(onlineBrands.map((brand) => [brand.slug, brand]));
    const brandSeedsBySlug = new Map(brandSeeds.map((brand) => [brand.slug, brand]));
    const newBrands = [...new Set(newProducts.map((product) => product.brand))]
      .filter((slug) => !brandBySlug.has(slug))
      .map((slug) => {
        const seed = brandSeedsBySlug.get(slug);
        if (!seed) throw new Error(`新商品缺少品牌种子：${slug}`);
        return seed;
      });
    for (const seed of newProducts) {
      const category = onlineCategories.find((item) => item.slug === seed.category);
      if (!category) throw new Error(`新商品缺少生产类目：${seed.slug}`);
      const brand = brandBySlug.get(seed.brand);
      if (brand) {
        const duplicate = await prisma.product.findFirst({
          where: { categoryId: category.id, brandId: brand.id, model: seed.model, year: seed.year },
          select: { slug: true },
        });
        if (duplicate) throw new Error(`新商品与线上记录重复：${seed.slug} / ${duplicate.slug}`);
      }
    }

    for (const seed of products) {
      const live = onlineBySlug.get(seed.slug);
      if (!live) {
        if (seed.status === 'draft') skippedDrafts.push(seed.slug);
        continue;
      }
      const category = onlineCategories.find((item) => item.slug === seed.category)!;
      if (live.categoryId !== category.id || live.brand.slug !== seed.brand || live.model !== seed.model || live.year !== seed.year) {
        throw new Error(`生产商品身份与种子不符：${seed.slug}`);
      }

      const fields: string[] = [];
      if (live.title !== seed.title) fields.push('title');
      if (live.oneLiner !== seed.one_liner) fields.push('oneLiner');
      if (live.status !== seed.status) fields.push('status');
      if (seed.price) {
        const price = normalizePriceRange(seed.price);
        if (Number(live.priceMin) !== price.min || Number(live.priceMax) !== price.max || live.priceCurrency !== price.currency) fields.push('price');
      }
      if (canonical(live.specs) !== canonical(seed.specs)) fields.push('specs');
      if (seed.editorial_scores && canonical(live.editorialScores) !== canonical(seed.editorial_scores)) fields.push('editorialScores');
      if (seed.images.length > 0) {
        const wantedImages = seed.images.map((image) => ({ url: image.url, kind: image.kind, sortOrder: image.sort_order, alt: image.alt ?? null, source: image.source ?? null }));
        const liveImages = live.images.map((image) => ({ url: image.url, kind: image.kind, sortOrder: image.sortOrder, alt: image.alt, source: image.source }));
        if (canonical(liveImages) !== canonical(wantedImages) || live.coverUrl !== seed.images[0]?.url) fields.push('images');
      }
      if (fields.length) updates.push({ seed, product: live, fields });
    }

    console.log(JSON.stringify({
      mode: apply ? 'apply' : 'preview',
      categories: CATEGORIES.length,
      checked: products.length,
      categorySchemaChanges: schemaUpdates.map(({ seed }) => seed.slug),
      createBrands: newBrands.map(({ slug, name }) => ({ slug, name })),
      createPublished: newProducts.map((seed) => seed.slug),
      skippedMissingDrafts: skippedDrafts,
      changed: updates.map(({ seed, fields }) => ({ slug: seed.slug, fields })),
      protected: ['community ratings and reviews', 'favorites', 'product statistics', 'accounts'],
    }, null, 2));
    if (!apply) return;

    await prisma.$transaction(async (tx) => {
      for (const seed of newBrands) {
        const brand = await tx.brand.create({ data: {
          id: uuidv7(), slug: seed.slug, name: seed.name, nameCn: seed.name_cn,
          country: seed.country, logoUrl: seed.logo_url, officialUrl: seed.official_url,
          description: seed.description,
        }, select: { id: true, slug: true } });
        brandBySlug.set(brand.slug, brand);
      }
      for (const { seed, category } of schemaUpdates) {
        await tx.category.update({
          where: { id: category.id },
          data: { specSchema: toJsonInput(seed.spec_schema!) },
        });
      }
      for (const seed of newProducts) {
        const category = onlineCategories.find((item) => item.slug === seed.category)!;
        const brand = brandBySlug.get(seed.brand);
        if (!brand) throw new Error(`无法解析生产品牌：${seed.brand}`);
        const price = seed.price ? normalizePriceRange(seed.price) : { min: null, max: null, currency: 'CNY' as const };
        const source = seed.data_source ? await tx.dataSource.create({ data: {
          id: uuidv7(), brandId: brand.id,
          originUrl: seed.data_source.origin_url ?? `manual:${seed.slug}`,
          kind: seed.data_source.kind, snapshotUrl: seed.data_source.snapshot_url,
        } }) : null;
        const created = await tx.product.create({ data: {
          id: uuidv7(), slug: seed.slug, categoryId: category.id, brandId: brand.id,
          model: seed.model, year: seed.year, title: seed.title, oneLiner: seed.one_liner,
          coverUrl: seed.images[0]?.url ?? null,
          priceMin: price.min, priceMax: price.max, priceCurrency: price.currency,
          specs: toJsonInput(seed.specs), editorialScores: seed.editorial_scores ? toJsonInput(seed.editorial_scores) : undefined,
          status: seed.status, dataSource: source?.id ?? null, publishedAt: new Date(),
        }, select: { id: true } });
        await tx.productStat.create({ data: { productId: created.id } });
        if (seed.images.length) await tx.productImage.createMany({ data: seed.images.map((image) => ({
          id: uuidv7(), productId: created.id, url: image.url, kind: image.kind,
          sortOrder: image.sort_order, alt: image.alt, source: image.source,
        })) });
        await tx.outboxEvent.create({ data: {
          aggregate: 'product', aggregateId: created.id, type: 'product.updated',
          payload: { reason: 'curated-snow-data-sync', fields: ['created'] },
        } });
      }
      for (const { seed, product, fields } of updates) {
        const data: Prisma.ProductUpdateInput = {
          title: seed.title,
          oneLiner: seed.one_liner,
          status: seed.status,
          specs: toJsonInput(seed.specs),
          ...(seed.editorial_scores ? { editorialScores: toJsonInput(seed.editorial_scores) } : {}),
          ...(seed.price ? (() => {
            const price = normalizePriceRange(seed.price);
            return { priceMin: price.min, priceMax: price.max, priceCurrency: price.currency };
          })() : {}),
          ...(seed.images.length ? { coverUrl: seed.images[0]!.url } : {}),
        };
        await tx.product.update({ where: { id: product.id }, data });
        if (fields.includes('images')) {
          await tx.productImage.deleteMany({ where: { productId: product.id } });
          await tx.productImage.createMany({ data: seed.images.map((image) => ({
            id: uuidv7(), productId: product.id, url: image.url, kind: image.kind,
            sortOrder: image.sort_order, alt: image.alt, source: image.source,
          })) });
        }
        await tx.outboxEvent.create({ data: {
          aggregate: 'product', aggregateId: product.id, type: 'product.updated',
          payload: { reason: 'curated-snow-data-sync', fields },
        } });
      }
    }, { isolationLevel: 'Serializable', timeout: 120000 });
    console.log(`滑雪资料同步完成：更新 ${updates.length} 款，新增 ${newProducts.length} 款；社区数据保持不变。`);
  } finally {
    await prisma.$disconnect();
  }
}

function canonical(value: unknown): string {
  return JSON.stringify(value, (_, item) => item && typeof item === 'object' && !Array.isArray(item)
    ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b)))
    : item);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
