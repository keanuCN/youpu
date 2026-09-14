import type { Metadata } from "next";
import { RevealEngine } from "@/components/reveal-engine";
import { AppShell } from "@/store/app-shell";
import { BRAND } from "@/lib/brand";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} ${BRAND.nameEn.toUpperCase()} · ${BRAND.archive}`,
    template: `%s | ${BRAND.name}`,
  },
  description: `${BRAND.tagline} —— 装备参数图鉴 + 客观分析 + 社区实测评价。`,
  openGraph: { type: "website", siteName: BRAND.name, locale: "zh_CN" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="light">
      <body>
        {/* 字体走 Google Fonts CDN；不可达时按 styles.css 的本地字族回退 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=JetBrains+Mono:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
        <RevealEngine />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
