"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Heart, Scale } from "lucide-react";
import { toast } from "sonner";
import { MediaPlaceholder, PendingValue } from "@/components/gear/data-state";
import { reviewCount, userRating } from "@/data/boards";
import { getCategory } from "@/data/categories";
import { sceneLabel } from "@/lib/domain";
import { fmtCompact, fmtPrice } from "@/lib/format";
import { hasEditorialScores, hasMedia, hasPrice, hasUserRating, mediaUrl } from "@/lib/gear-state";
import { cloudAddFavorite, cloudRemoveFavorite, hasCloudSession, productRefForGear } from "@/lib/api";
import { DOCK_MAX, addToDock, removeFromDock, toggleFavorite, useCurrentUser } from "@/lib/store";
import { track, trackExposeOnce } from "@/lib/track";
import { cn } from "@/lib/utils";
import type { GearItem } from "@/types";
import { useAuthGate } from "@/store/app-shell";
import { FlexBar, ScoreMark, Stars } from "./primitives";

type FromSource = "home" | "list" | "search" | "ranking" | "compare" | "recommend";

function CardSignal({ gear }: { gear: GearItem }) {
  if (gear.categorySlug === "snowboard") {
    return <FlexBar value={gear.flexValue} />;
  }

  const signals =
    gear.categorySlug === "badminton-racket"
      ? [
          ["重量", gear.specs.weightClass],
          ["平衡", gear.specs.balance],
        ]
      : [
          ["调性", gear.specs.power],
          ["饵重", gear.specs.lureWeight],
        ];

  return (
    <div className="grid grid-cols-2 gap-2 border-y border-border py-2">
      {signals.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <p className="mono-label">{label}</p>
          <p className="mt-1 truncate text-[12px] text-foreground/80">{value || "待补充"}</p>
        </div>
      ))}
    </div>
  );
}

/** 装备卡：列表页 4 列网格 / 首页新品区共用 */
export function GearCard({
  gear,
  rank,
  className,
  from = "list",
  position,
  sort,
}: {
  gear: GearItem;
  rank?: number;
  className?: string;
  from?: FromSource;
  position?: number;
  sort?: string;
}) {
  const { requireAuth } = useAuthGate();
  const me = useCurrentUser();
  const fav = me.isFavorite(gear.id);
  const inDock = me.dockIds.includes(gear.id);
  const priceReady = hasPrice(gear);
  const editorialReady = hasEditorialScores(gear);
  const mediaReady = hasMedia(gear);
  const mediaSrc = mediaUrl(gear);
  const ratingReady = hasUserRating(gear);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            trackExposeOnce(gear.id, { category: gear.categorySlug, position, sort });
            observer.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [gear.id, gear.categorySlug, position, sort]);

  const onFav = () => {
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
      toast.success(added ? `已收藏 ${gear.model}` : `已取消收藏`);
    }, "收藏装备需要先登录");
  };

  const onDock = () => {
    if (inDock) {
      removeFromDock(gear.id);
      toast(`已移出对比坞`);
      return;
    }
    const res = addToDock(gear.id, gear.categorySlug);
    if (res.ok) {
      track("compare_add", { product_ids: [gear.id], source: from });
      toast.success(`已加入对比坞 · ${Math.min(DOCK_MAX, me.dockIds.length + 1)}/${DOCK_MAX}`);
      return;
    }
    if (res.reason === "full") toast.error(`对比坞最多 ${DOCK_MAX} 件，先移除一件再加入`);
    if (res.reason === "cross") toast.error("对比坞只能比较同一品类，请先移出其他品类的装备");
  };

  return (
    <article
      ref={ref}
      className={cn(
        "group relative flex flex-col border border-border bg-card transition-colors duration-300 hover:border-foreground",
        className,
      )}
    >
      <Link
        href={`/gear/${gear.id}`}
        className="flex flex-1 flex-col max-lg:pb-10"
        onClick={() => track("card_click", { product_id: gear.id, from })}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
          {mediaReady && mediaSrc ? (
            <img
              src={mediaSrc}
              alt={`${gear.brand} ${gear.model}`}
              loading="lazy"
              className={cn(
                "plate h-full w-full",
                gear.categorySlug === "snowboard" ? "object-cover" : "object-contain p-4",
              )}
            />
          ) : (
            <MediaPlaceholder label={`${gear.brand} ${gear.model}`} />
          )}
          <div className="absolute top-0 left-0">
            {rank ? (
              <span className="mono-data bg-foreground px-2 py-1 text-[13px] text-background tnum">
                {String(rank).padStart(2, "0")}
              </span>
            ) : gear.isNew ? (
              <span className="mono-label bg-primary px-2 py-[6px] text-primary-foreground">New</span>
            ) : null}
          </div>
          <div className="absolute top-0 right-0">
            {editorialReady ? <ScoreMark value={gear.composite} size="sm" /> : <PendingValue label="待补分" className="bg-background/90 px-1.5 py-1" />}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-foreground/85 px-2.5 py-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="mono-label text-background/70">{gear.year} 款</span>
            <span className="mono-data text-[12px] text-background tnum">{fmtCompact(gear.heat)} 次浏览</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2.5 p-3.5">
          <div>
            <p className="mono-label">{gear.brand}</p>
            <h3 className="mt-1 text-[15px] leading-snug font-medium tracking-tight">{gear.model}</h3>
          </div>

          <div className="flex flex-wrap gap-1">
            {from === "search" ? (
              <span className="mono-label border border-primary/40 px-1.5 py-[2px] text-primary">
                {getCategory(gear.categorySlug)?.name ?? gear.categorySlug}
              </span>
            ) : null}
            {gear.scenes.slice(0, 2).map((s) => (
              <span key={s} className="mono-label border border-border px-1.5 py-[2px]">
                {sceneLabel(s)}
              </span>
            ))}
          </div>

          <CardSignal gear={gear} />

          <div className="mt-auto flex items-end justify-between gap-2 border-t border-border pt-2.5">
            <div className="min-w-0">
              <p className="mono-data text-[15px] leading-none tnum">
                {priceReady ? fmtPrice(gear.price) : <PendingValue label="价格待补" />}
              </p>
              <p className="mono-label mt-1.5">{priceReady ? "参考价" : "价格尚未采集"}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {ratingReady ? (
                <>
                  <Stars value={userRating(gear)} size={11} />
                  <span className="mono-data text-[11px] text-muted-foreground tnum">
                    {userRating(gear).toFixed(1)} · {reviewCount(gear)} 条实测
                  </span>
                </>
              ) : (
                <PendingValue label="暂无实测" />
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="absolute inset-x-0 bottom-0 flex opacity-0 transition-opacity duration-300 max-lg:opacity-100 lg:pointer-events-none lg:group-hover:pointer-events-auto lg:group-hover:opacity-100">
        <button
          type="button"
          onClick={onFav}
          aria-label={fav ? "取消收藏" : "收藏"}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 border-t border-r border-foreground/15 py-2 text-[12px] transition-colors",
            fav ? "bg-primary text-primary-foreground" : "bg-background/95 hover:bg-accent",
          )}
        >
          <Heart size={13} strokeWidth={1.6} className={fav ? "fill-current" : undefined} />
          {fav ? "已收藏" : "收藏"}
        </button>
        <button
          type="button"
          onClick={onDock}
          aria-label={inDock ? "移出对比" : "加入对比"}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 border-t border-foreground/15 py-2 text-[12px] transition-colors",
            inDock ? "bg-foreground text-background" : "bg-background/95 hover:bg-accent",
          )}
        >
          <Scale size={13} strokeWidth={1.6} />
          {inDock ? "已加入" : "对比"}
        </button>
      </div>
    </article>
  );
}

