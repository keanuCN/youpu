# 本地全栈验收与阻塞修复实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** 把 codex/admin-information-architecture 验证为可发布候选版本，修复可选 Elasticsearch 阻塞健康检查的问题，并同步本地验收文档。

**Architecture:** 保留 PostgreSQL 搜索兜底和现有前台 API/本地内容包回退。将 Elasticsearch 健康探测抽成无 Nest 依赖的小型超时函数，API 健康检查只把数据库和 Redis 视为必需依赖；本地验收使用现有迁移、seed 和 HTTP 接口，不重置数据库。

**Tech Stack:** pnpm 9、Node.js 20、NestJS 10、Next.js 14、Prisma 5、PostgreSQL、Redis、可选 Elasticsearch、Node node:test、TypeScript。

## Global Constraints

- 工作目录固定为 C:\Users\40683\Desktop\Code\project\youpu\.worktrees\admin-information-architecture，不在主工作树直接改代码。
- 不执行 prisma migrate reset、删除容器卷、删除数据库记录或覆盖已有 .env。
- Elasticsearch 和 Umami 不是本地基础启动的必需依赖；没有 Elasticsearch 时必须使用 PostgreSQL 搜索路径。
- 管理令牌、数据库密码、SMTP 凭据只能来自现有本地环境变量，不写入仓库。
- 生产代码遵循测试先行：先看到新增测试失败，再写最小实现。
- 修改完成后必须运行与改动对应的自动化测试、迁移/数据校验和 HTTP 验收；未取得新证据不能声称完成。

---

### Task 1: 为可选 Elasticsearch 健康检查增加超时保护

**Files:**
- Create: apps/api/src/health/health-check.ts
- Create: apps/api/src/health/health-check.test.ts
- Modify: apps/api/src/health/health.controller.ts
- Modify: apps/api/package.json

**Interfaces:**
- Produces checkWithTimeout(probe, timeoutMs): Promise<boolean>.
- checkWithTimeout must return false for a rejected or timed-out probe, return the boolean result for a completed probe, and never reject to its caller.

- [ ] Step 1: Add the failing health-check tests.

Create apps/api/src/health/health-check.test.ts:

    import assert from 'node:assert/strict';
    import test from 'node:test';
    import { checkWithTimeout } from './health-check';

    test('returns false when an optional health probe times out', async () => {
      const startedAt = Date.now();
      const result = await checkWithTimeout(() => new Promise<boolean>(() => undefined), 20);

      assert.equal(result, false);
      assert.ok(Date.now() - startedAt < 500);
    });

    test('returns false when an optional health probe rejects', async () => {
      const result = await checkWithTimeout(async () => {
        throw new Error('elasticsearch unavailable');
      }, 100);

      assert.equal(result, false);
    });

    test('preserves a successful health probe result', async () => {
      assert.equal(await checkWithTimeout(async () => true, 100), true);
      assert.equal(await checkWithTimeout(async () => false, 100), false);
    });

- [ ] Step 2: Run the tests and confirm the expected failure.

Run from the worktree root:

    node --import tsx --test apps/api/src/health/health-check.test.ts

Expected: FAIL because apps/api/src/health/health-check.ts does not exist. If the command fails because workspace dependencies are unavailable, run pnpm install first and rerun the same test; do not skip the failing-test check.

- [ ] Step 3: Implement the minimal timeout helper.

Create apps/api/src/health/health-check.ts:

    export const HEALTH_CHECK_TIMEOUT_MS = 1_000;

    export async function checkWithTimeout(
      probe: () => Promise<boolean>,
      timeoutMs = HEALTH_CHECK_TIMEOUT_MS,
    ): Promise<boolean> {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const probeResult = Promise.resolve()
        .then(probe)
        .then((value) => Boolean(value), () => false);
      const timeoutResult = new Promise<boolean>((resolve) => {
        timer = setTimeout(() => resolve(false), timeoutMs);
      });

      try {
        return await Promise.race([probeResult, timeoutResult]);
      } finally {
        if (timer) clearTimeout(timer);
      }
    }

- [ ] Step 4: Use the helper in the API health controller.

Import checkWithTimeout from ./health-check and replace the Elasticsearch entry in the Promise.all call with:

    checkWithTimeout(() => this.elastic.ping()),

Keep the existing status rule: database and Redis determine status; the es field reports the optional dependency state.

- [ ] Step 5: Add a focused API test command and run the green test.

Add this script to apps/api/package.json without removing existing scripts:

    "test:health": "node --import tsx --test src/health/health-check.test.ts"

Run:

    pnpm --filter @youpu/api test:health
    pnpm --filter @youpu/schema build

