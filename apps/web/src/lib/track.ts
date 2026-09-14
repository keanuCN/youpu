'use client';

import type { EventName } from '@youpu/schema';
import { API_BASE } from './api';

/**
 * 自研轻埋点 SDK（技术方案 §12.1）：track() → 队列 → 批量 POST /api/events → Redis Stream → PG。
 * 只埋事件字典中声明的事件；匿名 ID 存 localStorage，埋点失败静默丢弃、绝不阻断页面。
 */

const ANON_KEY = 'youpu_anon_id';
const FLUSH_INTERVAL_MS = 3000;
const MAX_QUEUE = 50;

interface QueuedEvent {
  name: EventName;
  props: Record<string, unknown>;
  ts: number;
  path?: string;
}

let queue: QueuedEvent[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
let listenersBound = false;

function getAnonId(): string | null {
  try {
    let id = window.localStorage.getItem(ANON_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(ANON_KEY, id);
    }
    return id;
  } catch {
    // 隐私模式下 localStorage 不可用：本次会话内退化为随机 ID
    return crypto.randomUUID();
  }
}

export function track(name: EventName, props: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  queue.push({ name, props, ts: Date.now(), path: window.location.pathname });
  bindFlushHooks();
  if (queue.length >= MAX_QUEUE) {
    void flush();
    return;
  }
  if (timer === null) {
    timer = setTimeout(() => void flush(), FLUSH_INTERVAL_MS);
  }
}

async function flush(): Promise<void> {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
  if (queue.length === 0) return;
  const anonId = getAnonId();
  if (!anonId) {
    queue = [];
    return;
  }
  const events = queue.splice(0, MAX_QUEUE);
  try {
    await fetch(`${API_BASE}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anonId, events }),
      keepalive: true,
    });
  } catch {
    // 埋点可容忍丢弃
  }
}

function bindFlushHooks(): void {
  if (listenersBound) return;
  listenersBound = true;
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void flush();
  });
}

const exposed = new Set<string>();

/** 列表卡片进入视口 → expose，同页同一产品只报一次 */
export function trackExposeOnce(productId: string, props: Record<string, unknown> = {}): void {
  if (exposed.has(productId)) return;
  exposed.add(productId);
  track('expose', { product_id: productId, ...props });
}
