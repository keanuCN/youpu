/**
 * 本地持久化状态仓库（原型阶段）。
 * 收藏 / 对比坞 / 对比历史 / 评论 / 有帮助 / 投票 / 通知 / 问卷结果 / 账号 全部存 localStorage，
 * 通过 useSyncExternalStore 暴露给 React。
 *
 * SSR 注意事项：服务端与客户端首帧统一使用「游客空态」（guestState），
 * 挂载后再切换到真实 state —— 保证服务端 HTML 与首帧客户端渲染一致，避免水合不一致。
 * 接云端时只需替换本文件的读写实现。
 */
import { useEffect, useState, useSyncExternalStore } from "react";
import type {
  Account,
  AppNotification,
  CompareRecord,
  Profile,
  QuizResult,
  Review,
  ReviewerMeta,
  VoteRecord,
} from "@/types";
import { uid } from "./format";
import { GUEST, guestState, initial, type Persisted } from "./persisted";
import type { CloudAccount, CloudMeResponse } from "./api";
import { GEAR } from "@/data/boards";

export type { Persisted } from "./persisted";
export { GUEST };
const STORAGE_KEY = "youpu:store:v1";

function load(): Persisted {
  if (typeof window === "undefined") return guestState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial();
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return { ...initial(), ...parsed };
  } catch {
    return initial();
  }
}

let state: Persisted = load();
let storageOk = true;
const listeners = new Set<() => void>();

function persist(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    storageOk = true;
  } catch {
    storageOk = false;
  }
}

function emit(next: Partial<Persisted>): void {
  state = { ...state, ...next };
  persist();
  listeners.forEach((l) => l());
}

export function isStorageAvailable(): boolean {
  return storageOk;
}

/** 将本地 API 返回的账号映射进现有前端状态，保留原型页的同步派生逻辑。 */
export function applyCloudAccount(account: CloudAccount): void {
  const accountKey = account.email ?? account.id;
  const email = account.email ?? "";
  const rider = account.riderProfile ?? {};
  const levelMap: Record<string, string> = {
    beginner: "新手",
    intermediate: "中级",
    advanced: "进阶",
    expert: "高阶",
  };
  const prefix =
    email.split("@")[0]?.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 16) ||
    "rider_user";
  const next: Account = {
    userKey: accountKey,
    username: account.nickname,
    email,
    avatarSeed: prefix,
    years: Number(rider.years ?? 1),
    heightCm: Number(rider.height ?? 175),
    weightKg: Number(rider.weight ?? 70),
    level: levelMap[String(rider.level ?? "intermediate")] ?? String(rider.level ?? "中级"),
    resort: String(rider.home_resort ?? ""),
    secret: "cloud",
    createdAt: account.createdAt,
    remoteId: account.id,
    cloud: true,
  };
  const existing = state.accounts.find((item) => item.userKey === accountKey);
  emit({
    accounts: existing
      ? state.accounts.map((item) => (item.userKey === accountKey ? { ...item, ...next } : item))
      : [...state.accounts, next],
    sessionKey: accountKey,
    favorites: { ...state.favorites, [accountKey]: state.favorites[accountKey] ?? [] },
    dock: { ...state.dock, [accountKey]: state.dock[accountKey] ?? [] },
    helpful: { ...state.helpful, [accountKey]: state.helpful[accountKey] ?? [] },
    votes: { ...state.votes, [accountKey]: state.votes[accountKey] ?? [] },
  });
}

