# 社区评论、评分、收藏闭环实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有账号、评论、评分、收藏、举报、通知和后台审核基础上，完成即时发布、风险标记、审核处理、评分筛选、收藏同步和幂等通知的一条完整社区闭环。

**Architecture:** 保留当前 API 路径、Prisma 数据模型边界、Redis 连接、outbox worker 和前台本地内容包回退。新增纯函数负责评论风险与相似度排序，CommunityService 负责事务和权限，outbox NotificationConsumer 负责幂等落库，前台和后台只消费明确的 API 契约。

**Tech Stack:** NestJS 10、Prisma 5、PostgreSQL、Redis/ioredis、Zod、Next.js 14、React 18、TypeScript、Node `node:test`。

## Global Constraints

- 评论和回复默认发布后立即展示；风险命中只标记和入队，不自动隐藏。
- 只有 `published` 评论和回复参与前台展示、评分统计和“最有帮助”排序。
- 每个账号对同一产品只能保留一条评分；重复提交沿用更新逻辑。
- 新评论、回复和“有帮助”通知不得发送给操作人本人。
- outbox 重试不得产生重复通知；通知必须携带可跳转的目标信息。
- Redis 不可用时不能绕过账号与内容权限；限频失败按项目现有服务错误策略返回可理解错误。
- 后台审核变更只能由 `admin` 角色执行，所有变更写入审计日志。
- 后台管理新增和修改文案使用中文，不增加不必要的英文装饰标签。
- 不引入 AI 审核、私信、关注关系或新的外部服务。
- 不执行数据库重置、不删除现有数据、不覆盖现有 `.env`。

---

### Task 1: 固化社区查询契约并增加数据库字段

**Files:**
- Modify: `packages/schema/src/community.ts`
- Create: `packages/schema/src/community.test.ts`
- Modify: `apps/api/prisma/schema.prisma:197-330,393-403`
- Create: `apps/api/prisma/migrations/20260920010000_community_moderation_loop/migration.sql`

**Interfaces:**
- Produces `ratingListQuerySchema`, `ratingListQueryInput`, `moderationRiskSchema` and `ModerationRisk` for API and web consumers.
- Produces Prisma fields `moderationRisk`, `moderationReasons`, `moderationCheckedAt`, `handledAt` and `sourceEventId` used by later tasks.

- [ ] **Step 1: Write failing schema tests**

Add these cases to `packages/schema/src/community.test.ts`:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { ratingListQuerySchema, moderationRiskSchema } from './community';

test('rating list query applies stable defaults', () => {
  assert.deepEqual(ratingListQuerySchema.parse({}), {
    sort: 'helpful',
    profile: 'all',
  });
});

test('rating list query accepts similar sorting and level filtering', () => {
  assert.deepEqual(ratingListQuerySchema.parse({ sort: 'similar', profile: 'complete', level: 'advanced' }), {
    sort: 'similar',
    profile: 'complete',
    level: 'advanced',
  });
});

test('rating list query rejects unknown query values', () => {
  assert.equal(ratingListQuerySchema.safeParse({ sort: 'random' }).success, false);
  assert.equal(ratingListQuerySchema.safeParse({ profile: 'full' }).success, false);
});

test('moderation risk only accepts clear or watch', () => {
  assert.equal(moderationRiskSchema.safeParse('clear').success, true);
  assert.equal(moderationRiskSchema.safeParse('watch').success, true);
  assert.equal(moderationRiskSchema.safeParse('blocked').success, false);
});
```

- [ ] **Step 2: Run the focused schema test and verify it fails**

Run: `pnpm --filter @youpu/schema exec tsx --test src/community.test.ts`

Expected: FAIL because the new schemas are not exported yet.

- [ ] **Step 3: Add the shared schemas**

Append to `packages/schema/src/community.ts`:

```ts
export const moderationRiskSchema = z.enum(['clear', 'watch']);
export type ModerationRisk = z.infer<typeof moderationRiskSchema>;

