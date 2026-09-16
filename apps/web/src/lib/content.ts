import {
  productDetailSchema,
  productListResponseSchema,
  type ProductDetail,
  type ProductListItem,
} from "@youpu/schema";
import { GEAR, gearOfCategory, getGear } from "../data/boards";
import { flexBucket, getCategory, isLive } from "../data/categories";
import { API_BASE } from "./api";
import { isAllowedImageUrl, resolveImageUrl } from "./image-url";
import type { GearAnalysis, GearItem, GalleryShot } from "../types";

export type ContentSource = "pack" | "api";

export interface ContentOptions {
  source?: ContentSource;
  fetcher?: typeof fetch;
}

type ApiProduct = ProductListItem | ProductDetail;

const API_TIMEOUT_MS = 8_000;
const EMPTY_RATING_DIST: GearItem["ratingDist"] = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };

export function resolveContentSource(
  env: { NEXT_PUBLIC_CONTENT_SOURCE?: string } = process.env as { NEXT_PUBLIC_CONTENT_SOURCE?: string },
): ContentSource {
  return env.NEXT_PUBLIC_CONTENT_SOURCE === "api" ? "api" : "pack";
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

function priceOf(item: ApiProduct, fallback?: GearItem): number {
  if (item.priceMin !== null && item.priceMax !== null) return Math.round((item.priceMin + item.priceMax) / 2);
  if (item.priceMin !== null) return item.priceMin;
  if (item.priceMax !== null) return item.priceMax;
  return fallback?.price ?? 0;
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
  const priceBand = {
    min: item.priceMin ?? fallback?.priceBand.min ?? price,
    max: item.priceMax ?? fallback?.priceBand.max ?? price,
  };
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
    scenes,
    flexValue,
    flexLabel:
      numberValue(rawSpecs.flex) === undefined
        ? fallback?.flexLabel ?? "待补充"
        : ({ soft: "软", mid: "中", midstiff: "中硬", stiff: "硬" }[flexBucket(flexValue)] ?? "未知"),
    hero: cover,
    gallery: galleryOf(item, cover, fallback),
    specs: { ...(fallback?.specs ?? {}), ...specs },
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
  } catch {
    return fallback;
  }
}

export async function getProductDetail(id: string, options: ContentOptions = {}): Promise<GearItem | undefined> {
  const fallback = getGear(id);
  if ((options.source ?? resolveContentSource()) === "pack") return fallback;

  try {
    const lookup = fallback ? slugForProduct(fallback) : id;
    const response = await requestJson(`/api/products/${encodeURIComponent(lookup)}`, productDetailSchema, options.fetcher ?? fetch);
    if (!isLive(response.category.slug)) return fallback;
    return mapProductDetail(response, fallback);
  } catch {
    return fallback;
  }
}
