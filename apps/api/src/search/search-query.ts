export interface RawSearchQuery {
  q?: string;
  category?: string;
  brand?: string;
  year?: string;
  priceMin?: string;
  priceMax?: string;
  sort?: string;
  page?: string;
  pageSize?: string;
}

export interface SearchParams {
  q: string;
  category?: string;
  brand?: string;
  year?: number;
  priceMin?: number;
  priceMax?: number;
  sort: 'relevance' | 'new' | 'rating';
  page: number;
  pageSize: number;
}

export function parseSearchQuery(input: RawSearchQuery): SearchParams {
  const q = input.q?.trim() ?? '';
  if (!q || q.length > 128) throw new Error('q 必须是 1–128 个字符');

  const page = parsePositive(input.page, 'page', 1);
  const pageSize = Math.min(48, parsePositive(input.pageSize, 'pageSize', 20));
  const sort = input.sort === undefined || input.sort === '' ? 'relevance' : input.sort;
  if (sort !== 'relevance' && sort !== 'new' && sort !== 'rating') throw new Error('sort 不合法');

  const year = parseOptionalInteger(input.year, 'year');
  const priceMin = parseOptionalNumber(input.priceMin, 'priceMin');
  const priceMax = parseOptionalNumber(input.priceMax, 'priceMax');
  if (priceMin !== undefined && priceMax !== undefined && priceMin > priceMax) {
    throw new Error('priceMin 不能高于 priceMax');
  }

  return {
    q,
    sort,
    page,
    pageSize,
    ...(input.category?.trim() ? { category: input.category.trim() } : {}),
    ...(input.brand?.trim() ? { brand: input.brand.trim() } : {}),
    ...(year === undefined ? {} : { year }),
    ...(priceMin === undefined ? {} : { priceMin }),
    ...(priceMax === undefined ? {} : { priceMax }),
  };
}

function parsePositive(value: string | undefined, label: string, fallback: number): number {
  if (value === undefined || value === '') return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) throw new Error(`${label} 必须是大于 0 的整数`);
  return parsed;
}

function parseOptionalInteger(value: string | undefined, label: string): number | undefined {
  if (value === undefined || value === '') return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) throw new Error(`${label} 必须是整数`);
  return parsed;
}

function parseOptionalNumber(value: string | undefined, label: string): number | undefined {
  if (value === undefined || value === '') return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) throw new Error(`${label} 必须是非负数字`);
  return parsed;
}
