# 生产数据库与应用部署记录（2026-10-15）

## 部署目标

- 服务器：`115.190.156.88`
- 发布目录：`/opt/youpu-releases/20261015-full-snow-deploy`
- 数据库：仅同步单板、固定器、雪鞋、双板、滑雪服饰五个滑雪类目。
- 应用：更新 API、IP 前台、域名前台和两个管理台静态版本；保留根路径点单应用、Nginx 路由和服务器环境配置。

## 数据库变更

- 写入前生成并检查 PostgreSQL 完整备份：`database-before.dump`。
- 同步输入共 241 款商品种子；更新五个滑雪类目的规格 schema。
- 新增品牌：Donek、MOSS、NOBADAY。
- 新增 6 款已发布单板：Donek Knapton Twin、Donek Raven、MOSS Snowstick U4、MOSS WING SW 67、NOBADAY Blackboard 6、NOBADAY Pro 5。
- 更新 4 款既有商品字段：Rossignol Forza 50、Forza 60 Ti、Soul 102、Salomon Stance 84。
- 不删除线上遗留商品；未将缺失草稿升级或创建；同步脚本保留账号、评分评论、收藏和商品统计。
- 五类线上发布商品数：单板 82、固定器 62、雪鞋 40、双板 43、滑雪服饰 8。

## 应用与验证

- API、schema、IP 前台、域名前台、IP 管理台、域名管理台均构建成功。
- `youpu-api`、`youpu-web`、`youpu-domain-web` 均为 active；API 健康检查 `db=true`、`redis=true`。Elasticsearch 未配置，`es=false`，与部署前一致。
- IP 首页、单板科普页、管理台返回 HTTP 200；域名首页和管理台通过服务器本机 TLS 虚拟主机检查返回 HTTP 200。
- 点单应用根路径返回 HTTP 200。
- 管理台产物位于 `/opt/youpu/apps/admin/releases/20261015-full-snow-deploy/{ip,domain}`，并已切换 `current-ip`、`current-domain`。
- Web 构建目录：`apps/web/.next-full-snow-20261015-{ip,domain}`。

## 回滚资料

- 数据库备份：`/opt/youpu-releases/20261015-full-snow-deploy/database-before.dump`
- 部署前源文件归档：`/opt/youpu-releases/20261015-full-snow-deploy/source-before.tar.gz`
- 部署前 systemd drop-in：`/opt/youpu-releases/20261015-full-snow-deploy/systemd-before/`
- 部署前管理台链接目标：同目录 `admin-ip-before.txt`、`admin-domain-before.txt`
- 数据库完整恢复会覆盖备份后产生的数据；若需恢复，应先停写并核对备份后的新数据。
