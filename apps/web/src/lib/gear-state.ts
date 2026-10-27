import type { GearItem } from "@/types";
import { isCuratedBaselineEnabled } from "@/lib/curated-content";

/**
 * API 内容层会把缺失字段映射成页面模型可接受的默认值。
 * 这些判断集中在这里，避免 UI 把“未采集”误读成真实的 0 分或 0 元。
 */
export function hasPrice(gear: Pick<GearItem, "price" | "priceBand">): boolean {
  return gear.price > 0 || gear.priceBand.min > 0 || gear.priceBand.max > 0;
}

export function hasMedia(gear: Pick<GearItem, "hero" | "gallery">): boolean {
  return Boolean(mediaUrl(gear));
}

export function mediaUrl(gear: Pick<GearItem, "hero" | "gallery">): string | undefined {
  return gear.hero || gear.gallery[0]?.url;
}

/** Knapton 官方实物图为细长的整板照片，应完整展示板头和板尾。 */
export function showFullProductImage(gear: Pick<GearItem, "categorySlug" | "brand" | "model">): boolean {
  return gear.categorySlug !== "snowboard" ||
    (gear.brand.toLowerCase() === "donek" && gear.model.toLowerCase().includes("knapton"));
}

export function hasEditorialScores(gear: Pick<GearItem, "composite" | "scores">): boolean {
  return gear.composite > 0 || Object.values(gear.scores).some((value) => Number.isFinite(value) && value > 0);
}

export function hasNarrative(gear: Pick<GearItem, "analysis">): boolean {
  const { verdict, strengths, weaknesses, fits, notFits } = gear.analysis;
  return Boolean(verdict.trim()) || [strengths, weaknesses, fits, notFits].some((items) => items.length > 0);
}

export function hasFlex(gear: Pick<GearItem, "flexValue">): boolean {
  return gear.flexValue > 0;
}

export function hasHardcoreIndex(gear: Pick<GearItem, "hardcore" | "flexValue" | "specs" | "scores">): boolean {
  return (
    gear.hardcore > 0 &&
    hasFlex(gear) &&
    gear.specs.effectiveEdge !== null &&
    gear.specs.effectiveEdge !== undefined &&
    ((gear.specs.sidecut !== null && gear.specs.sidecut !== undefined) || Boolean(gear.specs.sidecutRadii)) &&
    Object.keys(gear.scores).length > 0
  );
}

export function hasUserRating(gear: Pick<GearItem, "ratingDist"> & Partial<Pick<GearItem, "communityRating">>): boolean {
  if ((gear.communityRating?.count ?? 0) > 0 && gear.communityRating?.overall !== null) return true;
  return isCuratedBaselineEnabled() && Object.values(gear.ratingDist).some((count) => count > 0);
}