export const ratingListQuerySchema = z.object({
  sort: z.enum(['helpful', 'latest', 'similar']).default('helpful'),
  profile: z.enum(['all', 'complete']).default('all'),
  level: riderProfileSchema.shape.level.optional(),
}).strict();
export type RatingListQueryInput = z.infer<typeof ratingListQuerySchema>;
```

- [ ] **Step 4: Add Prisma fields and the hand-written migration**

Add to both `Rating` and `RatingReply`:

```prisma
moderationRisk        String   @default("clear") @map("moderation_risk")
moderationReasons     Json     @default("[]") @map("moderation_reasons")
moderationCheckedAt   DateTime? @map("moderation_checked_at") @db.Timestamptz(6)
```

Add to `Report`:

```prisma
handledAt DateTime? @map("handled_at") @db.Timestamptz(6)
```

Add to `Notification`:

```prisma
sourceEventId BigInt? @unique @map("source_event_id")
```

Create `apps/api/prisma/migrations/20260920010000_community_moderation_loop/migration.sql`:

```sql
ALTER TABLE rating
  ADD COLUMN IF NOT EXISTS moderation_risk text NOT NULL DEFAULT 'clear',
  ADD COLUMN IF NOT EXISTS moderation_reasons jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS moderation_checked_at timestamptz(6);

ALTER TABLE rating_reply
  ADD COLUMN IF NOT EXISTS moderation_risk text NOT NULL DEFAULT 'clear',
  ADD COLUMN IF NOT EXISTS moderation_reasons jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS moderation_checked_at timestamptz(6);

ALTER TABLE report
  ADD COLUMN IF NOT EXISTS handled_at timestamptz(6);

ALTER TABLE notification
  ADD COLUMN IF NOT EXISTS source_event_id bigint;

