import { readdir, readFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";

import { productListResponseSchema, type ProductListItem } from "@youpu/schema";
import { parse as parseYaml } from "yaml";
import { CATALOG_SNAPSHOT, CATALOG_SNAPSHOT_META } from "../src/data/catalog-snapshot";

const PAGE_SIZE = 48;
const dataDirectory = resolve(process.cwd(), "../../data");
const apiBase = (process.env.CATALOG_AUDIT_API_BASE ?? "http://localhost:3001").replace(/\/$/, "");

interface SeedProduct {
  slug: string;
  category: string;
  status?: string;
  images?: unknown[];
  price?: { min?: number | null; max?: number | null } | null;
  specs?: Record<string, unknown>;
}

async function readSeedProducts(): Promise<SeedProduct[]> {
  const products: SeedProduct[] = [];
  for (const directory of await readdir(dataDirectory, { withFileTypes: true })) {
    if (!directory.isDirectory() || ["raw", "tmp"].includes(directory.name)) continue;
    const categoryDirectory = join(dataDirectory, directory.name);
    for (const filename of await readdir(categoryDirectory)) {
      if (!/\.ya?ml$/i.test(filename)) continue;
      const contents = await readFile(join(categoryDirectory, filename), "utf8");
      const parsed: unknown = parseYaml(contents);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) continue;
      const row = parsed as Partial<SeedProduct>;
      if (typeof row.slug !== "string" || typeof row.category !== "string") continue;
      products.push(row as SeedProduct);
    }
  }
  return products;
}

async function readApiProducts(): Promise<ProductListItem[]> {
  const products: ProductListItem[] = [];
  let expectedTotal = Number.POSITIVE_INFINITY;
  for (let page = 1; products.length < expectedTotal; page += 1) {
    const url = `${apiBase}/api/products?page=${page}&pageSize=${PAGE_SIZE}&sort=new`;
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`目录 API 返回 HTTP ${response.status}：${url}`);
    const parsed = productListResponseSchema.parse(await response.json());
    expectedTotal = parsed.total;
    products.push(...parsed.items);
    if (parsed.items.length === 0) break;
  }

  const unique = new Map(products.map((product) => [product.slug, product]));
  if (unique.size !== expectedTotal) {
    throw new Error(`目录 API 分页不完整：声明 ${expectedTotal} 款，读取到 ${unique.size} 款`);
  }
  return [...unique.values()];
}

function countByCategory<T>(rows: T[], categoryOf: (row: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of rows) counts.set(categoryOf(row), (counts.get(categoryOf(row)) ?? 0) + 1);
  return counts;
}

function listDifference<T>(left: T[], right: Set<string>, slugOf: (row: T) => string): string[] {
  return left.map(slugOf).filter((slug) => !right.has(slug)).sort();
}

function printList(label: string, values: string[]): void {
  console.log(`${label}（${values.length}）`);
  if (values.length > 0) console.log(`  ${values.join("、")}`);
}

async function main(): Promise<void> {
  const seeds = await readSeedProducts();
  const publishedSeeds = seeds.filter((seed) => seed.status !== "draft");
  const apiProducts = await readApiProducts();
  const snapshot = [...CATALOG_SNAPSHOT];

  const seedSlugs = new Set(publishedSeeds.map((seed) => seed.slug));
  const apiSlugs = new Set(apiProducts.map((product) => product.slug));
  const snapshotSlugs = new Set(snapshot.map((product) => product.slug));
  const categories = [...new Set([
    ...publishedSeeds.map((seed) => seed.category),
    ...apiProducts.map((product) => product.categorySlug),
    ...snapshot.map((product) => product.categorySlug),
  ])].sort();
  const seedCounts = countByCategory(publishedSeeds, (seed) => seed.category);
  const apiCounts = countByCategory(apiProducts, (product) => product.categorySlug);
  const snapshotCounts = countByCategory(snapshot, (product) => product.categorySlug);

  console.log(`目录一致性检查：种子 ${publishedSeeds.length} 款（另有 ${seeds.length - publishedSeeds.length} 款草稿），本地 API ${apiProducts.length} 款，快照 ${CATALOG_SNAPSHOT_META.total} 款`);
  console.log(`快照生成时间：${CATALOG_SNAPSHOT_META.generatedAt}；API：${apiBase}`);
  console.log("\n分类数量：");
  console.log("分类\t种子\t本地 API\t前台快照");
  for (const category of categories) {
    console.log(`${category}\t${seedCounts.get(category) ?? 0}\t${apiCounts.get(category) ?? 0}\t${snapshotCounts.get(category) ?? 0}`);
  }

  console.log("\n商品差异：");
  printList("种子有、API 没有", listDifference(publishedSeeds, apiSlugs, (seed) => seed.slug));
  printList("API 有、种子没有", listDifference(apiProducts, seedSlugs, (product) => product.slug));
  printList("快照有、API 没有", listDifference(snapshot, apiSlugs, (product) => product.slug));
  printList("API 有、快照没有", listDifference(apiProducts, snapshotSlugs, (product) => product.slug));

  const seedMissingImages = publishedSeeds.filter((seed) => !seed.images?.length).map((seed) => seed.slug).sort();
  const apiMissingImages = apiProducts.filter((product) => !product.coverUrl).map((product) => product.slug).sort();
  const seedMissingPrices = publishedSeeds
    .filter((seed) => seed.price?.min == null && seed.price?.max == null)
    .map((seed) => seed.slug)
    .sort();
  console.log("\n内容缺项：");
  printList("种子缺少图片", seedMissingImages);
  printList("本地 API 缺少封面", apiMissingImages);
  printList("种子缺少价格", seedMissingPrices);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
