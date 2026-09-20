# 后台多账号权限实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将后台从单一 Bearer 令牌升级为以现有账号体系为主的多账号登录、角色权限和真实操作人审计，同时保留旧令牌兼容迁移。

**Architecture:** API 继续使用现有 `/api/auth/login`、短期 access token 和 refresh token；`AdminGuard` 解析账号令牌并写入 `request.admin`，旧 `ADMIN_TOKEN` 作为兼容身份。`@AdminRoles('admin')` 保护审核、审计和账号管理接口，产品资料接口允许 `editor`。管理端新增账号登录、刷新、角色导航和账号权限页，审计写入优先使用当前账号。

**Tech Stack:** NestJS 10、Prisma 5、PostgreSQL、Redis、Next.js 14、React 18、TypeScript、Zod、Node `node:test`、pnpm 9。

## Global Constraints

- 保留 `ADMIN_TOKEN` 兼容入口，用于本地迁移和紧急回退；不能在未配置账号的环境中让后台完全失去入口。
- 只有 `active` 状态且角色为 `editor` 或 `admin` 的账号可以进入后台；普通 `user` 永远不能访问 `/api/admin/*`。
- `editor` 只能访问总览、数据分析、产品、品牌和类目；审核、审计、账号权限只能由 `admin` 访问。
- API 守卫是唯一安全边界；前端隐藏导航只作为用户体验，不替代后端权限检查。
- 不新增组织、邀请、团队、批量导入和复杂审批流；本计划只处理身份、角色、账号启停和审计 actor。
- 不把任何真实密码、访问令牌或 SMTP/数据库密钥写入仓库。
- 生产数据库使用 Prisma 迁移，不执行破坏性 reset；Docker 恢复后才进行真实数据库联调。

---

### Task 1: 固定角色权限规则与守卫测试

**Files:**
- Create: `apps/api/src/admin/admin-permissions.ts`
- Create: `apps/api/src/admin/admin-permissions.test.ts`
- Create: `apps/api/src/admin/admin-roles.decorator.ts`
- Modify: `apps/api/src/admin/admin.guard.ts`
- Modify: `apps/api/src/admin/admin.module.ts`

**Interfaces:**
- `AdminRole = 'editor' | 'admin'`
- `AdminIdentity = { accountId: string | null; role: AdminRole; source: 'account' | 'legacy-token' }`
- `canAccessAdminRole(actual: AdminRole, required: AdminRole): boolean`
- `AdminGuard` asynchronously resolves either an account access token or the configured legacy token.
- `@AdminRoles('admin')` adds required role metadata to a controller handler.

- [ ] **Step 1: Write the failing permission tests**

Create tests for these exact behaviors:

```ts
test('admin can access editor and admin operations', () => {
  assert.equal(canAccessAdminRole('admin', 'editor'), true);
  assert.equal(canAccessAdminRole('admin', 'admin'), true);
});

test('editor cannot access admin operations', () => {
  assert.equal(canAccessAdminRole('editor', 'editor'), true);
  assert.equal(canAccessAdminRole('editor', 'admin'), false);
});
```
Also test that a guard accepts an active editor/admin account returned by `AuthService.resolveAccessToken`, rejects a regular user with 403, and accepts the configured legacy token as an admin identity. Use a small fake execution context and fake reflector; do not connect to PostgreSQL or Redis.

- [ ] **Step 2: Run the tests and verify the expected RED state**

Run:

```bash
pnpm --filter @youpu/api exec node --import tsx --test src/admin/admin-permissions.test.ts
```

Expected: FAIL because `admin-permissions.ts` and the new account-aware guard behavior do not exist yet.

- [ ] **Step 3: Implement the minimal role contract and guard**

Implement `canAccessAdminRole` with `admin >= editor`. Change `AdminGuard` to:

1. Read the handler's optional required role metadata.
2. Accept `Bearer ADMIN_TOKEN` as `{ accountId: null, role: env.ADMIN_ROLE, source: 'legacy-token' }`.
3. Otherwise call `AuthService.resolveAccessToken(authorization)`.
4. Reject missing/invalid accounts with 401 and regular accounts with 403.
5. Reject an account whose status is not `active`.
6. Store `request.admin` with the account ID and role.

