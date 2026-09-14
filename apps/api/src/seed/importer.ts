import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import {
  brandSeedSchema,
  categorySeedSchema,
  parseSpecSchema,
  productSeedSchema,
  validateSpecs,
  type CategorySeed,
  type SpecSchema,
} from '@youpu/schema';
import type { PrismaService } from '../common/prisma.service';
import { toJsonInput } from '../common/json';
import { uuidv7 } from '../common/uuid';

export interface ImportReport {
  categories: number;
  brands: number;
  products: number;
  errors: string[];
}

/**
 * seed 导入管线（技术方案 §4）：
 * data/categories.yaml + data/brands.yaml + data/<category>/*.yaml
 * YAML → zod schema → specs 对类目 spec_schema 校验 → PG（幂等 upsert）→ outbox 触发 ES 同步
 */
export async function runImport(prisma: PrismaService, dataDir: string): Promise<ImportReport> {
  const report: ImportReport = { categories: 0, brands: 0, products: 0, errors: [] };

  report.categories = await importCategories(prisma, join(dataDir, 'categories.yaml'), report.errors);
  report.brands = await importBrands(prisma, join(dataDir, 'brands.yaml'), report.errors);
  report.products = await importProducts(prisma, dataDir, report.errors);

  return report;
}

async function importCategories(prisma: PrismaService, file: string, errors: string[]): Promise<number> {
  const raw = parseYaml(readFileSync(file, 'utf8')) as unknown[];
  const seeds: CategorySeed[] = [];
  raw.forEach((item, i) => {
    const parsed = categorySeedSchema.safeParse(item);
    if (!parsed.success) {
      errors.push(`categories.yaml[${i}] 校验失败：${parsed.error.issues.map((x) => x.message).join('; ')}`);
      return;
    }
    seeds.push(parsed.data);
  });

  const bySlug = new Map(seeds.map((s) => [s.slug, s]));
  const ordered: Array<{ seed: CategorySeed; level: number; pathSlug: string; parentSlug?: string }> = [];
  const seen = new Set<string>();

  const visit = (seed: CategorySeed, stack: string[]): void => {
    if (seen.has(seed.slug)) return;
    if (stack.includes(seed.slug)) {
      errors.push(`类目父子关系存在环：${[...stack, seed.slug].join(' → ')}`);
      return;
    }
    let level = 1;
    let pathSlug = ltreeLabel(seed.slug);
    if (seed.parent) {
      const parent = bySlug.get(seed.parent);
      if (!parent) {
        errors.push(`类目 ${seed.slug} 的父类目 ${seed.parent} 不存在`);
      } else {
        visit(parent, [...stack, seed.slug]);
        const parentEntry = ordered.find((o) => o.seed.slug === parent.slug);
        level = (parentEntry?.level ?? 1) + 1;
        pathSlug = `${parentEntry?.pathSlug ?? ltreeLabel(parent.slug)}.${ltreeLabel(seed.slug)}`;
      }
    }
    seen.add(seed.slug);
    ordered.push({ seed, level, pathSlug, parentSlug: seed.parent });
  };

  for (const seed of seeds) visit(seed, []);

  let count = 0;
  for (const { seed, level, pathSlug } of ordered) {
    const parentId = seed.parent
      ? (await prisma.category.findUnique({ where: { slug: seed.parent }, select: { id: true } }))?.id ?? null
      : null;
    const specSchema = seed.spec_schema ? parseSpecSchema(seed.spec_schema) : undefined;
    const recommendConfig = seed.recommend_config ?? undefined;

    const saved = await prisma.category.upsert({
      where: { slug: seed.slug },
      create: {
        id: uuidv7(),
        slug: seed.slug,
        name: seed.name,
        level,
        sortOrder: seed.sort_order,
        parentId,
        specSchema: specSchema === undefined ? undefined : toJsonInput(specSchema),
        recommendConfig: recommendConfig === undefined ? undefined : toJsonInput(recommendConfig),
      },
      update: {
        name: seed.name,
        level,
        sortOrder: seed.sort_order,
        parentId,
        specSchema: specSchema === undefined ? undefined : toJsonInput(specSchema),
        recommendConfig: recommendConfig === undefined ? undefined : toJsonInput(recommendConfig),
      },
    });

    // ltree path 为 Prisma 表达受限字段，走 raw 写入
    await prisma.$executeRaw`
      UPDATE category SET path = ${pathSlug}::ltree WHERE id = ${saved.id}::uuid
    `;
    count += 1;
  }
  return count;
}

async function importBrands(prisma: PrismaService, file: string, errors: string[]): Promise<number> {
  const raw = parseYaml(readFileSync(file, 'utf8')) as unknown[];
  let count = 0;

  for (const [i, item] of raw.entries()) {
    const parsed = brandSeedSchema.safeParse(item);
    if (!parsed.success) {
      errors.push(`brands.yaml[${i}] 校验失败：${parsed.error.issues.map((x) => x.message).join('; ')}`);
      continue;
    }
    const seed = parsed.data;
    await prisma.brand.upsert({
      where: { slug: seed.slug },
      create: {
        id: uuidv7(),
        slug: seed.slug,
        name: seed.name,
        nameCn: seed.name_cn,
        country: seed.country,
        logoUrl: seed.logo_url,
        officialUrl: seed.official_url,
        description: seed.description,
      },
      update: {
        name: seed.name,
        nameCn: seed.name_cn,
        country: seed.country,
        logoUrl: seed.logo_url,
        officialUrl: seed.official_url,
        description: seed.description,
      },
    });
    count += 1;
  }
  return count;
}

