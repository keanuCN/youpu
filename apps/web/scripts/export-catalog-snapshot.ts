import { mkdir, writeFile, readFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { brandSeedSchema, categorySeedSchema, computeComposite, parseSpecSchema, productSeedSchema, productListItemSchema, normalizePriceRange, productListResponseSchema, type ProductListItem } from "@youpu/schema";
import { parse as parseYaml } from 'yaml';
import { shouldRejectCatalogCountDecrease } from "./catalog-build-policy";
import { CATALOG_SNAPSHOT, CATALOG_SNAPSHOT_META } from "../src/data/catalog-snapshot";
import { SNOWBOARD_SETUPS } from '../src/data/snowboard-setups';
import previousSetupProducts from '../src/data/snowboard-setup-products.json';
import previousImageGalleries from '../src/data/product-image-galleries.json';

const PAGE_SIZE = 48;
const apiBase = (process.env.CONTENT_EXPORT_API_BASE ?? process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001").replace(/\/$/, "");
const seedDir = process.env.CONTENT_EXPORT_SEED_DIR ? resolve(process.env.CONTENT_EXPORT_SEED_DIR) : undefined;
const seedCategories = new Set((process.env.CONTENT_EXPORT_SEED_CATEGORIES ?? '').split(',').map(v => v.trim()).filter(Boolean));
const seedImageOnly = process.env.CONTENT_EXPORT_SEED_IMAGE_ONLY === 'true';
const exportedImageGalleries: Record<string, Array<{ url: string; kind: string; alt?: string; source?: string }>> = { ...previousImageGalleries };
const outputPath = resolve(
  process.env.CONTENT_EXPORT_OUTPUT ?? resolve(process.cwd(), "src/data/catalog-snapshot.ts"),
);

async function fetchPage(page: number): Promise<{ total: number; items: ProductListItem[] }> {
  // The API currently used by the exporter may predate the unique pagination tie-breaker.
  // Use the less volatile ordering for offset paging; render() applies its own stable sort.
  const url = `${apiBase}/api/products?page=${page}&pageSize=${PAGE_SIZE}&sort=new`;
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`目录接口返回 HTTP ${response.status}：${url}`);
  const parsed = productListResponseSchema.parse(normalizeLegacyPriceResponse(await response.json()));
  return { total: parsed.total, items: parsed.items };
}

/**
 * 兼容尚未滚动重启的旧 API：旧进程可能仍返回 USD，导出时统一换算为共享契约要求的 CNY。
 * 正常情况下 API 已经返回 CNY，这里不会改变数值。
 */
function normalizeLegacyPriceResponse(value: unknown): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const body = value as Record<string, unknown>;
  if (!Array.isArray(body.items)) return value;

  return {
    ...body,
    items: body.items.map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return item;
      const product = item as Record<string, unknown>;
      const currency = typeof product.priceCurrency === "string" ? product.priceCurrency : "CNY";
      const min = product.priceMin === null || product.priceMin === undefined ? null : Number(product.priceMin);
      const max = product.priceMax === null || product.priceMax === undefined ? null : Number(product.priceMax);
      const normalized = normalizePriceRange({ min, max, currency });
      return {
        ...product,
        priceMin: normalized.min,
        priceMax: normalized.max,
        priceCurrency: normalized.currency,
      };
    }),
  };
}

function stableSort(items: ProductListItem[]): ProductListItem[] {
  return [...items].sort((a, b) =>
    a.categorySlug.localeCompare(b.categorySlug) ||
    a.brand.name.localeCompare(b.brand.name) ||
    a.model.localeCompare(b.model) ||
    a.year - b.year ||
    a.slug.localeCompare(b.slug),
  );
}

