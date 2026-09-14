"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { GearCard } from "@/components/gear/gear-card";
import { PageHead } from "@/components/layout/section-head";
import { Chip } from "@/components/gear/primitives";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { gearOfCategory } from "@/data/boards";
import { getCategory, isLive } from "@/data/categories";
import {
  DEFAULT_FILTERS,
  PRICE_BOUNDS,
  SORT_LABELS,
  activeFilterCount,
  applyFilters,
  sortGear,
  type Filters,
} from "@/lib/domain";
import { fmtPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SortKey } from "@/types";

const SORTS: SortKey[] = ["heat", "new", "score", "hardcore"];

export function BrowseClient({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") ?? "";
  const sortParam = searchParams.get("sort");
  const category = getCategory(slug);
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS, q });
  const [sort, setSort] = useState<SortKey>(SORTS.includes(sortParam as SortKey) ? (sortParam as SortKey) : "heat");

  const pool = useMemo(() => gearOfCategory(slug), [slug]);
  const result = useMemo(() => sortGear(applyFilters(pool, filters), sort), [pool, filters, sort]);
  const active = activeFilterCount(filters);

  if (!category || !isLive(slug)) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
        <p className="mono-label text-primary">CATEGORY NOT LIVE</p>
        <h1 className="mt-4 text-[32px] font-medium">{category?.name ?? slug} 尚在筹备</h1>
        <p className="mt-3 max-w-lg text-[13.5px] leading-relaxed text-muted-foreground">
          该品类的参数模板、评分维度与筛选维度还没配置完成。回到已开档的单板档案库继续浏览。
        </p>
        <Link
          href="/browse/snowboard"
          className="mono-label mt-6 inline-block bg-foreground px-5 py-3 text-background hover:bg-primary"
        >
          前往单板档案库
        </Link>
      </div>
    );
  }

  const patch = (p: Partial<Filters>) => setFilters((f) => ({ ...f, ...p }));
  const toggleIn = (key: "scenes" | "profileFamily" | "flex" | "brands" | "years", value: string) =>
    setFilters((f) => {
      const list = f[key];
      return { ...f, [key]: list.includes(value) ? list.filter((x) => x !== value) : [...list, value] };
    });

  const changeSort = (s: SortKey) => {
    setSort(s);
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    params.set("sort", s);
    router.replace(`/browse/${slug}?${params.toString()}`);
  };

  const filterDefs = category.filterTemplate;
  const cardFrom = filters.q ? "search" : "list";

  const FilterBody = (
    <div className="space-y-7">
      <div className="flex items-center justify-between border-b border-foreground pb-2.5">
        <p className="mono-label text-foreground">筛选 / FILTER</p>
        {active > 0 ? (
          <button
            type="button"
            onClick={() => setFilters({ ...DEFAULT_FILTERS, q: filters.q })}
            className="mono-label flex items-center gap-1 text-primary hover:underline"
          >
            <X size={11} strokeWidth={2} /> 清空 {active}
          </button>
        ) : null}
      </div>

      {filterDefs.map((def) => {
        if (def.control === "price") {
          return (
            <div key={def.key}>
              <p className="mono-label mb-3">{def.label}</p>
              <Slider
                min={PRICE_BOUNDS[0]}
                max={PRICE_BOUNDS[1]}
                step={def.step ?? 100}
                value={filters.price}
                onValueChange={(v) => patch({ price: [v[0] ?? PRICE_BOUNDS[0], v[1] ?? PRICE_BOUNDS[1]] as [number, number] })}
                className="[&_[data-slot=range]]:bg-foreground [&_[data-slot=thumb]]:h-4 [&_[data-slot=thumb]]:w-2 [&_[data-slot=thumb]]:rounded-none [&_[data-slot=thumb]]:border-foreground [&_[data-slot=thumb]]:bg-background [&_[data-slot=track]]:h-[3px]"
              />
              <p className="mono-data mt-3 flex justify-between text-[12px] tnum">
                <span>{fmtPrice(filters.price[0])}</span>
                <span>{fmtPrice(filters.price[1])}</span>
              </p>
            </div>
          );
        }
        const key = def.key as "scenes" | "profileFamily" | "flex" | "brands" | "years";
        return (
          <div key={def.key}>
            <p className="mono-label mb-3">
              {def.label}
              {filters[key].length ? <span className="ml-1.5 text-primary">· {filters[key].length}</span> : null}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {def.options?.map((o) => (
                <Chip key={o.value} active={filters[key].includes(o.value)} onClick={() => toggleIn(key, o.value)}>
                  {o.label}
                </Chip>
              ))}
            </div>
          </div>
        );
      })}

      <div className="border-t border-border pt-5">
        <p className="mono-label mb-2">匹配结果</p>
        <p className="mono-data text-[26px] leading-none tnum">
          {result.length}
          <span className="ml-1 text-[12px] text-muted-foreground">/ {pool.length} 件</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 sm:py-12">
      <nav className="mono-label mb-5 flex items-center gap-1.5">
        <Link href="/" className="hover:text-primary">
          首页
        </Link>
        <ChevronRight size={11} strokeWidth={1.6} />
        {category.path.map((p) => (
          <span key={p} className="flex items-center gap-1.5">
            {p}
            <ChevronRight size={11} strokeWidth={1.6} />
          </span>
        ))}
        <span className="text-foreground">{category.name}</span>
      </nav>

      <PageHead
        kicker={category.issue}
        title={`${category.name}档案库`}
        titleEn={category.nameEn}
        desc="按场景、硬度、价格与品牌筛选，四种排序对应四种决策方式：看热度、看新款、看评分、看它有多吃技术。"
        aside={
          <div className="text-right">
            <p className="mono-data text-[38px] leading-none tnum">{pool.length}</p>
            <p className="mono-label mt-1.5">件在档装备</p>
          </div>
        }
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[228px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-32">{FilterBody}</div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <div className="flex flex-wrap items-center gap-1">
              <span className="mono-label mr-2">排序</span>
              {SORTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => changeSort(s)}
                  className={cn(
                    "mono-label border px-2.5 py-1 transition-colors",
                    sort === s ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground",
                  )}
                >
                  {SORT_LABELS[s]}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="mono-data text-[12px] text-muted-foreground tnum">{result.length} 件</span>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 gap-1.5 rounded-none text-[12px] lg:hidden">
                    <SlidersHorizontal size={13} strokeWidth={1.6} />
                    筛选{active ? ` · ${active}` : ""}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[86vw] max-w-xs overflow-y-auto p-5">
                  <SheetTitle className="sr-only">筛选</SheetTitle>
                  {FilterBody}
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {filters.q ? (
            <div className="mb-4 flex items-center gap-2 border border-border bg-accent/50 px-3 py-2">
              <span className="mono-label">搜索</span>
              <span className="mono-data flex-1 text-[12.5px]">“{filters.q}”</span>
              <button
                type="button"
                onClick={() => patch({ q: "" })}
                aria-label="清除搜索"
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={13} strokeWidth={1.8} />
              </button>
            </div>
          ) : null}

          {result.length ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {result.map((g, i) => (
                <GearCard
                  key={g.id}
                  gear={g}
                  className="reveal reveal-up"
                  from={cardFrom}
                  position={i}
                  sort={sort}
                />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border py-24 text-center">
              <p className="text-[15px] font-medium">没有符合条件的装备</p>
              <p className="mono-label mt-2">试着放宽价格区间或减少筛选项</p>
              <Button
                variant="outline"
                onClick={() => setFilters({ ...DEFAULT_FILTERS })}
                className="mono-label mt-5 h-8 rounded-none px-4 text-[12px]"
              >
                重置全部筛选
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
