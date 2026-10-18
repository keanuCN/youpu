# 单板历史档案同步 · 2026-10-16（K2 / GRAY 共 15 款 + 单板 schema 放宽）

## 同步目标

- 服务器：`115.190.156.88`；源码与数据目录：`/opt/youpu`。
- 数据库：PostgreSQL 16.15，本机 `127.0.0.1:5432/youpu`。
- 范围：本会话第二轮 4 款 K2 + 第三轮 11 款 GRAY，共 **15 款 25/26 新档案**。
- 未重新构建或发布前台；站点页面仍为旧构建。

## 数据库变更

- 事务写入：新增 15 款已发布单板，更新 0 款。
- 生产商品总数 342 → 357；单板 `published` 97 → 112（`draft` 1 不变）。
- 其余既有滑雪商品零改动：preview 与 apply 的 `changed` 均为空数组。
- 无新建品牌（K2、GRAY 均已存在）；类目模板除下述 waistWidth 外无变更。
- 每款新建 `product_stat` 与 `data_source` 记录；社区评分、评论、收藏、商品统计和账号未改动。

新增 slug：

| 品牌 | slug |
|---|---|
| K2 | k2-chloro-2026、k2-extravision-2026、k2-medium-2026、k2-freeloader-2026 |
| GRAY | gray-genius-2026、gray-prodigy-2026、gray-rpm-2026、gray-tycoon-2026、gray-quadra-2026、gray-force-2026、gray-quadra-ii-2026、gray-despe-wood-32-43-2026、gray-lovebuzz-2026、gray-trick-stick-iz-2026、gray-shred-2026 |

## 单板 waistWidth 下限放宽（200 → 150 mm）

本次一并生效，**文件与数据库双写**：`data/categories.yaml` 与 `category.spec_schema`（slug=snowboard）的 `min` 均由 200 改为 150，`max` 保持 300。

原因：GRAY 刻滑线真实腰宽低于原下限——FORCE 190–196、TYCOON 190–196、QUADRA II 190–200、QUADRA 57 为 190 mm。若不放宽，这些**官方数值**会被校验直接拒绝，只能靠改数造假。双板类目的同名 `waistWidth` 下限本就是 55 mm（Atomic Redster S9 等窄板 68 mm），单板原 200 mm 下限对刻滑板过紧。

影响面：未修改任何已有商品档案的字段值；仅放宽可接受的输入范围。若需还原为 200，FORCE / TYCOON / QUADRA II 等窄板档案将不再通过校验。

## 执行流程

1. 上传 15 个种子到暂存区，复制进 `data/snowboard/`（线上种子数 98 → 113）。
2. **首次预检失败**：`gray-force-2026: waistWidth 不能小于 200` —— 线上仍为旧 schema。上传更新后的 `categories.yaml` 后重跑通过。
3. 预检结果：`createPublished` 恰为 15 款、`changed` 为空、`categorySchemaChanges: ["snowboard"]`。
4. 审阅通过后加 `--apply`，在 `Serializable` 事务内写入。

## 验收

- `youpu-api`、`youpu-web`、`youpu-domain-web` 均 active；API 健康检查 HTTP 200。
- 单板列表接口 `total=112`；抽样 5 个新 slug（k2-chloro / gray-genius / gray-force / gray-quadra-ii / gray-shred）详情接口全部 HTTP 200。
- 15 款均写入 CNY 价格；`data_source` 15 条；库内 `waistWidth.min` 已为 150。
- 未重新构建前台：新商品已入库且 API 可返回，但站点页面仍为旧构建。

## 校验限制

- 全仓 `validate:data` 仍报告 **16 处既有错误**，全部来自 action-cam 与 esports-keyboard 未声明的 `priceSource` / `priceStatus`；滑雪类目零错误。本次未修复该既有问题。
- 线上 `sync-curated-snow-data.ts` 的 `CATEGORIES` 为 **5 类**（不含 `ski-protection`），与本地 6 类不一致；本次只影响 snowboard，无实际后果。

## 备份与回滚

发布目录：`/opt/youpu-releases/20261016-gray-15-batch/`。

- `database-before.dump`：写入前 PostgreSQL 自定义格式全库备份，471606 字节，202 个归档条目，SHA-256 `f63b21cb848e9ef4a9ad467693adea1ef75b235dafb7cb1b826199fa4a8e477a`。
- `database-before.contents`：`pg_restore --list` 清单。
- `source-before-snowboard.tar.gz`：写入前 `data/snowboard` 种子目录归档。
- `preview.json`、`apply.log`（含空 stderr 文件）：写入前差异预览与事务结果。
- `incoming/`：本次上传的 15 个种子原件。

本批 15 款均为本次新增，无既有数据被覆盖。如需回退，删除这 15 款的 `product`、`product_stat`、`data_source` 记录及对应 outbox 事件即可。schema 下限如需还原，需同时改回文件与数据库；整库恢复会覆盖备份后产生的用户写入，须先另做当前备份再评估。
