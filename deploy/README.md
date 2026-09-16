# 部署记录

线上形态：**Next.js 静态导出（`out/`）由 nginx 直接托管** + **PG/Redis 容器** + **systemd 常驻 Node API**。
内测阶段不上 ES/Umami：服务器 2C1G 内存受限，搜索先用 PG（全文检索 / trgm），ES 是架构里唯一可从 PG 完全重建的组件。

## 服务器现状（2026-09-14 夜，逐条可回滚）

主机：腾讯云 CVM · 上海四区 · 2 核 1G · OpenCloudOS 9.6 · 宝塔面板（MySQL / nginx 在跑，勿动）
域名：xiaopang.club（✅ 已备案 津ICP备2026009482号；⚠️ DNS 的 A 记录还没加）

| 已做的改动 | 说明 / 回滚方式 |
|---|---|
| 停用 nomnom | 镜像自带的 Spring Boot 示例（占 204MB，与本站无关）；`systemctl start nomnom` 可恢复，jar 仍在 /opt/nomnom |
| 加 1G swap | `/swapfile2`（不动宝塔的 `/www/swap`），总 swap 2G，已写 fstab |
| 装 Docker CE 29.8.0 + Compose v5.5.1 | 镜像加速走 `mirror.ccs.tencentyun.com`；容器日志上限 10m×3 |
| 起 PG + Redis 容器 | 编排在 `/opt/youpu/docker`；端口只绑 `127.0.0.1`（§13.2）；实占 PG 42MB / Redis 4.6MB |
| 建表迁移已执行 | 23 张表 / ltree / GIN / 5 个部分索引 / 8 个 updated_at 触发器 / event 按月分区（已建出 `event_202609`），往分区表插埋点实测通过 |
| 装 Node 20.19 + pnpm 9.15 | `/usr/local/node-v20.19.0-linux-x64`（软链到 /usr/bin） |
| 上传源码 | `/opt/youpu`（scp 上传，非 git —— Gitee 仓库是私有的，服务器无法匿名 clone） |

## 待续（明天从这里开始）

1. `cd /opt/youpu && PRISMA_ENGINES_MIRROR=https://registry.npmmirror.com/-/binary/prisma NODE_OPTIONS=--max-old-space-size=384 pnpm install --filter @youpu/api...`
   → 再构建：`pnpm --filter @youpu/schema build && pnpm --filter @youpu/api build`
   （内存上限必须加，防止拖垮共存的 MySQL）
2. 重置 schema 让迁移历史一致（当前是手工 psql 应用的 SQL，没有 `_prisma_migrations` 表）：
   `docker exec youpu-postgres psql -U youpu -d youpu -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"` 然后 `pnpm --filter @youpu/api prisma:migrate`
3. `pnpm --filter @youpu/api seed` → 15 款板入库
4. API 以 **systemd 常驻**（不进 Docker，决策见下）；env 指向 `127.0.0.1:5432/6379`
5. 静态站埋点接 API：nginx 加 `/api` 反代 → 用 `NEXT_PUBLIC_API_BASE=https://xiaopang.club` 重新构建静态产物并上传

### 决策记录：API 为什么先不进 Docker

1G 内存下在服务器构建镜像要跑 `pnpm install + tsc`，峰值 400~600MB，有拖垮同机 MySQL/宝塔的风险；容器本身还要再占 ~50MB。
内测阶段用 systemd 直跑 Node（~150MB）；**升级到 2C4G 后再并入 compose**（届时镜像交给 CI 构建，正好接上技术方案 §9 的部署设计）。

## 静态站部署流程（每次更新站点）

```bash
cd apps/web
NEXT_OUTPUT=export NEXT_PUBLIC_SITE_URL=https://xiaopang.club pnpm build   # 产物在 apps/web/out

tar czf /tmp/youpu-static.tar.gz -C out .
scp /tmp/youpu-static.tar.gz root@111.229.87.101:/tmp/
ssh root@111.229.87.101 '
  rm -rf /www/wwwroot/xiaopang.club/* &&
  tar xzf /tmp/youpu-static.tar.gz -C /www/wwwroot/xiaopang.club &&
  chown -R www:www /www/wwwroot/xiaopang.club &&
  nginx -s reload'
```

nginx 配置：`deploy/nginx/xiaopang.club.conf` → 服务器 `/www/server/panel/vhost/nginx/xiaopang.club.conf`（宝塔的 vhost 目录会被自动 include，改完先 `nginx -t` 再 reload）。
回滚：静态站无状态，重新上传上一版 `out/` 即可。

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
| DNS | ⏳ `xiaopang.club` 尚无 A 记录，需在域名服务商添加：`@ → 111.229.87.101`、`www → 111.229.87.101` |
| ICP 备案 | ✅ 已备案：**津ICP备2026009482号**（页脚展示并链至 beian.miit.gov.cn） |
| HTTPS | 等 DNS 生效后配：腾讯云免费证书（宝塔面板可一键申请）加 443 server 块，HTTP 301 跳 HTTPS |

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
