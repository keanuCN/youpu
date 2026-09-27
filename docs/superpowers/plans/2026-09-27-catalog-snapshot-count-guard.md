# Catalog Snapshot Count Guard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent an API catalog export from replacing a larger checked-in snapshot with a smaller, technically complete but incomplete catalog unless the operator explicitly confirms the decrease.

**Architecture:** Add a pure decision helper to the existing web build policy module. The exporter compares its deduplicated API result count with the checked-in snapshot metadata before writing; a decrease aborts with an actionable error unless `CONTENT_EXPORT_ALLOW_COUNT_DECREASE=true`.

**Tech Stack:** TypeScript, `tsx`, Node.js built-in test runner.

## Global Constraints

- Preserve the existing snapshot when the API count is lower and no explicit override is set.
- An explicit override is exactly `CONTENT_EXPORT_ALLOW_COUNT_DECREASE=true`.
- Do not seed or mutate the database as part of this change.
- Do not commit or modify unrelated dirty worktree files.

---

### Task 1: Guard catalog snapshot count decreases

**Files:**
- Modify: `apps/web/scripts/catalog-build-policy.ts`
- Modify: `apps/web/scripts/catalog-build-policy.test.ts`
- Modify: `apps/web/scripts/export-catalog-snapshot.ts`
- Modify: `docs/前台目录快照刷新流程.md`

**Interfaces:**
- Add `shouldRejectCatalogCountDecrease(existingCount: number, incomingCount: number, env: { CONTENT_EXPORT_ALLOW_COUNT_DECREASE?: string }): boolean`.
- The exporter reads `CATALOG_SNAPSHOT_META.total` and checks the deduplicated API item count before creating directories or writing output.

- [x] **Step 1: Add failing policy tests**

```ts
test("默认拒绝会减少目录快照产品数的导出", () => {
  assert.equal(shouldRejectCatalogCountDecrease(235, 97, {}), true);
  assert.equal(shouldRejectCatalogCountDecrease(97, 235, {}), false);
  assert.equal(shouldRejectCatalogCountDecrease(97, 97, {}), false);
});

test("显式确认后允许减少目录快照产品数", () => {
  assert.equal(
    shouldRejectCatalogCountDecrease(235, 97, { CONTENT_EXPORT_ALLOW_COUNT_DECREASE: "true" }),
    false,
  );
  assert.equal(
    shouldRejectCatalogCountDecrease(235, 97, { CONTENT_EXPORT_ALLOW_COUNT_DECREASE: "1" }),
    true,
  );
});
```

- [x] **Step 2: Run the focused policy test and confirm it fails because the helper is missing**

Run from `apps/web`: `node --import tsx --test scripts/catalog-build-policy.test.ts`

- [x] **Step 3: Implement the helper and exporter guard**

```ts
export function shouldRejectCatalogCountDecrease(
  existingCount: number,
  incomingCount: number,
  env: { CONTENT_EXPORT_ALLOW_COUNT_DECREASE?: string },
): boolean {
  return incomingCount < existingCount && env.CONTENT_EXPORT_ALLOW_COUNT_DECREASE !== "true";
}
```

Before writing the output, if the helper returns `true`, throw an error that reports both counts and tells the operator to set `CONTENT_EXPORT_ALLOW_COUNT_DECREASE=true` only after verifying the intended removals.

Document the count-decrease protection and explicit override in `docs/前台目录快照刷新流程.md`.

- [x] **Step 4: Re-run the focused policy test and inspect the diff**

Run from `apps/web`: `node --import tsx --test scripts/catalog-build-policy.test.ts`

Expected: all policy tests pass; the exporter guard occurs before `mkdir` / `writeFile`.
