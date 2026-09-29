import {
  isAllowedImageUrl,
  isAiGeneratedImageUrl,
  preferHighResolutionProductImage,
  resolveImageUrl,
} from "../lib/image-url";
import type { GearItem } from "../types";
import type { CatalogSnapshotItem } from "./catalog-snapshot";

type SnapshotSpecs = GearItem["specs"];

const EMPTY_RATING_DIST: GearItem["ratingDist"] = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function numberValue(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
  return undefined;
}

function toSpecs(value: Record<string, unknown>): SnapshotSpecs {
  return Object.fromEntries(
    Object.entries(value).map(([key, raw]) => {
      if (raw === null || typeof raw === "number" || typeof raw === "string") return [key, raw];
      if (typeof raw === "boolean") return [key, raw ? "是" : "否"];
      return [key, JSON.stringify(raw)];
    }),
  );
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function slugForGear(gear: Pick<GearItem, "brand" | "model" | "year">): string {
  return slugify(`${gear.brand}-${gear.model}-${gear.year}`);
}

function matchesSnapshot(gear: GearItem, snapshot: CatalogSnapshotItem): boolean {
  return (
    snapshot.id === gear.id ||
    snapshot.slug === slugForGear(gear) ||
    (snapshot.categorySlug === gear.categorySlug &&
      snapshot.brand.name.toLowerCase() === gear.brand.toLowerCase() &&
      snapshot.model.toLowerCase() === gear.model.toLowerCase() &&
      snapshot.year === gear.year)
  );
}

function safeCover(snapshot: CatalogSnapshotItem, fallback: string): string {
  if (!snapshot.coverUrl || !isAllowedImageUrl(snapshot.coverUrl)) return fallback;
  return resolveImageUrl(snapshot.coverUrl);
}

function priceRange(snapshot: CatalogSnapshotItem, fallback?: GearItem): { min: number; max: number } {
  const min = snapshot.priceMin ?? fallback?.priceBand.min ?? fallback?.price ?? 0;
  const max = snapshot.priceMax ?? fallback?.priceBand.max ?? fallback?.price ?? min;
  return { min, max };
}

function flexLabel(value: number): string {
  if (value <= 0) return "不适用";
  if (value < 4) return "软";
  if (value < 6) return "中";
  if (value < 8) return "中硬";
  return "硬";
}

function scenesOf(specs: SnapshotSpecs, fallback: string[] = []): string[] {
  const scenes = specs.scenes;
  if (typeof scenes === "string") {
    if (scenes.trim().startsWith("[")) {
      try {
        const parsed = JSON.parse(scenes);
        if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === "string");
      } catch {
        // 继续按普通文本处理，保留兼容旧内容包的能力。
      }
    }
    return scenes.split(/[·,，]/).map((item) => item.trim()).filter(Boolean);
  }
  if (Array.isArray(scenes)) return scenes.filter((item): item is string => typeof item === "string");
  return fallback;
}

function galleryWithCover(cover: string): GearItem["gallery"] {
  if (!cover || isAiGeneratedImageUrl(cover)) return [];
  return [{ url: preferHighResolutionProductImage(cover), label: "目录封面 / CATALOG" }];
}

function mergeSnapshot(gear: GearItem, snapshot: CatalogSnapshotItem): GearItem {
  const specs = toSpecs(asRecord(snapshot.specs));
  const priceBand = priceRange(snapshot, gear);
  // 快照中的空封面也是权威状态；不要用旧内容包封面补回已清除的占位图。
  const cover = safeCover(snapshot, "");
  const flex = numberValue(specs.flex) ?? gear.flexValue;

  return {
    ...gear,
    categorySlug: snapshot.categorySlug,
    brand: snapshot.brand.name,
    model: snapshot.model,
    year: snapshot.year,
    price: Math.round((priceBand.min + priceBand.max) / 2),
    priceCurrency: "CNY",
    scenes: scenesOf(specs, gear.scenes),
    flexValue: flex,
    flexLabel: numberValue(specs.flex) === undefined ? gear.flexLabel : flexLabel(flex),
    hero: cover,
    gallery: galleryWithCover(cover),
    specs: { ...gear.specs, ...specs },
    liveRating:
      snapshot.ratingOverall !== null && snapshot.ratingCount > 0
        ? { overall: snapshot.ratingOverall, count: snapshot.ratingCount }
        : undefined,
    composite: snapshot.composite ?? gear.composite,
    analysis: snapshot.oneLiner ? { ...gear.analysis, verdict: snapshot.oneLiner } : gear.analysis,
    priceBand,
  };
}

function createFromSnapshot(snapshot: CatalogSnapshotItem): GearItem {
  const specs = toSpecs(asRecord(snapshot.specs));
  const priceBand = priceRange(snapshot);
  const cover = safeCover(snapshot, "");
  const flex = numberValue(specs.flex) ?? 0;
  const verdict = snapshot.oneLiner ?? "";

  return {
    id: snapshot.slug,
    categorySlug: snapshot.categorySlug,
    brand: snapshot.brand.name,
    model: snapshot.model,
    year: snapshot.year,
    price: Math.round((priceBand.min + priceBand.max) / 2),
    priceCurrency: "CNY",
    scenes: scenesOf(specs),
    flexValue: flex,
    flexLabel: flexLabel(flex),
    hero: cover,
    gallery: galleryWithCover(cover),
    specs,
    scores: {},
    composite: snapshot.composite ?? 0,
    hardcore: 0,
    heat: 0,
    whoFor: [],
    analysis: { verdict, strengths: [], weaknesses: [], fits: [], notFits: [] },
    priceBand,
    ratingDist: EMPTY_RATING_DIST,
    liveRating:
      snapshot.ratingOverall !== null && snapshot.ratingCount > 0
        ? { overall: snapshot.ratingOverall, count: snapshot.ratingCount }
        : undefined,
    isNew: false,
    addedAt: `${snapshot.year}-01-01`,
  };
}

/**
 * 把云端目录的事实字段合并进本地内容包。
 * 本地已有产品保留编辑分析、评分分布、图集等人工内容；云端新增产品使用明确的空默认值。
 */
export function applyCatalogSnapshot(
  base: readonly GearItem[],
  snapshots: readonly CatalogSnapshotItem[],
): GearItem[] {
  const used = new Set<number>();
  const hydrated = base.map((gear) => {
    const index = snapshots.findIndex((snapshot, candidate) => !used.has(candidate) && matchesSnapshot(gear, snapshot));
    if (index < 0) return gear;
    used.add(index);
    return mergeSnapshot(gear, snapshots[index]!);
  });

  return [...hydrated, ...snapshots.filter((_, index) => !used.has(index)).map(createFromSnapshot)];
}
