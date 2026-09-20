import test from 'node:test';
import assert from 'node:assert/strict';
import { fmtPrice } from './format';
import { ACTION_CAM_GEAR } from '../data/action-cams';
import { mapProductListItem } from './content';

test('formats every supported currency as a CNY amount', () => {
  assert.equal(fmtPrice(319, 'USD'), '¥2,297');
  assert.equal(fmtPrice(2297, 'CNY'), '¥2,297');
});

test('local action-camera data is canonical CNY', () => {
  const product = ACTION_CAM_GEAR.find((item) => item.model === 'Osmo Action 5 Pro');
  assert.ok(product);
  assert.equal(product.priceCurrency, 'CNY');
  assert.equal(product.price, 2297);
});

test('legacy API prices are normalized when mapped for web display', () => {
  const mapped = mapProductListItem({
    id: 'legacy', slug: 'legacy', title: 'Legacy', model: 'Legacy', year: 2026,
    oneLiner: null, priceMin: 319, priceMax: 379.99, priceCurrency: 'USD', coverUrl: null,
    ratingOverall: null, ratingCount: 0, favoriteCount: 0, composite: null,
    brand: { slug: 'dji', name: 'DJI', nameCn: null }, categorySlug: 'action-cam', specs: {}, highlights: [],
  } as never);
  assert.equal(mapped.priceCurrency, 'CNY');
  assert.equal(mapped.price, 2517);
  assert.deepEqual(mapped.priceBand, { min: 2297, max: 2736 });
});
