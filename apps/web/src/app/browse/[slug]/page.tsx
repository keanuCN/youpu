import type { Metadata } from "next";
import { Suspense } from "react";
import { BrowseClient } from "./browse-client";
import { CATEGORY_LEAVES, getCategory } from "@/data/categories";
import { getCategoryProducts } from "@/lib/content";
import { categoryMetadata } from "@/lib/seo";

/** 静态导出时预渲染全部开档类目 */
export function generateStaticParams() {
  return CATEGORY_LEAVES.filter((leaf) => leaf.status === "live")
    .map((leaf) => ({ slug: leaf.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = getCategory(params.slug);
  if (!category) return { title: "品类不存在" };
  // 参数 URL（?sort= / ?q=）的 noindex 在静态部署里由 nginx 的 X-Robots-Tag 承担
  // （静态导出无法按查询串产出不同 HTML）；canonical 始终指向干净路径。
  return categoryMetadata(category, { filtered: false });
}

export default async function BrowsePage({ params }: { params: { slug: string } }) {
  const initialPool = await getCategoryProducts(params.slug);
  const content = <BrowseClient slug={params.slug} initialPool={initialPool} />;
  // Next.js 14 生产构建要求 useSearchParams 始终位于 Suspense 边界内。
  return <Suspense fallback={null}>{content}</Suspense>;
}
