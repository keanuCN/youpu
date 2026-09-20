import test from 'node:test';
import assert from 'node:assert/strict';
import { convertPriceToCny, normalizePriceRange } from './price';

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
