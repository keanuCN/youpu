import {
  normalizePriceRange,
  productCompareResponseSchema,
  productDetailSchema,
  productListResponseSchema,
  type ProductDetail,
  type ProductListItem,
} from "@youpu/schema";
import { GEAR, gearOfCategory, getGear } from "../data/boards";
import { flexBucket, isLive } from "../data/categories";
import { API_BASE } from "./api";
import { isAllowedImageUrl, resolveImageUrl } from "./image-url";
import type { FitGuide, FitGuideRow, GearAnalysis, GearItem, GalleryShot } from "../types";

export type ContentSource = "pack" | "api";

export interface ContentOptions {
  source?: ContentSource;
  fetcher?: typeof fetch;
  onFallback?: (error: unknown) => void;
}

type ApiProduct = ProductListItem | ProductDetail;

const API_TIMEOUT_MS = 8_000;
const EMPTY_RATING_DIST: GearItem["ratingDist"] = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };

export function resolveContentSource(
  env?: { NEXT_PUBLIC_CONTENT_SOURCE?: string },
): ContentSource {
  // 使用直接属性访问，Next.js 才会在客户端构建时注入 NEXT_PUBLIC_* 环境变量。
  const configured = env ? env.NEXT_PUBLIC_CONTENT_SOURCE : process.env.NEXT_PUBLIC_CONTENT_SOURCE;
  return configured === "api" ? "api" : "pack";
}