Import `AuthModule` into `AdminModule` so the guard can inject `AuthService`. Keep the existing configuration error when neither legacy token nor a valid account token is available.

- [ ] **Step 4: Run the focused tests and verify GREEN**

Run the same command and expect all permission and guard tests to pass.

- [ ] **Step 5: Commit the isolated guard change**

```bash
git add apps/api/src/admin/admin-permissions.ts apps/api/src/admin/admin-permissions.test.ts apps/api/src/admin/admin-roles.decorator.ts apps/api/src/admin/admin.guard.ts apps/api/src/admin/admin.module.ts
git commit -m "feat: support account based admin guard"
```

### Task 2: Enforce the role matrix in the admin controller

**Files:**
- Modify: `apps/api/src/admin/admin.controller.ts`
- Modify: `apps/api/src/admin/admin.guard.ts`
- Modify: `apps/api/src/admin/admin-roles.decorator.ts`
- Test: `apps/api/src/admin/admin-permissions.test.ts`

**Interfaces:**
- `request.admin.accountId` and `request.admin.role` are available to every admin controller handler.
- `@AdminRoles('admin')` is applied to audit logs, moderation, and account management routes.

- [ ] **Step 1: Extend the failing guard tests**

Add handler metadata cases proving that an editor request is rejected when the handler requires `admin`, while an admin request is allowed. Add a case proving a regular `user` account cannot access a handler without explicit metadata.

- [ ] **Step 2: Run the guard test and verify RED**

Run:

```bash
pnpm --filter @youpu/api exec node --import tsx --test src/admin/admin-permissions.test.ts
```

Expected: the new metadata cases fail before controller annotations and metadata enforcement are added.

- [ ] **Step 3: Add role annotations and request typing**

Annotate these existing routes with `@AdminRoles('admin')`:

- `GET /api/admin/audit-logs`
- `GET/PATCH /api/admin/moderation/reports`
- `GET/PATCH /api/admin/moderation/ratings`

Leave dashboard, analytics, products, brands and categories available to both editor and admin. Export the request identity type from `admin.guard.ts` for service calls in later tasks.

- [ ] **Step 4: Run the focused tests and typecheck**

```bash
pnpm --filter @youpu/api exec node --import tsx --test src/admin/admin-permissions.test.ts
pnpm --filter @youpu/api typecheck
```

Expected: all guard tests pass and API typecheck exits 0.

- [ ] **Step 5: Commit the role matrix**

```bash
git add apps/api/src/admin/admin.controller.ts apps/api/src/admin/admin.guard.ts apps/api/src/admin/admin-roles.decorator.ts apps/api/src/admin/admin-permissions.test.ts
git commit -m "feat: enforce admin role matrix"
```

### Task 3: Add account management contract and service

**Files:**
- Modify: `packages/schema/src/admin.ts`
- Modify: `packages/schema/src/index.ts`
- Create: `apps/api/src/admin/admin-account.test.ts`
- Modify: `apps/api/src/admin/admin.service.ts`
- Modify: `apps/api/src/admin/admin.controller.ts`

**Interfaces:**
- `adminAccountPatchSchema`: strict object with optional `role: 'user' | 'editor' | 'admin'` and `status: 'active' | 'pending' | 'disabled'`.
- `AdminService.listAccounts()` returns `id`, `email`, `nickname`, `role`, `status`, `createdAt`.
- `AdminService.updateAccountAccess(id, input, actorId)` returns the updated account view.

- [ ] **Step 1: Write failing account policy tests**

Create service-level policy tests with a fake Prisma client for:

1. A valid role/status patch is accepted.
2. An unknown role/status is rejected by the Zod contract.
3. Demoting or disabling the final active admin throws a `BadRequestException`.
4. A valid role change writes an audit record with the current actor ID.

The test fixture must include two active admins for the successful role-change case and one active admin for the last-admin protection case.

- [ ] **Step 2: Run the account tests and verify RED**

```bash
pnpm --filter @youpu/api exec node --import tsx --test src/admin/admin-account.test.ts
```

