import assert from "node:assert/strict";
import test from "node:test";

import { WebApiError, type CloudMeResponse } from "./api";
import { createCloudSessionSync } from "./cloud-sync";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });
  return { promise, resolve, reject };
}

const cloudMeResponse = {
  account: {
    id: "account-a",
    email: "a@example.com",
    nickname: "账号 A",
    avatarUrl: null,
    riderProfile: {},
    role: "user",
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  favorites: [],
  recommendationRuns: [],
  notifications: [],
  ratings: [],
} satisfies CloudMeResponse;

test("ignores a delayed response after the active session changes", async () => {
  let token: string | null = "token-a";
  let version = 1;
  const pending = deferred<CloudMeResponse>();
  const applied: CloudMeResponse[] = [];
  const sync = createCloudSessionSync({
    getAccessToken: () => token,
    getSessionVersion: () => version,
    cloudMe: () => pending.promise,
    applyCloudMe: (data) => applied.push(data),
    clearCloudSession: () => {
      token = null;
      version += 1;
    },
    logout: () => undefined,
  });

  const task = sync();
  token = "token-b";
  version += 1;
  pending.resolve(cloudMeResponse);

  assert.equal(await task, "skipped");
  assert.deepEqual(applied, []);
});

test("does not clear the current session when an old request returns 401", async () => {
  let token: string | null = "token-a";
  let version = 1;
  const pending = deferred<CloudMeResponse>();
  let clearCount = 0;
  let logoutCount = 0;
  const sync = createCloudSessionSync({
    getAccessToken: () => token,
    getSessionVersion: () => version,
    cloudMe: () => pending.promise,
    applyCloudMe: () => undefined,
    clearCloudSession: () => {
      clearCount += 1;
      token = null;
      version += 1;
    },
    logout: () => {
      logoutCount += 1;
    },
  });

  const task = sync();
  token = "token-b";
  version += 1;
  pending.reject(new WebApiError("unauthorized", 401));

  assert.equal(await task, "skipped");
  assert.equal(clearCount, 0);
  assert.equal(logoutCount, 0);
});
