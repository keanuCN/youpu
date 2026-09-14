"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { PageHead } from "@/components/layout/section-head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORY_TREE, SNOWBOARD, getCategory } from "@/data/categories";
import { cn } from "@/lib/utils";
import type { CategoryNode } from "@/types";

export default function SoonClient({ slug }: { slug: string }) {
  const category = getCategory(slug);
  const [email, setEmail] = useState("");
  const leaves = CATEGORY_TREE.flatMap((r) => r.children ?? []).flatMap((c) => c.children ?? []);

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12 sm:px-8">
      <PageHead
        kicker="COMING SOON"
        title={`${category?.name ?? slug} 品类筹备中`}
        titleEn={category?.nameEn}
        desc="有谱的所有品类共用同一套模板引擎：参数分组、评分维度、筛选维度、榜单口径与问卷都由配置驱动。这个品类的配置写好后，页面会自动长出来，不需要改一行代码。"
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="mono-label mb-3">上线前需要准备 / CHECKLIST</p>
          <ul className="space-y-2.5 border-t border-foreground pt-4">
            {[
              ["参数模板", `定义 ${category?.name ?? "该品类"} 的规格分组与字段，标注每项的优劣方向与差异阈值`],
              ["评分维度", "确定 5–6 个可实测的维度与权重，产出 0–100 综合指数"],
              ["筛选维度", "场景、关键规格区间、价格带、品牌与年份"],
              ["内容库", "至少 12 件主流型号的完整参数与编辑结论"],
              ["榜单口径", "数据分与社区票的权重，以及分榜的场景切分"],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4 border-b border-border pb-2.5">
                <span className="mono-data shrink-0 text-[12px] text-primary tnum">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block text-[14px] font-medium">{t}</span>
                  <span className="mt-1 block text-[12.5px] leading-relaxed text-muted-foreground">{d}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <p className="mono-label mb-3">全部品类 / ALL CATEGORIES</p>
            <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
              {leaves.map((n: CategoryNode) => {
                const live = n.status === "live";
                return (
                  <Link
                    key={n.slug}
                    href={live ? `/browse/${n.slug}` : `/soon/${n.slug}`}
                    className={cn(
                      "flex items-center justify-between gap-3 bg-background px-4 py-3 transition-colors",
                      live ? "hover:bg-foreground hover:text-background" : "opacity-60 hover:opacity-100",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="mono-label block truncate">{n.path.join(" / ")}</span>
                      <span className="block truncate text-[14px] font-medium">{n.name}</span>
                    </span>
                    <span className={cn("mono-label shrink-0", live && "text-primary")}>{live ? "LIVE" : "SOON"}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="border border-foreground p-5">
            <p className="mono-label mb-2 text-primary">NOTIFY ME</p>
            <p className="text-[14px] leading-relaxed">留下邮箱，{category?.name ?? "该品类"} 开档时通知你。</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                  toast.error("邮箱格式不正确");
                  return;
                }
                toast.success("已记下，感谢关注");
                setEmail("");
              }}
              className="mt-4 space-y-2"
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-9 rounded-none border-border text-[13px]"
              />
              <Button type="submit" className="mono-label h-9 w-full rounded-none bg-foreground text-[12px] hover:bg-primary">
                订阅开档通知
              </Button>
            </form>
          </div>

          <div className="border border-border p-5">
            <p className="mono-label mb-3">已开档品类</p>
            <p className="text-[15px] font-medium">{SNOWBOARD.name}</p>
            <p className="mono-label mt-1">{SNOWBOARD.issue}</p>
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
              {SNOWBOARD.specTemplate.reduce((s, g) => s + g.fields.length, 0)} 项参数 ·{" "}
              {SNOWBOARD.scoreDims.length} 维评分 · {SNOWBOARD.rankCategories.length} 个分榜
            </p>
            <Link href="/browse/snowboard" className="mono-label mt-4 inline-block bg-foreground px-4 py-2.5 text-background hover:bg-primary">
              进入单板档案库
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
