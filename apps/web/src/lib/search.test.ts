import assert from 'node:assert/strict';
import test from 'node:test';

import { GEAR } from '../data/boards';
import { buildSearchParams, searchLocalGear } from './search';

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
