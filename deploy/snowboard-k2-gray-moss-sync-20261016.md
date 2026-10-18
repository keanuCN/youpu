# 单板历史档案同步 · 2026-10-16（K2 / GRAY / MOSS 共 12 款）

## 同步目标

- 服务器：`115.190.156.88`；源码与数据目录：`/opt/youpu`。
- 数据库：PostgreSQL 16.15，本机 `127.0.0.1:5432/youpu`。
- 范围：仅 2026-10-16 17:05–17:20 本地补录的 12 款单板 25/26 历史档案；未触碰其他类目。
- 未重新构建或发布前台，站点页面仍为旧构建。

## 数据库变更

- 事务写入：新增 12 款已发布单板，更新 0 款。
- 生产商品总数 330 → 342；单板 `published` 85 → 97（`draft` 1 不变）。
- 其余 243 款既有滑雪商品零改动：preview 与 apply 的 `changed` 均为空数组。
- 类目 `spec_schema` 无变更；无新建品牌（K2、GRAY、MOSS 均已存在）。
- 每款均创建 `product_stat` 与 `data_source` 记录（各 12 条），并写入 12 条 `product.updated` outbox 事件。
- 社区评分、评论、收藏、商品统计和账号在脚本保护范围内，未改动。

新增 slug：

| 品牌 | slug |
|---|---|
| K2 | k2-alchemist-2026、k2-world-peace-2026、k2-afterblack-2026、k2-sky-pilot-2026、k2-almanac-2026、k2-manifest-2026、k2-commonwealth-2026、k2-special-effects-2026 |
| GRAY | gray-desperado-ti-type-r-2026、gray-sonicalmach-2026 |
| MOSS | moss-snowstick-u5-ex-2026、moss-snowstick-u4-half-2026 |

## 执行流程

1. 全库备份（PG16 客户端 `/usr/pgsql-16/bin/pg_dump`；系统自带 `pg_dump` 为 13，与 16.15 服务端不兼容，会直接报版本不匹配）。
2. 上传 12 个种子到暂存区，校验 SHA-256 后复制进 `data/snowboard/`，线上种子数 86 → 98。
3. `sync-curated-snow-data.ts` 先跑 dry-run：`createPublished` 恰为 12 款，`changed` 为空，确认范围精确。
4. 审阅通过后加 `--apply`，在 `Serializable` 事务内写入。

## 验收

- `youpu-api`、`youpu-web`、`youpu-domain-web` 均 active；API 健康检查 HTTP 200。
- 单板列表接口 `total=97`；抽样 6 个新 slug 详情接口全部 HTTP 200；搜索可按 Alchemist 命中新档案。
- 价格均入库为 CNY；`coverUrl` 为 `null`（本批档案 `images: []`，未伪造历史商品图）。
- 抽样规格：k2-alchemist-2026 `sizeSpecs=6`、gray-sonicalmach-2026 `sizeSpecs=9`、k2-special-effects-2026 `sizeSpecs=4`、moss-snowstick-u5-ex-2026 `sizeSpecs=1`。

## 校验限制

- 全仓 `validate:data` 仍报告 **16 处既有错误**，全部来自 action-cam 与 esports-keyboard 未声明的 `priceSource` / `priceStatus` 字段；滑雪类目零错误。本次未修复该既有问题。
- 线上 `sync-curated-snow-data.ts` 的 `CATEGORIES` 为 **5 类**（不含 `ski-protection`），与本地 6 类不一致。本次只影响 snowboard，无实际后果，但后续同步前应核对线上脚本版本。

## 备份与回滚

发布目录：`/opt/youpu-releases/20261016-k2-gray-moss-12/`。

- `database-before.dump`：写入前 PostgreSQL 自定义格式全库备份，461358 字节，202 个归档条目，SHA-256 `60243f82312817b46bb3afc0d59375f259ade7f312efb486f29fca9121f9ed75`。
- `database-before.contents`：`pg_restore --list` 清单。
- `source-before-snowboard.tar.gz`：写入前 `data/snowboard` 种子目录归档。
- `preview.json`、`apply.log`（含空 stderr 文件）：写入前差异预览与事务结果。
- `incoming/`、`uploaded.sha256`：本次上传的 12 个种子原件及哈希。

本批 12 款均为本次新增，无既有数据被覆盖。如需回退，删除这 12 款的 `product`、`product_stat`、`data_source` 记录及对应 outbox 事件即可。整库恢复会覆盖备份后产生的用户写入，须先另做当前备份再评估。
