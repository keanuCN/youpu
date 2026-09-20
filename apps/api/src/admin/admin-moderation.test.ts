import assert from 'node:assert/strict';
import test from 'node:test';
import { NotFoundException } from '@nestjs/common';
import { adminModerationPatchSchema } from '@youpu/schema';
import { AdminService } from './admin.service';

type TestActor = { id: string; role: 'editor' | 'admin'; status: 'active' | 'disabled' };

const handledAt = new Date('2026-09-20T08:00:00.000Z');

function makePrisma(
  options: {
    targetType?: 'rating' | 'reply';
    targetStillExists?: boolean;
    editorActor?: TestActor | null;
    adminActor?: TestActor | null;
    auditFails?: boolean;
  } = {},
) {
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
    auditCreates: Array<{ data: Record<string, any>; transaction: object }>;
    rootAuditCreates: Array<{ data: Record<string, any> }>;
    transactionCommitted: boolean;
  } = { auditCreates: [], rootAuditCreates: [], transactionCommitted: false };

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
    auditLog: {
      create: async (input: { data: Record<string, any> }) => {
        calls.auditCreates.push({ data: input.data, transaction: tx });
        if (options.auditFails) throw new Error('audit failed');
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
    account: {
      findUnique: async () => options.adminActor ?? null,
      findFirst: async (input: { where?: { role?: string | { in?: string[] } } }) => {
        const role = input.where?.role;
        if (role === 'editor' || (typeof role === 'object' && role.in?.includes('editor'))) {
          return options.editorActor ?? null;
        }
        return options.adminActor ?? null;
      },
    },
    $transaction: async <T>(callback: (transaction: typeof tx) => Promise<T>) => {
      const result = await callback(tx);
      calls.transactionCommitted = true;
      return result;
    },
    auditLog: {
      create: async (input: { data: Record<string, any> }) => {
        calls.rootAuditCreates.push(input);
        if (options.auditFails) throw new Error('audit failed');
        return input.data;
      },
    },
  };

  return { prisma, calls };
}

function makeService(
  options: {
    targetType?: 'rating' | 'reply';
    targetStillExists?: boolean;
    editorActor?: TestActor | null;
    adminActor?: TestActor | null;
    auditFails?: boolean;
  } = {},
) {
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
  assert.deepEqual(calls.auditCreates[0]?.data.before, {
    status: 'open',
    handledBy: null,
    handledAt: null,
    targetStatus: 'published',
  });
  assert.deepEqual(calls.auditCreates[0]?.data.after, {
    status: 'resolved',
    handledBy: 'admin-id',
    handledAt: (calls.reportUpdate?.data.handledAt as Date).toISOString(),
    targetStatus: 'published',
  });
  assert.equal(calls.rootAuditCreates.length, 0);
});

test('report action can hide a rating in the same transaction', async () => {
  const { service, calls } = makeService();

  await service.updateReport('report-id', { status: 'resolved', targetStatus: 'hidden' }, 'admin-id');

  assert.deepEqual(calls.ratingUpdate?.data, { status: 'hidden' });
  assert.equal(calls.outbox?.data.type, 'rating.changed');
  assert.equal(calls.outbox?.data.aggregateId, 'product-id');
  assert.equal(calls.auditCreates[0]?.data.before.targetStatus, 'published');
  assert.equal(calls.auditCreates[0]?.data.after.targetStatus, 'hidden');
  assert.equal(calls.rootAuditCreates.length, 0);
});

test('legacy-token moderation resolves an active editor fallback and never writes a null handler', async () => {
  const { service, calls } = makeService({
    editorActor: { id: 'editor-fallback-id', role: 'editor', status: 'active' },
  });

  await service.updateReport('report-id', { status: 'resolved' });

  assert.equal(calls.reportUpdate?.data.handledBy, 'editor-fallback-id');
  assert.equal(calls.auditCreates[0]?.data.actorId, 'editor-fallback-id');
});

test('legacy-token moderation fails before writing when no valid fallback actor exists', async () => {
  const { service, calls } = makeService({ editorActor: null, adminActor: null });

  await assert.rejects(() => service.updateReport('report-id', { status: 'resolved' }), /editor\/admin/);

  assert.equal(calls.reportUpdate, undefined);
  assert.equal(calls.transactionCommitted, false);
});

test('moderation audit failure aborts the transaction instead of being swallowed', async () => {
  const { service, calls } = makeService({ auditFails: true });

  await assert.rejects(() => service.updateReport('report-id', { status: 'resolved', targetStatus: 'hidden' }, 'admin-id'), /audit failed/);

  assert.equal(calls.transactionCommitted, false);
  assert.equal(calls.rootAuditCreates.length, 0);
});

test('direct rating moderation writes its audit in the same transaction as the rating and outbox', async () => {
  const { service, calls } = makeService();

  const result = await service.updateRatingStatus('rating-id', { status: 'hidden' }, 'admin-id');

  assert.equal(result.status, 'hidden');
  assert.deepEqual(calls.ratingUpdate?.data, { status: 'hidden' });
  assert.equal(calls.outbox?.data.type, 'rating.changed');
  assert.deepEqual(calls.auditCreates[0]?.data.before, { status: 'published', productId: 'product-id' });
  assert.deepEqual(calls.auditCreates[0]?.data.after, { status: 'hidden', productId: 'product-id' });
  assert.equal(calls.rootAuditCreates.length, 0);
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
