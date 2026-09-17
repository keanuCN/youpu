import type { AccountPatchInput } from '@youpu/schema';

export interface AccountView {
  id: string;
  email: string | null;
  nickname: string;
  avatarUrl: string | null;
  riderProfile: Record<string, unknown>;
  role: string;
  status: string;
  createdAt: string;
}

export interface AuthRequest {
  headers?: { authorization?: string; 'user-agent'?: string; 'x-forwarded-for'?: string };
  ip?: string;
  account?: AccountView;
  accountId?: string;
}

export interface SessionResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  account: AccountView;
}

export type AccountPatch = AccountPatchInput;
