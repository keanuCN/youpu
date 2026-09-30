"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FallbackNotice, MediaPlaceholder, PendingValue, RankingsSkeleton } from "@/components/gear/data-state";
import { GearRow } from "@/components/gear/gear-card";
import { ScoreMark } from "@/components/gear/primitives";
import { SafeImage } from "@/components/gear/safe-image";
import { PageHead } from "@/components/layout/section-head";
import { Button } from "@/components/ui/button";
import { GEAR } from "@/data/boards";
import { CATEGORIES, SEASON, SNOWBOARD, getCategory } from "@/data/categories";
import { getCategoryProducts, resolveContentSource } from "@/lib/content";
import { preferProductThumbnail } from "@/lib/image-url";
import { hasEditorialScores, hasMedia, mediaUrl } from "@/lib/gear-state";
import { rankRows } from "@/lib/domain";
import { fmtCompact } from "@/lib/format";
import { useCurrentUser, usePersisted, vote } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useAuthGate } from "@/store/app-shell";
import type { GearItem } from "@/types";

const LIVE_CATEGORIES = Object.values(CATEGORIES).filter((category) => category.status === "live");

export default function RankingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const persisted = usePersisted();
  const me = useCurrentUser();
  const { requireAuth } = useAuthGate();
  const requestedCategory = searchParams.get("category");
  const categorySlug = getCategory(requestedCategory ?? "")?.status === "live" ? requestedCategory! : "snowboard";
  const category = getCategory(categorySlug) ?? SNOWBOARD;
  const [rankKey, setRankKey] = useState(category.rankCategories[0]?.key ?? "overall");
  const [catalog, setCatalog] = useState<GearItem[]>(() => GEAR.filter((item) => item.categorySlug === categorySlug));
  const [catalogLoading, setCatalogLoading] = useState(resolveContentSource() === "api");
  const [catalogFallback, setCatalogFallback] = useState(false);
  const [catalogRetry, setCatalogRetry] = useState(0);

  useEffect(() => {
    setRankKey(category.rankCategories[0]?.key ?? "overall");
  }, [categorySlug, category.rankCategories]);

  useEffect(() => {
    let active = true;
    const localCatalog = GEAR.filter((item) => item.categorySlug === categorySlug);
    setCatalog(localCatalog);
    setCatalogFallback(false);
    if (resolveContentSource() === "pack") {
      setCatalogLoading(false);
      return () => {
        active = false;
      };
    }

    setCatalogLoading(true);
    void getCategoryProducts(categorySlug, {
      source: "api",
      onFallback: () => {
        if (active) setCatalogFallback(true);
      },
    }).then((next) => {
      if (!active) return;
      setCatalog(next);
      setCatalogLoading(false);
    });
    return () => {
      active = false;
    };
  }, [catalogRetry, categorySlug]);

  const rows = useMemo(
    () => rankRows(persisted, rankKey, categorySlug, catalog),
    [catalog, categorySlug, persisted, rankKey],
  );
  const mine = me.votes.find(
    (v) => v.categorySlug === categorySlug && v.rankKey === rankKey && v.season === SEASON,
  );
  const podium = rows.slice(0, 3);
  const rest = rows.slice(3);
  const maxFinal = rows[0]?.final ?? 1;

  const onVote = (gearId: string) => {
    requireAuth(() => {
      const res = vote(categorySlug, rankKey, SEASON, gearId);
      if (res.ok) toast.success(mine ? "已改投（改投机会仅一次）" : "投票成功，榜单已实时更新");
      else toast.error(res.message);
    }, "投票需要先登录");
  };

  const selectCategory = (slug: string) => {
    router.replace(slug === "snowboard" ? "/rankings" : `/rankings?category=${encodeURIComponent(slug)}`);
  };

  const rankLabel = category.rankCategories.find((item) => item.key === rankKey)?.label ?? "综合榜";
  const isSnowboard = categorySlug === "snowboard";
  const isBoot = categorySlug === "snowboard-boot";

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
      <PageHead
        kicker={`${SEASON} ${category.nameEn.toUpperCase()} RANKINGS`}
        title={`${category.name}榜单`}
        titleEn="Rankings"
        desc={
          isSnowboard
            ? "榜单参考分与热度由公开规格推算；真实社区票单独统计。最终分 = 数据分 × 70% + 社区票 × 30%。"
            : isBoot
              ? "单板雪鞋榜单参考分与热度由公开规格推算；真实社区票单独统计。最终分 = 数据分 × 70% + 社区票 × 30%。"
            : `最终分 = 数据分 × 70% + 社区票 × 30%。${category.name}数据分由编辑评分、热度与用户评分加权得出。`
        }
        aside={
          <div className="text-right">
            <p className="mono-data text-[38px] leading-none tnum">{rows.length}</p>
            <p className="mono-label mt-1.5">件参与本榜</p>
          </div>
        }
      />

      <div className="thin-scroll mt-8 flex items-center gap-1.5 overflow-x-auto border-b border-border pb-3">
        <span className="mono-label mr-1 shrink-0 text-muted-foreground">品类</span>
        {LIVE_CATEGORIES.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => selectCategory(item.slug)}
            className={cn(
              "mono-label shrink-0 border px-3.5 py-2 transition-colors",
              categorySlug === item.slug ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground",
            )}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="thin-scroll flex gap-1.5 overflow-x-auto border-b border-foreground pb-3 pt-3">
        {category.rankCategories.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setRankKey(c.key)}
            className={cn(
              "mono-label shrink-0 border px-3.5 py-2 transition-colors",
              rankKey === c.key ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {catalogFallback ? <FallbackNotice onRetry={() => setCatalogRetry((value) => value + 1)} className="mt-6" /> : null}

      {catalogLoading ? (
        <RankingsSkeleton />
      ) : !rows.length ? (
        <div className="mt-10 border border-dashed border-border py-20 text-center">
          <p className="text-[15px] font-medium">{category.name}榜单数据待补充</p>
          <p className="mono-label mt-2">当前品类还没有足够的装备数据进入榜单。</p>
          <Link href={`/browse/${categorySlug}`} className="mono-label mt-6 inline-block bg-foreground px-5 py-3 text-background hover:bg-primary">
            去看{category.name}档案
          </Link>
        </div>
      ) : (
        <>
      {/* 领奖台 */}
      <section className="mt-10 grid gap-px border border-border bg-border md:grid-cols-3">
        {podium.map((r, i) => (
          <article
            key={r.gear.id}
            className={cn(
              "group relative flex flex-col bg-background p-5",
              i === 0 && "md:order-2 md:bg-secondary/40",
              i === 1 && "md:order-1",
              i === 2 && "md:order-3",
            )}
          >
            <div className="flex items-start justify-between">
              <span className={cn("mono-data text-[46px] leading-none tnum", i === 0 ? "text-primary" : "text-muted-foreground/40")}>
                {String(r.rank).padStart(2, "0")}
              </span>
              {hasEditorialScores(r.gear) ? <ScoreMark value={r.gear.composite} size="sm" /> : <PendingValue label="待补分" />}
            </div>
            <Link href={`/gear/${r.gear.id}`} className="mt-4 block">
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                {hasMedia(r.gear) && mediaUrl(r.gear) ? (
                  <SafeImage
                    src={preferProductThumbnail(mediaUrl(r.gear)!, 800)}
                    alt={`${r.gear.brand} ${r.gear.model}`}
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : undefined}
                    fallbackLabel={`${r.gear.brand} ${r.gear.model}`}
                    fallbackClassName="p-8"
                    className={cn(
                      "plate h-full w-full",
                      r.gear.categorySlug === "snowboard" ? "object-cover" : "object-contain p-6",
                    )}
                  />
                ) : (
                  <MediaPlaceholder label="图片待补" className="h-full min-h-0 p-8" />
                )}
              </div>
              <p className="mono-label mt-3">{r.gear.brand}</p>
              <h3 className="mt-1 text-[17px] leading-snug font-medium">{r.gear.model}</h3>
            </Link>

            <dl className="mono-data mt-4 space-y-1 border-t border-border pt-3 text-[12px] tnum">
              <div className="flex justify-between">
                <dt className="mono-label">数据分</dt>
                <dd>{hasEditorialScores(r.gear) ? r.dataScore.toFixed(1) : "待补"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="mono-label">社区票</dt>
                <dd>{fmtCompact(r.votes)}</dd>
              </div>
              <div className="flex justify-between text-foreground">
                <dt className="mono-label text-foreground">最终分</dt>
                <dd className="font-medium">{r.final.toFixed(1)}</dd>
              </div>
            </dl>

            <div className="mt-3 h-[4px] bg-border">
              <span className="animate-bar-grow block h-full bg-primary" style={{ width: `${(r.final / maxFinal) * 100}%` }} />
            </div>

            <Button
              type="button"
              size="sm"
              variant={mine?.gearId === r.gear.id ? "default" : "outline"}
              onClick={() => onVote(r.gear.id)}
              className={cn(
                "mono-label mt-4 h-8 w-full rounded-none text-[12px]",
                mine?.gearId === r.gear.id ? "bg-primary hover:bg-primary/90" : "border-border",
              )}
            >
              {mine?.gearId === r.gear.id ? "已投它" : mine ? "改投它" : "投它一票"}
            </Button>
          </article>
        ))}
      </section>

      {/* 完整名次 */}
      <section className="mt-12">
        <div className="rule-heavy mb-2 flex flex-wrap items-center justify-between gap-3 pb-2.5">
          <p className="mono-label text-foreground">完整名次 · {rows.length} 件</p>
          <p className="mono-label">
            {mine
              ? `你投了 ${rows.find((r) => r.gear.id === mine.gearId)?.gear.model ?? "已下架装备"}${mine.changed ? " · 改投机会已用完" : " · 还可改投一次"}`
              : `你还没在「${rankLabel}」投票`}
          </p>
        </div>
        <div>
          {rest.map((r) => (
            <div key={r.gear.id} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <GearRow
                  gear={r.gear}
                  rank={r.rank}
                  thumbnailMaxWidth={168}
                  note={`数据 ${hasEditorialScores(r.gear) ? r.dataScore.toFixed(1) : "待补"} · 社区 ${fmtCompact(r.votes)} 票 · 最终 ${r.final.toFixed(1)}`}
                />
              </div>
              <button
                type="button"
                onClick={() => onVote(r.gear.id)}
                className={cn(
                  "mono-label mb-3 hidden shrink-0 border px-3 py-1.5 transition-colors sm:block",
                  mine?.gearId === r.gear.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-foreground",
                )}
              >
                {mine?.gearId === r.gear.id ? "已投" : "投票"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 border border-border p-6">
        <p className="mono-label mb-3">计票口径 / METHODOLOGY</p>
        <ul className="grid gap-3 text-[13px] leading-relaxed text-muted-foreground sm:grid-cols-2">
          {isSnowboard ? (
            <li>· 数据分 = 综合指数 55% + 热度 20% + 进阶取向 15% + 用户评分 10%（新手榜把进阶取向反向计分）</li>
          ) : isBoot ? (
            <li>· 单板雪鞋维度分数与热度为规格推算参考值；贴合、支撑、保暖、便利和性价比需结合实穿复核。</li>
          ) : (
            <li>· 数据分 = 编辑评分 65% + 热度 15% + 用户评分 20%，缺少真实数据的项目保持待补状态</li>
          )}
          <li>· 社区票按本榜最高票数归一化后占最终分 30%</li>
          <li>· 性价比榜只在价格最低的 10 件里排名，避免高价板靠品牌溢价占位</li>
          <li>· 每人每榜每季一票，允许改投一次，改投后锁定</li>
        </ul>
        <p className="mono-label mt-4 border-t border-border pt-3">
          每人每榜每季一票，改投一次后锁定。
        </p>
      </section>
        </>
      )}
    </div>
  );
}
