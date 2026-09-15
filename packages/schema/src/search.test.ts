import test from 'node:test';
import assert from 'node:assert/strict';
import { searchResponseSchema } from './search';

test('search response accepts products and facets', () => {
  const result = searchResponseSchema.parse({
    query: 'burton',
    total: 1,
    page: 1,
    pageSize: 20,
    sort: 'relevance',
    items: [],
    facets: {
      categories: [{ slug: 'snowboard', name: '单板', count: 1 }],
      brands: [{ slug: 'burton', name: 'Burton', nameCn: null, count: 1 }],
      years: [{ value: 2026, count: 1 }],
      price: { min: 6299, max: 6299 },
    },
  });
  assert.equal(result.facets.brands[0]?.slug, 'burton');
});

test('search response rejects an unknown sort at the contract boundary', () => {
  const result = searchResponseSchema.safeParse({
    query: 'burton',
    total: 0,
    page: 1,
    pageSize: 20,
    sort: 'random',
    items: [],
    facets: { categories: [], brands: [], years: [], price: { min: null, max: null } },
  });
  assert.equal(result.success, false);
});
