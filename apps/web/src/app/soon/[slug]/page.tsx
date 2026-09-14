import SoonClient from "./soon-client";
import { CATEGORY_TREE } from "@/data/categories";

/** 静态导出时把全部筹备中品类也渲染出来（页脚与品类面板会链接到它们） */
export function generateStaticParams() {
  return CATEGORY_TREE.flatMap((root) => root.children ?? [])
    .flatMap((mid) => mid.children ?? [])
    .map((leaf) => ({ slug: leaf.slug }));
}

export default function SoonPage({ params }: { params: { slug: string } }) {
  return <SoonClient slug={params.slug} />;
}
