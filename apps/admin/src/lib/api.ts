import type {
  AdminBrandInput,
  AdminBrandPatch,
  AdminCategoryInput,
  AdminCategoryPatch,
  AdminProductInput,
  AdminProductPatch,
} from '@youpu/schema';
import type { AdminSessionAccount } from './admin-session';

const configuredBase = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3001';
export const API_BASE = configuredBase.replace(/\/$/, '');

export interface AdminSessionResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  account: AdminSessionAccount;
}

export class AdminApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly detail?: unknown,
  ) {
    super(message);
    this.name = 'AdminApiError';
  }
}

export interface AdminDashboard {
  metrics: {
    products: number;
    publishedProducts: number;
    drafts: number;
    brands: number;
    categories: number;
    dataQuality: {
      noVisualAsset: number;
      noPrice: number;
      noSource: number;
      noEditorialScores: number;
    };
  };
  recentProducts: Array<{
    id: string;
    slug: string;
    title: string;
    model: string;
    year: number;
    status: 'draft' | 'published';
    updatedAt: string;
    brand: { slug: string; name: string; nameCn: string | null };
    category: { slug: string; name: string };
  }>;
}

export type AdminAccountRole = 'user' | 'editor' | 'admin';
export type AdminAccountStatus = 'active' | 'pending' | 'disabled';

export interface AdminAccount {
  id: string;
  email: string | null;
  nickname: string;
  role: AdminAccountRole;
  status: AdminAccountStatus;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  before: unknown;
  after: unknown;
  ip: string | null;
  createdAt: string;
  actor: {
    id: string;
    nickname: string;
    email: string | null;
    role: string;
  };
}

export interface AdminAuditLogResponse {
  total: number;
  page: number;
  pageSize: number;
  items: AdminAuditLog[];
}

export interface AdminAnalytics {
  rangeDays: number;
  from: string;
  to: string;
  summary: {
    events: number;
    uniqueVisitors: number;
    productViews: number;
    activeAccounts: number;
  };
  funnel: {
    exposedVisitors: number;
    clickedVisitors: number;
    viewedVisitors: number;
    intentVisitors: number;
    clickRate: number | null;
    viewRate: number | null;
    intentRate: number | null;
  };
  engagement: {
    searches: number;
    recommendStarts: number;
    recommendCompletions: number;
    recommendCompletionRate: number | null;
    signups: number;
    ratings: number;
    replies: number;
  };
  daily: Array<{
    date: string;
    visitors: number;
    events: number;
    productViews: number;
  }>;
  eventBreakdown: Array<{ name: string; count: number }>;
  topPaths: Array<{ path: string; count: number }>;
  topProducts: Array<{ productId: string; title: string | null; brand: string; count: number }>;
  recentEvents: Array<{
    visitor: string;
    name: string;
    path: string | null;
    productId: string | null;
    createdAt: string;
  }>;
  system: {
    status: 'ok' | 'degraded';
    checkedAt: string;
    uptimeSeconds: number;
    nodeVersion: string;
    memory: { rssMb: number; heapUsedMb: number; heapTotalMb: number };
    services: {
      api: boolean;
      database: boolean;
      redis: boolean;
      elasticsearch: boolean;
      elasticsearchEnabled: boolean;
    };
    queue: { outboxPending: number | null; eventStreamLength: number | null };
  };
}

export interface AdminProductSummary {
  id: string;
  slug: string;
  model: string;
  year: number;
  title: string;
  oneLiner: string | null;
  priceMin: number | null;
  priceMax: number | null;
  priceCurrency: 'CNY';
  coverUrl: string | null;
  specs: Record<string, unknown>;
  editorialScores: Record<string, number> | null;
  status: 'draft' | 'published';
  dataSource: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  brand: { slug: string; name: string; nameCn: string | null };
  category: { slug: string; name: string };
  imageCount: number;
  coverImage: {
    id: string;
    url: string;
    kind: string;
    alt: string | null;
    source: string | null;
    sortOrder: number;
  } | null;
  quality: {
    missing: Array<'image' | 'price' | 'source' | 'scores'>;
  };
}

