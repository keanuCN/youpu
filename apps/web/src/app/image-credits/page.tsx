import type { Metadata } from "next";
import Link from "next/link";
import { HERO_IMAGE_POOL } from "@/data/assets";

export const metadata: Metadata = {
  title: "图片来源与授权",
  description: "首页雪景照片的作者署名、来源和 Creative Commons 授权信息。",
};

const PHOTO_CREDITS = HERO_IMAGE_POOL.filter(
  (image): image is (typeof HERO_IMAGE_POOL)[number] & { sourcePage: string; licenseUrl: string } =>
    Boolean(image.sourcePage && image.licenseUrl),
);

export default function ImageCreditsPage() {
  return (
    <main className="mx-auto min-h-[60vh] max-w-[1000px] px-5 py-12 sm:px-8 sm:py-16">
      <p className="mono-label text-primary">REFERENCE / IMAGE CREDITS</p>
      <h1 className="serif-display mt-3 text-4xl sm:text-5xl">图片来源与授权</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
        首页随机展示的雪景照片来源、作者与授权如下。照片在页面中经过裁切；点击来源页可查看原图及完整授权说明。
      </p>

      <ul className="mt-10 divide-y divide-border border-y border-border">
        {PHOTO_CREDITS.map((image) => (
          <li key={image.sourcePage} className="grid gap-3 py-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <h2 className="text-base font-medium">{image.alt}</h2>
              <p className="mono-label mt-2 text-muted-foreground">作者：{image.credit}</p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a
                className="story-link text-foreground/80 hover:text-foreground"
                href={image.sourcePage}
                target="_blank"
                rel="noreferrer"
              >
                来源与原图 ↗
              </a>
              <a
                className="story-link text-foreground/80 hover:text-foreground"
                href={image.licenseUrl}
                target="_blank"
                rel="noreferrer"
              >
                查看授权 ↗
              </a>
            </div>
          </li>
        ))}
      </ul>

      <Link className="story-link mt-8 inline-flex text-sm text-foreground/80 hover:text-foreground" href="/">
        ← 返回首页
      </Link>
    </main>
  );
}
