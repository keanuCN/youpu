import type { Metadata } from "next";
import HomeClient from "./home-client";
import { BRAND } from "@/lib/brand";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: `${BRAND.name} ${BRAND.nameEn.toUpperCase()} · 买之前，来有谱｜装备参数图鉴与实测评分`,
  },
  description:
    "把装备拆成数据再决定买不买：结构化参数图鉴、横向对比、按条件推荐、社区实测评价。现已开档单板、羽毛球拍与路亚竿。",
  alternates: { canonical: SITE_URL },
};

export default function Page() {
  return <HomeClient />;
}
