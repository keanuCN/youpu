import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import {
  normalizePriceRange,
  brandSeedSchema,
  parseSpecSchema,
  productSeedSchema,
  validateSpecs,
} from '@youpu/schema';
import { Prisma } from '../common/db';
import { PrismaService } from '../common/prisma.service';
import { toJsonInput } from '../common/json';
import { uuidv7 } from '../common/uuid';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const updateExisting = args.includes('--update-existing');
  const clearEditorialScores = args.includes('--clear-editorial-scores');
  const file = args.find((value) => !value.startsWith('--'));
  const brandFileIndex = args.indexOf('--brand-file');
  const brandFile = brandFileIndex >= 0 ? args[brandFileIndex + 1] : undefined;
  if (!file) throw new Error('用法：seed:product -- <产品 YAML 路径> [--brand-file <品牌 YAML 路径>] [--update-existing] [--clear-editorial-scores]');
  if (brandFileIndex >= 0 && !brandFile) throw new Error('--brand-file 缺少路径');

  const parsed = productSeedSchema.safeParse(parseYaml(readFileSync(resolve(file), 'utf8')));
  if (!parsed.success) {
    throw new Error(`产品 seed 校验失败：${parsed.error.issues.map((issue) => issue.message).join('; ')}`);
  }
  const seed = parsed.data;
  const dataDir = resolve(dirname(resolve(file)), '..');
  const brandSeeds = parseYaml(readFileSync(resolve(brandFile ?? resolve(dataDir, 'brands.yaml')), 'utf8')) as unknown[];
  const brandRecord = brandSeeds.find(
    (value) => typeof value === 'object' && value !== null && 'slug' in value && value.slug === seed.brand,
  );
  const parsedBrand = brandRecord === undefined ? undefined : brandSeedSchema.safeParse(brandRecord);
  if (parsedBrand && !parsedBrand.success) {
    throw new Error(`品牌 seed 校验失败：${parsedBrand.error.issues.map((issue) => issue.message).join('; ')}`);
  }
  const brandSeed = parsedBrand?.success ? parsedBrand.data : undefined;
  const prisma = new PrismaService();

  try {
    const [category, brand, existing] = await Promise.all([
      prisma.category.findUnique({ where: { slug: seed.category }, select: { id: true, specSchema: true } }),
      prisma.brand.findUnique({ where: { slug: seed.brand }, select: { id: true } }),
      prisma.product.findUnique({ where: { slug: seed.slug }, select: { id: true } }),
    ]);
    if (!category) throw new Error(`线上类目不存在：${seed.category}`);
    if (!brand && !brandSeed) throw new Error(`线上品牌不存在，且 brands.yaml 没有该品牌：${seed.brand}`);
    if (!category.specSchema) throw new Error(`线上类目没有规格定义：${seed.category}`);
    if (existing && !updateExisting) {
      throw new Error(`线上产品已存在：${seed.slug}；确认需要覆盖后再加 --update-existing`);
    }

    const validation = validateSpecs(parseSpecSchema(category.specSchema), seed.specs);
    if (!validation.ok) {
      throw new Error(`线上规格定义校验失败：${validation.issues.map((issue) => issue.message).join('; ')}`);
    }

    const duplicate = brand ? await prisma.product.findFirst({
      where: {
        brandId: brand.id,
        model: seed.model,
        year: seed.year,
        ...(existing ? { NOT: { slug: seed.slug } } : {}),
      },
      select: { slug: true },
    }) : null;
    if (duplicate) throw new Error(`线上同品牌型号年份已存在：${duplicate.slug}`);

    const normalizedPrice = seed.price
      ? normalizePriceRange({ min: seed.price.min, max: seed.price.max, currency: seed.price.currency })
      : { min: null, max: null, currency: 'CNY' as const };
    const productId = existing?.id ?? uuidv7();

    await prisma.$transaction(async (tx) => {
      const savedBrand = brand ?? await tx.brand.create({
        data: {
          id: uuidv7(),
          slug: brandSeed!.slug,
          name: brandSeed!.name,
          nameCn: brandSeed!.name_cn,
          country: brandSeed!.country,
          logoUrl: brandSeed!.logo_url,
          officialUrl: brandSeed!.official_url,
          description: brandSeed!.description,
        },
      });
      const dataSource = seed.data_source
        ? await tx.dataSource.create({
            data: {
              id: uuidv7(),
              brandId: savedBrand.id,
              originUrl: seed.data_source.origin_url ?? `manual:${seed.slug}`,
              kind: seed.data_source.kind,
              snapshotUrl: seed.data_source.snapshot_url,
            },
          })
        : undefined;
      const productData = {
        categoryId: category.id,
        brandId: savedBrand.id,
        model: seed.model,
        year: seed.year,
        title: seed.title,
        oneLiner: seed.one_liner,
        priceMin: normalizedPrice.min,
        priceMax: normalizedPrice.max,
        priceCurrency: normalizedPrice.currency,
        specs: toJsonInput(seed.specs),
        editorialScores: seed.editorial_scores ? toJsonInput(seed.editorial_scores) : clearEditorialScores ? Prisma.DbNull : undefined,
        status: seed.status,
        dataSource: dataSource?.id ?? null,
        publishedAt: seed.status === 'published' ? new Date() : null,
      };
      const product = existing
        ? await tx.product.update({ where: { slug: seed.slug }, data: productData })
        : await tx.product.create({ data: { id: productId, slug: seed.slug, ...productData } });

      await tx.productStat.upsert({
        where: { productId: product.id },
        create: { productId: product.id },
        update: {},
      });
      await tx.productImage.deleteMany({ where: { productId: product.id } });
      if (seed.images.length > 0) {
        await tx.productImage.createMany({
          data: seed.images.map((image) => ({
            id: uuidv7(),
            productId: product.id,
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
          aggregateId: product.id,
          type: 'product.updated',
          payload: { reason: 'seed.single-product-sync' },
        },
      });
    });

    console.log(`产品单条同步成功：${seed.slug}（${existing ? '更新' : '新增'}）`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
