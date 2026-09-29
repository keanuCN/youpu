import assert from 'node:assert/strict';
import test from 'node:test';
import { ratingListQuerySchema } from '@youpu/schema';
import type { AccountView } from '../auth/auth.types';
import { CommunityService } from './community.service';

const account: AccountView = {
  id: 'account-1',
  email: 'rider@example.com',
  nickname: 'Rider',
  avatarUrl: null,
  riderProfile: { level: 'advanced', years: 4 },
  role: 'user',
  status: 'active',
  createdAt: '2026-09-01T00:00:00.000Z',
};

function product() {
  return {
    id: 'product-1',
    slug: 'burton-custom',
    model: 'Custom',
    year: 2026,
    title: 'Burton Custom',
    priceMin: null,
    priceMax: null,
    specs: {},
    editorialScores: null,
    brand: { name: 'Burton', nameCn: null },
  };
}

function savedRating(id: string, riderProfile: Record<string, unknown>, helpfulCount = 0) {
  const createdAt = new Date('2026-09-01T00:00:00.000Z');
  return {
    id,
    productId: 'product-1',
    accountId: account.id,
    overall: 4,
    sub: {},
    content: '很稳',
    riderProfile,
    status: 'published',
    helpfulCount,
    createdAt,
    updatedAt: createdAt,
    account: { id: account.id, nickname: account.nickname, avatarUrl: null, riderProfile },
    replies: [],
  };
}

test('upsertRating applies the rating limit and persists moderation metadata while published', async () => {
  const calls: {
    limit: string[];
    events: Array<{ data: Record<string, unknown> }>;
    favoriteQuery?: unknown;
    upsert?: { create: Record<string, unknown>; update: Record<string, unknown> };
  } = { limit: [], events: [] };
  const tx = {
    rating: {
      upsert: async (input: { create: Record<string, unknown>; update: Record<string, unknown> }) => {
        calls.upsert = input;
        return savedRating('rating-1', account.riderProfile);
      },
    },
    outboxEvent: { create: async (input: { data: Record<string, unknown> }) => { calls.events.push(input); return {}; } },
    favorite: {
      findMany: async (input: unknown) => {
        calls.favoriteQuery = input;
        return [{ accountId: 'follower-1' }];
      },
    },
  };
  const prisma = {
    product: { findFirst: async () => product() },
    rating: { findUnique: async () => null },
    $transaction: async (callback: (value: typeof tx) => unknown) => callback(tx),
  };
  const rateLimit = { assertAllowed: async (accountId: string, scope: string) => calls.limit.push(`${accountId}:${scope}`) };
  const service = new CommunityService(prisma as never, rateLimit as never);

  await service.upsertRating('burton-custom', account, {
    overall: 5,
    sub: {},
    content: '加微信返现购买',
    images: ['https://youpu.tos-cn-beijing.volces.com/review-images/test.webp'],
    riderProfile: account.riderProfile,
  });

  assert.deepEqual(calls.limit, ['account-1:rating']);
  assert.equal(calls.upsert?.create.moderationRisk, 'watch');
  assert.deepEqual(calls.upsert?.create.moderationReasons, ['promotion']);
  assert.ok(calls.upsert?.create.moderationCheckedAt instanceof Date);
  assert.equal(calls.upsert?.create.status, 'published');
  assert.deepEqual(calls.upsert?.create.images, ['https://youpu.tos-cn-beijing.volces.com/review-images/test.webp']);
  assert.deepEqual(calls.upsert?.update.images, ['https://youpu.tos-cn-beijing.volces.com/review-images/test.webp']);
  assert.equal(calls.upsert?.update.moderationRisk, 'watch');
  assert.deepEqual(calls.upsert?.update.moderationReasons, ['promotion']);
  assert.ok(calls.upsert?.update.moderationCheckedAt instanceof Date);
  assert.deepEqual(calls.favoriteQuery, {
    where: { productId: 'product-1', accountId: { not: account.id } },
    select: { accountId: true },
  });
  const notifications = calls.events.filter((event) => event.data.type === 'notification.created');
  assert.equal(notifications.length, 1);
  assert.deepEqual(notifications[0]?.data.payload, {
    accountId: 'follower-1',
    actorId: account.id,
    type: 'new_review',
    targetType: 'product',
    targetId: 'product-1',
    payload: {
      productSlug: 'burton-custom',
      productTitle: 'Burton Custom',
      path: '/gear/burton-custom#reviews',
      anchor: 'rating-1',
      actorName: account.nickname,
    },
  });
});

