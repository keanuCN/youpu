import 'dotenv/config';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import {
  brandSeedSchema,
  categorySeedSchema,
  normalizePriceRange,
  parseSpecSchema,
  productSeedSchema,
  validateSpecs,
  type ProductSeed,
  type SpecSchema,
} from '@youpu/schema';
import { PrismaService } from '../common/prisma.service';
import { toJsonInput } from '../common/json';
import { uuidv7 } from '../common/uuid';
import type { Prisma } from '../common/db';

function readArgs(): { category?: string; apply: boolean } {
  const args = process.argv.slice(2);
  const categoryIndex = args.indexOf('--category');
  const category = categoryIndex >= 0 ? args[categoryIndex + 1] : undefined;
  if (categoryIndex >= 0 && (!category || category.startsWith('--'))) {
    throw new Error('--category 后需要类目 slug');
  }
  return { category, apply: args.includes('--apply') };
}

function readProducts(dataDir: string): ProductSeed[] {
  const products: ProductSeed[] = [];
  for (const entry of readdirSync(dataDir)) {
    const directory = join(dataDir, entry);
    if (!statSync(directory).isDirectory() || ['raw', 'tmp'].includes(entry)) continue;
    for (const filename of readdirSync(directory)) {
      if (!/\.ya?ml$/i.test(filename)) continue;
      const parsed = productSeedSchema.safeParse(parseYaml(readFileSync(join(directory, filename), 'utf8')));
      if (!parsed.success) throw new Error(`${filename} 种子校验失败：${parsed.error.issues.map((issue) => issue.message).join('; ')}`);
      if (parsed.data.status === 'published') products.push(parsed.data);
    }
  }
  return products;
}

function categoryPath(seed: { slug: string; parent?: string }, categoryBySlug: Map<string, { slug: string; parent?: string }>): string {
  const labels = [seed.slug.replace(/-/g, '_')];
  let parent = seed.parent ? categoryBySlug.get(seed.parent) : undefined;
  while (parent) {
    labels.unshift(parent.slug.replace(/-/g, '_'));
    parent = parent.parent ? categoryBySlug.get(parent.parent) : undefined;
  }
  return labels.join('.');
}

