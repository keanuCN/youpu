import {
  searchResponseSchema,
  type SearchFacet,
  type SearchSort,
} from '@youpu/schema';
import { GEAR } from '../data/boards';
import { getCategory } from '../data/categories';
import type { GearItem } from '../types';
import { API_BASE } from './api';
import { mapProductListItem } from './content';
import { hasPrice } from './gear-state';

export interface SearchRequest {
  q: string;
  category?: string;
  brand?: string;
  year?: number;
  priceMin?: number;
  priceMax?: number;
  sort: SearchSort;
  page: number;
  pageSize: number;
}

export interface SearchCatalogResult {
  query: string;
  total: number;
  page: number;
  pageSize: number;
  sort: SearchSort;
  items: GearItem[];
  facets: SearchFacet;
  source: 'api' | 'pack';
}

const SEARCH_TIMEOUT_MS = 8_000;

export async function searchCatalog(
  params: SearchRequest,
  fetcher: typeof fetch = fetch,
): Promise<SearchCatalogResult> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);
    try {
      const response = await fetcher(`${API_BASE.replace(/\/$/, '')}/api/search?${buildSearchParams(params)}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Search API returned ${response.status}`);
      const parsed = searchResponseSchema.parse(await response.json());
      return {
        query: parsed.query,
        total: parsed.total,
        page: parsed.page,
        pageSize: parsed.pageSize,
        sort: parsed.sort,
        items: parsed.items.map((item) => mapProductListItem(item)),
        facets: parsed.facets,
        source: 'api',
      };
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return searchLocalGear(GEAR, params);
  }
}

export function buildSearchParams(params: SearchRequest): URLSearchParams {
  const query = new URLSearchParams();
  query.set('q', params.q);
  if (params.category) query.set('category', params.category);
  if (params.brand) query.set('brand', params.brand);
  if (params.year !== undefined) query.set('year', String(params.year));
  if (params.priceMin !== undefined) query.set('priceMin', String(params.priceMin));
  if (params.priceMax !== undefined) query.set('priceMax', String(params.priceMax));
  query.set('sort', params.sort);
  query.set('page', String(params.page));
  query.set('pageSize', String(params.pageSize));
  return query;
}

export function searchLocalGear(pool: GearItem[], params: SearchRequest): SearchCatalogResult {
  const q = params.q.trim().toLocaleLowerCase();
  const priceFilterActive = params.priceMin !== undefined || params.priceMax !== undefined;
  const filtered = pool.filter((item) => {
    const categoryName = getCategory(item.categorySlug)?.name ?? item.categorySlug;
    const text = [
      item.brand,
      item.model,
      item.year,
      categoryName,
      item.analysis.verdict,
      ...item.scenes,
      ...item.whoFor,
      ...Object.values(item.specs),
    ]
      .filter((value) => value !== null && value !== undefined)
      .join(' ')
      .toLocaleLowerCase();
    if (q && !text.includes(q)) return false;
    if (params.category && item.categorySlug !== params.category) return false;
    if (params.brand && slugify(item.brand) !== params.brand && item.brand !== params.brand) return false;
    if (params.year !== undefined && item.year !== params.year) return false;
    if (priceFilterActive && !hasPrice(item)) return false;
    if (hasPrice(item) && params.priceMin !== undefined && item.priceBand.max < params.priceMin) return false;
    if (hasPrice(item) && params.priceMax !== undefined && item.priceBand.min > params.priceMax) return false;
    return true;
  });

  const ordered = [...filtered].sort((a, b) => {
    if (params.sort === 'new') return b.year - a.year || b.addedAt.localeCompare(a.addedAt);
    if (params.sort === 'rating') return b.composite - a.composite || b.year - a.year;
    return localScore(b, q) - localScore(a, q) || b.composite - a.composite || b.year - a.year;
  });
  const start = (params.page - 1) * params.pageSize;
  const items = ordered.slice(start, start + params.pageSize);

  return {
    query: params.q,
    total: filtered.length,
    page: params.page,
    pageSize: params.pageSize,
    sort: params.sort,
    items,
    facets: localFacets(filtered),
    source: 'pack',
  };
}

function localScore(item: GearItem, q: string): number {
  if (!q) return 0;
  const brand = item.brand.toLocaleLowerCase();
  const model = item.model.toLocaleLowerCase();
  const year = String(item.year);
  let score = 0;
  if (model === q) score += 1_000;
  if (`${brand} ${model}` === q) score += 900;
  if (model.includes(q)) score += 700;
  if (brand.includes(q)) score += 500;
  if (year === q) score += 400;
  return score;
}

function localFacets(items: GearItem[]): SearchFacet {
  const categories = new Map<string, { slug: string; name: string; count: number }>();
  const brands = new Map<string, { slug: string; name: string; nameCn: string | null; count: number }>();
  const years = new Map<number, number>();
  let min: number | null = null;
  let max: number | null = null;

  for (const item of items) {
    const category = categories.get(item.categorySlug);
    if (category) category.count += 1;
    else categories.set(item.categorySlug, {
      slug: item.categorySlug,
      name: getCategory(item.categorySlug)?.name ?? item.categorySlug,
      count: 1,
    });

    const brandSlug = slugify(item.brand);
    const brand = brands.get(brandSlug);
    if (brand) brand.count += 1;
    else brands.set(brandSlug, { slug: brandSlug, name: item.brand, nameCn: null, count: 1 });

    years.set(item.year, (years.get(item.year) ?? 0) + 1);
    if (hasPrice(item)) {
      min = min === null ? item.priceBand.min : Math.min(min, item.priceBand.min);
      max = max === null ? item.priceBand.max : Math.max(max, item.priceBand.max);
    }
  }

  return {
    categories: [...categories.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    brands: [...brands.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    years: [...years.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => b.value - a.value),
    price: { min, max },
  };
}

function slugify(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
