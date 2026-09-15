import assert from 'node:assert/strict';
import test from 'node:test';

import { GEAR } from '../data/boards';
import { buildSearchParams, searchCatalog, searchLocalGear } from './search';

test('local search matches brand, model, and year', () => {
  const result = searchLocalGear(GEAR, { q: 'burton', sort: 'relevance', page: 1, pageSize: 20 });
  assert.ok(result.items.length > 0);
  assert.ok(result.items.every((item) => item.brand.toLocaleLowerCase().includes('burton')));
});

test('URL builder preserves filters and sort', () => {
  assert.equal(
    buildSearchParams({ q: 'custom camber', category: 'snowboard', priceMin: 3000, sort: 'rating', page: 2, pageSize: 20 }).toString(),
    'q=custom+camber&category=snowboard&priceMin=3000&sort=rating&page=2&pageSize=20',
  );
});

test('API search response is parsed and mapped to GearItem', async () => {
  const fetcher: typeof fetch = async () => new Response(JSON.stringify({
    query: 'custom',
    total: 1,
    page: 1,
    pageSize: 20,
    sort: 'relevance',
    items: [{
      id: 'api-id',
      slug: 'burton-custom-camber-2026',
      title: 'Burton Custom Camber',
      model: 'Custom Camber',
      year: 2026,
      oneLiner: '稳定的全山地单板',
      priceMin: 6200,
      priceMax: 6400,
      priceCurrency: 'CNY',
      coverUrl: null,
      ratingOverall: null,
      ratingCount: 0,
      favoriteCount: 0,
      composite: 86,
      brand: { slug: 'burton', name: 'Burton', nameCn: null },
      categorySlug: 'snowboard',
      specs: { flex: 7 },
      highlights: [],
    }],
    facets: { categories: [], brands: [], years: [], price: { min: 6200, max: 6400 } },
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  const result = await searchCatalog({ q: 'custom', sort: 'relevance', page: 1, pageSize: 20 }, fetcher);
  assert.equal(result.source, 'api');
  assert.equal(result.items[0]?.model, 'Custom Camber');
});
