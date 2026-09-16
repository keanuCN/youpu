import type { AccountPatchInput } from '@youpu/schema';

export interface AccountView {
  id: string;
  email: string | null;
  phone: string | null;
  nickname: string;
  avatarUrl: string | null;
  riderProfile: Record<string, unknown>;
  role: string;
  status: string;
  createdAt: string;
}

export interface AuthRequest {
  headers?: { authorization?: string; 'user-agent'?: string };
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