async function readSeedCatalog(dataDir: string): Promise<ProductListItem[]> {
  const brands = brandSeedSchema.array().parse(parseYaml(await readFile(resolve(dataDir, 'brands.yaml'), 'utf8')));
  const categories = categorySeedSchema.array().parse(parseYaml(await readFile(resolve(dataDir, 'categories.yaml'), 'utf8')));
  const specSchemasByCategory = new Map(categories.flatMap(category => {
    if (!category.spec_schema) return [];
    const schema = parseSpecSchema(category.spec_schema);
    return [[category.slug, schema] as const];
  }));
  const existing = new Map(CATALOG_SNAPSHOT.map(item => [item.slug, item]));
  const items: ProductListItem[] = [];
  if (seedCategories.size) items.push(...CATALOG_SNAPSHOT.filter(item => !seedCategories.has(item.categorySlug)));
  for (const directory of await readdir(dataDir, { withFileTypes: true })) {
    if (!directory.isDirectory() || ['raw', 'tmp'].includes(directory.name)) continue;
    if (seedCategories.size && !seedCategories.has(directory.name)) continue;
    for (const filename of await readdir(resolve(dataDir, directory.name))) {
      if (!filename.endsWith('.yaml')) continue;
      const seed = productSeedSchema.parse(parseYaml(await readFile(resolve(dataDir, directory.name, filename), 'utf8')));
      const old = existing.get(seed.slug);
      // 草稿不得经内容包回退重新出现在公开目录。
      if (seed.status !== 'published') { delete exportedImageGalleries[seed.slug]; continue; }
      exportedImageGalleries[seed.slug] = seed.images.map(image => ({ url: image.url, kind: image.kind, alt: image.alt, source: image.source }));
      const brand = brands.find(item => item.slug === seed.brand);
      if (!brand) throw new Error(`品牌不存在：${seed.brand}`);
      const specSchema = specSchemasByCategory.get(seed.category);
      if (!specSchema) throw new Error(`类目缺失公开规格 schema：${seed.category}`);
      const publicKeys = new Set(specSchema.fields.filter(field => field.display !== false).map(field => field.key));
      const publicSpecs = Object.fromEntries(Object.entries(seed.specs).filter(([key]) => publicKeys.has(key)));
      const price = normalizePriceRange(seed.price ? { min: seed.price.min, max: seed.price.max, currency: seed.price.currency } : { min: null, max: null, currency: 'CNY' });
      const editorialScores = seed.editorial_scores ?? old?.editorialScores ?? null;
      items.push(productListItemSchema.parse({
        id: old?.id ?? seed.slug, slug: seed.slug, title: seed.title, model: seed.model, year: seed.year,
        oneLiner: seed.one_liner ?? null, priceMin: price.min, priceMax: price.max, priceCurrency: 'CNY',
        coverUrl: seed.images?.[0]?.url ?? null,
        ratingOverall: old?.ratingOverall ?? null, ratingCount: old?.ratingCount ?? 0,
        favoriteCount: old?.favoriteCount ?? 0,
        composite: computeComposite(specSchema, editorialScores),
        editorialScores,
        brand: { slug: brand.slug, name: brand.name, nameCn: brand.name_cn ?? null },
        categorySlug: seed.category, specs: publicSpecs, highlights: [],
      }));
    }
  }
  if (seedImageOnly) {
    const covers = new Map(items.map(item => [item.slug, item.coverUrl]));
    // 图片迁移时仅更新现有快照的封面；不增删商品或覆盖人工/社区事实。
    return CATALOG_SNAPSHOT.map(item => {
      const next = { ...item, coverUrl: covers.get(item.slug) ?? item.coverUrl };
      if (covers.has(item.slug) && covers.get(item.slug) === null) next.coverUrl = null;
      productListItemSchema.parse(next);
      return next;
    });
  }
  return items;
}

function render(items: ProductListItem[], source: string): string {
  const categorySlugs = [...new Set(items.map((item) => item.categorySlug))].sort();
  const meta = {
    source,
    generatedAt: new Date().toISOString(),
    total: items.length,
    pageSize: PAGE_SIZE,
    categorySlugs,
  };

  return `/**
 * 公开目录快照。
 *
 * 由 apps/web/scripts/export-catalog-snapshot.ts 自动生成，请勿手工编辑。
 * 事实字段来自公开 API 或校验后的 seed；seed 导出保留既有社区统计，不伪造评分。
 * 编辑分析、评分分布等内容继续由本地内容包维护。
 */
export interface CatalogSnapshotItem {
  id: string;
  slug: string;
  title: string;
  model: string;
  year: number;
  oneLiner: string | null;
  priceMin: number | null;
  priceMax: number | null;
  priceCurrency: "CNY";
  coverUrl: string | null;
  ratingOverall: number | null;
  ratingCount: number;
  favoriteCount: number;
  composite: number | null;
  editorialScores?: Record<string, number> | null;
  brand: { slug: string; name: string; nameCn?: string | null };
  categorySlug: string;
  specs: Record<string, unknown>;
  highlights: Array<{ key: string; label: string; value: string }>;
}

export interface CatalogSnapshotMeta {
  source: string;
  generatedAt: string;
  total: number;
  pageSize: number;
  categorySlugs: string[];
}

export const CATALOG_SNAPSHOT_META: CatalogSnapshotMeta = ${JSON.stringify(meta, null, 2)};

export const CATALOG_SNAPSHOT: readonly CatalogSnapshotItem[] = ${JSON.stringify(items, null, 2)};
`;
}

