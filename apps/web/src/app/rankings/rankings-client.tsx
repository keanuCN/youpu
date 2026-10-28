"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { FallbackNotice, MediaPlaceholder, PendingValue, RankingsSkeleton } from "@/components/gear/data-state";
import { GearRow } from "@/components/gear/gear-card";
import { ScoreMark } from "@/components/gear/primitives";
import { SafeImage } from "@/components/gear/safe-image";
import { PageHead } from "@/components/layout/section-head";
import { Button } from "@/components/ui/button";
import { GEAR } from "@/data/boards";
import { PRODUCT_PERSONALITY_TAGS } from "@/data/product-personality-tags";
import { CATEGORIES, SEASON, SNOWBOARD, getCategory } from "@/data/categories";
import { getCategoryProducts, resolveContentSource } from "@/lib/content";
import { hasEditorialScores, hasMedia, mediaUrl } from "@/lib/gear-state";
import { rankRows } from "@/lib/domain";
import { cloudRankingVotes, cloudSubmitRankingVote, hasCloudSession, productRefForGear, type CloudRankingVotes } from "@/lib/api";
import { useCurrentUser, usePersisted } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { GearItem } from "@/types";
import { useAuthGate } from "@/store/app-shell";

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
  const [votes, setVotes] = useState<CloudRankingVotes | null>(null);
  const [voting, setVoting] = useState(false);
  const currentVoteKey = useRef("");
  currentVoteKey.current = `${categorySlug}:${rankKey}`;

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

  useEffect(() => {
    let active = true;
    setVotes(null);
    void cloudRankingVotes(categorySlug, rankKey, SEASON).then((result) => {
      if (active) setVotes(result);
    }).catch(() => { if (active) setVotes(null); });
    return () => { active = false; };
  }, [categorySlug, rankKey, me.profile?.userKey]);

  const rows = useMemo(
    () => rankRows(persisted, rankKey, categorySlug, catalog, votes ? { serverVotes: votes.counts } : { includeVotes: false }),
    [catalog, categorySlug, persisted, rankKey, votes],
  );
  const podium = rows.slice(0, 3);
  const rest = rows.slice(3);
  const maxFinal = Math.max(1, ...rows.map((row) => row.final));

  const onVote = (gear: GearItem) => requireAuth(() => {
    if (!votes || !hasCloudSession() || voting) return;
    setVoting(true);
    const requestedKey = `${categorySlug}:${rankKey}`;
    void cloudSubmitRankingVote(categorySlug, rankKey, SEASON, productRefForGear(gear)).then((result) => {
      if (currentVoteKey.current === requestedKey) setVotes(result);
      toast.success(result.mine?.changed ? "改投成功" : "投票成功");
    }).catch((error: unknown) => toast.error(error instanceof Error ? error.message : "投票失败"))
      .finally(() => setVoting(false));
  }, "投票需要先登录");

  const selectCategory = (slug: string) => {
    router.replace(slug === "snowboard" ? "/rankings" : `/rankings?category=${encodeURIComponent(slug)}`);
  };

  const isSnowboard = categorySlug === "snowboard";

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
      <PageHead
        kicker={`${SEASON} ${category.nameEn.toUpperCase()} RANKINGS`}
        title={`${category.name}榜单`}
        titleEn="Rankings"
        desc={
          isSnowboard
            ? "综合榜优先展示编辑推荐，其他榜单参考数据分及真实社区投票。"
            : `${category.name}榜单参考数据分及真实社区投票。`
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
                    src={mediaUrl(r.gear)}
                    alt={`${r.gear.brand} ${r.gear.model}`}
                    loading="lazy"
                    fallbackLabel={`${r.gear.brand} ${r.gear.model}`}
                    fallbackClassName="p-8"
                    className="h-full w-full object-contain p-3"
                  />
                ) : (
                  <MediaPlaceholder label="图片待补" className="h-full min-h-0 p-8" />
                )}
              </div>
              <p className="mono-label mt-3">{r.gear.brand}</p>
              <h3 className="mt-1 text-[17px] leading-snug font-medium">{r.gear.model}</h3>
              {PRODUCT_PERSONALITY_TAGS[r.gear.id] ? (
                <span title="有谱编辑个性标签" className="mt-2 inline-block border border-primary/40 bg-primary/5 px-2 py-1 text-xs font-medium text-primary">
                  {PRODUCT_PERSONALITY_TAGS[r.gear.id]}
                </span>
              ) : null}
            </Link>

            <dl className="mono-data mt-4 space-y-1 border-t border-border pt-3 text-[12px] tnum">
              <div className="flex justify-between">
                <dt className="mono-label">数据分</dt>
                <dd>{hasEditorialScores(r.gear) ? r.dataScore.toFixed(1) : "待补"}</dd>
              </div>
              <div className="flex justify-between"><dt className="mono-label">社区票</dt><dd>{votes ? r.votes : "暂不可用"}</dd></div>
              <div className="flex justify-between text-foreground">
                <dt className="mono-label text-foreground">参考分</dt>
                <dd className="font-medium">{r.final.toFixed(1)}</dd>
              </div>
            </dl>

            <div className="mt-3 h-[4px] bg-border">
              <span className="animate-bar-grow block h-full bg-primary" style={{ width: `${(r.final / maxFinal) * 100}%` }} />
            </div>
            <Button type="button" size="sm" variant="outline" disabled={!votes || voting} onClick={() => onVote(r.gear)} className="mono-label mt-4 h-8 w-full rounded-none text-[12px]">
              {votes?.mine?.slug === (r.gear.productSlug ?? r.gear.id) ? "已投票" : votes?.mine?.changed ? "改投机会已用完" : votes?.mine ? "改投" : "投票"}
            </Button>

          </article>
        ))}
      </section>

      {/* 完整名次 */}
      <section className="mt-12">
        <div className="rule-heavy mb-2 flex flex-wrap items-center justify-between gap-3 pb-2.5">
          <p className="mono-label text-foreground">完整名次 · {rows.length} 件</p>
          <p className="mono-label">{votes ? "每人每榜每季一票，可改投一次" : "投票服务暂不可用"}</p>
        </div>
        <div>
          {rest.map((r) => (
            <div key={r.gear.id} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <GearRow
                  gear={r.gear}
                  rank={r.rank}
                  note={`参考分 ${hasEditorialScores(r.gear) ? r.dataScore.toFixed(1) : "待补"} · 社区 ${votes ? r.votes : "—"} 票`}
                />
              </div>
              <button type="button" disabled={!votes || voting} onClick={() => onVote(r.gear)} className="mono-label mb-3 hidden shrink-0 border px-3 py-1.5 disabled:opacity-40 sm:block">
                {votes?.mine?.slug === (r.gear.productSlug ?? r.gear.id) ? "已投" : "投票"}
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
          ) : (
            <li>· 数据分 = 编辑评分 65% + 热度 15% + 用户评分 20%，缺少真实数据的项目保持待补状态</li>
          )}
          <li>· 单板综合榜优先展示编辑推荐，推荐顺序不由参考分决定</li>
          <li>· 热度目前来自内容快照，仅作参考，并非实时浏览量</li>
          <li>· 性价比榜只在价格最低的 10 件里排名，避免高价板靠品牌溢价占位</li>
          <li>· 社区票来自站内真实账号，按本榜最高票数归一化后占参考分 30%</li>
        </ul>
        <p className="mono-label mt-4 border-t border-border pt-3">
          每人每榜每季一票，可改投一次；综合榜的编辑推荐顺序优先。
        </p>
      </section>
        </>
      )}
    </div>
  );
}
