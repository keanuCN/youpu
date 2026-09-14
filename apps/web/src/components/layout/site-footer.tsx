import Link from "next/link";
import { CATEGORY_TREE, SEASON } from "@/data/categories";
import { BRAND } from "@/lib/brand";
import type { CategoryNode } from "@/types";

/** 品类入口由配置驱动：开档的进档案库，筹备中的进占位页 —— 新增品类不改页脚代码 */
const LEAF_CATEGORIES: CategoryNode[] = CATEGORY_TREE.flatMap((root) => root.children ?? []).flatMap(
  (mid) => mid.children ?? [],
);
const LIVE_CATEGORIES = LEAF_CATEGORIES.filter((c) => c.status === "live");

const TOOLS: { label: string; href: string }[] = [
  { label: "参数对比", href: "/compare" },
  { label: "选装备问卷", href: "/quiz" },
  { label: "本季榜单", href: "/rankings" },
  { label: "我的收藏", href: "/me" },
  { label: "登录 / 注册", href: "/auth" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-foreground bg-secondary/40 pb-28 lg:pb-10">
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
        <div className="grid gap-8 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <p className="serif-display text-2xl">{BRAND.name}</p>
            <p className="mono-label mt-1">
              {BRAND.nameEn} · {BRAND.tagline}
            </p>
            <p className="mt-4 max-w-sm text-[12px] leading-relaxed text-muted-foreground">
              从单板到跑鞋、镜头、键盘，品类在扩，方法不变：
              每个品类定义自己的参数体系与评分维度，每条评价都标注真实使用条件——装备好不好，取决于谁来用。
            </p>
          </div>
          <nav>
            <p className="mono-label mb-3">档案库</p>
            <ul className="space-y-2">
              {LIVE_CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/browse/${c.slug}`} className="story-link text-[13px] text-foreground/80 hover:text-foreground">
                    {c.name}
                  </Link>
                </li>
              ))}
              {LEAF_CATEGORIES.filter((c) => c.status !== "live").map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/soon/${c.slug}`}
                    className="story-link text-[13px] text-muted-foreground/70 hover:text-foreground"
                  >
                    {c.name}
                    <span className="mono-label ml-1.5">筹备中</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav>
            <p className="mono-label mb-3">工具</p>
            <ul className="space-y-2">
              {TOOLS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="story-link text-[13px] text-foreground/80 hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <p className="mono-label">{SEASON} SEASON · ISSUE No.42</p>
          <a
            href={BRAND.icpUrl}
            target="_blank"
            rel="noreferrer"
            className="mono-label transition-colors hover:text-foreground"
          >
            {BRAND.icp}
          </a>
        </div>
      </div>
    </footer>
  );
}
