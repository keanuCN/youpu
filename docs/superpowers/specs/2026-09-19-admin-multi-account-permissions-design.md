# 后台多账号权限设计

## 目标

把后台从“单一 Bearer 令牌”升级为基于现有账号体系的多账号后台，同时保留旧令牌作为本地迁移和紧急回退入口。

本阶段只覆盖后台身份、角色权限和操作人审计，不扩展组织、团队、邀请和复杂工作流。

## 现状与约束

- `account` 表已经有 `role`、`status`、邮箱密码和刷新令牌字段。
- 普通用户登录已经由 `POST /api/auth/login`、短期 access token 和 refresh token 提供。
- 当前 `AdminGuard` 只比较 `ADMIN_TOKEN`，审计日志默认使用 `ADMIN_ACTOR_ID` 或本地自动创建的审计账号。
- 后台前端目前只保存一个令牌，不理解 access/refresh token，也没有按角色隐藏页面。

## 方案选择

### 方案 A：账号登录为主，旧令牌兼容（采用）

- 后台使用已有邮箱密码登录接口，要求账号 `status=active` 且 `role` 为 `editor` 或 `admin`。
- 后端继续接受 `ADMIN_TOKEN`，用于本地迁移、初始化账号和紧急回退；旧令牌身份固定使用 `ADMIN_ROLE` 与 `ADMIN_ACTOR_ID`。
- 后台保存 access/refresh token；access token 过期时自动刷新一次，刷新失败才退出。
- 权限在 API 守卫层强制执行，前端隐藏只是体验优化，不能作为安全边界。

### 方案 B：立即删除旧令牌

安全边界更干净，但需要先解决首个管理员账号的创建和本地无数据库时的迁移问题，升级风险较高。

### 方案 C：继续扩展 Bearer 令牌配置

改动最小，但无法支持真实操作人、账号停用和多角色协作，不满足正式上线要求。

## 角色与权限

| 能力 | editor | admin |
| --- | --- | --- |
| 后台登录、总览、数据分析 | ✓ | ✓ |
| 产品、品牌、类目查看与编辑 | ✓ | ✓ |
| 内容审核（举报、评论状态） | — | ✓ |
| 操作审计查看 | — | ✓ |
| 后台账号列表与角色/状态修改 | — | ✓ |

普通 `user` 账号不能访问任何 `/api/admin/*` 接口。

## API 与数据流

### 后台守卫

`AdminGuard` 先尝试解析 `Authorization: Bearer <accessToken>`：

1. 通过现有 `AuthService.resolveAccessToken()` 取得账号。
2. 账号不存在、已停用或角色不是 `editor/admin` 时返回 401/403。
3. 将 `accountId` 与 `role` 写入 `request.admin`。
4. 若令牌等于配置的 `ADMIN_TOKEN`，沿用旧令牌身份作为兼容路径。

新增 `@AdminRoles('admin')` 元数据和角色守卫，只在账号管理、审核和审计接口启用 admin 限制。

### 账号管理

- `GET /api/admin/accounts`：admin 查看账号列表，返回邮箱、昵称、角色、状态、创建时间。
- `PATCH /api/admin/accounts/:id`：admin 修改 `role`（`user/editor/admin`）或 `status`（`active/pending/disabled`）。
- 不允许把最后一个启用中的 admin 降级或停用。
- 账号权限变更写入审计日志，actor 使用当前登录账号。

后台登录页增加两种中文入口：

- “账号登录”：邮箱 + 密码，使用现有认证接口。
- “内测令牌”：仅保留迁移期间的兼容入口，不作为正式推荐方式。

## 审计改造

所有产品、品牌、类目和审核变更方法接收当前 `actorId`，优先使用 JWT 账号作为审计人；旧令牌路径才回退到 `ADMIN_ACTOR_ID` 或本地审计账号。审计写入失败的现有“不回滚业务写入”策略保持不变。

## 前端行为

- 管理端存储 access token、refresh token 和当前角色，不再只存一个令牌。
- API 请求收到 401 时只执行一次刷新；刷新失败清理后台会话并回到登录页。
- `editor` 隐藏审核、审计和账号权限导航；如果直接访问受限接口，显示中文无权限提示。
- `admin` 新增“账号权限”页面，可调整账号角色和启用状态。

## 测试与验收

- 守卫测试：普通用户拒绝、editor 放行资料库、editor 拒绝审核、admin 放行全部、旧令牌兼容。
- 账号管理测试：角色/状态校验、最后一个 admin 保护、权限变更写审计。
- 审计测试：JWT 登录操作人优先于环境变量回退账号。
- 管理端测试：账号登录、刷新失败退出、editor 导航隐藏。
- 最后执行 API 聚焦测试、全仓类型检查和生产构建；Docker 恢复后补真实登录、角色和审计接口联调。
