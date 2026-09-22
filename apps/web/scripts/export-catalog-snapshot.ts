import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { normalizePriceRange, productListResponseSchema, type ProductListItem } from "@youpu/schema";

const PAGE_SIZE = 48;
const apiBase = (process.env.CONTENT_EXPORT_API_BASE ?? process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001").replace(/\/$/, "");
const outputPath = resolve(
  process.env.CONTENT_EXPORT_OUTPUT ?? resolve(process.cwd(), "src/data/catalog-snapshot.ts"),
);

async function fetchPage(page: number): Promise<{ total: number; items: ProductListItem[] }> {
  const url = `${apiBase}/api/products?page=${page}&pageSize=${PAGE_SIZE}&sort=hot`;
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
  const sorted = stableSort([...unique.values()]);
  if (sorted.length !== total) {
    throw new Error(`目录快照数量不完整：接口声明 ${total} 条，实际得到 ${sorted.length} 条`);
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, render(sorted, apiBase), "utf8");
  console.log(`已从 ${apiBase} 导出 ${sorted.length} 条产品到 ${outputPath}`);
  console.log(`覆盖品类：${[...new Set(sorted.map((item) => item.categorySlug))].sort().join("、")}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
