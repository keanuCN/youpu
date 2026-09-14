"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChevronRight, Heart, Scale, Share2 } from "lucide-react";
import { toast } from "sonner";
import { AnalysisBlock, WhoForTags } from "@/components/gear/analysis-block";
import { Gallery } from "@/components/gear/gallery";
import { GearCard } from "@/components/gear/gear-card";
import { FlexBar, ScoreMark, SceneTags, Stars } from "@/components/gear/primitives";
import { RADAR_COLORS, RadarChart } from "@/components/gear/radar";
import { ReviewPanel } from "@/components/gear/review-panel";
import { SpecTable } from "@/components/gear/spec-table";
import { SectionHead } from "@/components/layout/section-head";
import { reviewCount, userRating } from "@/data/boards";
import { getCategory } from "@/data/categories";
import { gearById, pricePosition, sameScenePeers } from "@/lib/domain";
import { fmtCompact, fmtPrice } from "@/lib/format";
import { DOCK_MAX, addToDock, removeFromDock, toggleFavorite, useCurrentUser } from "@/lib/store";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";
import { useAuthGate } from "@/store/app-shell";

export default function GearDetailPage({ id }: { id: string }) {
  const gear = gearById(id);

  useEffect(() => {
    if (gear) track("detail_view", { product_id: gear.id, from: "detail" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!gear) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="mono-label text-primary">NOT FOUND</p>
        <h1 className="mt-4 text-[30px] font-medium">档案不存在</h1>
        <Link href="/browse/snowboard" className="mono-label mt-6 inline-block bg-foreground px-5 py-3 text-background hover:bg-primary">
          返回单板档案库
        </Link>
      </div>
    );
  }

  const category = getCategory(gear.categorySlug);
  const dims = category?.scoreDims ?? [];
  const groups = category?.specTemplate ?? [];
  const peers = sameScenePeers(gear, 4);

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 sm:py-10">
      <nav className="mono-label mb-6 flex flex-wrap items-center gap-1.5">
        <Link href="/" className="hover:text-primary">
          首页
        </Link>
        <ChevronRight size={11} strokeWidth={1.6} />
        <Link href={`/browse/${gear.categorySlug}`} className="hover:text-primary">
          {category?.name ?? gear.categorySlug}
        </Link>
        <ChevronRight size={11} strokeWidth={1.6} />
        <span className="text-foreground">
          {gear.brand} {gear.model}
        </span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <Gallery shots={gear.gallery} alt={`${gear.brand} ${gear.model}`} />
        <InfoCard gearId={gear.id} />
      </div>

      <section className="reveal mt-16">
        <SectionHead index="01" title="客观分析" titleEn="Objective Analysis" desc="结论、强项、短板，以及它明确不适合谁。" />
        <AnalysisBlock gear={gear} />
      </section>

      <section className="reveal mt-16 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <SectionHead index="02" title="完整参数" titleEn="Specifications" desc={`按 ${category?.name ?? ""} 品类的统一模板录入，缺测项显示 —。`} />
          <SpecTable gear={gear} groups={groups} />
        </div>
        <div>
          <SectionHead index="03" title="六维评分" titleEn="Score Radar" />
          <div className="border border-border p-4">
            <RadarChart
              dims={dims}
              series={[{ label: `${gear.brand} ${gear.model}`, values: dims.map((d) => gear.scores[d.key] ?? 0), color: RADAR_COLORS[0]! }]}
              size={300}
              showLegend={false}
            />
            <ul className="mt-4 space-y-1.5 border-t border-border pt-4">
              {dims.map((d) => (
                <li key={d.key} className="flex items-center gap-3">
                  <span className="mono-label w-16 shrink-0">{d.label}</span>
                  <span className="h-[5px] flex-1 bg-border">
                    <span
                      className="animate-bar-grow block h-full bg-foreground"
                      style={{ width: `${(gear.scores[d.key] ?? 0) * 10}%` }}
                    />
                  </span>
                  <span className="mono-data w-8 shrink-0 text-right text-[12px] tnum">{(gear.scores[d.key] ?? 0).toFixed(1)}</span>
                </li>
              ))}
            </ul>
            <p className="mono-label mt-4 border-t border-border pt-3">
              权重合计 {dims.reduce((s, d) => s + d.weight, 0).toFixed(2)} · 综合指数 {gear.composite}
            </p>
          </div>
        </div>
      </section>

      <section className="reveal mt-16">
        <SectionHead index="04" title="实测评论" titleEn="Field Reports" desc="发布评论必须标注雪龄、体重与常滑场地。" />
        <ReviewPanel gear={gear} />
      </section>

      {peers.length ? (
        <section className="reveal mt-16">
          <SectionHead
            index="05"
            title="同场景对照"
            titleEn="Same Scene"
            desc={`和它抢同一批用户的 ${peers.length} 件装备，点进去加入对比坞即可横向拉表。`}
          />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {peers.map((p) => (
              <GearCard key={p.id} gear={p} from="recommend" />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function InfoCard({ gearId }: { gearId: string }) {
  const { requireAuth } = useAuthGate();
  const router = useRouter();
  const me = useCurrentUser();
  const gear = gearById(gearId)!;
  const fav = me.isFavorite(gear.id);
  const inDock = me.dockIds.includes(gear.id);
  const pos = pricePosition(gear);

  const onDock = () => {
    if (inDock) {
      removeFromDock(gear.id);
      toast("已移出对比坞");
      return;
    }
    const res = addToDock(gear.id, gear.categorySlug);
    if (res.ok) {
      track("compare_add", { product_ids: [gear.id], source: "compare" });
      toast.success(`已加入对比坞 · ${Math.min(DOCK_MAX, me.dockIds.length + 1)}/${DOCK_MAX}`);
      return;
    }
    if (res.reason === "full") toast.error(`对比坞最多 ${DOCK_MAX} 件`);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-foreground pb-4">
        <div>
          <p className="mono-label">
            {gear.brand} · {gear.year} 款
          </p>
          <h1 className="mt-2 text-[32px] leading-[1.12] font-medium tracking-tight sm:text-[40px]">{gear.model}</h1>
        </div>
        <ScoreMark value={gear.composite} size="lg" />
      </div>

      <div className="grid grid-cols-2 gap-x-6 border-b border-border py-5 sm:grid-cols-4">
        <Stat label="用户评分" value={userRating(gear).toFixed(1)} sub={<Stars value={userRating(gear)} size={11} className="mt-1" />} />
        <Stat label="实测条数" value={String(reviewCount(gear))} sub={<span className="mono-label mt-1 block">FIELD REPORTS</span>} />
        <Stat label="进阶指数" value={String(gear.hardcore)} sub={<span className="mono-label mt-1 block">越高越吃技术</span>} />
        <Stat label="浏览热度" value={fmtCompact(gear.heat)} sub={<span className="mono-label mt-1 block">近 90 天</span>} />
      </div>

      <div className="border-b border-border py-5">
        <div className="flex items-baseline justify-between">
          <p className="mono-label">官方参考价</p>
          <p className="mono-data text-[24px] leading-none tnum">{fmtPrice(gear.price)}</p>
        </div>
        <div className="relative mt-4 h-[6px] bg-border">
          <span className="absolute inset-y-0 left-0 bg-foreground/25" style={{ width: `${pos}%` }} />
          <span className="absolute top-1/2 h-4 w-[3px] -translate-y-1/2 bg-primary" style={{ left: `calc(${pos}% - 1.5px)` }} />
        </div>
        <div className="mono-data mt-2 flex justify-between text-[12px] text-muted-foreground tnum">
          <span>{fmtPrice(gear.priceBand.min)}</span>
          <span className="text-foreground">
            同类区间 {fmtPrice(gear.priceBand.min)}–{fmtPrice(gear.priceBand.max)}
          </span>
          <span>{fmtPrice(gear.priceBand.max)}</span>
        </div>
      </div>

      <div className="grid gap-5 border-b border-border py-5 sm:grid-cols-2">
        <div>
          <p className="mono-label mb-2.5">硬度 / FLEX</p>
          <FlexBar value={gear.flexValue} />
          <p className="mono-label mt-2 text-foreground/70">{gear.flexLabel}</p>
        </div>
        <div>
          <p className="mono-label mb-2.5">适用场景 / SCENES</p>
          <SceneTags scenes={gear.scenes} />
        </div>
      </div>

      <div className="border-b border-border py-5">
        <p className="mono-label mb-3">适合谁 / WHO IT&apos;S FOR</p>
        <WhoForTags tags={gear.whoFor} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={onDock}
          className={cn(
            "mono-label flex flex-1 items-center justify-center gap-2 px-5 py-3.5 transition-colors",
            inDock ? "bg-foreground text-background" : "bg-primary text-primary-foreground hover:bg-foreground",
          )}
        >
          <Scale size={15} strokeWidth={1.6} />
          {inDock ? "已在对比坞" : "加入对比"}
        </button>
        <button
          type="button"
          onClick={() =>
            requireAuth(() => {
              const added = toggleFavorite(gear.id);
              if (added) track("favorite_add", { product_id: gear.id });
              toast.success(added ? "已加入收藏" : "已取消收藏");
            }, "收藏需要先登录")
          }
          className={cn(
            "mono-label flex items-center justify-center gap-2 border px-5 py-3.5 transition-colors",
            fav ? "border-primary text-primary" : "border-foreground hover:bg-foreground hover:text-background",
          )}
        >
          <Heart size={15} strokeWidth={1.6} className={fav ? "fill-current" : undefined} />
          {fav ? "已收藏" : "收藏"}
        </button>
        {me.dockIds.length >= 2 ? (
          <button
            type="button"
            onClick={() => {
              track("compare_open", { product_ids: me.dockIds, source: "recommend" });
              router.push("/compare");
            }}
            className="mono-label flex items-center justify-center gap-2 border border-border px-5 py-3.5 transition-colors hover:border-foreground"
          >
            去对比 {me.dockIds.length} 件
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard?.writeText(window.location.href);
            toast.success("链接已复制");
          }}
          aria-label="分享链接"
          className="mono-label flex items-center justify-center border border-border px-4 py-3.5 transition-colors hover:border-foreground"
        >
          <Share2 size={15} strokeWidth={1.6} />
        </button>
      </div>

      <p className="mono-label mt-4">
        {me.sessionKey ? "已登录，你的操作会记入个人中心" : "游客模式 · 登录后操作会记入个人中心"}
      </p>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: React.ReactNode }) {
  return (
    <div>
      <p className="mono-label">{label}</p>
      <p className="mono-data mt-1.5 text-[22px] leading-none tnum">{value}</p>
      {sub}
    </div>
  );
}
