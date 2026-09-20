import test from 'node:test';
import assert from 'node:assert/strict';
import { serializeProductListItem } from './catalog.service';

test('serializes legacy USD product prices as CNY', () => {
  const item = serializeProductListItem({
    id: 'product-1',
    slug: 'legacy-action-cam-2026',
    model: 'Legacy Action Cam',
    year: 2026,
    title: 'Legacy Action Cam',
    oneLiner: null,
    priceMin: 319,
    priceMax: 379.99,
    priceCurrency: 'USD',
    coverUrl: null,
    specs: {},
    editorialScores: null,
    ratingOverall: null,
    ratingCount: 0,
    favoriteCount: 0,
    brand: { slug: 'dji', name: 'DJI', nameCn: null },
    category: { id: 'category-1', slug: 'action-cam', specSchema: null },
    stat: null,
    images: [],
  } as never);

  assert.equal(item.priceMin, 2297);
  assert.equal(item.priceMax, 2736);
  assert.equal(item.priceCurrency, 'CNY');
});
