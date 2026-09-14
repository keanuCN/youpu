/**
 * 本机持久化状态的「纯数据层」：类型、初始数据、服务端/首帧用的游客空态。
 * 不引入任何 React 依赖 —— 服务端组件（sitemap / 结构化数据）也能安全读取确定性数据。
 * 读写与订阅在 lib/store.ts。
 */
import type { Account, AppNotification, CompareRecord, QuizResult, Review, VoteRecord } from "@/types";
import { BRAND } from "./brand";
import { mockSecret } from "./format";

/** 游客态在 favorites/dock/votes 等字典里的键 */
export const GUEST = "guest";

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

export function initial(): Persisted {
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
