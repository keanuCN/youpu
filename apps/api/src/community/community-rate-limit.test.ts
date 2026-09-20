import assert from 'node:assert/strict';
import test from 'node:test';
import type { CommunityRateLimitScope } from './community-rate-limit';

process.env.DATABASE_URL ||= 'postgresql://localhost:5432/youpu_test';

async function loadCommunityRateLimit() {
  return await import('./community-rate-limit');
}

test('allows one operation and rejects a repeated operation for the same account and scope', async () => {
  const { CommunityRateLimit, TooManyRequestsException } = await loadCommunityRateLimit();
  const calls: unknown[][] = [];
  let nextResult: 'OK' | null = 'OK';
  const redis = {
    set: async (...args: unknown[]) => {
      calls.push(args);
      const result = nextResult;
      nextResult = null;
      return result;
    },
  };
  const rateLimit = new CommunityRateLimit(redis as never);

  await rateLimit.assertAllowed('account-1', 'reply');
  await assert.rejects(
    () => rateLimit.assertAllowed('account-1', 'reply'),
    (error: unknown) =>
      error instanceof TooManyRequestsException && error.message === '操作过于频繁，请稍后再试',
  );

  assert.deepEqual(calls, [
    ['community:reply:account-1', '1', 'EX', 30, 'NX'],
    ['community:reply:account-1', '1', 'EX', 30, 'NX'],
  ]);
});

test('uses the exact Redis window for every community operation scope', async () => {
  const { CommunityRateLimit } = await loadCommunityRateLimit();
  const calls: unknown[][] = [];
  const redis = {
    set: async (...args: unknown[]) => {
      calls.push(args);
      return 'OK';
    },
  };
  const rateLimit = new CommunityRateLimit(redis as never);
  const scopes: Array<[CommunityRateLimitScope, number]> = [
    ['rating', 300],
    ['reply', 30],
    ['report', 60],
    ['helpful', 5],
  ];

  for (const [scope, seconds] of scopes) {
    await rateLimit.assertAllowed('account-2', scope);
    assert.deepEqual(calls.at(-1), [`community:${scope}:account-2`, '1', 'EX', seconds, 'NX']);
  }
});
