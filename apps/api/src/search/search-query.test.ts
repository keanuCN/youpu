import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSearchQuery } from './search-query';

test('parser trims and defaults search parameters', () => {
  assert.deepEqual(parseSearchQuery({ q: '  burton ', page: undefined }), {
    q: 'burton',
    sort: 'relevance',
    page: 1,
    pageSize: 20,
  });
});

test('parser rejects empty queries, invalid numbers, and reversed prices', () => {
  assert.throws(() => parseSearchQuery({ q: ' ' }), /q/);
  assert.throws(() => parseSearchQuery({ q: 'burton', page: '0' }), /page/);
  assert.throws(() => parseSearchQuery({ q: 'burton', priceMin: '7000', priceMax: '3000' }), /price/);
});
