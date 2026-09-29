"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, Heart, Scale, Share2 } from "lucide-react";
import { toast } from "sonner";
import { AnalysisBlock, WhoForTags } from "@/components/gear/analysis-block";
import { PendingBlock, PendingValue } from "@/components/gear/data-state";
import { FitGuideTable } from "@/components/gear/fit-guide";
import { Gallery } from "@/components/gear/gallery";
import { GearCard } from "@/components/gear/gear-card";
import { FlexBar, ScoreMark, SceneTags, Stars } from "@/components/gear/primitives";
import { RADAR_COLORS, RadarChart } from "@/components/gear/radar";
import { ReviewPanel } from "@/components/gear/review-panel";
import { SpecTable } from "@/components/gear/spec-table";
import { SizeSpecTable } from "@/components/gear/size-spec-table";
import { SectionHead } from "@/components/layout/section-head";
import { reviewCount, userRating } from "@/data/boards";
import { getCategory, mtbTypeLabel, roadBikeTypeLabel } from "@/data/categories";
import { cloudAddFavorite, cloudRemoveFavorite, hasCloudSession, productRefForGear, type CloudRatingsResponse } from "@/lib/api";
import { formatSpecValue, gearById, pricePosition, sameScenePeers } from "@/lib/domain";
import { fmtCompact, fmtPrice } from "@/lib/format";
import { hasEditorialScores, hasHardcoreIndex, hasPrice, hasUserRating } from "@/lib/gear-state";
import { DOCK_MAX, addToDock, removeFromDock, toggleFavorite, useCurrentUser } from "@/lib/store";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";
import { useAuthGate } from "@/store/app-shell";
import type { GearItem, SpecField } from "@/types";