Expected: FAIL because the schema and service methods do not exist.

- [ ] **Step 3: Add the shared Zod contract and service methods**

Export the patch schema from `packages/schema/src/index.ts`. Implement `listAccounts` with newest accounts first and a maximum of 100 rows. Implement `updateAccountAccess` in a Prisma transaction:

1. Load the target account and fail with `NotFoundException` if missing.
2. Parse the patch with `adminAccountPatchSchema`.
3. If the target is the last active admin and the patch removes `admin` or `active`, throw `BadRequestException('不能停用或降级最后一个管理员')`.
4. Update only provided fields.
5. Write an audit event using the passed `actorId`.
6. Return the account fields needed by the admin table.

Add `GET /api/admin/accounts` and `PATCH /api/admin/accounts/:id` to the controller. Mark both routes `@AdminRoles('admin')`, validate the patch through `ZodValidationPipe`, and pass `request.admin.accountId` to the service.

- [ ] **Step 4: Run tests and typecheck**

```bash
pnpm --filter @youpu/api exec node --import tsx --test src/admin/admin-account.test.ts src/admin/admin-permissions.test.ts
pnpm --filter @youpu/schema build
pnpm --filter @youpu/api typecheck
```

Expected: all focused tests pass and both packages typecheck.

- [ ] **Step 5: Commit account management**

```bash
git add packages/schema/src/admin.ts packages/schema/src/index.ts apps/api/src/admin/admin-account.test.ts apps/api/src/admin/admin.service.ts apps/api/src/admin/admin.controller.ts
git commit -m "feat: add admin account access management"
```

### Task 4: Record the real account as audit actor

**Files:**
- Modify: `apps/api/src/admin/admin.service.ts`
- Modify: `apps/api/src/admin/admin.controller.ts`
- Create: `apps/api/src/admin/admin-audit-actor.test.ts`

**Interfaces:**
- Every mutating admin service method accepts an optional `actorId?: string` after its existing input parameters.
- `recordAudit` accepts `actorId?: string` and uses it before the legacy `getAuditActorId()` fallback.

- [ ] **Step 1: Write the failing actor-selection test**

Test a pure helper or extracted method that selects the request actor when present and falls back to the configured legacy actor only when the request actor is absent.

```ts
assert.equal(selectAuditActor('account-1', 'legacy-actor'), 'account-1');
assert.equal(selectAuditActor(undefined, 'legacy-actor'), 'legacy-actor');
```

- [ ] **Step 2: Run the test and verify RED**

```bash
pnpm --filter @youpu/api exec node --import tsx --test src/admin/admin-audit-actor.test.ts
```

Expected: FAIL because the selector does not exist.

- [ ] **Step 3: Thread `actorId` through every mutating route**

Update `updateReport`, `updateRatingStatus`, `createProduct`, `updateProduct`, `createBrand`, `updateBrand`, `createCategory`, `updateCategory`, and `updateAccountAccess` so their audit calls pass `request.admin.accountId`. Preserve legacy fallback when `accountId` is `null` for the old token path.

- [ ] **Step 4: Run actor, account, and existing API tests**

```bash
pnpm --filter @youpu/api exec node --import tsx --test src/admin/admin-audit-actor.test.ts src/admin/admin-account.test.ts src/admin/admin-permissions.test.ts src/health/health-check.test.ts
```

Expected: all tests pass with no audit actor regressions.

- [ ] **Step 5: Commit audit identity propagation**

```bash
git add apps/api/src/admin/admin.service.ts apps/api/src/admin/admin.controller.ts apps/api/src/admin/admin-audit-actor.test.ts
git commit -m "feat: record authenticated admin actor"
```

### Task 5: Add admin session API helpers and migration login

**Files:**
- Modify: `apps/admin/src/lib/api.ts`
- Create: `apps/admin/src/lib/admin-session.ts`
- Create: `apps/admin/src/lib/admin-session.test.ts`

