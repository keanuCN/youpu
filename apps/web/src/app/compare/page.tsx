"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Crown, Plus, Scale, X } from "lucide-react";
import { GearCard } from "@/components/gear/gear-card";
import { ScoreMark } from "@/components/gear/primitives";
import { RADAR_COLORS, RadarChart } from "@/components/gear/radar";
import { PageHead, SectionHead } from "@/components/layout/section-head";
import { GEAR, getGear } from "@/data/boards";
import { getCategory } from "@/data/categories";
import { buildCompareMatrix, compareConclusion } from "@/lib/domain";
import { clearDock, recordCompare, removeFromDock, setDock, useCurrentUser } from "@/lib/store";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

export default function ComparePage() {
  const me = useCurrentUser();
  const ids = me.dockIds;
  const items = useMemo(() => ids.map((id) => getGear(id)).filter((g): g is NonNullable<typeof g> => !!g), [ids]);
  const [onlyDiff, setOnlyDiff] = useState(false);
  const [picker, setPicker] = useState(false);

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

  useEffect(() => {
    if (items.length >= 2) {
      track("compare_open", { product_ids: items.map((i) => i.id), source: "compare" });
      if (me.sessionKey) recordCompare(items[0]!.categorySlug, items.map((i) => i.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|"), me.sessionKey]);

  if (items.length < 2) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
        <PageHead kicker="COMPARE" title="参数对比" titleEn="Side by Side" desc="把 2–4 件装备拉进同一张表，差异项自动高亮，数值项自动标出胜出方。" />
        <div className="mt-10 border border-dashed border-border py-16 text-center">
          <Scale size={30} strokeWidth={1.2} className="mx-auto text-muted-foreground" />
          <p className="mt-4 text-[16px] font-medium">对比坞里只有 {items.length} 件</p>
          <p className="mono-label mt-2">至少需要 2 件才能开始对比 · 最多 4 件</p>
          <Link href="/browse/snowboard" className="mono-label mt-6 inline-block bg-foreground px-5 py-3 text-background hover:bg-primary">
            去档案库挑板
          </Link>
        </div>
        <section className="mt-14">
          <SectionHead title="热门候选" titleEn="Popular" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {GEAR.slice(0, 4).map((g) => (
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

      {picker ? (
        <div className="mt-6 border border-foreground p-4">
          <p className="mono-label mb-3">选择要替换 / 追加的装备（点已选中的可移出）</p>
          <div className="thin-scroll flex gap-2 overflow-x-auto pb-2">
            {GEAR.map((g) => {
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
                  <img src={g.hero} alt="" className="h-10 w-10 shrink-0 object-cover" loading="lazy" />
                  <span className="min-w-0">
                    <span className="mono-label block truncate">{g.brand}</span>
                    <span className="mono-data block truncate text-[11px]">{g.model}</span>
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
          <RadarChart
            dims={dims}
            series={items.map((g, i) => ({
              label: g.model,
              values: dims.map((d) => g.scores[d.key] ?? 0),
              color: RADAR_COLORS[i % RADAR_COLORS.length]!,
            }))}
            size={340}
          />
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
                <ScoreMark value={g.composite} size="sm" />
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
                    <img src={g.hero} alt="" className="mt-2.5 h-16 w-full object-cover grayscale" loading="lazy" />
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
                            {v === null || v === undefined || v === "" ? <span className="opacity-40">—</span> : String(v)}
                            {r.unit && v !== null && v !== undefined && v !== "" ? (
                              <span className={cn("text-[10px]", win ? "opacity-70" : "text-muted-foreground")}>{r.unit}</span>
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
