'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { FallbackNotice, GearGridSkeleton } from '@/components/gear/data-state';
import { GearCard } from '@/components/gear/gear-card';
import { Chip } from '@/components/gear/primitives';
import { PageHead } from '@/components/layout/section-head';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { fmtPrice } from '@/lib/format';
import { searchCatalog, type SearchCatalogResult, type SearchRequest } from '@/lib/search';
import { track } from '@/lib/track';
import { cn } from '@/lib/utils';
import type { SearchSort } from '@youpu/schema';

const PAGE_SIZE = 20;
const SORTS: Array<{ key: SearchSort; label: string }> = [
  { key: 'relevance', label: '相关性' },
  { key: 'new', label: '最新年款' },
  { key: 'rating', label: '综合评分' },
];

export function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const request = useMemo(() => readSearchRequest(searchParams), [queryString, searchParams]);
  const [result, setResult] = useState<SearchCatalogResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let alive = true;
    if (!request) {
      setResult(null);
      setLoading(false);
      setFallback(false);
      return () => {
        alive = false;
      };
    }

    setLoading(true);
    setFallback(false);
    void searchCatalog(request, fetch, () => {
      if (alive) setFallback(true);
    }).then((next) => {
      if (!alive) return;
      setResult(next);
      setLoading(false);
      track('search', { query: request.q, hits: next.total });
    });

    return () => {
      alive = false;
    };
  }, [request, retryToken]);

  const bounds = useMemo<[number, number]>(() => {
    const min = result?.facets.price.min ?? 0;
    const max = result?.facets.price.max ?? Math.max(min + 1000, 10000);
    return [min, Math.max(min + 1, max)];
  }, [result]);
  const selectedPrice: [number, number] = [request?.priceMin ?? bounds[0], request?.priceMax ?? bounds[1]];
  const totalPages = result ? Math.max(1, Math.ceil(result.total / result.pageSize)) : 1;
  const activeFilterCount = request ? countActiveFilters(request) : 0;

  const replaceQuery = (changes: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams(queryString);
    for (const [key, value] of Object.entries(changes)) {
      if (value === undefined || value === '') next.delete(key);
      else next.set(key, String(value));
    }
    next.delete('page');
    const suffix = next.toString();
    router.replace(suffix ? `/search?${suffix}` : '/search');
  };

  const resetFilters = () => {
    const next = new URLSearchParams();
    if (request?.q) next.set('q', request.q);
    router.replace(`/search?${next.toString()}`);
  };

  const FilterBody = (
    <div className="space-y-7">
      <div className="flex items-center justify-between border-b border-foreground pb-2.5">
        <p className="mono-label text-foreground">筛选 / FILTER</p>
        {activeFilterCount > 0 ? (
          <button type="button" onClick={resetFilters} className="mono-label flex items-center gap-1 text-primary hover:underline">
            <X size={11} strokeWidth={2} /> 清空 {activeFilterCount}
          </button>
        ) : null}
      </div>

      <FacetGroup
        label="品类"
        value={request?.category}
        options={result?.facets.categories.map((facet) => ({ value: facet.slug, label: `${facet.name} · ${facet.count}` })) ?? []}
        onChange={(value) => replaceQuery({ category: value })}
      />
      <FacetGroup
        label="品牌"
        value={request?.brand}
        options={result?.facets.brands.map((facet) => ({ value: facet.slug, label: `${facet.nameCn ?? facet.name} · ${facet.count}` })) ?? []}
        onChange={(value) => replaceQuery({ brand: value })}
      />
      <FacetGroup
        label="年款"
        value={request?.year === undefined ? undefined : String(request.year)}
        options={result?.facets.years.map((facet) => ({ value: String(facet.value), label: `${facet.value} · ${facet.count}` })) ?? []}
        onChange={(value) => replaceQuery({ year: value ? Number(value) : undefined })}
      />

      <div>
        <p className="mono-label mb-3">价格区间</p>
        <Slider
          min={bounds[0]}
          max={bounds[1]}
          step={100}
          value={selectedPrice}
          onValueCommit={(value) => replaceQuery({ priceMin: value[0], priceMax: value[1] })}
          className="[&_[data-slot=range]]:bg-foreground [&_[data-slot=thumb]]:h-4 [&_[data-slot=thumb]]:w-2 [&_[data-slot=thumb]]:rounded-none [&_[data-slot=thumb]]:border-foreground [&_[data-slot=thumb]]:bg-background [&_[data-slot=track]]:h-[3px]"
        />
        <p className="mono-data mt-3 flex justify-between text-[12px] tnum">
          <span>{fmtPrice(selectedPrice[0])}</span>
          <span>{fmtPrice(selectedPrice[1])}</span>
        </p>
      </div>

      <div className="border-t border-border pt-5">
        <p className="mono-label mb-2">匹配结果</p>
        <p className="mono-data text-[26px] leading-none tnum">
          {result?.total ?? '—'}
          <span className="ml-1 text-[12px] text-muted-foreground">件</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 sm:py-12">
      <nav className="mono-label mb-5 flex items-center gap-1.5">
        <Link href="/" className="hover:text-primary">首页</Link>
        <ChevronRight size={11} strokeWidth={1.6} />
        <span className="text-foreground">搜索装备</span>
      </nav>

      <PageHead
        kicker="GLOBAL SEARCH / EQUIPMENT INDEX"
        title={request ? `搜索「${request.q}」` : '搜索装备'}
        titleEn="SEARCH"
        desc="按品牌、型号、年款和中文关键词找到装备，再用价格与类目筛选缩小范围。"
        aside={
          <div className="text-right">
            <p className="mono-data text-[38px] leading-none tnum">{result?.total ?? '—'}</p>
            <p className="mono-label mt-1.5">匹配装备</p>
          </div>
        }
      />

      {!request ? (
        <div className="mt-12 border border-dashed border-border py-24 text-center">
          <p className="text-[15px] font-medium">输入关键词开始搜索</p>
          <p className="mono-label mt-2">支持品牌、型号、年款和中文描述</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[228px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-32">{FilterBody}</div>
          </aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <div className="flex flex-wrap items-center gap-1">
                <span className="mono-label mr-2">排序</span>
                {SORTS.map((sort) => (
                  <button
                    key={sort.key}
                    type="button"
                    onClick={() => replaceQuery({ sort: sort.key })}
                    className={cn(
                      'mono-label border px-2.5 py-1 transition-colors',
                      request.sort === sort.key ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground',
                    )}
                  >
                    {sort.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="mono-data text-[12px] text-muted-foreground tnum">{result?.total ?? '—'} 件</span>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 gap-1.5 rounded-none text-[12px] lg:hidden">
                      <SlidersHorizontal size={13} strokeWidth={1.6} />
                      筛选{activeFilterCount ? ` · ${activeFilterCount}` : ''}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[86vw] max-w-xs overflow-y-auto p-5">
                    <SheetTitle className="sr-only">搜索筛选</SheetTitle>
                    {FilterBody}
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-2 border border-border bg-accent/50 px-3 py-2">
              <span className="mono-label">搜索</span>
              <span className="mono-data flex-1 truncate text-[12.5px]">“{request.q}”</span>
              {result?.source === 'pack' ? <span className="mono-label text-muted-foreground">内容包回退</span> : null}
              <button type="button" onClick={() => router.push('/search')} aria-label="清除搜索" className="text-muted-foreground hover:text-foreground">
                <X size={13} strokeWidth={1.8} />
              </button>
            </div>

            {fallback ? <FallbackNotice onRetry={() => setRetryToken((value) => value + 1)} className="mb-5" /> : null}

            {loading ? <GearGridSkeleton count={8} className="md:grid-cols-3 xl:grid-cols-4" /> : null}
            {!loading && result && result.items.length ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {result.items.map((gear, index) => (
                  <GearCard key={gear.id} gear={gear} className="reveal reveal-up" from="search" position={index} sort={request.sort} />
                ))}
              </div>
            ) : null}
            {!loading && result && !result.items.length ? (
              <div className="border border-dashed border-border py-24 text-center">
                <p className="text-[15px] font-medium">没有找到符合条件的装备</p>
                <p className="mono-label mt-2">试着更换品牌、型号或放宽价格范围</p>
                <Button variant="outline" onClick={resetFilters} className="mono-label mt-5 h-8 rounded-none px-4 text-[12px]">
                  重置全部筛选
                </Button>
              </div>
            ) : null}

            {result && result.total > 0 ? (
              <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
                <button type="button" disabled={request.page <= 1} onClick={() => replacePage(request.page - 1)} className="mono-label disabled:cursor-not-allowed disabled:text-muted-foreground/40 hover:text-primary">
                  ← 上一页
                </button>
                <span className="mono-data text-[12px] tnum">{request.page} / {totalPages}</span>
                <button type="button" disabled={request.page >= totalPages} onClick={() => replacePage(request.page + 1)} className="mono-label disabled:cursor-not-allowed disabled:text-muted-foreground/40 hover:text-primary">
                  下一页 →
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );

  function replacePage(page: number) {
    const next = new URLSearchParams(queryString);
    next.set('page', String(page));
    router.replace(`/search?${next.toString()}`);
  }
}

function FacetGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value?: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string | undefined) => void;
}) {
  if (!options.length) return null;
  return (
    <div>
      <p className="mono-label mb-3">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <Chip key={option.value} active={value === option.value} onClick={() => onChange(value === option.value ? undefined : option.value)}>
            {option.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function readSearchRequest(searchParams: { get(name: string): string | null }): SearchRequest | null {
  const q = searchParams.get('q')?.trim() ?? '';
  if (!q) return null;
  const sortValue = searchParams.get('sort');
  const sort: SearchSort = sortValue === 'new' || sortValue === 'rating' ? sortValue : 'relevance';
  return {
    q,
    category: searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    year: parseNumber(searchParams.get('year')),
    priceMin: parseNumber(searchParams.get('priceMin')),
    priceMax: parseNumber(searchParams.get('priceMax')),
    sort,
    page: Math.max(1, parseNumber(searchParams.get('page')) ?? 1),
    pageSize: PAGE_SIZE,
  };
}

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function countActiveFilters(request: SearchRequest): number {
  return [request.category, request.brand, request.year, request.priceMin, request.priceMax].filter((value) => value !== undefined).length;
}
