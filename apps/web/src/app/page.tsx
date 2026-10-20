import type { Metadata } from "next";
import HomeClient from "./home-client";
import { HERO_IMAGE_POOL } from "@/data/assets";
import { BRAND } from "@/lib/brand";
import { SITE_URL } from "@/lib/seo";

type HeroImage = (typeof HERO_IMAGE_POOL)[number];

export const metadata: Metadata = {
  title: {
    absolute: `${BRAND.name} ${BRAND.nameEn.toUpperCase()} · 买之前，来有谱｜装备参数图鉴与实测评分`,
  },
  description:
    "把装备拆成数据再决定买不买：结构化参数图鉴、横向对比、按条件推荐、社区实测评价。现已开档单板、羽毛球拍与路亚竿。",
  alternates: { canonical: SITE_URL },
};

export const dynamic = "force-dynamic";

export default function Page() {
  const resortImages = HERO_IMAGE_POOL.slice(1);
  const initialHeroImage: HeroImage = resortImages[Math.floor(Math.random() * resortImages.length)] ?? HERO_IMAGE_POOL[0];
  return <HomeClient initialHeroImage={initialHeroImage} />;
}
