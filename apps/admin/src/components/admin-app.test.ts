import test from 'node:test';
import assert from 'node:assert/strict';
import * as adminApp from './admin-app';

test('buildProductPayload always emits CNY for product prices', () => {
  const { buildProductPayload } = adminApp as unknown as {
    buildProductPayload: (form: unknown, schema: null) => { priceCurrency: string };
  };
  const payload = buildProductPayload({
    slug: 'sample-product-2026', categorySlug: 'snowboard', brandSlug: 'sample',
    model: 'Sample', year: '2026', title: 'Sample', oneLiner: '',
    priceMin: '1000', priceMax: '2000', priceCurrency: 'USD', coverUrl: '',
    status: 'draft', sourceKind: 'manual', sourceUrl: '', snapshotUrl: '',
    specs: {}, editorialScores: {}, images: [],
  }, null);
  assert.equal(payload.priceCurrency, 'CNY');
});
