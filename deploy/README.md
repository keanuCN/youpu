# 部署记录

## 当前部署（2026-10-12）

服务器已迁移到 `115.190.156.88`，正式域名配置改为 `youpu.asia`，注册邮件发件人改为 `no-reply@youpu.asia`。当前采用独立 Next.js 服务，保留 IP 下的点单应用及 `/youpu` 入口。

**当前操作请使用 [youpu.asia 部署说明](./youpu.asia.md)。** DNS、证书和 Resend 验证已完成；公网仍受火山引擎备案/接入备案拦截。下面的旧服务器、宝塔路径和 xiaopang.club 操作属于历史记录。

## 旧服务器部署记录（历史）

线上形态：**Next.js 静态导出（`out/`）由 nginx 直接托管** + **PG/Redis 容器** + **systemd 常驻 Node API**。
内测阶段不上 ES/Umami：服务器 2C1G 内存受限，搜索先用 PG（全文检索 / trgm），ES 是架构里唯一可从 PG 完全重建的组件。

## 服务器现状

主机资料来自 2026-09-14 部署记录：腾讯云 CVM · 上海四区 · 2 核 1G · OpenCloudOS 9.6 · 宝塔面板（MySQL / nginx 在跑，勿动）。硬件与系统状态尚未重新登录服务器核实。

2026-09-30 部署后复核：`https://xiaopang.club/`、`/admin/`、`/api/health` 均返回 200；健康接口为 `db=true`、`redis=true`、`es=false`。正式 HTTPS 静态前台已发布，canonical、robots/sitemap、前端资源未发现 localhost；API systemd 服务 active，7/7 Prisma migrations 已应用。静态发布版本 `20260930T105502Z`，回滚备份为 `/www/wwwroot/xiaopang.club.backup-20260930T105502Z`。

2026-10-02 静态目录更新：从生产公开 API 导出 285 条商品后完成构建与发布；首页、单板档案库、三款新增商品详情及其官方图片地址、管理台、robots/sitemap、API 健康检查均返回 200。发布版本 `20261002T051210Z`，回滚备份为 `/www/wwwroot/xiaopang.club.backup-20261002T051210Z`；`/admin/` 与 `/.well-known/` 在发布前后内容校验一致。

| 已做的改动 | 说明 / 回滚方式 |
|---|---|
| 停用 nomnom | 镜像自带的 Spring Boot 示例（占 204MB，与本站无关）；`systemctl start nomnom` 可恢复，jar 仍在 /opt/nomnom |
| 加 1G swap | `/swapfile2`（不动宝塔的 `/www/swap`），总 swap 2G，已写 fstab |
| 装 Docker CE 29.8.0 + Compose v5.5.1 | 镜像加速走 `mirror.ccs.tencentyun.com`；容器日志上限 10m×3 |
| 起 PG + Redis 容器 | 编排在 `/opt/youpu/docker`；端口只绑 `127.0.0.1`（§13.2）；实占 PG 42MB / Redis 4.6MB |
| 建表迁移已执行 | 23 张表 / ltree / GIN / 5 个部分索引 / 8 个 updated_at 触发器 / event 按月分区（已建出 `event_202609`），往分区表插埋点实测通过 |
| 装 Node 20.19 + pnpm 9.15 | `/usr/local/node-v20.19.0-linux-x64`（软链到 /usr/bin） |
| 上传源码 | `/opt/youpu`（scp 上传，非 git —— Gitee 仓库是私有的，服务器无法匿名 clone） |

## 上线验收状态

已完成：静态前台生产构建与发布；首页 / 管理台 / API 健康检查；目录数据、SEO canonical、robots、sitemap 和前端包抽检；生产 CORS、SMTP 配置存在性核验；补设随机 `AUTH_SECRET` 并重启 API；PostgreSQL 备份及隔离恢复演练；两条待执行 Prisma migration 已在验证数据币种后应用，迁移状态现为 up to date。

正式开放前仍需：

1. 指定并启用首个管理员账号（当前数据库有普通账号，但尚无 admin）。
2. 用真实浏览器走通注册/登录、搜索、评论、后台审核及埋点关键链路。
3. 配置自动化、异地保存且有保留策略的数据库备份；当前确认只有一次手工备份与恢复演练，未发现站点自动备份定时任务。
4. 向站长平台提交 sitemap，并观察首批真实访问 / 错误日志。

### PostgreSQL 自动备份模板（尚未在线启用）

仓库提供 `deploy/backup-postgres.sh` 和 systemd service/timer 模板。脚本通过 Docker Compose 在 PostgreSQL 容器内执行自定义格式 `pg_dump`，随后用容器内 `pg_restore --list` 校验归档，写入 SHA-256 校验文件，并默认保留 30 天。锁文件防止重叠运行；备份目录使用仅 root 可读写权限。

当前部署尚未安装或启用该定时器，也没有配置异地 COS 上传。执行部署时需先核实 compose 与 `.env` 的服务器路径、磁盘空间和备份策略，再安装到 `/etc/systemd/system/`；配置 `/etc/youpu/backup.env`（仅路径和保留天数，不要把数据库密码写入此文件，Compose `.env` 仍由 Docker Compose 安全读取），例如：

