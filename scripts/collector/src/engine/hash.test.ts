import assert from 'node:assert/strict';
import test from 'node:test';
import { sha256Json, stableJson } from './hash';

test('stable JSON sorts object keys but preserves array order', () => {
  assert.equal(stableJson({ b: 2, a: 1 }), stableJson({ a: 1, b: 2 }));
  assert.notEqual(stableJson(['a', 'b']), stableJson(['b', 'a']));
  assert.equal(sha256Json({ b: 2, a: 1 }), sha256Json({ a: 1, b: 2 }));
});

test('hash changes when normalized product facts change', () => {
  const first = sha256Json({ length: 158, flex: 7, scenes: ['all-mountain'] });
  const second = sha256Json({ length: 158, flex: 8, scenes: ['all-mountain'] });
  assert.notEqual(first, second);
  assert.match(first, /^[a-f0-9]{64}$/);
});