async function main(): Promise<void> {
  if (seedImageOnly && !seedDir) throw new Error('CONTENT_EXPORT_SEED_IMAGE_ONLY 需要同时设置 CONTENT_EXPORT_SEED_DIR');
  const items: ProductListItem[] = [];
  let total = Number.POSITIVE_INFINITY;
  let page = 1;

  if (seedDir) {
    items.push(...await readSeedCatalog(seedDir));
    total = items.length;
  }
  while (!seedDir && items.length < total) {
    const result = await fetchPage(page);
    total = result.total;
    items.push(...result.items);
    if (result.items.length === 0) break;
    page += 1;
  }

  const unique = new Map(items.map((item) => [item.slug, item]));
  const sorted = stableSort([...unique.values()]);
  if (sorted.length !== total) {
    throw new Error(`目录快照数量不完整：接口声明 ${total} 条，实际得到 ${sorted.length} 条`);
  }
  if (
    shouldRejectCatalogCountDecrease(CATALOG_SNAPSHOT_META.total, sorted.length, {
      CONTENT_EXPORT_ALLOW_COUNT_DECREASE: process.env.CONTENT_EXPORT_ALLOW_COUNT_DECREASE,
    })
  ) {
    throw new Error(
      `目录快照导出已中止：API 返回 ${sorted.length} 条产品，当前仓库快照有 ${CATALOG_SNAPSHOT_META.total} 条。` +
        "请先核实 API 数据是否完整；确认需要移除产品后，再设置 CONTENT_EXPORT_ALLOW_COUNT_DECREASE=true 重新导出。",
    );
  }

  await mkdir(dirname(outputPath), { recursive: true });
  const source = seedDir ? `repository seed YAML${seedCategories.size ? `: ${[...seedCategories].join(',')}` : ''} (${seedImageOnly ? 'cover URLs only; catalog facts and community statistics retained' : 'community statistics retained from previous snapshot'})` : apiBase;
  await writeFile(outputPath, render(sorted, source), "utf8");
  if (!process.env.CONTENT_EXPORT_OUTPUT) {
    if (seedDir) {
      const publishedSlugs = new Set(sorted.map(item => item.slug));
      const galleries = Object.fromEntries(Object.entries(exportedImageGalleries).filter(([slug]) => publishedSlugs.has(slug)).sort(([a], [b]) => a.localeCompare(b)));
      await writeFile(resolve(dirname(outputPath), 'product-image-galleries.json'), JSON.stringify(galleries, null, 2) + '\n', 'utf8');
    }
    const setupSlugs = [...new Set(SNOWBOARD_SETUPS.flatMap(setup => [...setup.products]))];
    const setupProducts = setupSlugs.map(slug => {
      const product = sorted.find(item => item.slug === slug);
      if (!product) throw new Error(`搭配指南缺少产品：${slug}`);
      const text = (key: string) => typeof product.specs[key] === 'string' ? product.specs[key] as string : '';
      return {
        slug, title: product.title, model: product.model, year: product.year, category: product.categorySlug,
        quote: text('officialPrice'), checkedAt: text('priceCheckedAt'), priceNote: text('priceStatus'),
        source: text('priceSource') || (text('compatibilitySources').match(/https:\/\/[^\s；]+/) ?? [])[0] || previousSetupProducts.find(item => item.slug === slug)?.source || '',
      };
    });
    await writeFile(resolve(dirname(outputPath), 'snowboard-setup-products.json'), JSON.stringify(setupProducts, null, 2) + '\n', 'utf8');
  }
  console.log(`已从 ${source} 导出 ${sorted.length} 条产品到 ${outputPath}`);
  console.log(`覆盖品类：${[...new Set(sorted.map((item) => item.categorySlug))].sort().join("、")}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