```ini
YOUPU_COMPOSE_FILE=/opt/youpu/docker/compose.yml
YOUPU_ENV_FILE=/opt/youpu/.env
YOUPU_PG_BACKUP_DIR=/var/backups/youpu/postgres
YOUPU_PG_BACKUP_RETENTION_DAYS=30
```

手动运行一次 service 并完成隔离恢复演练后，再 enable timer。每日计划时间为 UTC 03:17（加最多 5 分钟随机延迟）；异地备份仍是正式开放前的独立事项。

内测资源取舍：Elasticsearch 未启用（`es=false`），搜索由 PostgreSQL 兜底；这不是 API 健康故障。

**禁止重置生产 schema。** 旧步骤中的 `DROP SCHEMA public CASCADE` 会删除现有表与数据，已从操作流程移除。若 `_prisma_migrations` 历史缺失，应先比对实际 schema 与迁移文件，再制定可审阅、保留数据的基线方案；不得直接清库或全量 seed。

### 决策记录：API 为什么先不进 Docker

1G 内存下在服务器构建镜像要跑 `pnpm install + tsc`，峰值 400~600MB，有拖垮同机 MySQL/宝塔的风险；容器本身还要再占 ~50MB。
内测阶段用 systemd 直跑 Node（~150MB）；**升级到 2C4G 后再并入 compose**（届时镜像交给 CI 构建，正好接上技术方案 §9 的部署设计）。

## 静态站部署流程（每次更新站点）

```bash
cd apps/web
NEXT_OUTPUT=export NEXT_PUBLIC_SITE_URL=https://xiaopang.club NEXT_PUBLIC_API_BASE=https://xiaopang.club CONTENT_EXPORT_API_BASE=https://xiaopang.club pnpm build   # 刷新 API 目录并生成 out/

tar czf /tmp/youpu-static.tar.gz -C out .
scp /tmp/youpu-static.tar.gz root@111.229.87.101:/tmp/
ssh root@111.229.87.101 '
  set -eu
  root=/www/wwwroot/xiaopang.club
  stage=$(mktemp -d /tmp/youpu-static-stage.XXXXXX)
  release=$(date -u +%Y%m%dT%H%M%SZ)
  test "$root" = /www/wwwroot/xiaopang.club
  tar xzf /tmp/youpu-static.tar.gz -C "$stage"
  test -s "$stage/index.html"
  test -s "$stage/robots.txt"
  cp -a "$root" "${root}.backup-${release}"
  rsync -a --delete --exclude=/admin/ --exclude=/.well-known/ "$stage/" "$root/"
  chown -R www:www /www/wwwroot/xiaopang.club &&
  nginx -t && nginx -s reload'
```

该流程会在替换前保留带时间戳的整站备份，并排除管理台与证书校验目录。回滚时先将当前站点另行备份，再从对应备份恢复；操作前核对归档和站点根目录。

nginx 配置：`deploy/nginx/xiaopang.club.conf` → 服务器 `/www/server/panel/vhost/nginx/xiaopang.club.conf`（宝塔的 vhost 目录会被自动 include，改完先 `nginx -t` 再 reload）。
回滚：使用站点根目录旁带时间戳的 `.backup-<release>` 目录恢复；先另存当前站点，再恢复目标备份并执行 `nginx -t`、reload。也可重新发布上一版 `out/`。

## M2 管理台部署

管理台以静态子路径 `/admin/` 发布，构建时必须设置 `basePath`，避免与前台的 `_next/` 资源冲突：

```bash
cd apps/admin
NEXT_PUBLIC_BASE_PATH=/admin NEXT_PUBLIC_API_BASE=https://xiaopang.club pnpm build   # 产物在 apps/admin/out
tar czf /tmp/youpu-admin.tar.gz -C out .
scp /tmp/youpu-admin.tar.gz root@111.229.87.101:/tmp/
```

服务器解压到 `/www/wwwroot/xiaopang.club/admin/` 后即可通过 `https://xiaopang.club/admin/` 访问；管理数据请求统一走 `/api/admin`，令牌只保存在浏览器本地会话中。

## 域名与备案

| 项 | 状态 |
|---|---|
| DNS | ✅ `xiaopang.club` 已解析并可通过 HTTPS 访问（2026-09-30 只读检查） |
| ICP 备案 | ✅ 已备案：**津ICP备2026009482号**（页脚展示并链至 beian.miit.gov.cn） |
| HTTPS | ✅ `https://xiaopang.club/` 返回 200；证书续期与 HTTP 跳转策略待登录服务器核实 |

DNS 生效前，站点可先用 IP 访问：**http://111.229.87.101/**（server_name 里带了 IP）。

## 服务器上的位置

| 内容 | 路径 |
|---|---|
| 静态站点文件 | `/www/wwwroot/xiaopang.club/` |
| M2 管理台文件 | `/www/wwwroot/xiaopang.club/admin/` |
| 后端源码 | `/opt/youpu/`（`docker/` 编排、`apps/api`、`data/`） |
| API systemd 服务 | `youpu-api.service` |
| nginx 配置 | `/www/server/panel/vhost/nginx/xiaopang.club.conf` |
| 访问 / 错误日志 | `/www/wwwlogs/xiaopang.club.log`、`.error.log` |
| 停用的示例应用 | `/opt/nomnom/`（保留了 jar） |
