"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Crown, Plus, Scale, X } from "lucide-react";
import { GearCard } from "@/components/gear/gear-card";
import { CompareSkeleton, FallbackNotice, MediaPlaceholder, PendingBlock, PendingValue } from "@/components/gear/data-state";
import { ScoreMark } from "@/components/gear/primitives";
import { RADAR_COLORS, RadarChart } from "@/components/gear/radar";
import { SafeImage } from "@/components/gear/safe-image";
import { PageHead, SectionHead } from "@/components/layout/section-head";
import { GEAR, getGear } from "@/data/boards";
import { getCategory } from "@/data/categories";
import { buildCompareMatrix, compareConclusion, formatSpecValue } from "@/lib/domain";
import { getCategoryProducts, getCompareProducts, resolveContentSource } from "@/lib/content";
import { preferProductThumbnail } from "@/lib/image-url";
import { hasEditorialScores, hasMedia, mediaUrl } from "@/lib/gear-state";
import { clearDock, recordCompare, removeFromDock, setDock, useCurrentUser } from "@/lib/store";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";
import type { GearItem } from "@/types";

export default function ComparePage() {
  const me = useCurrentUser();
  const ids = me.dockIds;
  const idsKey = ids.join("|");
  const localItems = useMemo(() => ids.map((id) => getGear(id)).filter((g): g is NonNullable<typeof g> => !!g), [idsKey]);
  const [items, setItems] = useState<GearItem[]>(localItems);
  const [availableGear, setAvailableGear] = useState<GearItem[]>(GEAR);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareFallback, setCompareFallback] = useState(false);
  const [availableFallback, setAvailableFallback] = useState(false);
  const [contentRetry, setContentRetry] = useState(0);
  const [onlyDiff, setOnlyDiff] = useState(false);
  const [picker, setPicker] = useState(false);
  const apiMode = resolveContentSource() === "api";

  useEffect(() => {
    let active = true;
    setItems(localItems);
    setCompareFallback(false);
    if (!apiMode) {
      setCompareLoading(false);
      return () => {
        active = false;
      };
    }

    setCompareLoading(ids.length > 0);
    void getCompareProducts(ids, {
      source: "api",
      onFallback: () => {
        if (active) setCompareFallback(true);
      },
    }).then((next) => {
      if (!active) return;
      setItems(next);
      setCompareLoading(false);
    });
    return () => {
      active = false;
    };
  }, [apiMode, contentRetry, idsKey]);

  const categorySlug = items[0]?.categorySlug ?? "snowboard";
  const categorySlugs = [...new Set(items.map((item) => item.categorySlug))];
  const mixedCategories = categorySlugs.length > 1;
  useEffect(() => {
    let active = true;
    setAvailableFallback(false);
    if (!apiMode) {
      setAvailableGear(GEAR);
      return () => {
        active = false;
      };
    }

    void getCategoryProducts(categorySlug, {
      source: "api",
      onFallback: () => {
        if (active) setAvailableFallback(true);
      },
    }).then((next) => {
      if (active) setAvailableGear(next);
    });
    return () => {
      active = false;
    };
  }, [apiMode, categorySlug, contentRetry]);

  const category = getCategory(items[0]?.categorySlug ?? "snowboard");
  const dims = category?.scoreDims ?? [];
  const groups = category?.specTemplate ?? [];

  const matrix = useMemo(() => buildCompareMatrix(items, groups, dims), [items, groups, dims]);
  const rows = onlyDiff ? matrix.filter((r) => r.isDiff) : matrix;
  const grouped = useMemo(() => {
    const map = new Map<string, typeof rows>();
    for (const r of rows) {
      const list = map.get(r.group) ?? [];
      list.push(r);
      map.set(r.group, list);
    }
    return [...map.entries()];
  }, [rows]);
  const hasRadarData = items.some((item) => hasEditorialScores(item));

  useEffect(() => {
    if (items.length >= 2) {
      track("compare_open", { product_ids: items.map((i) => i.id), source: "compare" });
      if (me.sessionKey) recordCompare(items[0]!.categorySlug, items.map((i) => i.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|"), me.sessionKey]);

  if (compareLoading && items.length < 2) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
        <PageHead kicker="COMPARE" title="参数对比" titleEn="Side by Side" desc="正在读取对比数据……" />
        <CompareSkeleton />
      </div>
    );
  }

  if (mixedCategories) {
    const categoryNames = categorySlugs.map((slug) => getCategory(slug)?.name ?? slug);
    const sameCategoryCandidates = availableGear.filter(
      (gear) => gear.categorySlug === categorySlug && !ids.includes(gear.id),
    );

    return (
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
        <PageHead
          kicker="COMPARE / SAME CATEGORY ONLY"
          title="先统一品类"
          titleEn="Same Category"
          desc="不同品类的参数含义和评分维度不同，先移出其他品类，再开始有效对比。"
        />
        {compareFallback || availableFallback ? (
          <FallbackNotice onRetry={() => setContentRetry((value) => value + 1)} className="mt-6" />
        ) : null}
        <div className="mt-10 border border-dashed border-border py-14 text-center">
          <Scale size={30} strokeWidth={1.2} className="mx-auto text-muted-foreground" />
          <p className="mt-4 text-[16px] font-medium">当前包含 {categoryNames.join("、")}</p>
          <p className="mono-label mt-2">参数横表只支持同一品类，避免把不同装备的字段强行放在一起。</p>
        </div>

        <div className="mt-6 grid gap-px border border-border bg-border sm:grid-cols-2">
          {items.map((gear) => {
            const image = mediaUrl(gear);
            return (
              <div key={gear.id} className="flex items-center gap-3 bg-background p-4">
                {image ? (
                  <SafeImage
                    src={preferProductThumbnail(image, 192)}
                    alt=""
                    fallbackLabel={`${gear.brand} ${gear.model}`}
                    fallbackMode="muted"
                    className={cn(
                      "h-14 w-14 shrink-0 bg-secondary",
                      gear.categorySlug === "snowboard" ? "object-cover" : "object-contain p-1.5",
                    )}
                    loading="lazy"
                  />
                ) : (
                  <MediaPlaceholder label="图片待补" className="h-14 w-14 min-h-0 shrink-0 p-2" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="mono-label truncate">{getCategory(gear.categorySlug)?.name ?? gear.categorySlug}</p>
                  <Link href={`/gear/${gear.id}`} className="block truncate text-[14px] font-medium hover:text-primary">
                    {gear.brand} {gear.model}
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromDock(gear.id)}
                  className="mono-label shrink-0 border border-border px-2.5 py-1.5 transition-colors hover:border-destructive hover:text-destructive"
                >
                  移出
                </button>
              </div>
            );
          })}
        </div>

        {sameCategoryCandidates.length ? (
          <section className="mt-12">
            <SectionHead title={`继续比较${category?.name ?? "同品类装备"}`} titleEn="Keep Comparing" desc="下面只展示当前第一件装备所属品类。" />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {sameCategoryCandidates.slice(0, 4).map((gear) => (
                <GearCard key={gear.id} gear={gear} from="compare" />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    );
  }

  if (items.length < 2) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
        <PageHead kicker="COMPARE" title="参数对比" titleEn="Side by Side" desc="把 2–4 件装备拉进同一张表，差异项自动高亮，数值项自动标出胜出方。" />
        {compareFallback || availableFallback ? (
          <FallbackNotice onRetry={() => setContentRetry((value) => value + 1)} className="mt-6" />
        ) : null}
        <div className="mt-10 border border-dashed border-border py-16 text-center">
          <Scale size={30} strokeWidth={1.2} className="mx-auto text-muted-foreground" />
          <p className="mt-4 text-[16px] font-medium">对比坞里只有 {items.length} 件</p>
          <p className="mono-label mt-2">至少需要 2 件才能开始对比 · 最多 4 件</p>
          <Link href={`/browse/${categorySlug}`} className="mono-label mt-6 inline-block bg-foreground px-5 py-3 text-background hover:bg-primary">
            去档案库挑{category?.name ?? "装备"}
          </Link>
        </div>
        <section className="mt-14">
          <SectionHead title="热门候选" titleEn="Popular" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {availableGear.slice(0, 4).map((g) => (
              <GearCard key={g.id} gear={g} from="compare" />
            ))}
          </div>
        </section>
      </div>
    );
  }

  const conclusions = compareConclusion(items);

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
      <PageHead
        kicker="COMPARE"
        title="参数对比"
        titleEn="Side by Side"
        desc={`正在对比 ${items.length} 件${category?.name ?? ""}。差异项已按品类模板的阈值判定，数值项标出胜出方。`}
        aside={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOnlyDiff((v) => !v)}
              className={cn(
                "mono-label border px-3 py-2 transition-colors",
                onlyDiff ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground",
              )}
            >
              只看差异项
            </button>
            <button
              type="button"
              onClick={() => setPicker((v) => !v)}
              className="mono-label flex items-center gap-1.5 border border-border px-3 py-2 transition-colors hover:border-foreground"
            >
              <Plus size={13} strokeWidth={1.8} /> 换一件
            </button>
            <button
              type="button"
              onClick={clearDock}
              className="mono-label border border-border px-3 py-2 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
            >
              清空
            </button>
          </div>
        }
      />
      {compareFallback || availableFallback ? (
        <FallbackNotice onRetry={() => setContentRetry((value) => value + 1)} className="mt-6" />
      ) : null}

      {picker ? (
        <div className="mt-6 border border-foreground p-4">
          <p className="mono-label mb-3">选择要替换 / 追加的装备（点已选中的可移出）</p>
          <div className="thin-scroll flex gap-2 overflow-x-auto pb-2">
            {availableGear.map((g) => {
              const on = ids.includes(g.id);
              const full = !on && ids.length >= 4;
              return (
                <button
                  key={g.id}
                  type="button"
                  disabled={full}
                  onClick={() => (on ? removeFromDock(g.id) : setDock([...ids, g.id]))}
                  className={cn(
                    "flex w-40 shrink-0 items-center gap-2 border p-2 text-left transition-colors",
                    on ? "border-foreground bg-accent" : "border-border hover:border-foreground",
                    full && "cursor-not-allowed opacity-40",
                  )}
                >
                  {hasMedia(g) && mediaUrl(g) ? (
                    <SafeImage
                      src={preferProductThumbnail(mediaUrl(g)!, 480)}
                      alt=""
                      loading="lazy"
                      fallbackLabel={`${g.brand} ${g.model}`}
                      fallbackMode="muted"
                      className="h-10 w-10 shrink-0 object-cover"
                    />
                  ) : (
                    <MediaPlaceholder label="图片待补" className="h-10 w-10 min-h-0 shrink-0 p-1.5" />
                  )}
                  <span className="min-w-0">
                    <span className="mono-label block truncate">{g.brand}</span>
                    <span className="mono-data block truncate text-[12px]">{g.model}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* 叠放雷达 */}
      <section className="reveal mt-10 grid gap-8 lg:grid-cols-[420px_1fr]">
        <div className="border border-border p-5">
          <p className="mono-label mb-2">分项叠放 / OVERLAID RADAR</p>
          {hasRadarData ? (
            <RadarChart
              dims={dims}
              series={items.map((g, i) => ({
                label: g.model,
                values: dims.map((d) => g.scores[d.key] ?? 0),
                color: RADAR_COLORS[i % RADAR_COLORS.length]!,
              }))}
              size={340}
            />
          ) : (
            <PendingBlock title="评分数据待补充" detail="当前对比产品已有结构化参数，但还没有进入有谱的编辑评分体系。" className="min-h-[340px]" />
          )}
        </div>
        <div>
          <p className="mono-label mb-3">一句话结论 / TAKEAWAYS</p>
          <ul className="space-y-2.5">
            {conclusions.map((c) => (
              <li key={c} className="flex items-baseline gap-3 border-b border-border pb-2.5 text-[13.5px]">
                <Crown size={14} strokeWidth={1.5} className="mt-[2px] shrink-0 text-primary" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-px border border-border bg-border sm:grid-cols-2">
            {items.map((g, i) => (
              <div key={g.id} className="flex items-center gap-3 bg-background p-4">
                <span className="h-8 w-1 shrink-0" style={{ background: RADAR_COLORS[i % RADAR_COLORS.length] }} />
                <div className="min-w-0 flex-1">
                  <p className="mono-label truncate">{g.brand}</p>
                  <p className="truncate text-[14px] font-medium">{g.model}</p>
                </div>
                {hasEditorialScores(g) ? <ScoreMark value={g.composite} size="sm" /> : <PendingValue label="待补分" />}
                <Link href={`/gear/${g.id}`} className="mono-label shrink-0 hover:text-primary">
                  详情
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 参数横表 */}
      <section className="reveal mt-12">
        <SectionHead title="完整参数横表" titleEn="Full Matrix" desc="移动端可左右滑动；首列固定。" />
        <div className="thin-scroll overflow-x-auto border border-foreground">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 w-44 border-r border-b border-foreground bg-background p-3 align-bottom">
                  <span className="mono-label">参数 / 装备</span>
                </th>
                {items.map((g, i) => (
                  <th key={g.id} className="border-r border-b border-foreground bg-background p-3 align-bottom last:border-r-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="mb-1.5 block h-[3px] w-8" style={{ background: RADAR_COLORS[i % RADAR_COLORS.length] }} />
                        <span className="mono-label block truncate">{g.brand}</span>
                        <Link href={`/gear/${g.id}`} className="block truncate text-[13.5px] font-medium hover:text-primary">
                          {g.model}
                        </Link>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromDock(g.id)}
                        aria-label="移出对比"
                        className="shrink-0 p-1 text-muted-foreground hover:text-destructive"
                      >
                        <X size={13} strokeWidth={1.8} />
                      </button>
                    </div>
                    {hasMedia(g) && mediaUrl(g) ? (
                      <SafeImage
                        src={preferProductThumbnail(mediaUrl(g)!, 480)}
                        alt=""
                        loading="lazy"
                        fallbackLabel={`${g.brand} ${g.model}`}
                        fallbackMode="muted"
                        className="mt-2.5 h-16 w-full object-cover grayscale"
                      />
                    ) : (
                      <MediaPlaceholder label="图片待补" className="mt-2.5 h-16 w-full min-h-0 p-2" />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            {grouped.map(([groupName, groupRows]) => (
              <tbody key={groupName}>
                <tr>
                  <td colSpan={items.length + 1} className="border-b border-foreground bg-secondary/70 px-3 py-1.5">
                    <span className="mono-label text-foreground">{groupName}</span>
                  </td>
                </tr>
                {groupRows.map((r) => (
                  <tr key={`${r.group}-${r.key}`} className={cn(r.isDiff && "bg-primary/[0.045]")}>
                    <th scope="row" className="sticky left-0 z-10 border-r border-b border-border bg-background px-3 py-2 align-middle">
                      <span className="mono-label">{r.label}</span>
                      {r.isDiff ? <span className="mono-label ml-1.5 text-primary">差异</span> : null}
                    </th>
                    {r.values.map((v, i) => {
                      const win = r.winner === i;
                      return (
                        <td
                          key={i}
                          className={cn(
                            "border-r border-b border-border px-3 py-2 last:border-r-0",
                            win && "bg-foreground text-background",
                          )}
                        >
                          <span className="mono-data flex items-center gap-1.5 text-[13px] tnum">
                            {win ? <Crown size={12} strokeWidth={1.8} className="shrink-0" /> : null}
                            {v === null || v === undefined || v === "" ? <span className="opacity-40">—</span> : formatSpecValue(v)}
                            {r.unit && v !== null && v !== undefined && v !== "" ? (
                              <span className={cn("text-[11px]", win ? "opacity-70" : "text-muted-foreground")}>{r.unit}</span>
                            ) : null}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
        <p className="mono-label mt-3">
          高亮底色 = 该项存在有效差异 · 反白单元格 = 该行的胜出方（依据品类模板中定义的优劣方向）
        </p>
      </section>
    </div>
  );
}