async function importProducts(prisma: PrismaService, dataDir: string, errors: string[]): Promise<number> {
  const schemaByCategory = new Map<string, SpecSchema | null>();
  let count = 0;

  for (const entry of readdirSync(dataDir)) {
    const dir = join(dataDir, entry);
    if (!statSync(dir).isDirectory()) continue;

    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.yaml') && !file.endsWith('.yml')) continue;
      const fullPath = join(dir, file);
      const parsed = productSeedSchema.safeParse(parseYaml(readFileSync(fullPath, 'utf8')));
      if (!parsed.success) {
        errors.push(
          `${fullPath} 校验失败：${parsed.error.issues.map((x) => `${x.path.join('.')} ${x.message}`).join('; ')}`,
        );
        continue;
      }
      const seed = parsed.data;

      const [category, brand] = await Promise.all([
        prisma.category.findUnique({ where: { slug: seed.category } }),
        prisma.brand.findUnique({ where: { slug: seed.brand } }),
      ]);
      if (!category) {
        errors.push(`${fullPath}：类目 ${seed.category} 不存在（先导入 categories.yaml）`);
        continue;
      }
      if (!brand) {
        errors.push(`${fullPath}：品牌 ${seed.brand} 不存在（先导入 brands.yaml）`);
        continue;
      }

      // ── 数据质量闸门：specs 必须通过类目 spec_schema 校验 ──
      if (!schemaByCategory.has(seed.category)) {
        schemaByCategory.set(
          seed.category,
          category.specSchema ? parseSpecSchema(category.specSchema) : null,
        );
      }
      const specSchema = schemaByCategory.get(seed.category) ?? null;
      if (!specSchema) {
        errors.push(`${fullPath}：类目 ${seed.category} 未声明 spec_schema，无法校验 specs`);
        continue;
      }
      const validation = validateSpecs(specSchema, seed.specs);
      if (!validation.ok) {
        errors.push(
          `${fullPath}：specs 校验未通过 → ${validation.issues.map((x) => `${x.path}: ${x.message}`).join('; ')}`,
        );
        continue;
      }

      // 编辑评分维度必须来自 rating_dimensions（编辑评分与社区评分共用同一组维度键）
      if (seed.editorial_scores) {
        const dims = new Set((specSchema.rating_dimensions ?? []).map((d) => d.key));
        const unknownDims = Object.keys(seed.editorial_scores).filter((k) => !dims.has(k));
        if (unknownDims.length > 0) {
          errors.push(`${fullPath}：editorial_scores 含未声明的评分维度 → ${unknownDims.join(', ')}`);
          continue;
        }
      }

      const dataSourceRow = seed.data_source
        ? await prisma.dataSource.create({
            data: {
              id: uuidv7(),
              brandId: brand.id,
              originUrl: seed.data_source.origin_url ?? `manual:${seed.slug}`,
              kind: seed.data_source.kind,
              snapshotUrl: seed.data_source.snapshot_url,
            },
          })
        : null;

      const productData = {
        categoryId: category.id,
        brandId: brand.id,
        model: seed.model,
        year: seed.year,
        title: seed.title,
        oneLiner: seed.one_liner,
        priceMin: seed.price?.min,
        priceMax: seed.price?.max,
        priceCurrency: seed.price?.currency ?? 'CNY',
        specs: toJsonInput(seed.specs),
        editorialScores: seed.editorial_scores ? toJsonInput(seed.editorial_scores) : undefined,
        status: seed.status,
        dataSource: dataSourceRow?.id ?? null,
        publishedAt: seed.status === 'published' ? new Date() : null,
      };

      const product = await prisma.product.upsert({
        where: { slug: seed.slug },
        create: { id: uuidv7(), slug: seed.slug, ...productData },
        update: productData,
      });

      await prisma.productStat.upsert({
        where: { productId: product.id },
        create: { productId: product.id },
        update: {},
      });

      if (seed.images.length > 0) {
        await prisma.productImage.deleteMany({ where: { productId: product.id } });
        await prisma.productImage.createMany({
          data: seed.images.map((img) => ({
            id: uuidv7(),
            productId: product.id,
            url: img.url,
            kind: img.kind,
            sortOrder: img.sort_order,
            alt: img.alt,
            source: img.source,
          })),
        });
      }

      // 触发下游：评分聚合 + ES 同步（DB 设计 §7.2）
      await prisma.outboxEvent.create({
        data: {
          aggregate: 'product',
          aggregateId: product.id,
          type: 'product.updated',
          payload: { reason: 'seed.import' },
        },
      });

      count += 1;
    }
  }
  return count;
}

/** ltree 标签仅允许 [A-Za-z0-9_]，slug 中的连字符转下划线 */
function ltreeLabel(slug: string): string {
  return slug.replace(/-/g, '_');
}

export function resolveDataDir(dataDirEnv: string): string {
  return resolve(process.cwd(), dataDirEnv);
}
