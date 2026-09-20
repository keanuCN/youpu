import assert from 'node:assert/strict';
import test from 'node:test';
import { NotFoundException } from '@nestjs/common';
import { adminModerationPatchSchema } from '@youpu/schema';
import { AdminService } from './admin.service';

const handledAt = new Date('2026-09-20T08:00:00.000Z');

function makePrisma(options: { targetType?: 'rating' | 'reply'; targetStillExists?: boolean } = {}) {
  const targetType = options.targetType ?? 'rating';
  const targetStillExists = options.targetStillExists ?? true;
  const report = {
    id: targetType === 'reply' ? 'reply-report-id' : 'report-id',
    targetType,
    targetId: targetType === 'reply' ? 'reply-id' : 'rating-id',
    reporterId: 'reporter-id',
    reason: 'spam',
    note: null,
    status: 'open',
    handledBy: null,
    handledAt: null,
    createdAt: new Date('2026-09-19T08:00:00.000Z'),
  };
  const rating = {
    id: 'rating-id',
    productId: 'product-id',
    status: 'published',
    moderationRisk: 'watch',
    moderationReasons: ['promotion'],
    riderProfile: { level: 'advanced', years: 4 },
  };
  const reply = { id: 'reply-id', ratingId: 'rating-id', status: 'published' };
  const calls: {
    reportUpdate?: { data: Record<string, unknown> };
    ratingUpdate?: { data: Record<string, unknown> };
    replyUpdate?: { data: Record<string, unknown> };
    outbox?: { data: Record<string, any> };
  } = {};

  const applyReportUpdate = ({ data }: { data: Record<string, unknown> }) => {
    calls.reportUpdate = { data };
    return {
      ...report,
      ...data,
      handledAt: data.handledAt ?? report.handledAt,
      handler: data.handledBy ? { id: data.handledBy, nickname: '管理员' } : null,
    };
  };
  const applyRatingUpdate = ({ data }: { data: Record<string, unknown> }) => {
    calls.ratingUpdate = { data };
    return { ...rating, ...data };
  };
  const applyReplyUpdate = ({ data }: { data: Record<string, unknown> }) => {
    calls.replyUpdate = { data };
    return { ...reply, ...data };
  };

  const tx = {
    report: {
      findUnique: async () => report,
      update: async (input: { data: Record<string, unknown> }) => applyReportUpdate(input),
    },
    rating: {
      findUnique: async () => (targetType === 'rating' && !targetStillExists ? null : rating),
      update: async (input: { data: Record<string, unknown> }) => applyRatingUpdate(input),
    },
    ratingReply: {
      findUnique: async () => (targetType === 'reply' && !targetStillExists ? null : reply),
      update: async (input: { data: Record<string, unknown> }) => applyReplyUpdate(input),
    },
    outboxEvent: {
      create: async (input: { data: Record<string, any> }) => {
        calls.outbox = input;
        return input.data;
      },
    },
  };

  const prisma = {
    report: {
      findUnique: async () => report,
      findMany: async () => [
        {
          ...report,
          handledAt,
          reporter: { id: 'reporter-id', nickname: '举报人', email: 'reporter@example.com' },
          handler: { id: 'admin-id', nickname: '管理员' },
        },
      ],
      update: async (input: { data: Record<string, unknown> }) => applyReportUpdate(input),
    },
    rating: {
      findUnique: async () => rating,
      findMany: async () => [
        {
          ...rating,
          overall: 4.5,
          content: '实测内容',
          helpfulCount: 2,
          createdAt: new Date('2026-09-18T08:00:00.000Z'),
          account: { id: 'account-id', nickname: '骑手', email: 'rider@example.com' },
          product: { id: 'product-id', slug: 'sample-product', title: '示例产品' },
        },
      ],
    },
    ratingReply: {
      findUnique: async () => reply,
    },
    $transaction: async <T>(callback: (transaction: typeof tx) => Promise<T>) => callback(tx),
    auditLog: { create: async () => undefined },
  };

  return { prisma, calls };
}

function makeService(options: { targetType?: 'rating' | 'reply'; targetStillExists?: boolean } = {}) {
  const { prisma, calls } = makePrisma(options);
  return { service: new AdminService(prisma as never, {} as never, {} as never), calls };
}

test('accepts only the three report target statuses', () => {
  assert.deepEqual(adminModerationPatchSchema.parse({ status: 'resolved', targetStatus: 'hidden' }), {
    status: 'resolved',
    targetStatus: 'hidden',
  });
  assert.throws(() => adminModerationPatchSchema.parse({ targetStatus: 'open' }));
});

test('resolving a report records the admin and preserves content when no target status is given', async () => {
  const { service, calls } = makeService();

  const result = await service.updateReport('report-id', { status: 'resolved' }, 'admin-id');

  assert.equal(result.status, 'resolved');
  assert.equal(calls.reportUpdate?.data.handledBy, 'admin-id');
  assert.ok(calls.reportUpdate?.data.handledAt instanceof Date);
  assert.equal(calls.ratingUpdate, undefined);
});

test('report action can hide a rating in the same transaction', async () => {
  const { service, calls } = makeService();

  await service.updateReport('report-id', { status: 'resolved', targetStatus: 'hidden' }, 'admin-id');

  assert.deepEqual(calls.ratingUpdate?.data, { status: 'hidden' });
  assert.equal(calls.outbox?.data.type, 'rating.changed');
  assert.equal(calls.outbox?.data.aggregateId, 'product-id');
});

test('report action can reject a reply through its owning rating product', async () => {
  const { service, calls } = makeService({ targetType: 'reply' });

  await service.updateReport('reply-report-id', { status: 'resolved', targetStatus: 'rejected' }, 'admin-id');

  assert.deepEqual(calls.replyUpdate?.data, { status: 'rejected' });
  assert.equal(calls.outbox, undefined);
});

test('report target disappearance inside the transaction aborts the action', async () => {
  const { service, calls } = makeService({ targetStillExists: false });

  await assert.rejects(
    () => service.updateReport('report-id', { status: 'resolved', targetStatus: 'hidden' }, 'admin-id'),
    (error: unknown) => error instanceof NotFoundException,
  );
  assert.equal(calls.reportUpdate, undefined);
  assert.equal(calls.outbox, undefined);
});

test('serializes handled report metadata and moderation rating context for the admin', async () => {
  const { service } = makeService();

  const reports = await service.listReports();
  const ratings = await service.listRatings();

  assert.equal(reports[0]?.handledAt, handledAt.toISOString());
  assert.deepEqual(reports[0]?.handler, { id: 'admin-id', nickname: '管理员' });
  assert.deepEqual(ratings[0]?.moderationReasons, ['promotion']);
  assert.equal(ratings[0]?.moderationRisk, 'watch');
  assert.deepEqual(ratings[0]?.riderProfile, { level: 'advanced', years: 4 });
});
