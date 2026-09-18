import type { Metadata } from "next";
import GearDetailPage from "./gear-client";
import { GEAR } from "@/data/boards";
import { getCategory } from "@/data/categories";
import { getCategoryProducts, getProductDetail } from "@/lib/content";
import { breadcrumbJsonLd, gearMetadata, jsonLdProps, productJsonLd } from "@/lib/seo";

/** 详情页是长尾流量的主力，静态预渲染全部在档档案 */
export function generateStaticParams() {
  return GEAR.map((gear) => ({ id: gear.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const gear = await getProductDetail(params.id);
  if (!gear) return { title: "档案不存在" };
  return gearMetadata(gear);
}

export default async function Page({ params }: { params: { id: string } }) {
  const gear = await getProductDetail(params.id);
  if (!gear) {
    // 交给客户端组件渲染「档案不存在」空态（数据源切换后这里会换成 notFound()）
    return <GearDetailPage id={params.id} />;
  }
  const relatedGear =
    gear.categorySlug === "snowboard"
      ? undefined
      : await getCategoryProducts(gear.categorySlug);
  const category = getCategory(gear.categorySlug);
  return (
    <>
      <script {...jsonLdProps(productJsonLd(gear))} />
      <script
        {...jsonLdProps(
          breadcrumbJsonLd([
            { name: "首页", path: "/" },
            { name: category?.name ?? gear.categorySlug, path: `/browse/${gear.categorySlug}` },
            { name: `${gear.brand} ${gear.model}` },
          ]),
        )}
      />
      <GearDetailPage id={gear.id} initialGear={gear} relatedGear={relatedGear} />
    </>
  );
}
