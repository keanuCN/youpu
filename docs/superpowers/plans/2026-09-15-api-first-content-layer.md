# API-First Content Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Web browse and gear detail pages read API catalog data when configured, while preserving the local content pack as a validated fallback.

**Architecture:** Add one server-safe content module that selects `pack` or `api`, validates API responses with the shared zod contracts, and maps transport DTOs into the existing `GearItem` view model. Server route pages fetch content and pass it into existing client components; existing local domain data remains the fallback for interactions and transitional fields.

**Tech Stack:** Next.js 14 App Router, TypeScript, Node `node:test` via the existing `tsx` runner, `@youpu/schema` zod contracts, current `GearItem` domain model.

## Global Constraints

- Keep `NEXT_PUBLIC_CONTENT_SOURCE=pack` as the default.
- API failures, non-2xx responses, and schema parse failures must fall back to the local content pack.
- Do not change NestJS controllers, Prisma schema, comments, favorites, rankings, quiz, or comparison behavior in this phase.
- Preserve the existing image proxy changes in `apps/web/src/data/assets.ts`, `apps/web/src/lib/image-url.ts`, and `apps/web/src/app/api/image-proxy/route.ts`.
- Run Web typecheck and all content-layer tests before completion.

---

### Task 1: Content transport and GearItem mapping

**Files:**
- Create: `apps/web/src/lib/content.ts`
- Create: `apps/web/src/lib/content.test.ts`
- Modify: `apps/web/src/lib/api.ts`

**Interfaces:**
- Produces `getCategoryProducts(slug: string): Promise<GearItem[]>`.
- Produces `getProductDetail(id: string): Promise<GearItem | undefined>`.
- Produces `resolveContentSource(): "pack" | "api"`.

- [ ] **Step 1: Write failing tests**

Cover these behaviors in `content.test.ts`:

```ts
test("defaults to the local pack", () => {
  assert.equal(resolveContentSource({}), "pack");
});

test("maps a validated list DTO while preserving local transitional fields", () => {
  const gear = mapProductListItem(apiItem, localGear);
  assert.equal(gear.brand, "Burton");
  assert.equal(gear.composite, 8.7);
  assert.deepEqual(gear.analysis, localGear.analysis);
});

test("falls back to the local pack when the API request fails", async () => {
  const result = await getCategoryProducts("snowboard", { fetcher: failingFetcher });
  assert.deepEqual(result, gearOfCategory("snowboard"));
});
```

Use a small injected `fetcher` option in tests so no database or live API is required.

- [ ] **Step 2: Run the focused test and verify it fails for the missing module/functions**

Run:

```powershell
& '.\\apps\\web\\node_modules\\.bin\\tsx.cmd' --test '.\\apps\\web\\src\\lib\\content.test.ts'
```

Expected: FAIL because `content.ts` and its exported functions do not exist yet.

- [ ] **Step 3: Implement the minimal content module**

Implement:

```ts
export function resolveContentSource(env = process.env): "pack" | "api" {
  return env.NEXT_PUBLIC_CONTENT_SOURCE === "api" ? "api" : "pack";
}

export async function getCategoryProducts(
  slug: string,
  options?: { fetcher?: typeof fetch },
): Promise<GearItem[]>;

export async function getProductDetail(
  id: string,
  options?: { fetcher?: typeof fetch },
): Promise<GearItem | undefined>;
```

Build API URLs from `API_BASE`, call `/api/products?category=<slug>&page=1&pageSize=48` and `/api/products/<id>`, validate with `productListResponseSchema` and `productDetailSchema`, then map the DTO. On any fetch, status, JSON, or schema failure, return the local result. Use the local item with the same slug/id as the base object when available; fill missing API-only items with explicit zero/empty defaults.

- [ ] **Step 4: Run the focused test and verify it passes**

Run the same `tsx --test` command. Expected: all content mapping and fallback tests pass.

- [ ] **Step 5: Run Web typecheck**

Run `pnpm --filter @youpu/web typecheck`. Expected: exit code 0.

### Task 2: Feed server content into browse and detail pages

**Files:**
- Modify: `apps/web/src/app/browse/[slug]/page.tsx`
- Modify: `apps/web/src/app/browse/[slug]/browse-client.tsx`
- Modify: `apps/web/src/app/gear/[id]/page.tsx`
- Modify: `apps/web/src/app/gear/[id]/gear-client.tsx`

**Interfaces:**
- `BrowseClient` accepts `initialPool?: GearItem[]`.
- `GearDetailPage` accepts `initialGear?: GearItem`.

- [ ] **Step 1: Add page integration tests or type-level fixtures for props**

Use the existing content tests to assert that page-level consumers can receive a mapped `GearItem`; keep page tests focused on prop plumbing rather than rendering the entire visual tree.

- [ ] **Step 2: Update the browse server page**

Call `getCategoryProducts(params.slug)` in `BrowsePage` and pass the result as `initialPool`. Keep the existing category metadata and static params behavior unchanged.

- [ ] **Step 3: Update the browse client**

Use `initialPool ?? gearOfCategory(slug)` as the pool. Preserve all existing client-side filter controls, URL sort state, and card behavior.

- [ ] **Step 4: Update the gear server page**

Call `getProductDetail(params.id)` for the page data. Use the resolved gear for metadata and JSON-LD when present; pass it into `GearDetailPage`. Keep local `getGear` as a fallback for metadata if the API is unavailable.

- [ ] **Step 5: Update the gear client**

Use `initialGear ?? gearById(id)` as the primary gear object. Pass that object into `InfoCard`; keep existing local `sameScenePeers`, review, favorite, and compare behavior unchanged.

- [ ] **Step 6: Run typecheck and focused tests**

Run:

```powershell
& '.\\apps\\web\\node_modules\\.bin\\tsx.cmd' --test '.\\apps\\web\\src\\lib\\content.test.ts'
pnpm --filter @youpu/web typecheck
```

Expected: all tests pass and TypeScript exits 0.

### Task 3: Runtime verification and source-mode documentation

**Files:**
- Modify: `apps/web/.env.example`
- Modify: `README.md`

- [ ] **Step 1: Document the content source switch**

Add `NEXT_PUBLIC_CONTENT_SOURCE=pack` to `apps/web/.env.example` with a comment that `api` enables API-first mode and falls back to the pack.

- [ ] **Step 2: Verify pack mode without Docker**

With the current Web dev server, request `/` and `/browse/snowboard`, confirm HTTP 200, and verify the browser still renders local gear cards.

- [ ] **Step 3: Verify API mode fallback without Docker**

Start the Web dev server with `NEXT_PUBLIC_CONTENT_SOURCE=api` while API port `3001` is unavailable. Confirm `/browse/snowboard` and one `/gear/<existing-id>` still render HTTP 200 through the local pack fallback.

- [ ] **Step 4: Run final checks**

Run:

```powershell
& '.\\apps\\web\\node_modules\\.bin\\tsx.cmd' --test '.\\apps\\web\\src\\lib\\content.test.ts'
pnpm --filter @youpu/web typecheck
git diff --check
```

Expected: 0 test failures, typecheck exit 0, and no whitespace errors. Docker/API integration remains a separate environment check after virtualization is enabled.
