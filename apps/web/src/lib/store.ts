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
import { BRAND } from "./brand";
import { mockSecret, uid } from "./format";

export const GUEST = "guest";
const STORAGE_KEY = "youpu:store:v1";

export interface Persisted {
  accounts: Account[];
  sessionKey: string | null;
  favorites: Record<string, string[]>;
  dock: Record<string, string[]>;
  history: CompareRecord[];
  userReviews: Review[];
  helpful: Record<string, string[]>;
  votes: Record<string, VoteRecord[]>;
  notifications: AppNotification[];
  quiz: QuizResult[];
}

function demoAccounts(): Account[] {
  return [
    {
      userKey: BRAND.demoEmail,
      username: "档案员 No.42",
      email: BRAND.demoEmail,
      avatarSeed: "demo",
      years: 6,
      heightCm: 176,
      weightKg: 72,
      level: "进阶",
      resort: "崇礼 · 万龙",
      secret: mockSecret(BRAND.demoPassword),
      createdAt: "2025-11-02T08:00:00Z",
    },
  ];
}

function seedNotifications(): AppNotification[] {
  return [
    {
      id: "n-seed-1",
      userKey: BRAND.demoEmail,
      type: "reply",
      title: "你的评论被回复",
      body: "「一季三十天」回复了你关于 Jones Mountain Twin 的评论",
      link: "/gear/sb-02",
      read: false,
      createdAt: "2026-02-16T03:20:00Z",
    },
    {
      id: "n-seed-2",
      userKey: BRAND.demoEmail,
      type: "helpful",
      title: "你的评论被标记为有帮助",
      body: "有 12 人觉得你对 Nitro Team 的评价有帮助",
      link: "/gear/sb-11",
      read: false,
      createdAt: "2026-02-14T09:05:00Z",
    },
    {
      id: "n-seed-3",
      userKey: BRAND.demoEmail,
      type: "new_review",
      title: "你收藏的装备有新评论",
      body: "Burton Custom Camber 新增 3 条实测评论",
      link: "/gear/sb-01",
      read: true,
      createdAt: "2026-02-10T11:40:00Z",
    },
    {
      id: "n-seed-4",
      userKey: BRAND.demoEmail,
      type: "ranking",
      title: "2026 雪季榜单已更新",
      body: "综合榜与全山地榜的名次发生变化，来看看你投的板子排第几",
      link: "/rankings",
      read: true,
      createdAt: "2026-02-08T06:00:00Z",
    },
  ];
}

function initial(): Persisted {
  return {
    accounts: demoAccounts(),
    sessionKey: null,
    favorites: { [BRAND.demoEmail]: ["sb-01", "sb-07", "sb-11"] },
    dock: { [GUEST]: [], [BRAND.demoEmail]: [] },
    history: [
      {
        id: "h-seed-1",
        userKey: BRAND.demoEmail,
        categorySlug: "snowboard",
        gearIds: ["sb-01", "sb-02", "sb-11"],
        createdAt: "2026-02-15T07:12:00Z",
      },
      {
        id: "h-seed-2",
        userKey: BRAND.demoEmail,
        categorySlug: "snowboard",
        gearIds: ["sb-03", "sb-14"],
        createdAt: "2026-02-09T13:44:00Z",
      },
    ],
    userReviews: [],
    helpful: {},
    votes: { [BRAND.demoEmail]: [{ categorySlug: "snowboard", rankKey: "overall", season: "2026", gearId: "sb-01", changed: false }] },
    notifications: seedNotifications(),
    quiz: [],
  };
}

/** 服务端 / 首帧用的确定性游客空态（同引用，避免 useSyncExternalStore 死循环） */
let guestStateSingleton: Persisted | null = null;
export function guestState(): Persisted {
  guestStateSingleton ??= {
    accounts: demoAccounts(),
    sessionKey: null,
    favorites: {},
    dock: {},
    history: [],
    userReviews: [],
    helpful: {},
    votes: {},
    notifications: [],
    quiz: [],
  };
  return guestStateSingleton;
}

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

export function register(email: string, password: string, username?: string): AuthResult {
  const key = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) return { ok: false, message: "邮箱格式不正确" };
  if (password.length < 6) return { ok: false, message: "密码至少 6 位" };
  if (state.accounts.some((a) => a.userKey === key)) return { ok: false, message: "该邮箱已注册，请直接登录" };
  const prefix = key.split("@")[0]?.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 16);
  const account: Account = {
    userKey: key,
    username: username?.trim() || `${prefix || "rider"}_${Math.random().toString(36).slice(2, 6)}`,
    email: key,
    avatarSeed: prefix || "rider",
    years: 1,
    heightCm: 175,
    weightKg: 70,
    level: "中级",
    resort: "",
    secret: mockSecret(password),
    createdAt: new Date().toISOString(),
  };
  emit({
    accounts: [...state.accounts, account],
    sessionKey: key,
    favorites: { ...state.favorites, [key]: [] },
    dock: { ...state.dock, [key]: [] },
    helpful: { ...state.helpful, [key]: [] },
    votes: { ...state.votes, [key]: [] },
  });
  return { ok: true };
}

export function login(email: string, password: string): AuthResult {
  const key = email.trim().toLowerCase();
  const account = state.accounts.find((a) => a.userKey === key);
  if (!account) return { ok: false, message: "该邮箱尚未注册" };
  if (account.secret !== mockSecret(password)) return { ok: false, message: "密码不正确" };
  emit({ sessionKey: key });
  return { ok: true };
}

export function logout(): void {
  emit({ sessionKey: null });
}

export function resetPassword(email: string, password: string): AuthResult {
  const key = email.trim().toLowerCase();
  const account = state.accounts.find((a) => a.userKey === key);
  if (!account) return { ok: false, message: "该邮箱尚未注册" };
  if (password.length < 6) return { ok: false, message: "密码至少 6 位" };
  emit({
    accounts: state.accounts.map((a) => (a.userKey === key ? { ...a, secret: mockSecret(password) } : a)),
  });
  return { ok: true };
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
  emit({ dock: { ...state.dock, [key]: [...list, gearId] } });
  void categorySlug;
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
