import assert from 'node:assert/strict';
import test from 'node:test';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AdminGuard } from './admin.guard';
import { canAccessAdminRole } from './admin-permissions';

function makeContext(authorization: string, requiredRole?: 'editor' | 'admin') {
  const request: { headers: { authorization: string }; admin?: unknown } = { headers: { authorization } };
  const handler = { requiredRole };
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: () => handler,
    getClass: () => ({}),
  } as never;
  return { context, request };
}

function makeReflector() {
  return {
    getAllAndOverride: (_key: string, targets: Array<{ requiredRole?: 'editor' | 'admin' }>) =>
      targets.find((target) => target.requiredRole)?.requiredRole
        ? [targets.find((target) => target.requiredRole)?.requiredRole]
        : undefined,
  };
}

test('admin can access editor and admin operations', () => {
  assert.equal(canAccessAdminRole('admin', 'editor'), true);
  assert.equal(canAccessAdminRole('admin', 'admin'), true);
});

test('editor cannot access admin operations', () => {
  assert.equal(canAccessAdminRole('editor', 'editor'), true);
  assert.equal(canAccessAdminRole('editor', 'admin'), false);
});

test('accepts an active editor account and stores its identity on the request', async () => {
  const auth = { resolveAccessToken: async () => ({ id: 'editor-1', role: 'editor', status: 'active' }) };
  const { context, request } = makeContext('Bearer account-token', 'editor');

  const result = await new AdminGuard(auth, makeReflector()).canActivate(context);

  assert.equal(result, true);
  assert.deepEqual(request.admin, { accountId: 'editor-1', role: 'editor', source: 'account' });
});

test('rejects a regular account from every admin route', async () => {
  const auth = { resolveAccessToken: async () => ({ id: 'user-1', role: 'user', status: 'active' }) };
  const { context } = makeContext('Bearer user-token');

  await assert.rejects(
    () => new AdminGuard(auth, makeReflector()).canActivate(context),
    (error: unknown) => error instanceof ForbiddenException,
  );
});

test('rejects an invalid access token with unauthorized', async () => {
  const auth = { resolveAccessToken: async () => null };
  const { context } = makeContext('Bearer invalid-token');

  await assert.rejects(
    () => new AdminGuard(auth, makeReflector()).canActivate(context),
    (error: unknown) => error instanceof UnauthorizedException,
  );
});

test('accepts the configured legacy token as an admin identity', async () => {
  const auth = { resolveAccessToken: async () => null };
  const { context, request } = makeContext(`Bearer ${process.env.ADMIN_TOKEN}`);

  const result = await new AdminGuard(auth, makeReflector()).canActivate(context);

  assert.equal(result, true);
  assert.deepEqual(request.admin, { accountId: null, role: 'admin', source: 'legacy-token' });
});