export interface AdminProductDetail extends Omit<AdminProductSummary, 'coverImage'> {
  images: Array<{
    id: string;
    url: string;
    kind: string;
    alt: string | null;
    source: string | null;
    sortOrder: number;
  }>;
  specSchema: unknown;
}

export interface AdminProductListResponse {
  total: number;
  page: number;
  pageSize: number;
  items: AdminProductSummary[];
}

export interface AdminBrandRecord {
  id: string;
  slug: string;
  name: string;
  nameCn: string | null;
  country: string | null;
  logoUrl: string | null;
  officialUrl: string | null;
  description: string | null;
  status: 'active' | 'inactive';
  productCount?: number;
}

export interface AdminCategoryRecord {
  id: string;
  parentId: string | null;
  parent: { id: string; slug: string; name: string } | null;
  slug: string;
  name: string;
  level: number;
  coverUrl: string | null;
  sortOrder: number;
  status: 'active' | 'inactive';
  specSchema: unknown;
  recommendConfig: unknown;
  productCount: number;
  childCount: number;
}

export interface AdminReport {
  id: string;
  targetType: string;
  targetId: string;
  reporterId: string;
  reason: string;
  note: string | null;
  status: 'open' | 'resolved' | 'dismissed';
  createdAt: string;
  handledAt: string | null;
  reporter: { id: string; nickname: string; email: string | null };
  handler: { id: string; nickname: string } | null;
}

export interface AdminModerationRating {
  id: string;
  overall: number;
  content: string | null;
  helpfulCount: number;
  status: 'published' | 'hidden' | 'rejected';
  moderationRisk: 'clear' | 'watch';
  moderationReasons: string[];
  riderProfile: Record<string, unknown>;
  createdAt: string;
  account: { id: string; nickname: string; email: string | null };
  product: { id: string; slug: string; title: string };
}

export type AdminProductFormInput = AdminProductInput;
export type AdminProductFormPatch = AdminProductPatch;
export type AdminBrandFormInput = AdminBrandInput;
export type AdminBrandFormPatch = AdminBrandPatch;
export type AdminCategoryFormInput = AdminCategoryInput;
export type AdminCategoryFormPatch = AdminCategoryPatch;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
}

export async function adminFetch<T>(token: string, path: string, options: RequestOptions = {}): Promise<T> {
  return requestJson<T>(`${API_BASE}/api/admin${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function adminLogin(email: string, password: string): Promise<AdminSessionResponse> {
  return requestJson<AdminSessionResponse>(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    body: { email, password },
  });
}

export function adminRefresh(refreshToken: string): Promise<AdminSessionResponse> {
  return requestJson<AdminSessionResponse>(`${API_BASE}/api/auth/refresh`, {
    method: 'POST',
    body: { refreshToken },
  });
}

export function adminLogout(refreshToken: string): Promise<{ ok: true }> {
  return requestJson<{ ok: true }>(`${API_BASE}/api/auth/logout`, {
    method: 'POST',
    body: { refreshToken },
  });
}

async function requestJson<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers ?? {}),
  };
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: 'no-store',
    });
  } catch (error) {
    throw new AdminApiError(`无法连接 API：${API_BASE}`, 0, error);
  }

  const text = await response.text();
  let payload: unknown = undefined;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }
  if (!response.ok) {
    const message = getErrorMessage(payload) ?? `API 请求失败（${response.status}）`;
    throw new AdminApiError(message, response.status, payload);
  }
  return payload as T;
}

function getErrorMessage(payload: unknown): string | undefined {
  if (typeof payload === 'string') return payload;
  if (!payload || typeof payload !== 'object') return undefined;
  const record = payload as Record<string, unknown>;
  if (typeof record.message === 'string') return record.message;
  if (Array.isArray(record.message)) return record.message.filter((item) => typeof item === 'string').join('；');
  return undefined;
}

export function buildProductQuery(params: {
  search?: string;
  status?: string;
  categorySlug?: string;
  brandSlug?: string;
  missing?: string;
  page?: number;
  pageSize?: number;
}): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') query.set(key, String(value));
  }
  const suffix = query.toString();
  return suffix ? `?${suffix}` : '';
}
