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

1. **完成真实用户链路验收。** 用户已确认管理台可用；2026-10-19 的只读检查确认 IP 内测页、登录页、管理台页面壳、API 健康和单板目录接口可响应。注册邮件真实投递、登录态下的评分/评论、后台审核与埋点仍需用已登录浏览器完成，当前不能据未登录的 401 响应判断用户会话失效。
2. **启用并验证自动备份。** 仓库脚本和 systemd 配置已准备，尚未安装到服务器或启用；异地 COS 备份也未配置。按下方步骤完成手动备份、隔离恢复后，再启用定时器。
3. **通过公网验收。** `youpu.asia` 仍受火山引擎接入备案审核影响；审核通过后检查公网 HTTPS、主要页面与 API，再向站长平台提交 sitemap 并观察访问和错误日志。
4. **已发布 2026-10-19 工作区变更。** 三款单板图片同步生产库；IP/域名前台与管理台已切换新版本，数据库和旧构建均留有回滚材料。发布细节及公网限制见 [youpu.asia 部署记录](./youpu.asia.md)。日常数据与界面工作仍不自动发布，后续等用户明确指示。

### PostgreSQL 自动备份（仓库配置，尚未在线启用）

当前服务器使用原生 PostgreSQL 16。`deploy/backup-native-postgres.sh` 以 `postgres` 系统用户执行自定义格式 `pg_dump`，用 `pg_restore --list` 校验归档并生成 SHA-256 文件。备份目录固定为 `/var/backups/youpu/postgres`，权限为仅 root 可访问；`flock` 避免重复运行。每次备份成功后，脚本会删除超过 30 天、且名称符合本脚本格式的归档及其 `.contents`、`.sha256` 文件。

仓库中的 `deploy/systemd/youpu-native-postgres-backup.service` 和 `.timer` 配套该脚本，计划每日 UTC 03:17 执行，并随机延迟最多 5 分钟。**目前尚未确认脚本和 systemd 单元已安装到服务器，也未启用定时器；线上自动备份和 30 天清理尚未生效。** 当前也没有配置异地 COS 保存。上线启用前，需先核对服务器版本与磁盘空间、安装脚本至 `/usr/local/sbin/youpu-native-postgres-backup`，安装 systemd 单元，手动执行备份并使用 `deploy/verify-native-postgres-backup.sh` 完成隔离恢复演练，再启用 timer。不要在本地运行这些服务器脚本，也不要把数据库密码写进备份配置；脚本通过 `runuser -u postgres` 使用本机 PostgreSQL 权限。

服务器确认使用 PostgreSQL 16 且 `/opt/youpu/deploy` 是当前版本源码后，按以下顺序操作。先安装并手动执行一次，不要立即启用 timer：

```bash
install -o root -g root -m 0750 /opt/youpu/deploy/backup-native-postgres.sh /usr/local/sbin/youpu-native-postgres-backup
install -o root -g root -m 0644 /opt/youpu/deploy/systemd/youpu-native-postgres-backup.service /etc/systemd/system/
install -o root -g root -m 0644 /opt/youpu/deploy/systemd/youpu-native-postgres-backup.timer /etc/systemd/system/
systemctl daemon-reload
systemctl start youpu-native-postgres-backup.service
systemctl status --no-pager youpu-native-postgres-backup.service
```

从 `BACKUP_COMPLETE` 输出中复制刚生成的归档完整路径，然后用它执行隔离恢复演练；恢复脚本会创建临时数据库并在退出时删除：

```bash
/opt/youpu/deploy/verify-native-postgres-backup.sh /var/backups/youpu/postgres/youpu-20261019T031700Z.dump
```

上面是路径格式示例，执行时请将文件名替换为备份命令实际输出的时间戳。

只有备份服务成功且隔离恢复输出 `ISOLATED_RESTORE_VERIFIED` 后，才启用并核对定时器：

```bash
systemctl enable --now youpu-native-postgres-backup.timer
systemctl list-timers youpu-native-postgres-backup.timer
```

若验收失败，停止并禁用 timer（若已启用），保留现有归档供排查：`systemctl disable --now youpu-native-postgres-backup.timer`。此流程仅覆盖本机备份；服务器磁盘损坏时仍需另行完成异地 COS 保存及恢复演练。

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
