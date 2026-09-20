import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ADMIN_LEGACY_TOKEN_KEY,
  ADMIN_SESSION_STORAGE_KEY,
  clearAdminSession,
  loadAdminSession,
  saveAdminSession,
  type AdminSessionStorage,
} from './admin-session';

class MemoryStorage implements AdminSessionStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

test('persists and restores an account session', () => {
  const storage = new MemoryStorage();
  const session = {
    kind: 'account' as const,
    accessToken: 'access-1',
    refreshToken: 'refresh-1',
    expiresIn: 900,
    account: {
      id: 'account-1',
      email: 'admin@example.com',
      nickname: '管理员',
      role: 'admin',
      status: 'active',
    },
  };

  saveAdminSession(storage, session);

  assert.deepEqual(loadAdminSession(storage), session);
  assert.equal(storage.getItem(ADMIN_LEGACY_TOKEN_KEY), null);
  assert.notEqual(storage.getItem(ADMIN_SESSION_STORAGE_KEY), null);
});

test('keeps the legacy token mode available during migration', () => {
  const storage = new MemoryStorage();

  saveAdminSession(storage, { kind: 'legacy-token', token: 'legacy-token' });

  assert.deepEqual(loadAdminSession(storage), { kind: 'legacy-token', token: 'legacy-token' });
  assert.equal(storage.getItem(ADMIN_SESSION_STORAGE_KEY), null);
  assert.equal(storage.getItem(ADMIN_LEGACY_TOKEN_KEY), 'legacy-token');
});

test('clears both account and legacy session data', () => {
  const storage = new MemoryStorage();
  saveAdminSession(storage, { kind: 'legacy-token', token: 'legacy-token' });
  storage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify({ kind: 'account' }));

  clearAdminSession(storage);

  assert.equal(loadAdminSession(storage), null);
  assert.equal(storage.getItem(ADMIN_SESSION_STORAGE_KEY), null);
  assert.equal(storage.getItem(ADMIN_LEGACY_TOKEN_KEY), null);
});

test('ignores malformed persisted session data', () => {
  const storage = new MemoryStorage();
  storage.setItem(ADMIN_SESSION_STORAGE_KEY, '{not-json');

  assert.equal(loadAdminSession(storage), null);
});