Expected: three health tests pass and the shared schema package builds successfully.

- [ ] Step 6: Commit the isolated health-check change.

    git add apps/api/src/health/health-check.ts apps/api/src/health/health-check.test.ts apps/api/src/health/health.controller.ts apps/api/package.json
    git commit -m "fix: make optional search health checks bounded"

### Task 2: 同步 README 的本地验收说明

**Files:**
- Modify: README.md, local startup section
- Modify: README.md, current-state and milestone section

**Interfaces:**
- Documentation only; commands must match the root package.json scripts and current API ports.

- [ ] Step 1: Update the local startup section.

保留现有 Docker、迁移和 seed 命令，并明确说明：默认启动 PostgreSQL + Redis 即可完成基础开发；Elasticsearch 只用于增强搜索和分面；健康检查会返回 db、redis、es，其中 es=false 不代表 API 不可用。

- [ ] Step 2: Update the current-state and milestone text.

将当前分支已经实现的认证、前台 API 内容模式、搜索筛选、问卷和后台审核基础标为已落地；将本地全栈联调、线上 API systemd 部署、生产域名和埋点接入保留为未完成项。不要把后续社区扩展和 M4 运营功能提前标记为完成。

- [ ] Step 3: Review the documentation for contradictions.

    rg -n "M2|M3|Elasticsearch|健康检查|下一步|待续|待部署" README.md
    git diff --check

确认 README 不再同时声称 Elasticsearch 是必需依赖和可选依赖，也不再把当前分支已实现的功能描述为完全未实现。

- [ ] Step 4: Commit the documentation change.

    git add README.md
    git commit -m "docs: update local acceptance status"

### Task 3: 执行本地基础设施和数据基线验收

**Files:**
- Read-only checks against docker/compose.yml, apps/api/prisma/migrations, data, and local environment files.

**Interfaces:**
- Produces command output proving that PostgreSQL, Redis, migrations, data validation, and seed are usable from the current worktree.

- [ ] Step 1: Verify environment files without printing secrets.

    Test-Path .env
    Test-Path apps/api/.env
    Test-Path ..\..\.env
    Test-Path ..\..\apps\api\.env
    git status --short

If the worktree does not contain ignored environment files, use the already configured main-worktree files with explicit --env-file arguments; do not copy or commit them.

- [ ] Step 2: Start only PostgreSQL and Redis.

If the worktree .env exists:

    docker compose --env-file .env -f docker/compose.yml up -d

Otherwise:

    docker compose --env-file ..\..\.env -f docker/compose.yml up -d
    docker compose --env-file ..\..\.env -f docker/compose.yml ps

Expected: PostgreSQL and Redis are running; Elasticsearch and Umami are not required for this baseline.

- [ ] Step 3: Apply migrations and validate the data package.

    pnpm db:migrate
    pnpm --filter @youpu/api validate:data

Expected: both commands exit with code 0 and data validation reports no invalid seed records.

- [ ] Step 4: Run the idempotent seed and inspect counts.

    pnpm seed
    Invoke-RestMethod http://localhost:3001/api/products?category=snowboard&page=1&pageSize=3

Expected: the response contains a non-empty product list and category data. Do not use prisma migrate reset if the command exposes unrelated existing data issues.

### Task 4: 验收 API、前台和后台关键链路

**Files:**
- Read-only checks against running services on ports 3000, 3001, and 3002.
- No source files are modified unless a blocker is reproduced and assigned to a follow-up fix.

**Interfaces:**
- Produces an acceptance record for health, catalog, search, authentication, community, recommendation, admin, image proxy, and quiz routes.

- [ ] Step 1: Start the three local applications without sharing Next build directories.

Use separate PowerShell windows or existing project-owned processes:

    pnpm dev:api
    pnpm dev:web
    pnpm dev:admin

Do not run pnpm build while next dev is using the same application .next directory.

- [ ] Step 2: Check service responses.

    Invoke-WebRequest http://localhost:3000/ -UseBasicParsing | Select-Object StatusCode
    Invoke-WebRequest http://localhost:3002/ -UseBasicParsing | Select-Object StatusCode
    Invoke-RestMethod http://localhost:3001/api/health
    Invoke-RestMethod 'http://localhost:3001/api/products?category=snowboard&page=1&pageSize=3'
    Invoke-RestMethod 'http://localhost:3001/api/search?q=burton&page=1&pageSize=3'

Expected: both pages return HTTP 200, catalog and search return valid JSON, and health returns quickly with db, redis, and es fields.

- [ ] Step 3: Exercise development email authentication with a local-only address.