function slugForProduct(product: Pick<GearItem, "brand" | "model" | "year">): string {
  return `${product.brand}-${product.model}-${product.year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function findLocalGear(item: ApiProduct): GearItem | undefined {
  const categorySlug = "categorySlug" in item ? item.categorySlug : item.category.slug;
  return GEAR.find(
    (gear) =>
      gear.id === item.id ||
      slugForProduct(gear) === item.slug ||
      (gear.categorySlug === categorySlug &&
        gear.brand.toLowerCase() === item.brand.name.toLowerCase() &&
        gear.model.toLowerCase() === item.model.toLowerCase() &&
        gear.year === item.year),
  );
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function numberValue(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
  return undefined;
}

function toSpecs(value: Record<string, unknown>): GearItem["specs"] {
  return Object.fromEntries(
    Object.entries(value).map(([key, raw]) => {
      if (raw === null || typeof raw === "number" || typeof raw === "string") return [key, raw];
      if (typeof raw === "boolean") return [key, raw ? "是" : "否"];
      return [key, JSON.stringify(raw)];
    }),
  );
}

function textValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function fitGuideOf(value: Record<string, unknown>, fallback?: GearItem): FitGuide | undefined {
  const rows = Array.isArray(value.geometry)
    ? value.geometry
        .map((raw): FitGuideRow | null => {
          const row = asRecord(raw);
          const size = textValue(row.size);
          if (!size) return null;
          return {
            size,
            height: textValue(row.height),
            stack: numberValue(row.stack),
            reach: numberValue(row.reach),
            wheelbase: numberValue(row.wheelbase),
            headAngle: textValue(row.headAngle),
            seatAngle: textValue(row.seatAngle),
            wheelSize: textValue(row.wheelSize),
          };
        })
        .filter((row): row is FitGuideRow => row !== null)
    : [];

  if (!rows.length) return fallback?.fitGuide;
  const note = textValue(value.geometryNote) ?? fallback?.fitGuide?.note;
  return note ? { rows, note } : { rows };
}

function priceRangeOf(item: ApiProduct, fallback?: GearItem): { min: number; max: number } {
  if (item.priceMin !== null || item.priceMax !== null) {
    const normalized = normalizePriceRange({ min: item.priceMin, max: item.priceMax, currency: item.priceCurrency });
    return { min: normalized.min ?? 0, max: normalized.max ?? normalized.min ?? 0 };
  }
  return {
    min: fallback?.priceBand.min ?? fallback?.price ?? 0,
    max: fallback?.priceBand.max ?? fallback?.price ?? 0,
  };
}

function priceOf(item: ApiProduct, fallback?: GearItem): number {
  const range = priceRangeOf(item, fallback);
  return Math.round((range.min + range.max) / 2);
}

function analysisOf(item: ApiProduct, fallback?: GearItem): GearAnalysis {
  if (fallback) return fallback.analysis;
  return {
    verdict: item.oneLiner ?? "",
    strengths: [],
    weaknesses: [],
    fits: [],
    notFits: [],
  };
}

function galleryOf(item: ApiProduct, hero: string, fallback?: GearItem): GalleryShot[] {
  if ("images" in item && item.images.length > 0) {
    return item.images
      .filter((image) => isAllowedImageUrl(image.url))
      .map((image) => ({ url: resolveImageUrl(image.url), label: image.alt ?? image.kind }));
  }
  if (fallback?.gallery.length) return fallback.gallery;
  return hero ? [{ url: hero, label: "封面 / COVER" }] : [];
}

function safeImageUrl(source: string | null, fallback = ""): string {
  if (!source || !isAllowedImageUrl(source)) return fallback;
  return resolveImageUrl(source);
}

function hardcoreOf(specs: Record<string, unknown>, scores: Record<string, number>, fallback?: GearItem): number {
  if (fallback) return fallback.hardcore;
  const flex = numberValue(specs.flex);
  const edge = numberValue(specs.effectiveEdge);
  const sidecut = numberValue(specs.sidecut);
  const damping = numberValue(specs.damping);
  if ([flex, edge, sidecut, damping, scores.stability].every((value) => value === undefined)) return 0;

  const norm = (value: number, lo: number, hi: number) => Math.min(1, Math.max(0, (value - lo) / (hi - lo)));
  const raw =
    norm(flex ?? 5, 2, 10) * 0.3 +
    norm(edge ?? 1200, 1050, 1400) * 0.2 +
    (1 - norm(sidecut ?? 8, 6, 11)) * 0.15 +
    norm(damping ?? 5, 3, 10) * 0.2 +
    norm(scores.stability ?? 5, 3, 10) * 0.15;
  return Math.round(raw * 100);
}

function mapProduct(item: ApiProduct, fallback?: GearItem): GearItem {
  const rawSpecs = asRecord(item.specs);
  const specs = toSpecs(rawSpecs);
  const fallbackFlex = fallback?.flexValue ?? 0;
  const flexValue = numberValue(rawSpecs.flex) ?? fallbackFlex;
  const cover = safeImageUrl(item.coverUrl, fallback?.hero ?? "");
  const categorySlug = "categorySlug" in item ? item.categorySlug : item.category.slug;
  const scores = "editorialScores" in item && item.editorialScores ? item.editorialScores : fallback?.scores ?? {};
  const price = priceOf(item, fallback);
  const priceBand = priceRangeOf(item, fallback);
  const scenesRaw = rawSpecs.scenes;
  const scenes = Array.isArray(scenesRaw)
    ? scenesRaw.filter((scene): scene is string => typeof scene === "string")
    : fallback?.scenes ?? [];

  return {
    // Detail routes are slug-based. Keep the local id while transitional data exists,
    // and use the API slug for new products so cards can link to a resolvable route.
    id: fallback?.id ?? item.slug,
    categorySlug,
    brand: item.brand.name,
    model: item.model,
    year: item.year,
    price,
    priceCurrency: "CNY",
    scenes,
    flexValue,
    flexLabel:
      numberValue(rawSpecs.flex) === undefined
        ? fallback?.flexLabel ?? "待补充"
        : ({ soft: "软", mid: "中", midstiff: "中硬", stiff: "硬" }[flexBucket(flexValue)] ?? "未知"),
    hero: cover,
    gallery: galleryOf(item, cover, fallback),
    specs: { ...(fallback?.specs ?? {}), ...specs },
    fitGuide: fitGuideOf(rawSpecs, fallback),
    scores,
    composite: item.composite ?? fallback?.composite ?? 0,
    hardcore: hardcoreOf(rawSpecs, scores, fallback),
    heat: fallback?.heat ?? 0,
    whoFor: fallback?.whoFor ?? [],
    analysis: analysisOf(item, fallback),
    priceBand,
    ratingDist: fallback?.ratingDist ?? EMPTY_RATING_DIST,
    isNew: fallback?.isNew ?? false,
    addedAt: fallback?.addedAt ?? `${item.year}-01-01`,
  };
}

export function mapProductListItem(item: ProductListItem, fallback?: GearItem): GearItem {
  return mapProduct(item, fallback ?? findLocalGear(item));
}

export function mapProductDetail(item: ProductDetail, fallback?: GearItem): GearItem {
  return mapProduct(item, fallback ?? findLocalGear(item));
}

function apiPath(path: string): string {
  return `${API_BASE.replace(/\/$/, "")}${path}`;
}

async function requestJson<T>(
  path: string,
  schema: { parse: (value: unknown) => T },
  fetcher: typeof fetch,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const response = await fetcher(apiPath(path), {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Content API returned ${response.status}`);
    return schema.parse(await response.json());
  } finally {
    clearTimeout(timer);
  }
}

