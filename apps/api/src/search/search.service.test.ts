import test from 'node:test';
import assert from 'node:assert/strict';
import { searchScore } from './search.service';

test('exact model and brand matches rank above a one-liner-only match', () => {
  const exact = searchScore({
    q: 'burton custom',
    title: 'Burton Custom Camber',
    model: 'Custom Camber',
    brand: 'Burton',
    oneLiner: null,
  });
  const prose = searchScore({
    q: 'burton custom',
    title: 'Jones Mountain Twin',
    model: 'Mountain Twin',
    brand: 'Jones',
    oneLiner: '适合 Burton Custom 用户升级',
  });
  assert.ok(exact > prose);
});

test('search score is case-insensitive and whitespace-normalized', () => {
  assert.equal(
    searchScore({ q: ' BURTON ', title: 'Burton Custom', model: 'Custom', brand: 'Burton', oneLiner: null }),
    searchScore({ q: 'burton', title: 'Burton Custom', model: 'Custom', brand: 'Burton', oneLiner: null }),
  );
});