export default function GearDetailPage({
  id,
  initialGear,
  relatedGear,
}: {
  id: string;
  initialGear?: GearItem;
  relatedGear?: GearItem[];
}) {
  const gear = initialGear ?? gearById(id);
  const [ratingSummary, setRatingSummary] = useState<CloudRatingsResponse["summary"] | null>(null);

  useEffect(() => {
    setRatingSummary(null);
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
  const peers = relatedGear
    ? relatedGear
        .filter((item) => item.id !== gear.id && item.scenes.some((scene) => gear.scenes.includes(scene)))
        .sort((a, b) => b.composite - a.composite)
        .slice(0, 4)
    : sameScenePeers(gear, 4);

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
        <Gallery
          shots={gear.gallery}
          alt={`${gear.brand} ${gear.model}`}
          fit={gear.categorySlug === "snowboard" ? "cover" : "contain"}
        />
         <InfoCard gear={gear} ratingSummary={ratingSummary} />
      </div>

      <section className="reveal mt-16">
        <SectionHead index="01" title="客观分析" titleEn="Objective Analysis" desc="结论、强项、短板，以及它明确不适合谁。" />
        <AnalysisBlock gear={gear} />
      </section>

      <section className="reveal mt-16 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <SectionHead index="02" title="完整参数" titleEn="Specifications" desc={`按 ${category?.name ?? ""} 品类的统一模板录入，缺测项显示 —。`} />
          <FitGuideTable guide={gear.fitGuide} />
          <SizeSpecTable gear={gear} />
          <SpecTable gear={gear} groups={groups} />
        </div>
        <div>
          <SectionHead index="03" title={`${dims.length || 0}维评分`} titleEn="Score Radar" />
          {hasEditorialScores(gear) ? (
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
          ) : (
            <PendingBlock
              title="编辑评分待补充"
              detail="当前产品已经有官方规格，但还没有进入有谱的六维编辑评分体系。"
              className="min-h-[300px]"
            />
          )}
        </div>
      </section>

      <section className="reveal mt-16">
        <SectionHead index="04" title="实测评论" titleEn="Field Reports" desc="发布评论需要标注与品类相关的使用条件。" />
        <ReviewPanel gear={gear} onSummaryChange={setRatingSummary} />
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

function InfoCard({ gear, ratingSummary }: { gear: GearItem; ratingSummary: CloudRatingsResponse["summary"] | null }) {
  const { requireAuth } = useAuthGate();
  const router = useRouter();
  const me = useCurrentUser();
  const fav = me.isFavorite(gear.id);
  const inDock = me.dockIds.includes(gear.id);
  const pos = pricePosition(gear);
  const priceReady = hasPrice(gear);
  const editorialReady = hasEditorialScores(gear);
  const localSummary = {
    overall: hasUserRating(gear) ? userRating(gear) : null,
    count: reviewCount(gear),
  };
  const summary = ratingSummary && ratingSummary.count > 0 ? ratingSummary : localSummary;
  const ratingReady = summary.overall !== null && summary.count > 0;
  const hardcoreReady = gear.categorySlug === "snowboard" && hasHardcoreIndex(gear);
  const categorySignal = categorySignalFor(gear);

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
        {editorialReady ? <ScoreMark value={gear.composite} size="lg" /> : <PendingValue label="评分待补" className="border border-dashed border-border bg-secondary px-3 py-2" />}
      </div>

      <div className="grid grid-cols-2 gap-x-6 border-b border-border py-5 sm:grid-cols-4">
        <Stat
          label="用户评分"
          value={ratingReady ? summary.overall!.toFixed(1) : "—"}
          sub={ratingReady ? <Stars value={summary.overall!} size={11} className="mt-1" /> : <PendingValue label="暂无实测" className="mt-1 block" />}
        />
        <Stat label="实测条数" value={String(summary.count)} sub={<span className="mono-label mt-1 block">FIELD REPORTS</span>} />
        <Stat label={categorySignal.label} value={categorySignal.value} sub={<span className="mono-label mt-1 block">{categorySignal.sub}</span>} />
        <Stat
          label="浏览热度"
          value={gear.heat > 0 ? fmtCompact(gear.heat) : "—"}
          sub={<span className="mono-label mt-1 block">{gear.heat > 0 ? "近 90 天" : "数据待补"}</span>}
        />
      </div>

      <div className="border-b border-border py-5">
        <div className="flex items-baseline justify-between">
          <p className="mono-label">参考价</p>
          <p className="mono-data text-[24px] leading-none tnum">{priceReady ? fmtPrice(gear.price, gear.priceCurrency) : <PendingValue label="价格待补" />}</p>
        </div>
        {priceReady ? (
          <>
            <div className="relative mt-4 h-[6px] bg-border">
              <span className="absolute inset-y-0 left-0 bg-foreground/25" style={{ width: `${pos}%` }} />
              <span className="absolute top-1/2 h-4 w-[3px] -translate-y-1/2 bg-primary" style={{ left: `calc(${pos}% - 1.5px)` }} />
            </div>
            <div className="mono-data mt-2 flex justify-between text-[12px] text-muted-foreground tnum">
              <span>{fmtPrice(gear.priceBand.min, gear.priceCurrency)}</span>
              <span className="text-foreground">
                同类区间 {fmtPrice(gear.priceBand.min, gear.priceCurrency)}–{fmtPrice(gear.priceBand.max, gear.priceCurrency)}
              </span>
              <span>{fmtPrice(gear.priceBand.max, gear.priceCurrency)}</span>
            </div>
          </>
        ) : (
          <p className="mt-4 border border-dashed border-border bg-secondary/45 px-3 py-3 text-[13px] leading-relaxed text-muted-foreground">
            暂无可比价格，当前页面只展示已核验的官方规格。
          </p>
        )}
      </div>

      <DetailSignals gear={gear} />

      {gear.whoFor.length ? (
        <div className="border-b border-border py-5">
          <p className="mono-label mb-3">适合谁 / WHO IT&apos;S FOR</p>
          <WhoForTags tags={gear.whoFor} />
        </div>
      ) : null}

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
              if (hasCloudSession()) {
                const request = added ? cloudAddFavorite(productRefForGear(gear)) : cloudRemoveFavorite(productRefForGear(gear));
                void request.catch(() => {
                  toggleFavorite(gear.id);
                  toast.error("云端收藏同步失败，已恢复本地状态");
                });
              }
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

function categorySignalFor(gear: GearItem): { label: string; value: string; sub: string } {
  if (gear.categorySlug === "snowboard") {
    return {
      label: "进阶指数",
      value: hasHardcoreIndex(gear) ? String(gear.hardcore) : "—",
      sub: hasHardcoreIndex(gear) ? "越高越吃技术" : "参数待补全",
    };
  }

  if (gear.categorySlug === "badminton-racket") {
    return {
      label: "平衡点",
      value: formatSpecValue(gear.specs.balance),
      sub: "拍头 / 均衡 / 拍柄",
    };
  }

  if (gear.categorySlug === "action-cam") {
    return {
      label: "最高视频规格",
      value: formatSpecValue(gear.specs.maxVideo),
      sub: "官方规格",
    };
  }

  if (gear.categorySlug === "road-bike") {
    return {
      label: "车型取向",
      value: roadBikeTypeLabel(gear.specs.bikeType),
      sub: "官方车型定位",
    };
  }

  if (gear.categorySlug === "mtb") {
    return {
      label: "车型取向",
      value: mtbTypeLabel(gear.specs.bikeType),
      sub: "官方车型定位",
    };
  }

  const firstSpec = categorySpecEntries(gear)[0];
  if (!firstSpec) return { label: "类别特征", value: "—", sub: "关键参数待补充" };

  return {
    label: firstSpec.field.label,
    value: formatCategorySpecValue(gear.categorySlug, firstSpec.field, firstSpec.value),
    sub: firstSpec.group,
  };
}

function DetailSignals({ gear }: { gear: GearItem }) {
  if (gear.categorySlug === "snowboard") {
    return (
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
    );
  }

  const fields = categorySpecEntries(gear).slice(0, 4);

  return (
    <div className="border-b border-border py-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="mono-label mb-2.5">关键参数 / KEY SPECS</p>
          <dl className="grid grid-cols-2 gap-x-4 border-t border-border">
            {fields.length ? (
              fields.map(({ field, value }) => (
                <div key={field.key} className="min-w-0 border-b border-border py-2">
                  <dt className="mono-label">{field.label}</dt>
                  <dd className="mt-1 truncate text-[13px]">
                    {formatCategorySpecValue(gear.categorySlug, field, value)}
                    {field.unit ? <span className="ml-1 text-[11px] text-muted-foreground">{field.unit}</span> : null}
                  </dd>
                </div>
              ))
            ) : (
              <p className="col-span-2 border-t border-border py-3 text-[13px] text-muted-foreground">暂无已核验的关键参数</p>
            )}
          </dl>
        </div>
        <div>
          <p className="mono-label mb-2.5">适用场景 / SCENES</p>
          <SceneTags scenes={gear.scenes} />
        </div>
      </div>
    </div>
  );
}

function categorySpecEntries(gear: GearItem) {
  const category = getCategory(gear.categorySlug);
  return (category?.specTemplate ?? []).flatMap((group) =>
    group.fields.flatMap((field) => {
      const value = gear.specs[field.key];
      if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) return [];
      return [{ field, group: group.group, value }];
    }),
  );
}

function formatCategorySpecValue(categorySlug: string, field: SpecField, value: number | string): string {
  if (categorySlug === "esports-keyboard" && field.key === "keyboardType") {
    if (value === "mechanical") return "机械键盘";
    if (value === "magnetic") return "磁轴键盘";
  }
  return formatSpecValue(value);
}
