"use client";

import { clearCloudSession, cloudMe, hasCloudSession, WebApiError } from "@/lib/api";
import { applyCloudMe, logout } from "@/lib/store";

export type CloudSyncResult = "synced" | "skipped" | "offline" | "invalid";

let syncInFlight: Promise<CloudSyncResult> | null = null;

/**
 * 将当前云端账号的资料、收藏、评分和通知回填到前端状态。
 * 同一时间只允许一次请求，避免登录页和 AppShell 同时水合同一账号。
 */
export function syncCloudSession(): Promise<CloudSyncResult> {
  if (!hasCloudSession()) return Promise.resolve("skipped");
  if (syncInFlight) return syncInFlight;

  const task = (async (): Promise<CloudSyncResult> => {
    try {
      const data = await cloudMe();
      applyCloudMe(data);
      return "synced";
    } catch (error) {
      if (error instanceof WebApiError && error.status === 401) {
        clearCloudSession();
        logout();
        return "invalid";
      }
      // 网络暂时不可用时保留令牌和本地状态，恢复网络后由焦点事件再次同步。
      return "offline";
    }
  })();

  syncInFlight = task;
  void task.then(
    () => {
      if (syncInFlight === task) syncInFlight = null;
    },
    () => {
      if (syncInFlight === task) syncInFlight = null;
    },
  );
  return task;
}
