import type { MetadataRoute } from "next";
import { GEAR } from "@/data/boards";
import { CATEGORY_TREE } from "@/data/categories";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

/**
 * 全站 sitemap（技术方案 §14.2）：列表页 / 详情页 / 榜单页 / 工具页。
 * 筛选与排序参数 URL、个人中心、登录页一律不入（noindex 白名单）。
 * 数据量上千后可改用 generateSitemaps 按 products/rankings 分组，当前单文件足够。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const liveCategories = CATEGORY_TREE.flatMap((root) => root.children ?? [])
    .flatMap((mid) => mid.children ?? [])
    .filter((leaf) => leaf.status === "live");

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    ...liveCategories.map((category) => ({
      url: absoluteUrl(`/browse/${category.slug}`),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    {
      url: absoluteUrl("/rankings"),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    ...GEAR.map((gear) => ({
      url: absoluteUrl(`/gear/${gear.id}`),
      lastModified: new Date(gear.addedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      url: absoluteUrl("/quiz"),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: absoluteUrl("/compare"),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];
}