async function main(): Promise<void> {
  const { category, apply } = readArgs();
  const dataDir = resolve(process.env.DATA_DIR ?? '../../data');
  const products = readProducts(dataDir).filter((product) => !category || product.category === category);
  const categoriesRaw = parseYaml(readFileSync(join(dataDir, 'categories.yaml'), 'utf8')) as unknown[];
  const brandsRaw = parseYaml(readFileSync(join(dataDir, 'brands.yaml'), 'utf8')) as unknown[];
  const categorySeeds = categoriesRaw.map((raw) => categorySeedSchema.parse(raw));
  const brandSeeds = brandsRaw.map((raw) => brandSeedSchema.parse(raw));
  const categoryBySlug = new Map(categorySeeds.map((seed) => [seed.slug, seed]));
  const brandBySlug = new Map(brandSeeds.map((seed) => [seed.slug, seed]));
  const prisma = new PrismaService();

  try {
    await prisma.$connect();
    const [existingProducts, databaseCategories, databaseBrands] = await Promise.all([
      prisma.product.findMany({ select: { slug: true } }),
      prisma.category.findMany({ select: { id: true, slug: true, level: true, parentId: true, specSchema: true } }),
      prisma.brand.findMany({ select: { id: true, slug: true } }),
    ]);
    const existingSlugs = new Set(existingProducts.map((product) => product.slug));
    const categoryRows = new Map(databaseCategories.map((row) => [row.slug, row]));
    const brandRows = new Map(databaseBrands.map((row) => [row.slug, row]));
    const missing = products.filter((product) => !existingSlugs.has(product.slug));
    const schemaByCategory = new Map<string, SpecSchema>();
    const neededCategorySlugs = new Set<string>();
    for (const product of missing) {
      let current = categoryBySlug.get(product.category);
      while (current) {
        neededCategorySlugs.add(current.slug);
        current = current.parent ? categoryBySlug.get(current.parent) : undefined;
      }
    }
    const categoriesToCreate = [...neededCategorySlugs]
      .filter((slug) => !categoryRows.has(slug))
      .map((slug) => categoryBySlug.get(slug)!)
      .sort((a, b) => a.sort_order - b.sort_order || a.slug.localeCompare(b.slug));
    const categorySchemasToUpdate = [...schemaByCategory]
      .filter(([slug, schema]) => {
        const current = categoryRows.get(slug)?.specSchema;
        if (!current) return true;
        return JSON.stringify(parseSpecSchema(current)) !== JSON.stringify(schema);
      });
    const brandsToCreate = [...new Set(missing.map((product) => product.brand))]
      .filter((slug) => !brandRows.has(slug))
      .map((slug) => brandBySlug.get(slug))
      .filter((seed): seed is NonNullable<typeof seed> => Boolean(seed));

    for (const seed of missing) {
      const categorySeed = categoryBySlug.get(seed.category);
      if (!categorySeed?.spec_schema) throw new Error(`${seed.slug} 缺少类目规格定义`);
      if (!brandBySlug.has(seed.brand)) throw new Error(`${seed.slug} 缺少品牌种子`);
      const schema = parseSpecSchema(categorySeed.spec_schema);
      schemaByCategory.set(seed.category, schema);
      const result = validateSpecs(schema, seed.specs);
      if (!result.ok) throw new Error(`${seed.slug} 规格校验失败：${result.issues.map((issue) => issue.message).join('; ')}`);
    }

    console.log(`本地数据库已有 ${existingSlugs.size} 款商品、${databaseCategories.length} 个分类和 ${databaseBrands.length} 个品牌。`);
    console.log(`本次计划新增 ${categoriesToCreate.length} 个分类、${brandsToCreate.length} 个品牌、更新 ${categorySchemasToUpdate.length} 个分类参数模板、新增 ${missing.length} 款商品${category ? `（${category}）` : ''}。`);
    if (categorySchemasToUpdate.length > 0) console.log(`待更新分类模板：${categorySchemasToUpdate.map(([slug]) => slug).join('、')}`);
    for (const seed of missing) console.log(`${apply ? '待新增' : '预览'}：${seed.slug}`);
    if (!apply || missing.length === 0) {
      if (!apply && missing.length > 0) console.log('预览模式未写数据库；确认列表后追加 --apply 执行。');
      return;
    }

    await prisma.$transaction(async (tx) => {
      const pendingCategories = [...categoriesToCreate];
      while (pendingCategories.length > 0) {
        let createdInPass = 0;
        for (let index = pendingCategories.length - 1; index >= 0; index -= 1) {
          const seed = pendingCategories[index]!;
          const parent = seed.parent ? categoryRows.get(seed.parent) : undefined;
          if (seed.parent && !parent) continue;
          const specSchema = seed.spec_schema === undefined ? undefined : parseSpecSchema(seed.spec_schema);
          const saved = await tx.category.create({
            data: {
              id: uuidv7(),
              slug: seed.slug,
              name: seed.name,
              level: parent ? parent.level + 1 : 1,
              sortOrder: seed.sort_order,
              parentId: parent?.id,
              specSchema: specSchema ? toJsonInput(specSchema) : undefined,
              recommendConfig: seed.recommend_config ? toJsonInput(seed.recommend_config as Prisma.InputJsonValue) : undefined,
            },
          });
          const pathSlug = categoryPath(seed, categoryBySlug);
          await tx.$executeRaw`UPDATE category SET path = ${pathSlug}::ltree WHERE id = ${saved.id}::uuid`;
          categoryRows.set(seed.slug, saved);
          pendingCategories.splice(index, 1);
          createdInPass += 1;
        }
        if (createdInPass === 0) throw new Error(`分类父级缺失，无法创建：${pendingCategories.map((seed) => seed.slug).join(', ')}`);
      }
      for (const seed of brandsToCreate) {
        const saved = await tx.brand.create({
          data: {
            id: uuidv7(),
            slug: seed.slug,
            name: seed.name,
            nameCn: seed.name_cn,
            country: seed.country,
            logoUrl: seed.logo_url,
            officialUrl: seed.official_url,
            description: seed.description,
          },
        });
        brandRows.set(seed.slug, saved);
      }
      for (const [slug, schema] of categorySchemasToUpdate) {
        await tx.category.update({ where: { slug }, data: { specSchema: toJsonInput(schema) } });
      }
      for (const seed of missing) {
        const dbCategory = categoryRows.get(seed.category)!;
        const dbBrand = brandRows.get(seed.brand)!;
        const normalizedPrice = seed.price
          ? normalizePriceRange({ min: seed.price.min, max: seed.price.max, currency: seed.price.currency })
          : { min: null, max: null, currency: 'CNY' as const };
        const source = seed.data_source
          ? await tx.dataSource.create({
              data: {
                id: uuidv7(),
                brandId: dbBrand.id,
                originUrl: seed.data_source.origin_url ?? `manual:${seed.slug}`,
                kind: seed.data_source.kind,
                snapshotUrl: seed.data_source.snapshot_url,
              },
            })
          : null;
        const productId = uuidv7();
        await tx.product.create({
          data: {
            id: productId,
            slug: seed.slug,
            categoryId: dbCategory.id,
            brandId: dbBrand.id,
            model: seed.model,
            year: seed.year,
            title: seed.title,
            oneLiner: seed.one_liner,
            priceMin: normalizedPrice.min,
            priceMax: normalizedPrice.max,
            priceCurrency: normalizedPrice.currency,
            specs: toJsonInput(seed.specs),
            editorialScores: seed.editorial_scores ? toJsonInput(seed.editorial_scores) : undefined,
            status: seed.status,
            dataSource: source?.id ?? null,
            publishedAt: new Date(),
          },
        });
        await tx.productStat.create({ data: { productId } });
        if (seed.images.length > 0) {
          await tx.productImage.createMany({
            data: seed.images.map((image) => ({
              id: uuidv7(),
              productId,
              url: image.url,
              kind: image.kind,
              sortOrder: image.sort_order,
              alt: image.alt,
              source: image.source,
            })),
          });
        }
        await tx.outboxEvent.create({
          data: {
            aggregate: 'product',
            aggregateId: productId,
            type: 'product.updated',
            payload: { reason: 'seed.missing-product-sync' },
          },
        });
      }
    });
    console.log(`已新增 ${missing.length} 款商品；数据库中已有的商品、评分、收藏及图片未被修改。`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
