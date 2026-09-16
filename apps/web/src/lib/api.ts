/**
 * 后端 API 接入点。
 *
 * 当前前端内容来自 src/data 内容包（原型阶段的站内数据），
 * 唯一实时链路是埋点上报 `track()` → POST /api/events（见 lib/track.ts）。
 * M2 起这里将补齐目录/详情/搜索等接口，内容层改为「API 优先、内容包回退」。
 */
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001";

const ACCESS_TOKEN_KEY = "youpu:auth:access-token";
const REFRESH_TOKEN_KEY = "youpu:auth:refresh-token";

export interface CloudAccount {
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

export interface CloudSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  account: CloudAccount;
}

export interface CloudPhoneCodeResponse {
  ok: true;
  expiresIn: number;
  /** 仅本地开发返回，生产环境由短信服务投递验证码。 */
  devCode?: string;
}

export interface CloudRating {
  id: string;
  productId: string;
  overall: number;
  sub: Record<string, number>;
  content: string | null;
  riderProfile: Record<string, unknown>;
  helpfulCount: number;
  helpfulByMe: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    nickname: string;
    avatarUrl: string | null;
    riderProfile: Record<string, unknown>;
  };
  replies: CloudReply[];
}

export interface CloudReply {
  id: string;
  ratingId: string;
  replyTo: string | null;
  content: string;
  createdAt: string;
  author: { id: string; nickname: string; avatarUrl: string | null };
}

export interface CloudRatingsResponse {
  productId: string;
  productSlug: string;
  summary: { overall: number | null; count: number; distribution: Record<string, number> };
  items: CloudRating[];
}

export interface CloudNotification {
  id: string;
  type: string;
  read: boolean;
  actor: { id: string; nickname: string } | null;
  targetType: string | null;
  targetId: string | null;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface CloudMeResponse {
  account: CloudAccount;
  favorites: Array<{ id: string; slug: string; title: string; model?: string; year?: number; coverUrl?: string | null }>;
  recommendationRuns: unknown[];
  notifications: CloudNotification[];
  ratings: Array<{
    id: string;
    productId: string;
    productSlug: string;
    productTitle: string;
    overall: number;
    content: string | null;
    riderProfile: Record<string, unknown>;
    helpfulCount: number;
    createdAt: string;
  }>;
}

export interface CloudRecommendation {
  productId: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  match: number;
  reasons: string[];
  fallback: boolean;
}

export class WebApiError extends Error {
  constructor(message: string, readonly status: number, readonly detail?: unknown) {
    super(message);
    this.name = "WebApiError";
  }
}

function storage(): Storage | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

export function getCloudAccessToken(): string | null {
  return storage()?.getItem(ACCESS_TOKEN_KEY) ?? null;
}

export function hasCloudSession(): boolean {
  return Boolean(getCloudAccessToken());
}

export function saveCloudSession(session: CloudSession): void {
  storage()?.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  storage()?.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
}

export function clearCloudSession(): void {
  storage()?.removeItem(ACCESS_TOKEN_KEY);
  storage()?.removeItem(REFRESH_TOKEN_KEY);
}

export function productRefForGear(gear: { id: string; brand: string; model: string; year: number }): string {
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(gear.id)) return gear.id;
  return `${gear.brand}-${gear.model}-${gear.year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function request<T>(path: string, options: { method?: string; body?: unknown; retry?: boolean } = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  const accessToken = getCloudAccessToken();
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  let response: Response;
  try {
    response = await fetch(`${API_BASE.replace(/\/$/, "")}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: "no-store",
    });
  } catch (error) {
    throw new WebApiError(`无法连接本地 API：${API_BASE}`, 0, error);
  }

  if (response.status === 401 && options.retry !== false && !path.startsWith("/api/auth/")) {
    const refreshed = await refreshCloudSession();
    if (refreshed) return request<T>(path, { ...options, retry: false });
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
  if (!response.ok) throw new WebApiError(errorMessage(payload) ?? `API 请求失败（${response.status}）`, response.status, payload);
  return payload as T;
}

let refreshInFlight: Promise<boolean> | null = null;