CREATE UNIQUE INDEX IF NOT EXISTS notification_source_event_id_key
  ON notification (source_event_id)
  WHERE source_event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS rating_product_status_created_at_idx
  ON rating (product_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS rating_reply_rating_status_created_at_idx
  ON rating_reply (rating_id, status, created_at ASC);

CREATE INDEX IF NOT EXISTS report_status_created_at_idx
  ON report (status, created_at DESC);

CREATE INDEX IF NOT EXISTS notification_account_read_created_at_idx
  ON notification (account_id, read_at, created_at DESC);
```

- [ ] **Step 5: Generate Prisma and run the schema tests**

Run:

```text
pnpm --filter @youpu/schema build
pnpm db:generate
pnpm --filter @youpu/schema exec tsx --test src/community.test.ts
```

Expected: all focused schema tests pass and Prisma client generation exits with code 0.

- [ ] **Step 6: Apply the migration against the existing local database**

Run: `pnpm db:migrate`

Expected: migration `20260920010000_community_moderation_loop` is applied without resetting the database. Commit:

```text
git add packages/schema/src/community.ts packages/schema/src/community.test.ts apps/api/prisma/schema.prisma apps/api/prisma/migrations/20260920010000_community_moderation_loop/migration.sql
git commit -m "feat: add community moderation contracts"
```

### Task 2: Implement explainable risk rules and Redis rate limits

**Files:**
- Create: `apps/api/src/community/community-moderation.ts`
- Create: `apps/api/src/community/community-moderation.test.ts`
- Create: `apps/api/src/community/community-rate-limit.ts`
- Create: `apps/api/src/community/community-rate-limit.test.ts`
- Modify: `apps/api/src/community/community.module.ts`

**Interfaces:**
- Produces `evaluateCommunityRisk(input)` returning `{ risk: 'clear' | 'watch'; reasons: string[] }`.
- Produces `CommunityRateLimit.assertAllowed(accountId, scope)` and `CommunityRateLimitScope` for `rating`, `reply`, `report` and `helpful` operations.

- [ ] **Step 1: Write failing pure rule tests**

Create tests for a clean submission, a sensitive term, an extreme rating, and a repeated content flag:

```ts
test('clean content stays clear', () => {
  assert.deepEqual(evaluateCommunityRisk({ content: '雪况稳定时抓边很稳', overall: 4 }), {
    risk: 'clear',
    reasons: [],
  });
});

test('sensitive promotion language is marked for review without blocking publication', () => {
  assert.deepEqual(evaluateCommunityRisk({ content: '加微信返现购买', overall: 5 }), {
    risk: 'watch',
    reasons: ['promotion'],
  });
});

test('extreme ratings without text are marked for review', () => {
  assert.deepEqual(evaluateCommunityRisk({ content: null, overall: 1 }), {
    risk: 'watch',
    reasons: ['extreme-rating-without-context'],
  });
});

test('duplicate content adds a duplicate reason', () => {
  assert.deepEqual(evaluateCommunityRisk({ content: '同一段内容', duplicate: true }), {
    risk: 'watch',
    reasons: ['duplicate-content'],
  });
});
```

- [ ] **Step 2: Run the rule test and verify it fails**

Run: `pnpm --filter @youpu/api exec tsx --test src/community/community-moderation.test.ts`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement the pure risk evaluator**

Implement `evaluateCommunityRisk` with these exact rules:

```ts
export type CommunityRiskResult = {
  risk: 'clear' | 'watch';
  reasons: string[];
};

export function evaluateCommunityRisk(input: {
  content?: string | null;
  overall?: number;
  duplicate?: boolean;
}): CommunityRiskResult {
  const reasons: string[] = [];
  const normalized = (input.content ?? '').replace(/\s+/g, '').toLowerCase();
  if (['加微信', '微信号', '二维码', '返现', '刷单', '私聊转账'].some((term) => normalized.includes(term))) {
    reasons.push('promotion');
  }
  if (!normalized && (input.overall === 1 || input.overall === 5)) {
    reasons.push('extreme-rating-without-context');
  }
  if (input.duplicate) reasons.push('duplicate-content');
  return { risk: reasons.length ? 'watch' : 'clear', reasons };
}
```

- [ ] **Step 4: Write failing rate-limit tests**

Use a fake Redis with `set()` returning `'OK'` once and `null` thereafter. Assert that the first call succeeds and the second call throws `TooManyRequestsException`; also assert that the generated key contains the account and scope.

- [ ] **Step 5: Implement the rate-limit service and register it**

Use these limits:

```ts
const LIMITS = {
  rating: { seconds: 300, key: 'rating' },
  reply: { seconds: 30, key: 'reply' },
  report: { seconds: 60, key: 'report' },
  helpful: { seconds: 5, key: 'helpful' },
} as const;
```

`assertAllowed(accountId, scope)` must call `redis.set(`community:${scope}:${accountId}`, '1', 'EX', seconds, 'NX')` and throw `TooManyRequestsException('操作过于频繁，请稍后再试')` unless Redis returns `'OK'`. Register the provider in `CommunityModule` and inject `REDIS` through the existing `RedisModule`.

- [ ] **Step 6: Run both focused test files and commit**

Run: `pnpm --filter @youpu/api exec tsx --test src/community/community-moderation.test.ts src/community/community-rate-limit.test.ts`

Expected: all rule and rate-limit tests pass. Commit:

```text
git add apps/api/src/community/community-moderation.ts apps/api/src/community/community-moderation.test.ts apps/api/src/community/community-rate-limit.ts apps/api/src/community/community-rate-limit.test.ts apps/api/src/community/community.module.ts
git commit -m "feat: add community risk rules and rate limits"
```

### Task 3: Add rating filtering, similarity sorting, and service safeguards

**Files:**
- Create: `apps/api/src/community/rating-query.ts`
- Create: `apps/api/src/community/rating-query.test.ts`
- Modify: `apps/api/src/community/community.controller.ts`
- Modify: `apps/api/src/community/community.service.ts`
- Create: `apps/api/src/community/community.service.test.ts`

**Interfaces:**
- Produces `filterAndSortRatings(rows, query, viewerProfile)` for deterministic list behavior.
- Extends `CommunityService.listRatings(productRef, query, accountId?)` while preserving the old default sort.

- [ ] **Step 1: Write failing rating-query tests**

Cover `profile=complete`, `level`, helpful ordering, latest ordering, and similar ordering. Use rows with the existing `riderProfile`, `helpfulCount`, and `createdAt` fields. The expected similar order must put the same `level` first, then a row with more profile fields, then an unrelated row.

- [ ] **Step 2: Run the focused query test and verify it fails**

Run: `pnpm --filter @youpu/api exec tsx --test src/community/rating-query.test.ts`

Expected: FAIL because `rating-query.ts` is not present.

- [ ] **Step 3: Implement deterministic filter and sort helpers**

Implement these rules:

```ts
export function hasCompleteRiderProfile(profile: Record<string, unknown>): boolean {
  const hasLevel = typeof profile.level === 'string';
  const additional = ['years', 'height', 'weight', 'home_resort'].filter((key) => profile[key] !== undefined).length;
  return hasLevel && additional >= 1;
}

export function filterAndSortRatings(rows: RatingQueryRow[], query: RatingListQueryInput, viewerProfile?: Record<string, unknown>): RatingQueryRow[] {
  const filtered = rows.filter((row) => query.profile !== 'complete' || hasCompleteRiderProfile(row.riderProfile))
    .filter((row) => !query.level || row.riderProfile.level === query.level);
  return [...filtered].sort((a, b) => compareRatings(a, b, query.sort, viewerProfile));
}
```

`compareRatings` must use helpful count then `createdAt` for `helpful`, reverse creation time for `latest`, and a deterministic similarity score plus helpful count and creation time for `similar`. If no viewer profile exists, `similar` must behave as `helpful`.

- [ ] **Step 4: Integrate the query schema into the controller**

Change the controller signature to parse `ratingListQuerySchema`:

```ts
ratings(
  @Param('productRef') productRef: string,
  @Query(new ZodValidationPipe(ratingListQuerySchema)) query: RatingListQueryInput,
  @Req() request: AuthRequest,
) {
  return this.community.listRatings(productRef, query, request.account?.id);
}
```

- [ ] **Step 5: Integrate safeguards into CommunityService**

Before creating or updating a rating, load the existing product/account state, detect duplicate reply content within the same rating, call `CommunityRateLimit.assertAllowed`, evaluate risk, and persist `moderationRisk`, `moderationReasons` and `moderationCheckedAt` while leaving `status: 'published'`. Apply the same limit and risk evaluator to replies and reports; call the helpful limit before toggling a vote.

For `listRatings`, query published rows, load the viewer profile only when `sort === 'similar'` and an account ID is available, then call `filterAndSortRatings`. Do not expose `moderationReasons` to anonymous public consumers.

- [ ] **Step 6: Run focused API tests and commit**

Run:

```text
pnpm --filter @youpu/schema build
pnpm --filter @youpu/api exec tsx --test src/community/rating-query.test.ts src/community/community-moderation.test.ts src/community/community-rate-limit.test.ts
pnpm --filter @youpu/api typecheck
```

Expected: all focused tests pass and API typecheck exits with code 0. Commit:

```text
git add apps/api/src/community packages/schema/src/community.ts
git commit -m "feat: improve community rating quality controls"
```

### Task 4: Make notification delivery idempotent and targetable

**Files:**
- Modify: `apps/api/src/community/community.service.ts`
- Modify: `apps/api/src/outbox/consumers/notification.consumer.ts`
- Create: `apps/api/src/outbox/consumers/notification.consumer.test.ts`

**Interfaces:**
- `NotificationConsumer.handle(event)` writes `sourceEventId: event.id` and ignores a duplicate unique-key insert for the same event.
- Community-created notification payloads expose `productSlug`, `path` and `anchor` where applicable.

- [ ] **Step 1: Write failing NotificationConsumer tests**

Use a fake Prisma client and assert:

```ts
await consumer.handle({
  id: 42n,
  aggregate: 'rating',
  aggregateId: 'rating-id',
  type: 'notification.created',
  attempts: 0,
  payload: {
    accountId: 'account-id',
    type: 'reply',
    actorId: 'actor-id',
    targetType: 'rating',
    targetId: 'rating-id',
    payload: { path: '/gear/burton-custom-camber#reviews', anchor: 'rating-id' },
  },
});
assert.equal(createCall.data.sourceEventId, 42n);
```

Add a second case where `create` throws a Prisma `P2002`; it must resolve without throwing so the outbox row can be marked processed.

- [ ] **Step 2: Run the consumer test and verify it fails**

Run: `pnpm --filter @youpu/api exec tsx --test src/outbox/consumers/notification.consumer.test.ts`

Expected: FAIL because `sourceEventId` is not included and duplicate handling is absent.

- [ ] **Step 3: Implement idempotent notification writes**

Pass `event.id` into the create data. Catch only `Prisma.PrismaClientKnownRequestError` with code `P2002` and log a debug message; rethrow every other error. Preserve the existing payload validation and actor / target fields.

- [ ] **Step 4: Add route metadata to all notification-producing transactions**

When creating notifications in `upsertRating`, `createReply` and `toggleHelpful`, include:

```ts
payload: {
  productSlug: product.slug,
  path: `/gear/${product.slug}#reviews`,
  anchor: ratingId,
  actorName: account.nickname,
}
```

Use `anchor: ratingId` for replies and helpful notifications. For new product reviews, use the newly saved rating ID. Exclude the acting account before creating follower notifications.

- [ ] **Step 5: Fix report handler attribution**

When `AdminService.updateReport` later changes a report status, it must set `handledBy` and `handledAt` in the same update transaction. Keep the notification work in this task limited to community-generated notifications.

- [ ] **Step 6: Run tests and commit**

Run: `pnpm --filter @youpu/api exec tsx --test src/outbox/consumers/notification.consumer.test.ts src/community/community-moderation.test.ts`

Expected: focused tests pass. Commit:

```text
git add apps/api/src/community/community.service.ts apps/api/src/outbox/consumers/notification.consumer.ts apps/api/src/outbox/consumers/notification.consumer.test.ts
git commit -m "feat: make community notifications idempotent"
```

### Task 5: Complete admin moderation actions and Chinese risk views

**Files:**
- Modify: `packages/schema/src/admin.ts`
- Modify: `apps/api/src/admin/admin.service.ts`
- Modify: `apps/api/src/admin/admin.controller.ts`
- Modify: `apps/admin/src/lib/api.ts`
- Modify: `apps/admin/src/components/admin-app.tsx`
- Create or modify: `apps/api/src/admin/admin-moderation.test.ts`

**Interfaces:**
- `adminModerationPatchSchema` accepts `status` plus optional `targetStatus` (`published | hidden | rejected`) for report actions.
- `AdminReport` exposes `handledAt` and `handler`; `AdminModerationRating` exposes `moderationRisk`, `moderationReasons`, and `riderProfile`.

- [ ] **Step 1: Write failing admin service tests**

Cover these cases:

```ts
test('resolving a report records the admin and preserves content when no target status is given', async () => {
  const result = await service.updateReport('report-id', { status: 'resolved' }, 'admin-id');
  assert.equal(result.status, 'resolved');
  assert.equal(updateCall.data.handledBy, 'admin-id');
  assert.ok(updateCall.data.handledAt instanceof Date);
});

test('report action can hide a rating in the same transaction', async () => {
  await service.updateReport('report-id', { status: 'resolved', targetStatus: 'hidden' }, 'admin-id');
  assert.deepEqual(ratingUpdateCall.data, { status: 'hidden' });
  assert.equal(outboxCall.data.type, 'rating.changed');
});
```

- [ ] **Step 2: Run the admin test and verify it fails**

Run: `pnpm --filter @youpu/api exec tsx --test src/admin/admin-moderation.test.ts`

Expected: FAIL because `targetStatus`, `handledAt` and target updates are not implemented.

- [ ] **Step 3: Implement the admin contract and service transaction**

Extend the admin patch schema, include the new fields in list serializers, and implement `updateReport` as one Prisma transaction:

```ts
const status = body.status ?? existing.status;
const now = new Date();
await tx.report.update({
  where: { id },
  data: { status, handledBy: actorId ?? null, handledAt: now },
});
if (body.targetStatus) {
  if (existing.targetType === 'rating') {
    await tx.rating.update({ where: { id: existing.targetId }, data: { status: body.targetStatus } });
    await tx.outboxEvent.create({ data: { aggregate: 'product', aggregateId: productId, type: 'rating.changed', payload: { reason: 'report.moderation' } } });
  }
  if (existing.targetType === 'reply') {
    await tx.ratingReply.update({ where: { id: existing.targetId }, data: { status: body.targetStatus } });
  }
}
```

Resolve `productId` from the target row before opening the transaction and return the updated report with handler data. Record before / after snapshots through the existing audit helper.

- [ ] **Step 4: Update the admin UI**

In `apps/admin/src/components/admin-app.tsx`:

- show risk level, reasons and profile fields in the comment queue;
- add Chinese actions “保留并处理”“隐藏内容”“拒绝内容”“驳回举报”“重新打开”；
- send `{ status, targetStatus }` through the existing `callAdmin` helper;
- display handler and handled time;
- keep editor navigation and permission behavior unchanged.

- [ ] **Step 5: Run API/admin checks and commit**

Run:

```text
pnpm --filter @youpu/schema build
pnpm --filter @youpu/api exec tsx --test src/admin/admin-moderation.test.ts src/admin/admin-controller-permissions.test.ts
pnpm --filter @youpu/api typecheck
pnpm --filter @youpu/admin typecheck
```

Expected: all focused tests pass and both typechecks exit with code 0. Commit:

```text
git add packages/schema/src/admin.ts apps/api/src/admin apps/admin/src/lib/api.ts apps/admin/src/components/admin-app.tsx
git commit -m "feat: complete community moderation workflow"
```

### Task 6: Add frontend filters, notification routing, and cloud state consistency

**Files:**
- Create: `apps/web/src/lib/community.ts`
- Create: `apps/web/src/lib/community.test.ts`
- Modify: `apps/web/src/lib/api.ts`
- Modify: `apps/web/src/components/gear/review-panel.tsx`
- Modify: `apps/web/src/components/layout/site-header.tsx`
- Modify: `apps/web/src/app/me/me-client.tsx`

**Interfaces:**
- Produces `notificationHref(notification)` returning a safe internal path or `null`.
- Produces `ratingQueryString({ sort, profile, level })` so UI query construction is tested outside React components.
- Extends `cloudRatings(productRef, query)` without breaking calls that pass only a product reference and optional sort.

- [ ] **Step 1: Write failing frontend helper tests**

Add these assertions:

```ts
test('notification links to the product review anchor', () => {
  assert.equal(notificationHref({ targetType: 'rating', targetId: 'r-1', payload: { path: '/gear/dji-osmo-action-5-pro#reviews', anchor: 'r-1' } }), '/gear/dji-osmo-action-5-pro#reviews');
});

test('external notification payloads do not become internal links', () => {
  assert.equal(notificationHref({ targetType: 'product', targetId: 'p-1', payload: { path: 'https://example.com' } }), null);
});

test('rating query builder omits default filters', () => {
  assert.equal(ratingQueryString({ sort: 'helpful', profile: 'all' }), 'sort=helpful&profile=all');
});
```

- [ ] **Step 2: Run the focused frontend test and verify it fails**

Run: `pnpm --filter @youpu/web exec tsx --test src/lib/community.test.ts`

Expected: FAIL because the helper file does not exist.

- [ ] **Step 3: Implement safe routing and query helpers**

`notificationHref` must accept only paths beginning with `/gear/` or `/me`, reject protocol-relative and absolute URLs, and return the payload path when it contains the expected review anchor. `ratingQueryString` must use `URLSearchParams` and include the explicit defaults so API and browser state remain inspectable.

- [ ] **Step 4: Extend the web API types and requests**

Add optional notification payload route fields and rating query types in `apps/web/src/lib/api.ts`. Change `cloudRatings` to accept:

```ts
export type CloudRatingQuery = {
  sort?: 'helpful' | 'latest' | 'similar';
  profile?: 'all' | 'complete';
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
};

export function cloudRatings(productRef: string, query: CloudRatingQuery = {}): Promise<CloudRatingsResponse>;
```

Preserve the existing default request behavior for callers that pass no query.

- [ ] **Step 5: Update the review panel**

Add Chinese controls for “最有帮助”“最新”“与我相似”“完整使用条件”“按水平”，request the selected query, and keep the existing local content merge when the API fails. Do not expose moderation reasons to regular visitors. Preserve the current login gate and form contents on a `429` response.

- [ ] **Step 6: Update notification and personal-center interactions**

In `site-header.tsx` and `me-client.tsx`, make notifications clickable, call `cloudMarkNotification` before navigation, route through `notificationHref`, and leave invalid targets as read-only rows. Ensure the unread count refreshes after single and bulk read operations. Keep favorites sourced from the cloud account after login and restore the local button state when add/remove fails.

- [ ] **Step 7: Run frontend checks and commit**

Run:

```text
pnpm --filter @youpu/web exec tsx --test src/lib/community.test.ts src/lib/cloud-sync.test.ts
pnpm --filter @youpu/web typecheck
```

Expected: focused tests pass and web typecheck exits with code 0. Commit:

```text
git add apps/web/src/lib/community.ts apps/web/src/lib/community.test.ts apps/web/src/lib/api.ts apps/web/src/components/gear/review-panel.tsx apps/web/src/components/layout/site-header.tsx apps/web/src/app/me/me-client.tsx apps/web/src/components/gear/gear-card.tsx
git commit -m "feat: improve community frontend experience"
```

### Task 7: Full regression, documentation, and local acceptance

**Files:**
- Modify: `README.md`
- Modify: `docs/M3-本地开发实现.md`
- Modify: `docs/M2-后台基础版实现.md`
- Create: `apps/api/src/community/community-flow.test.ts`

**Interfaces:**
- No new public API beyond the contracts defined in Tasks 1, 3 and 5.
- Documentation must state immediate publication, report handling, notification idempotency and the local verification commands.

- [ ] **Step 1: Write a cross-module acceptance test**

Using fake Prisma and Redis dependencies, verify the minimum flow in one test: create a rating, create a follower notification event, run the notification consumer twice with the same outbox ID, and assert that only one notification is created; then hide the rating and assert that the recount query excludes it.

- [ ] **Step 2: Run the acceptance test and fix only observed failures**

Run: `pnpm --filter @youpu/api exec tsx --test src/community/community-flow.test.ts`

Expected: PASS with one notification row and a published-rating count that excludes hidden content.

- [ ] **Step 3: Update project documentation**

Update README sections for current status and local startup:

- community comments, ratings, favorites, reports and notifications;
- immediate publication plus admin moderation behavior;
- rating filters and “similar” sorting;
- `pnpm db:migrate`, `pnpm --filter @youpu/api typecheck`, and focused test commands;
- current note that Elasticsearch remains optional and PostgreSQL fallback remains active.

Do not reintroduce stale USD price statements or English-only admin labels.

- [ ] **Step 4: Run the full verification set**

Run:

```text
pnpm --filter @youpu/schema build
pnpm --filter @youpu/api exec tsx --test src/**/*.test.ts
pnpm --filter @youpu/web exec tsx --test src/lib/*.test.ts
pnpm --filter @youpu/admin exec tsx --test src/lib/*.test.ts
pnpm typecheck
pnpm build
git diff --check
```

Expected: all commands exit with code 0; test output reports zero failures; production builds for API, web and admin complete. If the shell does not expand the test globs, run the same commands with the explicit test paths printed by `rg --files -g '*.test.ts'`.

- [ ] **Step 5: Inspect runtime behavior with existing local services**

With PostgreSQL and Redis running, apply migrations, start API, web and admin, then verify:

```text
Invoke-WebRequest http://localhost:3001/api/health
Invoke-WebRequest http://localhost:3000/gear/dji-osmo-action-5-pro
Invoke-WebRequest http://localhost:3002
```

Use an authenticated account to create one rating, favorite the product, reload the product page, and confirm the rating and favorite state survive a refresh. Verify a second account receives exactly one new-review notification, and verify an admin can process a report and hide the target.

- [ ] **Step 6: Commit the final documentation and acceptance changes**

Run:

```text
git add README.md docs/M3-本地开发实现.md docs/M2-后台基础版实现.md apps/api/src/community/community-flow.test.ts
git commit -m "docs: document community loop acceptance"
```

Do not push or merge from this plan unless the user separately requests it.

## Plan Self-Review Checklist

- Spec coverage: Tasks 1-2 cover schema, risk rules and rate limits; Tasks 3-4 cover filtering, scoring, favorites and notification flow; Task 5 covers admin actions, permissions and audit; Task 6 covers frontend state and routing; Task 7 covers regression, runtime acceptance and documentation.
- Placeholder scan: the plan contains no unfinished marker, vague “handle edge cases” step, or undefined later-task interface.
- Type consistency: `ModerationRisk`, `RatingListQueryInput`, `CommunityRateLimitScope`, `filterAndSortRatings`, `notificationHref`, and `CloudRatingQuery` are defined before their consumers.
- Scope check: all tasks contribute to one community loop and use existing infrastructure; AI moderation, social graph and unrelated catalog work are explicitly excluded.