export function applyCloudMe(data: CloudMeResponse): void {
  applyCloudAccount(data.account);
  const key = data.account.email ?? data.account.id;
  const slugForGear = (gear: (typeof GEAR)[number]) =>
    `${gear.brand}-${gear.model}-${gear.year}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const favorites = data.favorites.map((item) => {
    const local = GEAR.find((gear) => slugForGear(gear) === item.slug);
    return local?.id ?? item.slug;
  });
  const notifications: AppNotification[] = data.notifications.map((item) => {
    const payload = item.payload ?? {};
    const productSlug = typeof payload.productSlug === "string" ? payload.productSlug : undefined;
    const local = productSlug ? GEAR.find((gear) => slugForGear(gear) === productSlug) : undefined;
    const actorName = item.actor?.nickname ?? (typeof payload.actorName === "string" ? payload.actorName : "有人");
    const copy = notificationCopy(item.type, actorName, payload);
    return {
      id: `cloud-${item.id}`,
      userKey: key,
      type: copy.type,
      title: copy.title,
      body: copy.body,
      link: local ? `/gear/${local.id}` : productSlug ? `/gear/${productSlug}` : "/me",
      read: item.read,
      createdAt: item.createdAt,
    };
  });
  const ratings: Review[] = data.ratings.map((item) => {
    const local = GEAR.find((gear) => slugForGear(gear) === item.productSlug);
    const rider = item.riderProfile;
    const levelMap: Record<string, string> = { beginner: "新手", intermediate: "中级", advanced: "进阶", expert: "高阶" };
    return {
      id: item.id,
      gearId: local?.id ?? item.productSlug,
      userKey: key,
      authorName: data.account.nickname,
      authorMeta: {
        years: Number(rider.years ?? 1),
        heightCm: Number(rider.height ?? 0),
        weightKg: Number(rider.weight ?? 0) || undefined,
        level: levelMap[String(rider.level ?? "intermediate")] ?? "中级",
        resort: String(rider.home_resort ?? ""),
      },
      rating: item.overall,
      content: item.content ?? "",
      images: item.images ?? [],
      parentId: null,
      createdAt: item.createdAt,
      seedHelpful: item.helpfulCount,
    };
  });
  const cloudRatingIds = new Set(ratings.map((item) => item.id));
  emit({
    favorites: { ...state.favorites, [key]: favorites },
    notifications: [...state.notifications.filter((item) => item.userKey !== key), ...notifications],
    userReviews: [...ratings, ...state.userReviews.filter((item) => item.userKey !== key && !cloudRatingIds.has(item.id))],
  });
}

function notificationCopy(type: string, actorName: string, payload: Record<string, unknown>): { type: AppNotification["type"]; title: string; body: string } {
  if (type === "reply") return { type: "reply", title: "你的评论被回复", body: `${actorName} 回复了你的实测评论` };
  if (type === "helpful") return { type: "helpful", title: "你的评论被标记为有帮助", body: `${actorName} 觉得你的评价有帮助` };
  if (type === "new_review") {
    const title = typeof payload.productTitle === "string" ? payload.productTitle : "你收藏的装备";
    return { type: "new_review", title: "你收藏的装备有新评论", body: `${title} 新增了一条实测评论` };
  }
  return { type: "ranking", title: "有谱通知", body: "你的账号有一条新的动态" };
}

export function subscribe(l: () => void): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function getState(): Persisted {
  return state;
}

/**
 * 挂载前返回游客空态（与服务端一致），挂载后返回真实本机数据。
 */
export function usePersisted(): Persisted {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const snapshot = useSyncExternalStore(subscribe, getState, guestState);
  return mounted ? snapshot : guestState();
}

export interface CurrentUser {
  sessionKey: string | null;
  userKey: string;
  profile: Profile | null;
  dockIds: string[];
  favoriteIds: string[];
  votes: VoteRecord[];
  helpfulIds: string[];
  notifications: AppNotification[];
  isFavorite: (gearId: string) => boolean;
}

/** 当前用户视角的派生状态（水合安全的唯一读入口） */
export function useCurrentUser(): CurrentUser {
  const p = usePersisted();
  const key = p.sessionKey ?? GUEST;
  const raw = p.sessionKey ? p.accounts.find((a) => a.userKey === p.sessionKey) : undefined;
  let profile: Profile | null = null;
  if (raw) {
    const { secret: _secret, ...rest } = raw;
    profile = rest;
  }
  const favoriteIds = p.favorites[key] ?? [];
  return {
    sessionKey: p.sessionKey,
    userKey: key,
    profile,
    dockIds: p.dock[key] ?? [],
    favoriteIds,
    votes: p.votes[key] ?? [],
    helpfulIds: p.helpful[key] ?? [],
    notifications: p.notifications.filter((n) => n.userKey === p.sessionKey),
    isFavorite: (gearId: string) => favoriteIds.includes(gearId),
  };
}

function currentUserKey(): string {
  return state.sessionKey ?? GUEST;
}

// ---------- 账号 ----------

export type AuthResult = { ok: true } | { ok: false; message: string };

export function logout(): void {
  emit({ sessionKey: null });
}

export function updateProfile(patch: Partial<Omit<Profile, "userKey" | "email">>): void {
  const key = state.sessionKey;
  if (!key) return;
  emit({
    accounts: state.accounts.map((a) => (a.userKey === key ? { ...a, ...patch } : a)),
  });
}

// ---------- 收藏 ----------

export function toggleFavorite(gearId: string): boolean {
  const key = currentUserKey();
  const list = state.favorites[key] ?? [];
  const has = list.includes(gearId);
  emit({ favorites: { ...state.favorites, [key]: has ? list.filter((x) => x !== gearId) : [...list, gearId] } });
  return !has;
}

// ---------- 对比坞 ----------

export const DOCK_MAX = 4;

export type DockResult = { ok: true } | { ok: false; reason: "full" | "dup" | "cross" };

export function addToDock(gearId: string, categorySlug: string): DockResult {
  const key = currentUserKey();
  const list = state.dock[key] ?? [];
  if (list.includes(gearId)) return { ok: false, reason: "dup" };
  if (list.length >= DOCK_MAX) return { ok: false, reason: "full" };
  const hasOtherCategory = list.some((id) => {
    const existing = GEAR.find((gear) => gear.id === id);
    return existing ? existing.categorySlug !== categorySlug : false;
  });
  if (hasOtherCategory) return { ok: false, reason: "cross" };
  emit({ dock: { ...state.dock, [key]: [...list, gearId] } });
  return { ok: true };
}

export function removeFromDock(gearId: string): void {
  const key = currentUserKey();
  const list = state.dock[key] ?? [];
  emit({ dock: { ...state.dock, [key]: list.filter((x) => x !== gearId) } });
}

export function clearDock(): void {
  const key = currentUserKey();
  emit({ dock: { ...state.dock, [key]: [] } });
}

export function setDock(ids: string[]): void {
  const key = currentUserKey();
  emit({ dock: { ...state.dock, [key]: ids.slice(0, DOCK_MAX) } });
}

/** 登录后把游客态对比坞合并进账号 */
export function mergeGuestDock(): void {
  const key = state.sessionKey;
  if (!key) return;
  const guest = state.dock[GUEST] ?? [];
  const mine = state.dock[key] ?? [];
  if (!guest.length) return;
  const merged = [...mine];
  for (const g of guest) if (!merged.includes(g) && merged.length < DOCK_MAX) merged.push(g);
  emit({ dock: { ...state.dock, [key]: merged, [GUEST]: [] } });
}

// ---------- 对比历史 ----------

export function recordCompare(categorySlug: string, gearIds: string[]): void {
  const key = currentUserKey();
  if (key === GUEST || gearIds.length < 2) return;
  const signature = [...gearIds].sort().join("|");
  const rest = state.history.filter((h) => !(h.userKey === key && [...h.gearIds].sort().join("|") === signature));
  const record: CompareRecord = {
    id: uid("h"),
    userKey: key,
    categorySlug,
    gearIds,
    createdAt: new Date().toISOString(),
  };
  const mine = [record, ...rest.filter((h) => h.userKey === key)].slice(0, 20);
  emit({ history: [...mine, ...rest.filter((h) => h.userKey !== key)] });
}

// ---------- 评论 ----------

export function addReview(input: {
  gearId: string;
  rating: number;
  content: string;
  images: string[];
  authorName: string;
  authorMeta: ReviewerMeta;
  parentId?: string | null;
}): Review {
  const key = currentUserKey();
  const review: Review = {
    id: uid("r"),
    gearId: input.gearId,
    userKey: key === GUEST ? null : key,
    authorName: input.authorName,
    authorMeta: input.authorMeta,
    rating: input.rating,
    content: input.content,
    images: input.images,
    parentId: input.parentId ?? null,
    createdAt: new Date().toISOString(),
  };
  emit({ userReviews: [review, ...state.userReviews] });
  return review;
}

export function deleteReview(reviewId: string): void {
  const key = currentUserKey();
  emit({ userReviews: state.userReviews.filter((r) => !(r.id === reviewId && r.userKey === key)) });
}

export function toggleHelpful(reviewId: string): boolean {
  const key = currentUserKey();
  const list = state.helpful[key] ?? [];
  const has = list.includes(reviewId);
  emit({ helpful: { ...state.helpful, [key]: has ? list.filter((x) => x !== reviewId) : [...list, reviewId] } });
  return !has;
}

// ---------- 通知 ----------

export function pushNotification(n: Omit<AppNotification, "id" | "read" | "createdAt">): void {
  if (n.userKey === currentUserKey()) return;
  const item: AppNotification = {
    ...n,
    id: uid("n"),
    read: false,
    createdAt: new Date().toISOString(),
  };
  emit({ notifications: [item, ...state.notifications] });
}

export function markNotificationRead(id: string): void {
  emit({ notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) });
}

export function markAllRead(): void {
  const key = currentUserKey();
  emit({ notifications: state.notifications.map((n) => (n.userKey === key ? { ...n, read: true } : n)) });
}

export function deleteNotification(id: string): void {
  emit({ notifications: state.notifications.filter((n) => n.id !== id) });
}

// ---------- 投票 ----------

export function vote(categorySlug: string, rankKey: string, season: string, gearId: string): AuthResult {
  const key = currentUserKey();
  const list = state.votes[key] ?? [];
  const existing = list.find((v) => v.categorySlug === categorySlug && v.rankKey === rankKey && v.season === season);
  if (existing) {
    if (existing.gearId === gearId) return { ok: false, message: "本赛季你已经投过它了" };
    if (existing.changed) return { ok: false, message: "改投机会已用完" };
    const next = list.map((v) => (v === existing ? { ...v, gearId, changed: true } : v));
    emit({ votes: { ...state.votes, [key]: next } });
    return { ok: true };
  }
  emit({ votes: { ...state.votes, [key]: [...list, { categorySlug, rankKey, season, gearId, changed: false }] } });
  return { ok: true };
}

// ---------- 问卷 ----------

export function saveQuiz(result: Omit<QuizResult, "id" | "userKey" | "createdAt">): void {
  const key = currentUserKey();
  const record: QuizResult = {
    ...result,
    id: uid("q"),
    userKey: key,
    createdAt: new Date().toISOString(),
  };
  emit({ quiz: [record, ...state.quiz] });
}
