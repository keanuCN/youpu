export const ADMIN_ROLES = ['editor', 'admin'] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export interface AdminIdentity {
  accountId: string | null;
  role: AdminRole;
  source: 'account' | 'legacy-token';
}

export function canAccessAdminRole(actual: AdminRole, required: AdminRole): boolean {
  return actual === 'admin' || actual === required;
}