async function refreshCloudSession(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;
  const refreshToken = storage()?.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return false;
  refreshInFlight = (async () => {
    try {
      const session = await request<CloudSession>("/api/auth/refresh", { method: "POST", body: { refreshToken }, retry: false });
      saveCloudSession(session);
      return true;
    } catch {
      clearCloudSession();
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

function errorMessage(payload: unknown): string | undefined {
  if (typeof payload === "string") return payload;
  if (!payload || typeof payload !== "object") return undefined;
  const record = payload as Record<string, unknown>;
  if (typeof record.message === "string") return record.message;
  if (Array.isArray(record.message)) return record.message.filter((item) => typeof item === "string").join("；");
  return undefined;
}

export function cloudRegister(email: string, password: string, nickname?: string): Promise<CloudSession> {
  return request<CloudSession>("/api/auth/register", { method: "POST", body: { email, password, nickname: nickname || undefined } });
}

export function cloudLogin(email: string, password: string): Promise<CloudSession> {
  return request<CloudSession>("/api/auth/login", { method: "POST", body: { email, password } });
}

export function cloudRequestPhoneCode(phone: string): Promise<CloudPhoneCodeResponse> {
  return request<CloudPhoneCodeResponse>("/api/auth/phone/code", { method: "POST", body: { phone } });
}

export function cloudPhoneLogin(phone: string, code: string, nickname?: string): Promise<CloudSession> {
  return request<CloudSession>("/api/auth/phone/login", {
    method: "POST",
    body: { phone, code, nickname: nickname || undefined },
  });
}

export function cloudResetPassword(email: string, password: string): Promise<{ ok: true }> {
  return request<{ ok: true }>("/api/auth/reset-password", { method: "POST", body: { email, password } });
}

export function cloudUpdateMe(input: { nickname?: string; riderProfile?: Record<string, unknown> }): Promise<CloudAccount> {
  return request<CloudAccount>("/api/auth/me", { method: "PATCH", body: input });
}

export async function cloudLogout(): Promise<void> {
  const refreshToken = storage()?.getItem(REFRESH_TOKEN_KEY);
  try {
    if (refreshToken) await request<{ ok: true }>("/api/auth/logout", { method: "POST", body: { refreshToken }, retry: false });
  } finally {
    clearCloudSession();
  }
}

export function cloudMe(): Promise<CloudMeResponse> {
  return request<CloudMeResponse>("/api/me");
}

export function cloudAddFavorite(productRef: string): Promise<{ favorite: boolean; productId: string; productSlug: string }> {
  return request(`/api/products/${encodeURIComponent(productRef)}/favorite`, { method: "POST" });
}

export function cloudRemoveFavorite(productRef: string): Promise<{ favorite: boolean; productId: string; productSlug: string }> {
  return request(`/api/products/${encodeURIComponent(productRef)}/favorite`, { method: "DELETE" });
}

export function cloudRatings(productRef: string, sort: "helpful" | "latest" = "helpful"): Promise<CloudRatingsResponse> {
  return request(`/api/products/${encodeURIComponent(productRef)}/ratings?sort=${sort}`);
}

export function cloudCreateRating(productRef: string, input: { overall: number; content: string; riderProfile: Record<string, unknown> }): Promise<CloudRating> {
  return request(`/api/products/${encodeURIComponent(productRef)}/ratings`, { method: "POST", body: input });
}

export function cloudDeleteRating(id: string): Promise<{ ok: true }> {
  return request(`/api/ratings/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function cloudToggleHelpful(id: string): Promise<{ helpful: boolean; helpfulCount: number }> {
  return request(`/api/ratings/${encodeURIComponent(id)}/helpful`, { method: "POST" });
}

export function cloudCreateReply(id: string, content: string, replyTo?: string | null): Promise<CloudReply> {
  return request(`/api/ratings/${encodeURIComponent(id)}/replies`, { method: "POST", body: { content, replyTo } });
}

export function cloudCreateReport(targetType: "rating" | "reply", targetId: string, reason: string, note?: string): Promise<unknown> {
  return request("/api/reports", { method: "POST", body: { targetType, targetId, reason, note } });
}

export function cloudRecommendations(categorySlug: string, answers: Record<string, unknown>): Promise<{ categorySlug: string; picks: CloudRecommendation[] }> {
  return request("/api/recommendations", { method: "POST", body: { categorySlug, answers } });
}

export function cloudMarkNotificationRead(id: string, read = true): Promise<{ ok: true }> {
  return request(`/api/me/notifications/${encodeURIComponent(id)}`, { method: "PATCH", body: { read } });
}

export function cloudMarkAllNotificationsRead(): Promise<{ ok: true; count: number }> {
  return request("/api/me/notifications/read-all", { method: "POST" });
}
