# 滑雪数据同步记录 · 2026-10-15

## 发布结果

- 服务器：`115.190.156.88`；源码目录：`/opt/youpu`。
- 数据库事务更新 210 款现有滑雪装备，新增 3 款已发布双板：Atomic Bent 100 2026/27、HEAD Easy Joy 2026/27、HEAD Supershape e-Magnum 2026/27。
- 将 9 款商品状态同步到种子设定；HEAD EASY JOY R 316265 回到草稿且不设价格。Burton 女款 Step On 草稿保持未创建。
- 更新内容覆盖价格、规格、编辑评分、商品状态和图片；评论、社区评分、收藏、商品统计和账号不在写入范围。
- 种子目录中已撤下的 Atomic Bent 100 2025/26 与 HEAD Supershape e-Magnum 2025/26 生产记录保留，未自动删除，需后续确认是否作为旧季档案继续展示。
- `youpu-web` 与 `youpu-domain-web` 使用新构建目录；`youpu-api` 按新源码重建并重启。原 IP 根路径点单应用、`/youpu/admin/` 和 nginx 配置未改。

## 验收

- `youpu-api`、`youpu-web`、`youpu-domain-web` 均为 active；API 健康检查 `db=true`、`redis=true`，`es=false` 是既有资源配置。
- IP 内测首页、单板科普页、三款新双板详情页、管理台及原点单根路径均返回 HTTP 200。
- 新增商品 API 均返回 CNY 价格、商品封面；首页雪场图片文件可由 IP 内测站读取。
- 域名首页和科普页经服务器本机 Host/SNI 请求返回正常。公网域名仍受火山引擎备案接入拦截，不能据此宣称公网可访问。
- 前端 IP 与域名生产构建均成功。

## 数据校验限制

全仓 `validate:data` 当前仍报告 510 个扩展字段未声明在对应类目 `spec_schema` 中，主要是价格来源、雪季证据与服装信息。本次同步脚本只对模板已声明的参数做类型校验，保留扩展 JSON 字段；没有把这次发布描述为全量种子校验通过。后续应整理字段契约并修复全量校验。

## 备份与回滚

服务器发布目录：`/opt/youpu-releases/20261015-snow-data-sync/`。

- `database-before.dump`：写入前 PostgreSQL 自定义格式全库备份，清单保存在 `database-before.contents`。
- `source-before.tar.gz`：覆盖文件及将移除的过时种子文件备份。
- `catalog-preview.json`、`catalog-apply.log`：写入前差异预览和事务结果。
- `build-api.log`、`build-ip.log`、`build-domain.log`：构建输出。
- `ip-dropin-before.conf`、`domain-dropin-before.conf`：切换前的前台构建目录配置。

前台回滚时，先复制当前 drop-in 留档，再将上述两个旧配置恢复到 `/etc/systemd/system/youpu-web.service.d/equipment-20261013.conf` 与 `/etc/systemd/system/youpu-domain-web.service.d/equipment-20261013.conf`，执行 `systemctl daemon-reload` 并重启两个前台服务。数据库备份是整库备份；若需回滚数据库，先另做当前备份并评估发布后的用户写入，不能直接覆盖以免丢失新评论、评分或收藏。
