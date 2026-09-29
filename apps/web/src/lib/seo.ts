import type { Metadata } from "next";
import { reviewCount, userRating } from "@/data/boards";
import { BRAND } from "@/lib/brand";
import { fmtPrice } from "@/lib/format";
import { hasPrice } from "@/lib/gear-state";
import type { Category, GearItem } from "@/types";

/**
 * SEO 技术件（技术方案 §14.2）：标题/描述模板全部从结构化数据生成，无重复；
 * canonical 走站点根域名，筛选/排序等参数 URL 一律 noindex（由页面自行声明）。
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** 详情页：型号词是天然长尾，标题吃 {model} {year} + 决策词（技术方案 §14.2 模板） */
export function gearMetadata(gear: GearItem): Metadata {
  const title = `${gear.model} ${gear.year} 参数 · ${gear.demoRating ? "选板参考" : "实测评分"} · 尺寸怎么选 - ${gear.brand}`;
  const facts = [
    gear.demoRating ? "含规格推算参考样本" : `${reviewCount(gear)} 条实测`,
    gear.flexValue > 0 ? `硬度 ${gear.flexValue}/10` : "硬度待补充",
    hasPrice(gear) ? fmtPrice(gear.price, gear.priceCurrency) : "价格待补充",
  ].join(" · ");
  const description = [
    gear.analysis.verdict || `${gear.brand} ${gear.model} ${gear.year} 官方规格档案`,
    facts,
  ]
    .filter(Boolean)
    .join("｜")
    .slice(0, 150);
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/gear/${gear.id}`) },
    openGraph: { title, description, type: "website" },
  };
}

/** 列表页：泛品类词 */
export function categoryMetadata(category: Category, opts: { filtered: boolean }): Metadata {
  const title = `${category.name}怎么选 · 全参数对比与实测评分`;
  const filters = category.filterTemplate.map((filter) => filter.label).join("、") || "结构化参数";
  const description = `${category.name}档案库：按${filters}筛选，横向对比全部参数与社区实测评分。`;
  return {
    title,
    description,
    // 筛选/排序参数 URL 不进索引，只让干净路径进
    robots: opts.filtered ? { index: false, follow: true } : undefined,
    alternates: { canonical: absoluteUrl(`/browse/${category.slug}`) },
  };
}

export function simpleMetadata(opts: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
}): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    robots: opts.index === false ? { index: false, follow: false } : undefined,
    alternates: { canonical: absoluteUrl(opts.path) },
  };
}

// ---------- JSON-LD ----------

export function productJsonLd(gear: GearItem) {
  const rating = userRating(gear);
  const count = reviewCount(gear);
  const profile = gear.gallery.map((s) => s.url).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${gear.brand} ${gear.model} ${gear.year}`,
    brand: { "@type": "Brand", name: gear.brand },
    description: gear.analysis.verdict || `${gear.brand} ${gear.model} ${gear.year} 官方规格档案`,
    ...(profile.length > 0 ? { image: profile } : {}),
    ...(hasPrice(gear)
      ? {
          offers: {
            "@type": "Offer",
            price: gear.price,
            priceCurrency: gear.priceCurrency ?? "CNY",
            availability: "https://schema.org/InStock",
            url: absoluteUrl(`/gear/${gear.id}`),
          },
        }
      : {}),
    // 有实测评分才输出聚合评分，避免空数据进入富摘要
    ...(!gear.demoRating && count > 0
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: rating, reviewCount: count, bestRating: 5 } }
      : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

export function itemListJsonLd(name: string, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

/** 渲染结构化数据用的属性（服务端组件内展开到 <script> 上，不参与 React key 管理） */
export function jsonLdProps(data: unknown) {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  };
}
