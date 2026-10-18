# 生产数据库同步与应用部署记录（2026-10-18）

## 发布版本

- 应用提交：`f8877e5`（GitHub `main`）
- 服务器：`115.190.156.88`
- 发布目录：`/opt/youpu-releases/20261018-f8877e5`
- 保留点单根站、IP 下 `/youpu` 入口、域名站及现有 Nginx 路由。

## 生产数据库

- 写入前已使用 PostgreSQL 16 工具生成全库备份 `database-before.dump`，并通过 `pg_restore --list` 检查归档；备份 SHA-256 记录为 `database-before.sha256`。
- 同步程序校验 6 个滑雪类目、326 款本地种子及规格字段后，以事务方式更新：新增 27 款已发布商品（21 款双板、6 款滑雪服饰），更新 100 款既有商品，并调整 4 个类目的规格模板。
- 同步覆盖单板、固定器、雪鞋、双板、滑雪服饰和滑雪防护。没有删除商品；未发布缺失草稿；账号、社区评分、评分投票、回复、收藏与浏览统计由同步程序保护。
- 同步后线上已发布商品数：单板 134、固定器 62、雪鞋 40、双板 64、滑雪服饰 14、滑雪防护 6。
- 预览和执行日志：`sync-preview.json`、`sync-apply.log`。生产服务 API 健康状态为 `db=true`、`redis=true`；`es=false` 与当前配置一致。

## 应用部署与核验

- 上传提交 `f8877e5` 的源码，使用服务器 Node 22 / pnpm 9 构建 schema、API，以及 `/youpu` IP 前台和 `youpu.asia` 域名前台。
- 新前台使用独立构建目录 `.next-f8877e5-ip` 与 `.next-f8877e5-domain`；新 systemd drop-in 为 `zzzzzzz-f8877e5.conf`。API 与两个前台已重启，三个服务均为 active。
- 从服务器本机及外部 IP 检查：首页、单板科普、管理台、点单根站和 API 健康路由均返回 HTTP 200；科普页包含滑行风格内容，新增双板与滑雪服饰可由 API 查询。
- 域名首页、科普页和管理台在服务器本机通过 HTTPS 虚拟主机检查为 HTTP 200。域名公网仍受火山引擎备案接入限制，公网 HTTPS 不能视为可用。

## 回滚材料

- 全库备份：`/opt/youpu-releases/20261018-f8877e5/database-before.dump`
- 部署前源码归档：`/opt/youpu-releases/20261018-f8877e5/source-before.tar.gz`
- 旧 systemd drop-in：`systemd-ip-before/`、`systemd-domain-before/`
- 数据库全量恢复会覆盖备份后新增的数据；恢复前须另做当前备份并核对新写入。应用回滚可将旧 drop-in 恢复后重启对应服务；旧构建目录仍保留在 `/opt/youpu/apps/web/`。
