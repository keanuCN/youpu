import assert from 'node:assert/strict';
import test from 'node:test';
import { checkWithTimeout } from './health-check';

test('returns false when an optional health probe times out', async () => {
  const startedAt = Date.now();
  const result = await checkWithTimeout(() => new Promise<boolean>(() => undefined), 20);

  assert.equal(result, false);
  assert.ok(Date.now() - startedAt < 500);
});

test('returns false when an optional health probe rejects', async () => {
  const result = await checkWithTimeout(async () => {
    throw new Error('elasticsearch unavailable');
  }, 100);

  assert.equal(result, false);
});

test('preserves a successful health probe result', async () => {
  assert.equal(await checkWithTimeout(async () => true, 100), true);
  assert.equal(await checkWithTimeout(async () => false, 100), false);
});