**Interfaces:**
- `AdminSession = { accessToken: string; refreshToken: string; expiresIn: number; account: { id; email; nickname; role; status } }`.
- `adminLogin(email, password): Promise<AdminSession>` calls `/api/auth/login`.
- `adminRefresh(refreshToken): Promise<AdminSession>` calls `/api/auth/refresh`.
- `admin-session.ts` exports pure `readAdminSession`, `writeAdminSession`, `clearAdminSession` helpers using the key `youpu.admin.session`.

- [ ] **Step 1: Write failing session helper tests**

Test that a valid stored session is parsed, malformed storage is cleared/treated as absent, and writing then reading preserves the access token, refresh token and role. Use an in-memory storage object; do not access a real browser.

- [ ] **Step 2: Run the tests and verify RED**

```bash
pnpm --filter @youpu/admin exec node --import tsx --test src/lib/admin-session.test.ts
```

Expected: FAIL because the session module does not exist.

- [ ] **Step 3: Implement the session helpers and auth requests**

Keep legacy `youpu.admin.token` support in `readAdminSession` as a separate `{ kind: 'legacy-token'; token }` result. Account sessions use `{ kind: 'account'; session }`. `adminLogin` and `adminRefresh` must parse non-2xx responses with the existing `AdminApiError` behavior and never store credentials themselves.

- [ ] **Step 4: Run the session tests and admin typecheck**

```bash
pnpm --filter @youpu/admin exec node --import tsx --test src/lib/admin-session.test.ts
pnpm --filter @youpu/admin typecheck
```

Expected: all session tests pass and admin typecheck exits 0.

- [ ] **Step 5: Commit the session contract**

```bash
git add apps/admin/src/lib/api.ts apps/admin/src/lib/admin-session.ts apps/admin/src/lib/admin-session.test.ts
git commit -m "feat: add admin account session helpers"
```

### Task 6: Integrate account/legacy login and refresh into the admin UI

**Files:**
- Modify: `apps/admin/src/components/admin-app.tsx`
- Modify: `apps/admin/src/lib/admin-session.ts`
- Modify: `apps/admin/src/lib/api.ts`
- Modify: `apps/admin/src/app/globals.css`

**Interfaces:**
- `AdminApp` stores either an account session or legacy-token session and exposes a single `callAdmin` path for all authenticated API requests.
- `callAdmin` retries exactly once with `adminRefresh` after a 401 when a refresh token exists; it clears the session after refresh failure.

- [ ] **Step 1: Add a failing pure refresh-policy test**

Add to `admin-session.test.ts` a test for a refresh sequence: a first 401 invokes refresh once, a second 401 does not invoke refresh again, and a refresh failure clears the session. Keep network calls injected as functions.

- [ ] **Step 2: Run the test and verify RED**

```bash
pnpm --filter @youpu/admin exec node --import tsx --test src/lib/admin-session.test.ts
```

Expected: FAIL because the refresh policy is not implemented.

- [ ] **Step 3: Implement login modes and request refresh**

Replace the primary token-only form with a Chinese mode switch:

- `账号登录`: email and password, calling `adminLogin` and requiring returned role `editor/admin`.
- `内测令牌`: existing token field, calling `/admin/auth/me` and preserving the legacy localStorage key.

Use `callAdmin` for initial identity validation, workspace loading, analytics, moderation, audit, products, brands, categories, and all mutations. On account logout call the existing `/api/auth/logout` with the stored refresh token before clearing local state; network failure must still clear the UI session.

- [ ] **Step 4: Add role-aware navigation behavior**

Add an `accounts` section under `系统管理`. Filter navigation so editor sees only `dashboard`, `analytics`, `products`, `brands`, and `categories`; admin additionally sees `moderation`, `audit`, and `accounts`. If a stored editor session points at a hidden section, redirect to `dashboard`.

- [ ] **Step 5: Run admin tests and typecheck**

```bash
pnpm --filter @youpu/admin exec node --import tsx --test src/lib/admin-session.test.ts
pnpm --filter @youpu/admin typecheck
```

Expected: refresh/session tests pass and the admin app typechecks.

- [ ] **Step 6: Commit the UI session integration**

```bash
git add apps/admin/src/components/admin-app.tsx apps/admin/src/lib/admin-session.ts apps/admin/src/lib/api.ts apps/admin/src/app/globals.css
git commit -m "feat: add admin account login and refresh"
```

