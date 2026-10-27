import assert from 'node:assert/strict';
import test from 'node:test';
import { RankingService } from './ranking.service';

const selection = { category: 'snowboard', rank: 'carving', season: '2026' };
const input = { ...selection, product: 'donek-knapton-twin-custom-2026' };
const accountId = '11111111-1111-4111-8111-111111111111';

test('a vote stores the authenticated account and returns persisted counts and state', async () => {
  const sql: string[] = [];
  const prisma = {
    product: { findFirst: async () => ({ id: '22222222-2222-4222-8222-222222222222' }) },
    $queryRaw: async (parts: TemplateStringsArray) => {
      const statement = parts.join('?');
      sql.push(statement);
      if (statement.includes('INSERT INTO')) return [{ changed: false }];
      if (statement.includes('count(*)')) return [{ slug: input.product, votes: 1n }];
      return [{ slug: input.product, changed: false }];
    },
  };
  const limits = { assertAllowed: async () => undefined };
  const result = await new RankingService(prisma as never, limits as never).vote(input, accountId);
  assert.deepEqual(result, { counts: { [input.product]: 1 }, mine: { slug: input.product, changed: false } });
  assert.match(sql[0]!, /ON CONFLICT/);
  assert.match(sql[0]!, /NOT community_ranking_vote.changed/);
});

test('rejects duplicate votes and unknown rank categories', async () => {
  const prisma = { product: { findFirst: async () => ({ id: '22222222-2222-4222-8222-222222222222' }) }, $queryRaw: async () => [] };
  const service = new RankingService(prisma as never, { assertAllowed: async () => undefined } as never);
  await assert.rejects(() => service.vote(input, accountId), /改投机会已用完/);
  await assert.rejects(() => service.getVotes({ ...selection, rank: 'unknown' }), /榜单不存在/);
});
