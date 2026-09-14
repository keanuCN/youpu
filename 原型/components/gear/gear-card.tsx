import { Link } from "@tanstack/react-router";
import { Heart, Scale } from "lucide-react";
import { toast } from "sonner";
import { reviewCount, userRating } from "@/data/boards";
import { sceneLabel } from "@/lib/domain";
import { fmtCompact, fmtPrice } from "@/lib/format";
import {
  DOCK_MAX,
  addToDock,
  getState,
  isFavorite,
  removeFromDock,
  toggleFavorite,
  usePersisted,
  GUEST,
} from "@/lib/store";
import { cn } from "@/lib/utils";
import type { GearItem } from "@/types";
import { useAuthGate } from "@/store/app-shell";
import { FlexBar, ScoreMark, Stars } from "./primitives";

/** 装备卡：列表页 4 列网格 / 首页新品区共用 */
export function GearCard({ gear, rank, className }: { gear: GearItem; rank?: number; className?: string }) {
  const { requireAuth } = useAuthGate();
  const persisted = usePersisted();
  const dock = persisted.dock[persisted.sessionKey ?? GUEST] ?? [];
  const fav = isFavorite(gear.id);
  const inDock = dock.includes(gear.id);

  const onFav = () => {
    requireAuth(() => {
      const added = toggleFavorite(gear.id);
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
      toast.success(`已加入对比坞 · ${getState().dock[getState().sessionKey ?? GUEST]?.length ?? 1}/${DOCK_MAX}`);
      return;
    }
    if (res.reason === "full") toast.error(`对比坞最多 ${DOCK_MAX} 件，先移除一件再加入`);
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col border border-border bg-card transition-colors duration-300 hover:border-foreground",
        className,
      )}
    >
      <Link to="/gear/$id" params={{ id: gear.id }} className="flex flex-1 flex-col">
        <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
          <img src={gear.hero} alt={`${gear.brand} ${gear.model}`} loading="lazy" className="plate h-full w-full object-cover" />
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
            <ScoreMark value={gear.composite} size="sm" />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-foreground/85 px-2.5 py-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="mono-label text-background/70">{gear.year} 款</span>
            <span className="mono-data text-[11px] text-background tnum">{fmtCompact(gear.heat)} 次浏览</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2.5 p-3.5">
          <div>
            <p className="mono-label">{gear.brand}</p>
            <h3 className="mt-1 text-[15px] leading-snug font-medium tracking-tight">{gear.model}</h3>
          </div>

          <div className="flex flex-wrap gap-1">
            {gear.scenes.slice(0, 2).map((s) => (
              <span key={s} className="mono-label border border-border px-1.5 py-[2px]">
                {sceneLabel(s)}
              </span>
            ))}
          </div>

          <FlexBar value={gear.flexValue} />

          <div className="mt-auto flex items-end justify-between gap-2 border-t border-border pt-2.5">
            <div className="min-w-0">
              <p className="mono-data text-[15px] leading-none tnum">{fmtPrice(gear.price)}</p>
              <p className="mono-label mt-1.5">官方参考价</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Stars value={userRating(gear)} size={11} />
              <span className="mono-data text-[10px] text-muted-foreground tnum">
                {userRating(gear).toFixed(1)} · {reviewCount(gear)} 条实测
              </span>
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
            "flex flex-1 items-center justify-center gap-1.5 border-t border-r border-foreground/15 py-2 text-[11px] transition-colors",
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
            "flex flex-1 items-center justify-center gap-1.5 border-t border-foreground/15 py-2 text-[11px] transition-colors",
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
export function GearRow({ gear, rank, note }: { gear: GearItem; rank?: number; note?: string }) {
  return (
    <Link
      to="/gear/$id"
      params={{ id: gear.id }}
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
        <img src={gear.hero} alt="" loading="lazy" className="plate h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mono-label truncate">{gear.brand}</p>
        <p className="truncate text-[14px] font-medium">{gear.model}</p>
        <p className="mono-label mt-1 truncate">
          {note ?? `${gear.year} · ${fmtPrice(gear.price)} · ${gear.scenes.map(sceneLabel).join(" / ")}`}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <ScoreMark value={gear.composite} size="sm" />
        <p className="mono-label mt-1.5 hidden sm:block">{fmtCompact(gear.heat)} 热度</p>
      </div>
    </Link>
  );
}
