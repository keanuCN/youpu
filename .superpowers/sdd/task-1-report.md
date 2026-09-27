# Task 1 Report

## 状态

DONE_WITH_CONCERNS

## 提交哈希

实现提交：`68c9d2b7781fde03ace98987b277517ae748e158`

提交信息：`feat: add community moderation contracts`

## 修改文件

- `packages/schema/src/community.ts`
- `packages/schema/src/community.test.ts`
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260920010000_community_moderation_loop/migration.sql`
- `.superpowers/sdd/task-1-report.md`（本报告）

未实现风险规则、通知、前台或后台后续任务。

## 实现摘要

- 增加 `moderationRiskSchema`、`ModerationRisk`、`ratingListQuerySchema` 和 `RatingListQueryInput`。
- 固化评分列表查询的 `sort`、`profile` 默认值和 `level` 过滤契约。
- 为 `Rating` 与 `RatingReply` 增加风险标记字段，为 `Report` 增加 `handledAt`，为 `Notification` 增加唯一来源事件字段。
- 增加简报要求的评论、回复、举报和通知查询索引。
- 手写迁移已应用到本地 PostgreSQL，未重置数据库。

## TDD 与验证记录

### RED

先添加 `packages/schema/src/community.test.ts`，再运行测试。

命令：

```text
$tsx = (Resolve-Path 'apps/api/node_modules/.bin/tsx.cmd').Path; & $tsx --test (Resolve-Path 'packages/schema/src/community.test.ts').Path
```

输出摘要：4 个测试全部失败，失败原因为 `ratingListQuerySchema` 和 `moderationRiskSchema` 尚未导出，报 `TypeError: Cannot read properties of undefined`。

简报原始命令首次运行：

```text
pnpm --filter @youpu/schema exec tsx --test src/community.test.ts
```

输出摘要：退出码 1，`tsx is not recognized`；这是工作区依赖链接问题，不是测试断言失败。

### GREEN 与提交前验证

实际运行命令及摘要：

```text
pnpm --filter @youpu/schema build
```

退出码 0，`tsc -p tsconfig.json` 完成。

```text
pnpm db:generate
```

退出码 0，生成 `Prisma Client (v5.22.0)`。

```text
$env:PATH = "$(Resolve-Path 'apps/api/node_modules/.bin');$env:PATH"; pnpm --filter @youpu/schema exec tsx --test src/community.test.ts
```

退出码 0：4 tests、4 pass、0 fail。

```text
pnpm db:migrate
```

首次运行退出码 0，应用迁移 `20260920010000_community_moderation_loop`；提交前复跑退出码 0，输出 `No pending migrations to apply.`。

```text
git diff --check
```

退出码 0，无空白错误。

为解除 Prisma Windows query-engine DLL 锁定，定位确认 PID `27580` 为当前工作区 API 进程且监听 `127.0.0.1:3001`，运行 `Stop-Process -Id 27580` 后再次执行 `pnpm db:generate` 成功。未停止 web/admin 服务，未修改数据库数据。

## 自审

- 变更严格限定在 Task 1 的契约、测试、Prisma schema 和迁移；没有后续任务实现。
- schema 默认值、枚举值、字段映射、默认 JSON、时间精度、唯一索引和四组查询索引均与任务简报一致。
- 测试覆盖稳定默认值、合法相似排序与水平过滤、非法查询值和风险枚举边界。
- 本地迁移已成功应用，重复部署不会产生待执行迁移。

## 未解决问题 / concerns

- `@youpu/schema` 的 `package.json` 未声明 `tsx`，因此在未调整 PATH 的干净 shell 中，简报原始测试命令会因找不到 `tsx` 失败；本次使用仓库现有 `apps/api` runner 临时加入 PATH 后，原测试命令本身执行成功。未修改依赖声明，以保持简报规定的文件范围。
- Prisma client 生成在 API 进程占用 query-engine DLL 时会触发 Windows `EPERM`；已停止明确占用该 DLL 的本地 API 进程并验证生成成功。

## 审查修复追加：Prisma 查询索引声明

### 修复内容

- 在 `Rating` 中补齐 `@@index([productId, status, createdAt(sort: Desc)])`。
- 在 `RatingReply` 中补齐 `@@index([ratingId, status, createdAt])`；保留原有 `@@index([ratingId, createdAt])`。
- 在 `Report` 中补齐 `@@index([status, createdAt(sort: Desc)])`。
- 在 `Notification` 中补齐 `@@index([accountId, readAt, createdAt(sort: Desc)])`。
- 未修改 `apps/api/prisma/migrations/20260920010000_community_moderation_loop/migration.sql`，未重置数据库。

### 修复命令与输出摘要

```text
pnpm db:generate
```

首次执行因本地 API 进程占用 Prisma Windows query-engine DLL 退出码 1（`EPERM` rename）；确认 PID `8312` 监听 `127.0.0.1:3001` 后停止该本地 API 进程，重试退出码 0，生成 Prisma Client v5.22.0 成功。

```text
pnpm --filter @youpu/schema build
```

退出码 0，`tsc -p tsconfig.json` 成功。

```text
$tsx = (Resolve-Path 'apps/api/node_modules/.bin/tsx.cmd').Path; & $tsx --test (Resolve-Path 'packages/schema/src/community.test.ts').Path
```

退出码 0：4 tests、4 pass、0 fail、0 skipped。

```text
git diff --check
```

退出码 0，无空白错误。

### 本次修复修改文件

- `apps/api/prisma/schema.prisma`
- `.superpowers/sdd/task-1-report.md`（本报告）
