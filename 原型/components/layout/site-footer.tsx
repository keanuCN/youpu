import { Link } from "@tanstack/react-router";
import { SEASON } from "@/data/categories";

const COLS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "档案库",
    links: [
      { label: "单板雪板", to: "/browse/$slug" },
      { label: "本季榜单", to: "/rankings" },
      { label: "选板问卷", to: "/quiz" },
    ],
  },
  {
    title: "工具",
    links: [
      { label: "参数对比", to: "/compare" },
      { label: "我的收藏", to: "/me" },
      { label: "登录 / 注册", to: "/auth" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-foreground bg-secondary/40 pb-28 lg:pb-10">
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
        <div className="grid gap-8 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <p className="serif-display text-2xl">板鉴</p>
            <p className="mono-label mt-1">Boardlab · Gear Archive</p>
            <p className="mt-4 max-w-sm text-[12px] leading-relaxed text-muted-foreground">
              一个把装备参数、实测评分和真实使用条件放在同一张表上的档案库。
              我们不写「手感很棒」，我们写「74kg / 8 年 / 万龙冰面」。
            </p>
          </div>
          {COLS.map((c) => (
            <nav key={c.title}>
              <p className="mono-label mb-3">{c.title}</p>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to as never}
                      params={(l.to.includes("$slug") ? { slug: "snowboard" } : undefined) as never}
                      className="story-link text-[13px] text-foreground/80 hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <p className="mono-label">{SEASON} SEASON · ISSUE No.42</p>
          <p className="mono-label">原型演示 · 数据与账号均保存在本机浏览器</p>
        </div>
      </div>
    </footer>
  );
}
