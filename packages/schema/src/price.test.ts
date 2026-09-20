import test from 'node:test';
import assert from 'node:assert/strict';
import { convertPriceToCny, normalizePriceRange } from './price';
import { adminProductInputSchema, productListItemSchema } from './index';

test('keeps CNY unchanged and converts USD using the fixed rate', () => {
  assert.equal(convertPriceToCny(319, 'USD'), 2297);
  assert.equal(convertPriceToCny(2297, 'CNY'), 2297);
});

test('normalizes nullable ranges and rounds each endpoint', () => {
  assert.deepEqual(normalizePriceRange({ min: 319, max: 379.99, currency: 'USD' }), {
    min: 2297,
    max: 2736,
    currency: 'CNY',
  });
  assert.deepEqual(normalizePriceRange({ min: null, max: null, currency: 'USD' }), {
    min: null,
    max: null,
    currency: 'CNY',
  });
});

test('rejects invalid values, unknown currencies, and reversed ranges', () => {
  assert.throws(() => convertPriceToCny(-1, 'USD'), /非负/);
  assert.throws(() => convertPriceToCny(Number.NaN, 'USD'), /有限/);
  assert.throws(() => convertPriceToCny(100, 'EUR'), /未配置/);
  assert.throws(() => normalizePriceRange({ min: 300, max: 200, currency: 'CNY' }), /最小价格/);
});

test('admin and API product contracts only expose CNY', () => {
  assert.throws(
    () => adminProductInputSchema.parse({
      slug: 'sample-product-2026', categorySlug: 'snowboard', brandSlug: 'sample',
      model: 'Sample', year: 2026, title: 'Sample', priceCurrency: 'USD', specs: {},
    }),
    /Invalid literal value/,
  );
  assert.throws(
    () => productListItemSchema.parse({
      id: '1', slug: 'sample-product-2026', title: 'Sample', model: 'Sample', year: 2026,
      oneLiner: null, priceMin: 100, priceMax: 200, priceCurrency: 'USD', coverUrl: null,
      ratingOverall: null, ratingCount: 0, favoriteCount: 0, composite: null,
      brand: { slug: 'sample', name: 'Sample' }, categorySlug: 'snowboard', specs: {}, highlights: [],
    }),
    /Invalid literal value/,
  );
});
