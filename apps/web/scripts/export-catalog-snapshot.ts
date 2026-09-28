import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";

import { normalizePriceRange, productListResponseSchema, type ProductListItem } from "@youpu/schema";
import { shouldRejectCatalogCountDecrease } from "./catalog-build-policy";
import { CATALOG_SNAPSHOT, CATALOG_SNAPSHOT_META, type CatalogSnapshotItem } from "../src/data/catalog-snapshot";

const PAGE_SIZE = 48;
const apiBase = (process.env.CONTENT_EXPORT_API_BASE ?? process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001").replace(/\/$/, "");
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

/**
 * 单板固定器和雪鞋的商品图片、扩展参数以仓库 seed 为内容源；公开目录接口未必已同步这些编辑。
 * 导出快照时叠加本地正式档案，保证开发预览与构建不会丢失已核验的商品图和参数。
 */
async function overlaySnowboardSeeds(items: ProductListItem[]): Promise<ProductListItem[]> {
  const apiPackage = resolve(process.cwd(), "../api/package.json");
  const { parse } = createRequire(apiPackage)("yaml") as typeof import("yaml");
  const bySlug = new Map(items.map((item, index) => [item.slug, index]));
  const merged = [...items];
  for (const category of ["snowboard-binding", "snowboard-boot"]) {
    const seedDir = resolve(process.cwd(), `../../data/${category}`);
    for (const file of await readdir(seedDir)) {
      if (!file.endsWith(".yaml")) continue;
      const seed = parse(await readFile(join(seedDir, file), "utf8")) as {
        slug: string;
        specs: Record<string, unknown>;
        images?: Array<{ url: string }>;
      };
      const index = bySlug.get(seed.slug);
      if (index === undefined) throw new Error(`公开目录快照缺少${category}商品：${seed.slug}`);
      merged[index] = {
        ...merged[index]!,
        coverUrl: seed.images?.[0]?.url ?? null,
        specs: seed.specs,
      };
    }
  }
  return merged;
}

function isAiPlaceholder(url: string | null): boolean {
  if (!url) return false;
  try {
    const image = new URL(url);
    return image.hostname === "g.cdn.meoo.host" && image.pathname.startsWith("/uvayfd7jql5o/ai-images/");
  } catch {
    return false;
  }
}

function stripAiPlaceholderCovers(items: ProductListItem[]): ProductListItem[] {
  return items.map((item) => isAiPlaceholder(item.coverUrl) ? { ...item, coverUrl: null } : item);
}

function committedSnapshot(): readonly CatalogSnapshotItem[] {
  try {
    const source = execFileSync("git", ["show", "HEAD:apps/web/src/data/catalog-snapshot.ts"], { encoding: "utf8" });
    const marker = "export const CATALOG_SNAPSHOT: readonly CatalogSnapshotItem[] = ";
    const start = source.indexOf(marker);
    const end = source.indexOf(";\n", start + marker.length);
    if (start >= 0 && end > start) {
      return JSON.parse(source.slice(start + marker.length, end)) as CatalogSnapshotItem[];
    }
  } catch {
    // 在没有可读取 Git HEAD 的环境里，至少使用当前仓库快照。
  }
  return CATALOG_SNAPSHOT;
}

function preserveSnapshotIds(items: ProductListItem[]): ProductListItem[] {
  const baseline = committedSnapshot();
  const idBySlug = new Map(baseline.map((item) => [item.slug, item.id]));
  return items.map((item) => ({ ...item, id: idBySlug.get(item.slug) ?? item.id }));
}

function mergeSnowboardImages(items: ProductListItem[]): CatalogSnapshotItem[] {
  const baseline = committedSnapshot();
  const snowboardBySlug = new Map(items.filter((item) => item.categorySlug === "snowboard").map((item) => [item.slug, item]));
  const existingSlugs = new Set(baseline.map((item) => item.slug));
  const merged = baseline.map((item) => {
    if (item.categorySlug !== "snowboard") return item;
    const fresh = snowboardBySlug.get(item.slug);
    const coverUrl = fresh?.coverUrl ?? item.coverUrl;
    return { ...item, coverUrl: isAiPlaceholder(coverUrl) ? null : coverUrl };
  });
  const added = items
    .filter((item) => item.categorySlug === "snowboard" && !existingSlugs.has(item.slug))
    .map((item) => ({ ...item, coverUrl: isAiPlaceholder(item.coverUrl) ? null : item.coverUrl }));
  return [...merged, ...added];
}

async function writeSnapshot(items: CatalogSnapshotItem[], source: string): Promise<void> {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, render(items, source), "utf8");
  console.log(`已从 ${apiBase} 导出 ${items.length} 条产品到 ${outputPath}`);
  console.log(`覆盖品类：${[...new Set(items.map((item) => item.categorySlug))].sort().join("、")}`);
}

function snapshotSource(): string {
  return apiBase.includes("localhost") || apiBase.includes("127.0.0.1")
    ? "本地 API + 本地单板档案"
    : `${apiBase} + 本地单板档案`;
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
 * 云端目录快照。
 *
 * 由 apps/web/scripts/export-catalog-snapshot.ts 自动生成，请勿手工编辑。
 * 快照只保存公开目录接口返回的事实字段；编辑分析、评分分布等内容继续由本地内容包维护。
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
  const items: ProductListItem[] = [];
  let total = Number.POSITIVE_INFINITY;
  let page = 1;

  while (items.length < total) {
    const result = await fetchPage(page);
    total = result.total;
    items.push(...result.items);
    if (result.items.length === 0) break;
    page += 1;
  }

  const unique = new Map(items.map((item) => [item.slug, item]));
  if (process.env.CONTENT_EXPORT_SNOWBOARD_IMAGES_ONLY === "true") {
    const snowboardSnapshot = mergeSnowboardImages(stableSort([...unique.values()]));
    await writeSnapshot(snowboardSnapshot, `${snapshotSource()}（仅刷新单板图片）`);
    return;
  }
  let sorted = await overlaySnowboardSeeds(stableSort([...unique.values()]));
  if (sorted.length !== total) {
    throw new Error(`目录快照数量不完整：接口声明 ${total} 条，实际得到 ${sorted.length} 条`);
  }
  if (sorted.length < CATALOG_SNAPSHOT_META.total && process.env.CONTENT_EXPORT_PRESERVE_MISSING === "true") {
    const incomingSlugs = new Set(sorted.map((item) => item.slug));
    const missing = CATALOG_SNAPSHOT.filter((item) => !incomingSlugs.has(item.slug));
    sorted = stableSort([...sorted, ...missing]);
    console.warn(`API 少于现有快照，已保留 ${missing.length} 条 API 未返回的旧目录记录。`);
  }
  sorted = stripAiPlaceholderCovers(preserveSnapshotIds(sorted));
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

  await writeSnapshot(sorted, snapshotSource());
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
