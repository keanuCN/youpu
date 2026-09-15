import { Injectable } from '@nestjs/common';
import {
  type SearchFacet,
  type SearchResponse,
  type SearchSort,
} from '@youpu/schema';
import { Prisma } from '../common/db';
import { PrismaService } from '../common/prisma.service';
import {
  serializeProductListItem,
  type CatalogProductListRow,
} from '../catalog/catalog.service';
import type { SearchParams } from './search-query';

type SearchRow = CatalogProductListRow & {
  publishedAt: Date | null;
  ratingOverall: Prisma.Decimal | null;
  ratingCount: number;
};

interface SearchScoreInput {
  q: string;
  title: string;
  model: string;
  brand: string;
  oneLiner: string | null;
}

interface FacetRow {
  year: number;
  priceMin: Prisma.Decimal | null;
  priceMax: Prisma.Decimal | null;
  brand: { slug: string; name: string; nameCn: string | null };
  category: { slug: string; name: string };
}

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(params: SearchParams): Promise<SearchResponse> {
    return this.searchPostgres(params);
  }

  async searchPostgres(params: SearchParams): Promise<SearchResponse> {
    const where = this.buildWhere(params);
    const rows = (await this.prisma.product.findMany({
      where,
      include: {
        brand: { select: { slug: true, name: true, nameCn: true } },
        category: { select: { id: true, slug: true, specSchema: true } },
        stat: { select: { view7d: true, viewTotal: true } },
      },
    })) as SearchRow[];
    const facetRows = await this.prisma.product.findMany({
      where,
      select: {
        year: true,
        priceMin: true,
        priceMax: true,
        brand: { select: { slug: true, name: true, nameCn: true } },
        category: { select: { slug: true, name: true } },
      },
    });

    const ordered = [...rows].sort((a, b) => compareRows(a, b, params));
    const start = (params.page - 1) * params.pageSize;
    const items = ordered.slice(start, start + params.pageSize).map(serializeProductListItem);

    return {
      query: params.q,
      total: rows.length,
      page: params.page,
      pageSize: params.pageSize,
      sort: params.sort,
      items,
      facets: buildFacets(facetRows),
    };
  }

  private buildWhere(params: SearchParams): Prisma.ProductWhereInput {
    return {
      status: 'published',
      ...(params.category ? { category: { slug: params.category } } : {}),
      ...(params.brand ? { brand: { slug: params.brand } } : {}),
      ...(params.year === undefined ? {} : { year: params.year }),
      ...(params.priceMin === undefined ? {} : { priceMax: { gte: params.priceMin } }),
      ...(params.priceMax === undefined ? {} : { priceMin: { lte: params.priceMax } }),
      OR: [
        { title: { contains: params.q, mode: 'insensitive' } },
        { model: { contains: params.q, mode: 'insensitive' } },
        { slug: { contains: params.q, mode: 'insensitive' } },
        { oneLiner: { contains: params.q, mode: 'insensitive' } },
        { brand: { name: { contains: params.q, mode: 'insensitive' } } },
        { brand: { nameCn: { contains: params.q, mode: 'insensitive' } } },
      ],
    };
  }
}

export function searchScore(input: SearchScoreInput): number {
  const q = normalize(input.q);
  if (!q) return 0;
  const title = normalize(input.title);
  const model = normalize(input.model);
  const brand = normalize(input.brand);
  const oneLiner = normalize(input.oneLiner ?? '');
  const brandModel = `${brand} ${model}`;
  let score = 0;
  if (model === q) score += 1_000;
  if (title === q) score += 950;
  if (brandModel === q) score += 900;
  if (model.includes(q)) score += 700;
  if (title.includes(q)) score += 600;
  if (brand.includes(q)) score += 500;
  if (oneLiner.includes(q)) score += 100;
  for (const token of q.split(/\s+/).filter(Boolean)) {
    if (model.includes(token)) score += 80;
    else if (title.includes(token)) score += 60;
    else if (brand.includes(token)) score += 40;
  }
  return score;
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, ' ');
}

function compareRows(a: SearchRow, b: SearchRow, params: SearchParams): number {
  if (params.sort === 'new') {
    return b.year - a.year || (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0);
  }
  if (params.sort === 'rating') {
    const ratingA = a.ratingOverall === null ? -1 : Number(a.ratingOverall);
    const ratingB = b.ratingOverall === null ? -1 : Number(b.ratingOverall);
    return ratingB - ratingA || b.ratingCount - a.ratingCount;
  }
  const scoreA = searchScore({
    q: params.q,
    title: a.title,
    model: a.model,
    brand: a.brand.nameCn ?? a.brand.name,
    oneLiner: a.oneLiner,
  });
  const scoreB = searchScore({
    q: params.q,
    title: b.title,
    model: b.model,
    brand: b.brand.nameCn ?? b.brand.name,
    oneLiner: b.oneLiner,
  });
  return scoreB - scoreA || b.year - a.year || a.slug.localeCompare(b.slug);
}

function buildFacets(rows: FacetRow[]): SearchFacet {
  const categories = new Map<string, { slug: string; name: string; count: number }>();
  const brands = new Map<string, { slug: string; name: string; nameCn: string | null; count: number }>();
  const years = new Map<number, number>();
  let priceMin: number | null = null;
  let priceMax: number | null = null;

  for (const row of rows) {
    const category = categories.get(row.category.slug);
    if (category) category.count += 1;
    else categories.set(row.category.slug, { ...row.category, count: 1 });

    const brand = brands.get(row.brand.slug);
    if (brand) brand.count += 1;
    else brands.set(row.brand.slug, { ...row.brand, count: 1 });

    years.set(row.year, (years.get(row.year) ?? 0) + 1);
    const min = row.priceMin === null ? null : Number(row.priceMin);
    const max = row.priceMax === null ? null : Number(row.priceMax);
    if (min !== null) priceMin = priceMin === null ? min : Math.min(priceMin, min);
    if (max !== null) priceMax = priceMax === null ? max : Math.max(priceMax, max);
  }

  return {
    categories: [...categories.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    brands: [...brands.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    years: [...years.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.value - a.value),
    price: { min: priceMin, max: priceMax },
  };
}
