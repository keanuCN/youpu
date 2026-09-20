"use client";

import {
  clearCloudSession,
  cloudMe,
  getCloudAccessToken,
  getCloudSessionVersion,
  WebApiError,
  type CloudMeResponse,
} from "@/lib/api";
import { applyCloudMe, logout } from "@/lib/store";

export type CloudSyncResult = "synced" | "skipped" | "offline" | "invalid";

export interface CloudSyncDependencies {
  getAccessToken: () => string | null;
  getSessionVersion: () => number;
  cloudMe: () => Promise<CloudMeResponse>;
  applyCloudMe: (data: CloudMeResponse) => void;
  clearCloudSession: () => void;
  logout: () => void;
}

interface InFlightSync {
  accessToken: string;
  sessionVersion: number;
  task: Promise<CloudSyncResult>;
}

export function createCloudSessionSync(deps: CloudSyncDependencies): () => Promise<CloudSyncResult> {
  let syncInFlight: InFlightSync | null = null;

  return function syncCloudSessionForCurrentAccount(): Promise<CloudSyncResult> {
    const accessToken = deps.getAccessToken();
    if (!accessToken) return Promise.resolve("skipped");

    const sessionVersion = deps.getSessionVersion();
    if (
      syncInFlight &&
      syncInFlight.accessToken === accessToken &&
      syncInFlight.sessionVersion === sessionVersion
    ) {
      return syncInFlight.task;
    }

    const isCurrentSession = () =>
      deps.getAccessToken() === accessToken && deps.getSessionVersion() === sessionVersion;

    const task = (async (): Promise<CloudSyncResult> => {
      try {
        const data = await deps.cloudMe();
        if (!isCurrentSession()) return "skipped";
        deps.applyCloudMe(data);
        return "synced";
      } catch (error) {
        if (!isCurrentSession()) return "skipped";
        if (error instanceof WebApiError && error.status === 401) {
          deps.clearCloudSession();
          deps.logout();
          return "invalid";
        }
        // 网络暂时不可用时保留令牌和本地状态，恢复网络后由焦点事件再次同步。
        return "offline";
      }
    })();

    syncInFlight = { accessToken, sessionVersion, task };
    void task.then(
      () => {
        if (syncInFlight?.task === task) syncInFlight = null;
      },
      () => {
        if (syncInFlight?.task === task) syncInFlight = null;
      },
    );
    return task;
  };
}

const syncCurrentCloudSession = createCloudSessionSync({
  getAccessToken: getCloudAccessToken,
  getSessionVersion: getCloudSessionVersion,
  cloudMe,
  applyCloudMe,
  clearCloudSession,
  logout,
});

/**
 * 将当前云端账号的资料、收藏、评分和通知回填到前端状态。
 * 同一会话只允许一次请求；账号切换后会启动新的同步，旧响应不会覆盖当前账号。
 */
export function syncCloudSession(): Promise<CloudSyncResult> {
  return syncCurrentCloudSession();
}
