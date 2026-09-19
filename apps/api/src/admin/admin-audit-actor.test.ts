import assert from 'node:assert/strict';
import test from 'node:test';
import { selectAuditActor } from './admin-audit-actor';

test('prefers the authenticated account as the audit actor', () => {
  assert.equal(selectAuditActor('account-1', 'legacy-actor'), 'account-1');
});

test('uses the legacy fallback actor when no account is authenticated', () => {
  assert.equal(selectAuditActor(undefined, 'legacy-actor'), 'legacy-actor');
  assert.equal(selectAuditActor(null, 'legacy-actor'), 'legacy-actor');
});
