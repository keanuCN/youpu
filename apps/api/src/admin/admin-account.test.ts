import assert from 'node:assert/strict';
import test from 'node:test';
import { BadRequestException } from '@nestjs/common';
import { adminAccountPatchSchema } from '@youpu/schema';
import { AdminService } from './admin.service';
import { assertAccountAccessChangeAllowed } from './admin-account-policy';

test('accepts a role and status patch for an admin account', () => {
  assert.deepEqual(
    adminAccountPatchSchema.parse({ role: 'editor', status: 'active' }),
    { role: 'editor', status: 'active' },
  );
});

test('rejects unknown account roles and statuses', () => {
  assert.throws(() => adminAccountPatchSchema.parse({ role: 'moderator' }));
  assert.throws(() => adminAccountPatchSchema.parse({ status: 'disabled-now' }));
});

test('protects the final active administrator from demotion or deactivation', () => {
  assert.throws(
    () => assertAccountAccessChangeAllowed({ role: 'admin', status: 'active' }, 1, { role: 'editor' }),
    (error: unknown) => error instanceof BadRequestException,
  );
  assert.throws(
    () => assertAccountAccessChangeAllowed({ role: 'admin', status: 'active' }, 1, { status: 'disabled' }),
    (error: unknown) => error instanceof BadRequestException,
  );
});

test('allows changing an account when another active administrator remains', () => {
  assert.doesNotThrow(() => assertAccountAccessChangeAllowed({ role: 'admin', status: 'active' }, 2, { role: 'editor' }));
  assert.doesNotThrow(() => assertAccountAccessChangeAllowed({ role: 'editor', status: 'active' }, 1, { role: 'admin' }));
});

test('lists accounts with access fields ordered by creation time', async () => {
  const createdAt = new Date('2026-09-19T08:00:00.000Z');
  const prisma = {
    account: {
      findMany: async () => [
        {
          id: 'account-1',
          email: 'admin@example.com',
          nickname: '后台管理员',
          role: 'admin',
          status: 'active',
          createdAt,
        },
      ],
    },
  };
  const service = new AdminService(prisma as never, {} as never, {} as never);

  assert.deepEqual(await service.listAccounts(), [
    {
      id: 'account-1',
      email: 'admin@example.com',
      nickname: '后台管理员',
      role: 'admin',
      status: 'active',
      createdAt: createdAt.toISOString(),
    },
  ]);
});

test('updates account access and writes the authenticated actor to the audit log', async () => {
  const existing = {
    id: 'account-2',
    email: 'editor@example.com',
    nickname: '资料编辑',
    role: 'editor',
    status: 'active',
    createdAt: new Date('2026-09-18T08:00:00.000Z'),
  };
  let auditInput: { actorId?: string } | undefined;
  const tx = {
    account: {
      findUnique: async () => existing,
      count: async () => 1,
      update: async ({ data }: { data: Record<string, string> }) => ({ ...existing, ...data }),
    },
  };
  const prisma = {
    $transaction: async <T>(callback: (transaction: typeof tx) => Promise<T>) => callback(tx),
    auditLog: {
      create: async ({ data }: { data: { actorId?: string } }) => {
        auditInput = data;
        return data;
      },
    },
  };
  const service = new AdminService(prisma as never, {} as never, {} as never);

  const result = await service.updateAccountAccess('account-2', { role: 'admin' }, 'actor-1');

  assert.equal(result.role, 'admin');
  assert.equal(result.status, 'active');
  assert.equal(auditInput?.actorId, 'actor-1');
});

test('rejects an update that would remove the final active administrator', async () => {
  const existing = {
    id: 'account-3',
    email: 'only-admin@example.com',
    nickname: '唯一管理员',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2026-09-17T08:00:00.000Z'),
  };
  const tx = {
    account: {
      findUnique: async () => existing,
      count: async () => 1,
      update: async () => existing,
    },
  };
  const prisma = {
    $transaction: async <T>(callback: (transaction: typeof tx) => Promise<T>) => callback(tx),
  };
  const service = new AdminService(prisma as never, {} as never, {} as never);

  await assert.rejects(
    () => service.updateAccountAccess('account-3', { status: 'disabled' }, 'actor-1'),
    (error: unknown) => error instanceof BadRequestException,
  );
});
