export const ADMIN_SESSION_STORAGE_KEY = 'youpu.admin.session';
export const ADMIN_LEGACY_TOKEN_KEY = 'youpu.admin.token';

export interface AdminSessionStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface AdminSessionAccount {
  id: string;
  email: string | null;
  nickname: string;
  role: string;
  status: string;
}

export interface AdminAccountSession {
  kind: 'account';
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  account: AdminSessionAccount;
}

export interface AdminLegacySession {
  kind: 'legacy-token';
  token: string;
}

export type AdminSession = AdminAccountSession | AdminLegacySession;

export function saveAdminSession(storage: AdminSessionStorage, session: AdminSession): void {
  if (session.kind === 'account') {
    storage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
    storage.removeItem(ADMIN_LEGACY_TOKEN_KEY);
    return;
  }

  storage.setItem(ADMIN_LEGACY_TOKEN_KEY, session.token);
  storage.removeItem(ADMIN_SESSION_STORAGE_KEY);
}

export function loadAdminSession(storage: AdminSessionStorage): AdminSession | null {
  const serialized = storage.getItem(ADMIN_SESSION_STORAGE_KEY);
  if (serialized) {
    try {
      const parsed: unknown = JSON.parse(serialized);
      if (isAdminAccountSession(parsed)) return parsed;
    } catch {
      // Ignore corrupt account sessions and fall back to the legacy migration key.
    }
  }

  const legacyToken = storage.getItem(ADMIN_LEGACY_TOKEN_KEY)?.trim();
  return legacyToken ? { kind: 'legacy-token', token: legacyToken } : null;
}

export function clearAdminSession(storage: AdminSessionStorage): void {
  storage.removeItem(ADMIN_SESSION_STORAGE_KEY);
  storage.removeItem(ADMIN_LEGACY_TOKEN_KEY);
}

function isAdminAccountSession(value: unknown): value is AdminAccountSession {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  if (record.kind !== 'account') return false;
  if (typeof record.accessToken !== 'string' || typeof record.refreshToken !== 'string') return false;
  if (typeof record.expiresIn !== 'number' || !record.account || typeof record.account !== 'object') return false;
  const account = record.account as Record<string, unknown>;
  return (
    typeof account.id === 'string' &&
    (typeof account.email === 'string' || account.email === null) &&
    typeof account.nickname === 'string' &&
    typeof account.role === 'string' &&
    typeof account.status === 'string'
  );
}