/** 横向条目：榜单 / 搜索结果 / 收藏列表 */
export function GearRow({
  gear,
  rank,
  note,
  from = "ranking",
}: {
  gear: GearItem;
  rank?: number;
  note?: string;
  from?: FromSource;
}) {
  return (
    <Link
      href={`/gear/${gear.id}`}
      onClick={() => track("card_click", { product_id: gear.id, from })}
      className="group flex items-center gap-4 border-b border-border py-3.5 transition-colors hover:bg-accent/50"
    >
      {rank ? (
        <span
          className={cn(
            "mono-data w-8 shrink-0 text-center text-[20px] leading-none tnum",
            rank <= 3 ? "text-primary" : "text-muted-foreground/50",
          )}
        >
          {String(rank).padStart(2, "0")}
        </span>
      ) : null}
      <div className="h-14 w-14 shrink-0 overflow-hidden bg-secondary">
        {hasMedia(gear) && mediaUrl(gear) ? (
          <img src={mediaUrl(gear)} alt={`${gear.brand} ${gear.model}`} loading="lazy" className="plate h-full w-full object-cover" />
        ) : (
          <MediaPlaceholder label={`${gear.brand} ${gear.model}`} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="mono-label truncate">{gear.brand}</p>
        <p className="truncate text-[14px] font-medium">{gear.model}</p>
        <p className="mono-label mt-1 truncate">
          {note ?? `${gear.year} · ${hasPrice(gear) ? fmtPrice(gear.price) : "价格待补"} · ${gear.scenes.length ? gear.scenes.map(sceneLabel).join(" / ") : "场景待补"}`}
        </p>
      </div>
      <div className="shrink-0 text-right">
        {hasEditorialScores(gear) ? <ScoreMark value={gear.composite} size="sm" /> : <PendingValue label="待补分" />}
        <p className="mono-label mt-1.5 hidden sm:block">{fmtCompact(gear.heat)} 热度</p>
      </div>
    </Link>
  );
}
