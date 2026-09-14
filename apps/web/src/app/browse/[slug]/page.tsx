import type { Metadata } from "next";
import { Suspense } from "react";
import { BrowseClient } from "./browse-client";
import { CATEGORY_TREE, getCategory } from "@/data/categories";
import { categoryMetadata } from "@/lib/seo";

/** 静态导出时预渲染全部开档类目 */
export function generateStaticParams() {
  return CATEGORY_TREE.flatMap((root) => root.children ?? [])
    .flatMap((mid) => mid.children ?? [])
    .filter((leaf) => leaf.status === "live")
    .map((leaf) => ({ slug: leaf.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = getCategory(params.slug);
  if (!category) return { title: "品类不存在" };
  // 参数 URL（?sort= / ?q=）的 noindex 在静态部署里由 nginx 的 X-Robots-Tag 承担
  // （静态导出无法按查询串产出不同 HTML）；canonical 始终指向干净路径。
  return categoryMetadata(category, { filtered: false });
}

export default function BrowsePage({ params }: { params: { slug: string } }) {
  const content = <BrowseClient slug={params.slug} />;
  // 静态导出要求 useSearchParams 处于 Suspense 边界内；SSR/dev 构建下包边界会让该块
  // 延迟水合（触发 React 的 Extra attributes 警告），因此按构建模式分支。
  return process.env.NEXT_OUTPUT === "export" ? <Suspense>{content}</Suspense> : content;
}
