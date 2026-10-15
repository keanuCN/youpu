import { isAllowedImageUrl, resolveImageUrl } from "../lib/image-url";
import { sizeSpecsOf } from '../lib/size-specs';
import { removeInlinePriceClaims } from '../lib/format';
import { getCategory } from './categories';
import type { GearItem } from "../types";
import type { CatalogSnapshotItem } from "./catalog-snapshot";
import productImageGalleries from './product-image-galleries.json';

export type CatalogImageGalleries = Readonly<Record<string, ReadonlyArray<{ url: string; kind: string; source?: string }>>>;

type SnapshotSpecs = GearItem["specs"];

const EMPTY_RATING_DIST: GearItem["ratingDist"] = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
const DESPERADO_PRODUCT_ID = "gray-desperado-ti-type-r-2027";

function enrichDesperadoSpecs(slug: string, specs: SnapshotSpecs): SnapshotSpecs {
  if (slug !== DESPERADO_PRODUCT_ID) return specs;
  return {
    ...specs,
    season: "2026–2027（26/27）",
    manufacturer: "GRAY SNOWBOARDS",
    flex: 9.4,
    stiffnessScale: "N / W / T 分别为板头 / 腰部 / 板尾硬度；官方表格按尺码列出，非统一单值",
    flexNote: "当前选中 167 Vew 的官方分区硬度为 N 8.7 / W 9.4 / T 8.9（10 分制）；其余尺码请查看尺码表",
    hardcoreNote: "侧切按官方三段半径均值参与站内进阶指数计算；官方未公布减震值，按算法中性值 5 估算。该指数是站内参考，不是厂商评分。",
    edgeSpecNote: "官方资料的尺码表与产品说明对刃角标注存在差异；下单前请以对应尺码实物或厂商确认值为准",
    useCase: "偏向压雪道与硬雪上的高速刻滑、连续走刃和主动控弯",
    useCaseLimit: "高硬度和强支撑需要稳定的换刃与压板能力；不以新手容错、道具公园或深粉雪浮力为主要取向",
    sizingNote: "11 个尺码覆盖 154–179 cm；同长度含标准、Wide 与 Extra Wide 版本，选码需同时核对腰宽、靴底长度、体重和目标弯型",
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function numberValue(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
  return undefined;
}

function sidecutValue(specs: SnapshotSpecs): number | undefined {
  const direct = numberValue(specs.sidecut);
  if (direct !== undefined) return direct;
  const radii = String(specs.sidecutRadii ?? "").match(/\d+(?:\.\d+)?/g)?.map(Number).filter(Number.isFinite) ?? [];
  return radii.length ? radii.reduce((sum, value) => sum + value, 0) / radii.length : undefined;
}

function catalogHardcoreIndex(categorySlug: string, specs: SnapshotSpecs, scores: Record<string, number>): number {
  if (categorySlug !== "snowboard") return 0;
  const flex = numberValue(specs.flex);
  const edge = numberValue(specs.effectiveEdge);
  const sidecut = sidecutValue(specs);
  if (flex === undefined || edge === undefined || sidecut === undefined) return 0;
  const norm = (value: number, min: number, max: number) => Math.min(1, Math.max(0, (value - min) / (max - min)));
  // 与本地单板内容库的进阶指数口径一致；无官方减震数据时使用公式原有的中性默认值 5。
  const damping = numberValue(specs.damping) ?? 5;
  const stability = scores.stability ?? 5;
  return Math.round((
    norm(flex, 2, 10) * 0.3 +
    norm(edge, 1050, 1400) * 0.2 +
    (1 - norm(sidecut, 6, 11)) * 0.15 +
    norm(damping, 3, 10) * 0.2 +
    norm(stability, 3, 10) * 0.15
  ) * 100);
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
  if (!snapshot.coverUrl || !isAllowedImageUrl(snapshot.coverUrl)) {
    return isAllowedImageUrl(fallback) ? fallback : "";
  }
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

function galleryWithCover(cover: string, fallback: GearItem["gallery"] = []): GearItem["gallery"] {
  const safeFallback = fallback.filter((shot) => isAllowedImageUrl(shot.url));
  if (!cover) return safeFallback;
  if (safeFallback.some((shot) => shot.url === cover)) return safeFallback;
  return [{ url: cover, label: "目录封面 / CATALOG" }, ...safeFallback.filter((shot) => shot.url !== cover)];
}

function seedGallery(snapshot: CatalogSnapshotItem, galleries: CatalogImageGalleries): GearItem['gallery'] | undefined {
  const images = galleries[snapshot.slug];
  if (!images) return undefined;
  // API 封面已被管理台更新时，不用旧种子图集覆盖新的商品图。
  if (!images.length) return snapshot.coverUrl ? undefined : [];
  if (images[0]?.url !== snapshot.coverUrl) return undefined;
  const labels: Record<string, string> = { face: '正面 / FRONT', base: '底面 / BASE', side: '侧面 / SIDE', field: '实地 / FIELD', shape: '板型 / SHAPE', card3x4: '商品图 / PRODUCT' };
  const allowed = images.filter(image => isAllowedImageUrl(image.url));
  if (!allowed.length) return undefined;
  return allowed.map(image => ({ url: resolveImageUrl(image.url), label: labels[image.kind] ?? '细节 / DETAIL', ...(image.source ? { source: image.source } : {}) }));
}

function editorialComposite(categorySlug: string, scores: Record<string, number>): number {
  const dims = getCategory(categorySlug)?.scoreDims ?? [];
  const available = dims.filter((dim) => Number.isFinite(scores[dim.key]));
  const weight = available.reduce((sum, dim) => sum + dim.weight, 0);
  if (!weight) return 0;
  const weighted = available.reduce((sum, dim) => sum + scores[dim.key]! * dim.weight, 0);
  return Math.round((weighted / weight) * 100) / 10;
}

function mergeSnapshot(gear: GearItem, snapshot: CatalogSnapshotItem, galleries: CatalogImageGalleries): GearItem {
  const specs = toSpecs(asRecord(snapshot.specs));
  const mergedSpecs = snapshot.specs.priceCheckedAt || snapshot.specs.sourceCheckedAt ? specs : { ...gear.specs, ...specs };
  const enrichedSpecs = enrichDesperadoSpecs(snapshot.slug, mergedSpecs);
  const priceBand = priceRange(snapshot, gear);
  const cover = safeCover(snapshot, gear.hero);
  const flex = numberValue(enrichedSpecs.flex) ?? gear.flexValue;
  const scores = snapshot.editorialScores ?? gear.scores;

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
    flexLabel: numberValue(enrichedSpecs.flex) === undefined ? gear.flexLabel : flexLabel(flex),
    hero: cover,
    gallery: galleryWithCover(cover, seedGallery(snapshot, galleries) ?? gear.gallery),
    specs: enrichedSpecs,
    sizeSpecs: sizeSpecsOf(snapshot.specs.sizeSpecs, gear.sizeSpecs),
    equipmentSizeChart: sizeSpecsOf(snapshot.specs.sizeChart, gear.equipmentSizeChart),
    scores,
    composite: snapshot.composite ?? (editorialComposite(snapshot.categorySlug, scores) || gear.composite),
    analysis: snapshot.oneLiner ? { ...gear.analysis, verdict: removeInlinePriceClaims(snapshot.oneLiner) } : gear.analysis,
    priceBand,
  };
}

function createFromSnapshot(snapshot: CatalogSnapshotItem, galleries: CatalogImageGalleries): GearItem {
  const specs = enrichDesperadoSpecs(snapshot.slug, toSpecs(asRecord(snapshot.specs)));
  const priceBand = priceRange(snapshot);
  const cover = safeCover(snapshot, "");
  const flex = numberValue(specs.flex) ?? 0;
  const verdict = removeInlinePriceClaims(snapshot.oneLiner ?? "");
  const scores = snapshot.editorialScores ?? {};

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
    gallery: galleryWithCover(cover, seedGallery(snapshot, galleries)),
    specs: enrichDesperadoSpecs(snapshot.slug, specs),
    sizeSpecs: sizeSpecsOf(snapshot.specs.sizeSpecs),
    equipmentSizeChart: sizeSpecsOf(snapshot.specs.sizeChart),
    scores,
    composite: snapshot.composite ?? editorialComposite(snapshot.categorySlug, scores),
    hardcore: catalogHardcoreIndex(snapshot.categorySlug, specs, scores),
    heat: 0,
    whoFor: [],
    analysis: { verdict, strengths: [], weaknesses: [], fits: [], notFits: [] },
    priceBand,
    ratingDist: EMPTY_RATING_DIST,
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
  galleries: CatalogImageGalleries = productImageGalleries,
): GearItem[] {
  const used = new Set<number>();
  const hydrated = base.flatMap((gear) => {
    const index = snapshots.findIndex((snapshot, candidate) => !used.has(candidate) && matchesSnapshot(gear, snapshot));
    if (index < 0) return [];
    used.add(index);
    return [mergeSnapshot(gear, snapshots[index]!, galleries)];
  });

  return [...hydrated, ...snapshots.filter((_, index) => !used.has(index)).map(snapshot => createFromSnapshot(snapshot, galleries))];
}