### Task 7: Build the admin account permissions page

**Files:**
- Modify: `apps/admin/src/lib/api.ts`
- Modify: `apps/admin/src/components/admin-app.tsx`
- Modify: `apps/admin/src/app/globals.css`

**Interfaces:**
- `AdminAccount` matches the API response and includes `id`, `email`, `nickname`, `role`, `status`, and `createdAt`.
- The page calls `GET /admin/accounts` on entry and `PATCH /admin/accounts/:id` for role/status updates.

- [ ] **Step 1: Add navigation mapping tests**

Create `apps/admin/src/lib/admin-navigation.ts` with a pure `visibleAdminSections(role)` helper and test that editor excludes moderation/audit/accounts while admin includes them. Run the test before implementing the helper to verify RED.

- [ ] **Step 2: Implement the account table**

Add a Chinese “账号权限” section visible only to admins. Display nickname, email, current role, current status and creation time. Role/status selectors submit one PATCH at a time, show a busy state, refresh the row list, and display API errors in the existing notice component.

- [ ] **Step 3: Add responsive styles and empty states**

Use the existing data panel/table styles. On narrow screens allow horizontal table scrolling without page-level overflow. Show a Chinese empty state when no accounts exist; never display passwords or tokens.

- [ ] **Step 4: Run admin tests and typecheck**

```bash
pnpm --filter @youpu/admin exec node --import tsx --test src/lib/admin-session.test.ts src/lib/admin-navigation.test.ts
pnpm --filter @youpu/admin typecheck
```

Expected: all admin helper tests pass and typecheck exits 0.

- [ ] **Step 5: Commit the account management UI**

```bash
git add apps/admin/src/lib/api.ts apps/admin/src/lib/admin-navigation.ts apps/admin/src/lib/admin-navigation.test.ts apps/admin/src/components/admin-app.tsx apps/admin/src/app/globals.css
git commit -m "feat: add admin account permissions page"
```

### Task 8: Update documentation and run the full verification gate

**Files:**
- Modify: `README.md`
- Modify: `docs/M2-后台基础版实现.md`
- Modify: `docs/M3-本地开发实现.md`
- Modify: `apps/api/.env.example`

- [ ] **Step 1: Document the migration path**

Document that an existing account can be promoted through the legacy token during migration, then used through account login. Document that production must set `AUTH_SECRET`, `ADMIN_TOKEN` only for compatibility, SMTP variables, and a valid `ADMIN_ACTOR_ID` fallback. State the editor/admin permission matrix in Chinese.

- [ ] **Step 2: Verify documentation and examples**

Run:

```bash
rg -n "账号登录|内测令牌|editor|admin|ADMIN_TOKEN|AUTH_SECRET|权限" README.md docs/M2-后台基础版实现.md docs/M3-本地开发实现.md apps/api/.env.example
git diff --check
```

Expected: all migration and permission references are present and no whitespace errors exist.

- [ ] **Step 3: Run the complete local verification**

```bash
pnpm --filter @youpu/api exec node --import tsx --test src/admin/admin-permissions.test.ts src/admin/admin-account.test.ts src/admin/admin-audit-actor.test.ts src/health/health-check.test.ts
pnpm --filter @youpu/admin exec node --import tsx --test src/lib/admin-session.test.ts src/lib/admin-navigation.test.ts
pnpm typecheck
pnpm build
```

Expected: all focused tests pass, workspace typecheck exits 0, and schema/API/web/admin production builds exit 0.

- [ ] **Step 4: Record the runtime limitation**

If Docker Desktop is still unavailable, report that real login, role update and audit requests were not run against PostgreSQL/Redis. Do not claim the full stack is verified from unit tests alone. Once Docker is available, run migrations, seed, start API/admin, create or promote one editor account, and verify editor/admin behavior through HTTP.

- [ ] **Step 5: Commit documentation and final verification**

```bash
git add README.md docs/M2-后台基础版实现.md docs/M3-本地开发实现.md apps/api/.env.example
git commit -m "docs: document admin role migration"
```
