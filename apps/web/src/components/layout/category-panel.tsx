"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORY_TREE } from "@/data/categories";
import { cn } from "@/lib/utils";
import type { CategoryNode } from "@/types";

/**
 * 顶栏「全部品类」面板：左侧一级域（滑雪 / 骑行 / 影像 / 垂钓 …），
 * 悬停或点击切换右侧叶子列表 —— 品类数量增长时始终保持一屏可读。
 * 结构完全由 CATEGORY_TREE 驱动，新增品类不改本文件。
 */
export function CategoryPanel({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  const roots = CATEGORY_TREE;
  const domains: CategoryNode[] = roots.flatMap((root) => root.children ?? []);
  const firstLive = domains.find((d) => d.children?.some((c) => c.status === "live"));
  const [activeSlug, setActiveSlug] = useState(firstLive?.slug ?? domains[0]?.slug ?? "");
  const active = domains.find((d) => d.slug === activeSlug) ?? domains[0];

  if (!active) return null;

  return (
    <div className={cn("p-5", className)}>
      {roots.map((root) => (
        <div key={root.slug}>
          <p className="mono-label mb-3 border-b border-foreground pb-2">
            {root.name} <span className="text-muted-foreground/60">/ {root.nameEn.toUpperCase()}</span>
          </p>
          <div className="grid gap-5 sm:grid-cols-[132px_1fr]">
            {/* 一级域：悬停 / 点击切换 */}
            <ul className="flex flex-wrap gap-1 sm:flex-col sm:gap-0">
              {root.children?.map((domain) => {
                const isActive = domain.slug === active.slug;
                return (
                  <li key={domain.slug} className="sm:w-full">
                    <button
                      type="button"
                      onMouseEnter={() => setActiveSlug(domain.slug)}
                      onFocus={() => setActiveSlug(domain.slug)}
                      onClick={() => setActiveSlug(domain.slug)}
                      aria-pressed={isActive}
                      className={cn(
                        "mono-label w-full border px-2 py-[6px] text-left transition-colors sm:border-0 sm:border-l-2 sm:px-3",
                        isActive
                          ? "border-foreground bg-foreground text-background sm:border-l-primary sm:bg-accent sm:text-foreground"
                          : "border-border text-muted-foreground hover:border-foreground hover:text-foreground sm:hover:border-l-border",
                      )}
                    >
                      {domain.name}
                      <span className="ml-1.5 hidden opacity-60 sm:inline">{domain.children?.length ?? 0}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* 当前域的叶子 */}
            <div>
              <p className="mono-label mb-2 text-foreground/70">
                {active.name} <span className="opacity-60">/ {active.nameEn}</span>
              </p>
              <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {active.children?.map((leaf) =>
                  leaf.status === "live" ? (
                    <li key={leaf.slug}>
                      <Link
                        href={`/browse/${leaf.slug}`}
                        onClick={onNavigate}
                        className="story-link text-[13px] text-foreground hover:text-primary"
                      >
                        {leaf.name}
                        <span className="mono-label ml-1.5">{leaf.nameEn}</span>
                      </Link>
                    </li>
                  ) : (
                    <li key={leaf.slug}>
                      <Link
                        href={`/soon/${leaf.slug}`}
                        onClick={onNavigate}
                        className="group flex items-baseline gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
                      >
                        {leaf.name}
                        <span className="mono-label">筹备中</span>
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