Use a unique local test address such as codex-baseline-20260918@example.com:

    $codeResponse = Invoke-RestMethod 'http://localhost:3001/api/auth/email/code' -Method Post -ContentType 'application/json' -Body (@{ email = 'codex-baseline-20260918@example.com'; purpose = 'register' } | ConvertTo-Json)
    $codeResponse

When devCode is present, register with it; otherwise record that SMTP delivery is configured and do not create an account through an external mailbox. Use the returned access token to call /api/auth/me. Do not print refresh tokens into logs or commit them.

- [ ] Step 4: Exercise community and recommendation routes with the returned access token.

Use the access token in an Authorization header and call the exact existing routes below:

    GET /api/products/{known-product-slug}/ratings
    GET /api/me
    GET /api/me/favorites
    GET /api/me/notifications
    POST /api/recommendations

For the recommendation request, send the category slug and the already implemented quiz answer shape from packages/schema. For a new local account, a favorite or recommendation write is acceptable; do not change unrelated accounts. Also call GET /api/me without Authorization and record the expected 401 response. Rating creation, helpful votes, replies, and reports are optional unless the frontend smoke check exposes a regression.

- [ ] Step 5: Exercise the admin route with the configured local token.

Read ADMIN_TOKEN from the existing local environment without echoing it, then verify these exact routes:

    GET /api/admin/auth/me
    GET /api/admin/dashboard
    GET /api/admin/analytics
    GET /api/admin/products
    GET /api/admin/moderation/ratings
    GET /api/admin/moderation/reports
    GET /api/admin/audit-logs

If a product mutation is required, use a local seed record and restore its original status/value after verification using the existing PATCH route, recording the before/after response.

- [ ] Step 6: Verify frontend fallbacks and media paths.

Open or request the homepage, browse page, search page, a product detail page, quiz page, auth page, and profile page. Verify the image proxy returns an image response for a known local content image and that API content failure falls back to the local content pack without a blank page. Record any browser-console or HTTP error as a blocker instead of masking it.

### Task 5: 执行回归检查并形成发布候选记录

**Files:**
- Read-only verification of the current worktree and generated build output.
- Optional update to docs/M2-内容层接API准备.md only if the acceptance finds a documentation contradiction that cannot be accurately represented in README.

**Interfaces:**
- Produces fresh evidence for focused tests, type checking, production builds, and clean Git status.

- [ ] Step 1: Run focused existing tests.

    pnpm --filter @youpu/api test:health
    node --import tsx --test apps/web/src/lib/content.test.ts apps/web/src/lib/domain.test.ts apps/web/src/lib/image-url.test.ts apps/web/src/lib/search.test.ts

Expected: all selected tests pass with exit code 0.

- [ ] Step 2: Run type checking after stopping only project-owned dev processes.

    pnpm typecheck

Expected: schema builds and all workspace packages typecheck without errors.

- [ ] Step 3: Run production builds.

After stopping the project-owned next dev processes:

    pnpm build

Expected: schema, API, web, and admin builds all exit with code 0. Restart local development services only if the user still needs them running.

- [ ] Step 4: Review the final diff and classify remaining issues.

    git diff --check
    git status --short
    git log --oneline -5

Classify every observed issue as 阻塞、发布前修复 or 后续优化. Do not mark the phase complete while a reproducible blocker remains.

- [ ] Step 5: Record the baseline result.

Add a concise dated entry to README only after all commands above have fresh output. Include the actual branch commit, the services verified, and any remaining follow-up; do not claim production deployment unless the deployment commands were actually run.

### Task 6: 阶段交接

**Files:**
- Read-only Git state.
- No automatic merge or push in this plan.

**Interfaces:**
- Produces a clean, locally verified feature branch ready for the next independently designed sub-project.

- [ ] Step 1: Confirm the first sub-project completion checklist.

Confirm from fresh command output:

    健康检查在 Elasticsearch 不可用时快速返回
    迁移、数据校验和 seed 成功
    API、前台和后台关键入口可访问
    认证、搜索、社区最小闭环和问卷流程完成联调
    README 与实际状态一致
    没有未解释的工作树改动

- [ ] Step 2: Stop before starting the next sub-project.

Do not start community expansion or production deployment in the same change set. Report the evidence and ask whether to proceed to the next design/plan cycle.

## Verification Summary

The implementation is complete only when the following commands have fresh successful output:

    pnpm --filter @youpu/api test:health
    pnpm db:migrate
    pnpm --filter @youpu/api validate:data
    pnpm seed
    pnpm typecheck
    pnpm build
    git diff --check

HTTP checks and frontend fallback checks are also required; command success alone is not enough to claim that the full stack is usable.