test('createReply applies the reply limit and marks duplicate content for review', async () => {
  const calls: {
    limit: string[];
    events: Array<{ data: Record<string, unknown> }>;
    duplicateQuery?: unknown;
    create?: { data: Record<string, unknown> };
  } = { limit: [], events: [] };
  const tx = {
    ratingReply: {
      create: async (input: { data: Record<string, unknown> }) => {
        calls.create = input;
        return {
          id: 'reply-1',
          ratingId: 'rating-1',
          replyTo: null,
          content: '加微信购买',
          createdAt: new Date('2026-09-02T00:00:00.000Z'),
          account: { id: account.id, nickname: account.nickname, avatarUrl: null },
        };
      },
    },
    outboxEvent: { create: async (input: { data: Record<string, unknown> }) => { calls.events.push(input); return {}; } },
  };
  const prisma = {
    rating: { findUnique: async () => ({ id: 'rating-1', accountId: 'owner-1', product: { slug: 'burton-custom' } }) },
    account: { findUnique: async () => ({ id: 'owner-1' }) },
    ratingReply: {
      findFirst: async (input: unknown) => {
        calls.duplicateQuery = input;
        return { id: 'reply-existing' };
      },
    },
    $transaction: async (callback: (value: typeof tx) => unknown) => callback(tx),
  };
  const rateLimit = { assertAllowed: async (accountId: string, scope: string) => calls.limit.push(`${accountId}:${scope}`) };
  const service = new CommunityService(prisma as never, rateLimit as never);

  await service.createReply('rating-1', account, { content: '加微信购买' });

  assert.deepEqual(calls.limit, ['account-1:reply']);
  assert.deepEqual(calls.duplicateQuery, {
    where: { ratingId: 'rating-1', content: '加微信购买', status: 'published' },
    select: { id: true },
  });
  assert.equal(calls.create?.data.moderationRisk, 'watch');
  assert.deepEqual(calls.create?.data.moderationReasons, ['promotion', 'duplicate-content']);
  assert.ok(calls.create?.data.moderationCheckedAt instanceof Date);
  assert.equal(calls.create?.data.status, 'published');
  assert.deepEqual(calls.events[0]?.data.payload, {
    accountId: 'owner-1',
    actorId: account.id,
    type: 'reply',
    targetType: 'rating',
    targetId: 'rating-1',
    payload: {
      productSlug: 'burton-custom',
      path: '/gear/burton-custom#reviews',
      anchor: 'rating-1',
      actorName: account.nickname,
      replyId: 'reply-1',
    },
  });
});

test('createReport and toggleHelpful apply their operation limits', async () => {
  const limits: string[] = [];
  const ratingId = '11111111-1111-4111-8111-111111111111';
  const prisma = {
    rating: {
      findUnique: async () => ({ id: ratingId, accountId: account.id, helpfulCount: 0 }),
      update: async () => ({ helpfulCount: 1 }),
    },
    ratingVote: { findUnique: async () => null, create: async () => ({}) },
    report: {
      create: async () => ({ id: 'report-1', targetType: 'rating', targetId: ratingId, reason: 'spam', status: 'open', createdAt: new Date() }),
    },
    $transaction: async (callback: (value: unknown) => unknown) => callback(prisma),
  };
  const rateLimit = { assertAllowed: async (accountId: string, scope: string) => limits.push(`${accountId}:${scope}`) };
  const service = new CommunityService(prisma as never, rateLimit as never);

  await service.createReport(account.id, { targetType: 'rating', targetId: ratingId, reason: 'spam' });
  await service.toggleHelpful(ratingId, account);

  assert.deepEqual(limits, ['account-1:report', 'account-1:helpful']);
});

test('toggleHelpful emits a targetable notification to the rating author', async () => {
  const events: Array<{ data: Record<string, unknown> }> = [];
  const prisma = {
    rating: {
      findUnique: async () => ({ id: 'rating-1', accountId: 'owner-1', helpfulCount: 0, product: { slug: 'burton-custom' } }),
      update: async () => ({ helpfulCount: 1 }),
    },
    ratingVote: { findUnique: async () => null, create: async () => ({}) },
    outboxEvent: { create: async (input: { data: Record<string, unknown> }) => { events.push(input); return {}; } },
    $transaction: async (callback: (value: unknown) => unknown) => callback(prisma),
  };
  const service = new CommunityService(prisma as never, { assertAllowed: async () => {} } as never);

  await service.toggleHelpful('rating-1', account);

  assert.deepEqual(events[0]?.data.payload, {
    accountId: 'owner-1',
    actorId: account.id,
    type: 'helpful',
    targetType: 'rating',
    targetId: 'rating-1',
    payload: {
      productSlug: 'burton-custom',
      path: '/gear/burton-custom#reviews',
      anchor: 'rating-1',
      actorName: account.nickname,
    },
  });
});

test('listRatings filters and sorts published rows and loads the viewer only for similar sorting', async () => {
  const rows = [
    savedRating('unrelated', { level: 'beginner', years: 1 }, 99),
    savedRating('same-level', { level: 'advanced' }, 0),
    savedRating('richer-match', { level: 'intermediate', years: 4, height: 170, home_resort: 'yabuli' }, 0),
  ];
  const accountLookups: unknown[] = [];
  const prisma = {
    product: { findFirst: async () => product() },
    rating: { findMany: async () => rows },
    account: { findUnique: async (input: unknown) => { accountLookups.push(input); return { riderProfile: account.riderProfile }; } },
    ratingVote: { findMany: async () => [] },
  };
  const service = new CommunityService(prisma as never, { assertAllowed: async () => {} } as never);

  const result = await service.listRatings('burton-custom', ratingListQuerySchema.parse({ sort: 'similar' }), 'account-1');

  assert.deepEqual(result.items.map((item) => item.id), ['same-level', 'richer-match', 'unrelated']);
  assert.equal(accountLookups.length, 1);
  assert.deepEqual(accountLookups[0], { where: { id: 'account-1' }, select: { riderProfile: true } });
  const first = result.items[0];
  assert.ok(first);
  assert.equal('moderationReasons' in first, false);
});