export async function getCategoryProducts(slug: string, options: ContentOptions = {}): Promise<GearItem[]> {
  const fallback = gearOfCategory(slug);
  if ((options.source ?? resolveContentSource()) === "pack" || !isLive(slug)) return fallback;

  try {
    const response = await requestJson(
      `/api/products?category=${encodeURIComponent(slug)}&page=1&pageSize=48`,
      productListResponseSchema,
      options.fetcher ?? fetch,
    );
    return response.items
      .filter((item) => isLive(item.categorySlug))
      .map((item) => mapProductListItem(item));
  } catch (error) {
    options.onFallback?.(error);
    return fallback;
  }
}

export async function getProductDetail(id: string, options: ContentOptions = {}): Promise<GearItem | undefined> {
  const fallback = getGear(id);
  if ((options.source ?? resolveContentSource()) === "pack") return fallback;

  try {
    // 快照新增产品的 id 就是 API canonical slug；旧内容包仍使用内部短 id，需要按品牌/型号/年份回查。
    const lookup = fallback && fallback.id !== id ? slugForProduct(fallback) : id;
    const response = await requestJson(`/api/products/${encodeURIComponent(lookup)}`, productDetailSchema, options.fetcher ?? fetch);
    if (!isLive(response.category.slug)) return fallback;
    return mapProductDetail(response, fallback);
  } catch (error) {
    options.onFallback?.(error);
    return fallback;
  }
}

/** 对比页批量读取 API 详情；API 不可用时保留本地内容包体验。 */
export async function getCompareProducts(ids: string[], options: ContentOptions = {}): Promise<GearItem[]> {
  const localItems = ids.map((id) => getGear(id)).filter((gear): gear is GearItem => !!gear);
  if ((options.source ?? resolveContentSource()) === "pack" || ids.length === 0) return localItems;

  const refs = ids.map((id) => {
    const local = getGear(id);
    return local && local.id !== id ? slugForProduct(local) : id;
  });

  try {
    const response = await requestJson(
      `/api/products?ids=${refs.map((ref) => encodeURIComponent(ref)).join(",")}`,
      productCompareResponseSchema,
      options.fetcher ?? fetch,
    );
    const bySlug = new Map(
      response.items.map((item) => [item.slug, mapProductDetail(item, findLocalGear(item))]),
    );
    return refs
      .map((ref, index) => bySlug.get(ref) ?? localItems.find((item) => slugForProduct(item) === ref) ?? getGear(ids[index]!))
      .filter((gear): gear is GearItem => !!gear);
  } catch (error) {
    options.onFallback?.(error);
    return localItems;
  }
}
