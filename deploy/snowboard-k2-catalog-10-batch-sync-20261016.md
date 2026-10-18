# 单板历史档案同步 · 2026-10-16（K2 官方目录补全 10 款）

## 同步目标

- 服务器：`115.190.156.88`；源码与数据目录：`/opt/youpu`。
- 数据库：PostgreSQL 16.15，本机 `127.0.0.1:5432/youpu`。
- 范围：第四轮基于 **K2 官方 25/26 单板产品目录 PDF** 新建的 10 款 K2 档案。
- 未重新构建或发布前台。

## 背景：推翻了上一轮的「无法建档」结论

上一轮记录把 Antidote、Embassy、Gateway、Isolator、Kandi、Metropolitan、Tree Splitter 七个型号标为官方页 410/404、无法建档。本轮改用 K2 官方 25/26 单板产品目录 PDF（`https://k2sports.a.bigcontent.io/v1/static/k2_2526_product-catalog_snowboard`，由 `k2snow.com/en-us/support/product-catalogs` 链出，67 MB），从目录文本层抽取到这些型号的完整尺码表，因此重新建档。

这七个型号的**官方商品页至今仍是 410/404**，目录是当前唯一可核实来源。

## 数据库变更

- 事务写入：新增 10 款已发布单板，更新 0 款。
- 生产商品总数 357 → 367；单板 `published` 112 → 122（`draft` 1 不变）。
- 其余既有滑雪商品零改动：preview 与 apply 的 `changed` 均为空数组。
- 无新建品牌；类目 `spec_schema` 无变更（本轮不涉及 waistWidth 之外的模板改动）。
- 每款新建 `product_stat` 与 `data_source` 记录（data_source 10 条）。
- 社区评分、评论、收藏、商品统计和账号未改动。

新增 slug：

k2-metropolitan-2026、k2-antidote-2026、k2-kandi-2026、k2-tree-splitter-2026、k2-isolator-2026、k2-vandal-2026、k2-gateway-2026、k2-embassy-2026、k2-courier-2026、k2-dreamsicle-2026

## 价格处理

这 10 款**均不填价格**（库中 `price_min` 为 NULL）。原因：

1. 对应官方商品页已下架（HTTP 410/404）；
2. K2 官方目录是规格型文档，**不含任何标价**（已全文检索 `$xxx.xx`、MSRP、MAP 等标记，均无结果）。

因此不由同批其他 K2 型号的价格推断，价格缺失原因记在 `specs.priceStatus`，沿用仓库既有先例 `ogasaka-fc-s-2027`（无顶层 `price` 块）。若后续找到可核实标价，应补 `price` 块并注明来源与日期。

## 目录并排页的列归属（本次主要风险点）

K2 目录常把两个型号并排印在同一页、共用部分表头，抽取时极易张冠李戴。本次逐页做结构词比对后才取数，归属判断全部写入 raw 证据的 `columnAttribution` 字段：

| 页 | 本档案取的列 | 结构词依据 | 排除的列 |
|---|---|---|---|
| Antidote / Sky Pilot | Antidote | Camber Profile、A1 Core、SpaceGlass、ICG 20 Triax；侧切单值 | Sky Pilot（Combination Camber、VolumeShift、S1 Core、Carbon Y Beam、多半径） |
| Isolator / Tree Splitter | Isolator、Tree Splitter 各自建档 | Isolator 142–162 六码、侧切两段值、Splitrack；Tree Splitter 120/136 两码、侧切 9.00 单值、Flat Rocker | 互相排除 |
| Almanac / Embassy | Embassy | 149–165W 十码、退格 0.50 in、Twin Combination Camber、ICG 10 | Almanac（137–161、退格 CENTER、VolumeShift、Carbon Backbone） |
| Gateway Pop / Gateway | Gateway | Directional Rocker、Beginner to Intermediate | Gateway Pop（Combination Camber、Intermediate to Advanced） |
| Courier / Extravision | Courier | Twin Rocker、Aspen Core、Biax Glass、Catch-Free | Extravision（Combination Camber、Rhythm Core、ICG 10） |
| Dreamsicle / Chloro | Dreamsicle | Directional Rocker、ICG 10、Beginner to Intermediate | Chloro（Twin Rocker、Biax Glass、Beginner） |
| Vandal / Kandi | Vandal、Kandi 各自建档 | 结构描述相同，按尺码集合区分：Vandal 129/134/137/141、Kandi 132/137/142/145W/148W | 互相排除 |

## 保留的原始冲突（未修正）

- Dreamsicle 153 行有效边刃 122 cm，与相邻 149 行的 114 cm 差距偏大；
- Embassy 157W 站距记 20 in，而同长度 157 记 21 in；
- Vandal 134 行尾宽原文写作 `26`（未补零）；
- Metropolitan 146 行腰宽原文写作 `27.8 - 24 - - 27.8`（多一连字符）。

以上均按目录原值录入，并在 raw 证据中保留原始写法。计量换算说明：setback 0.75 in 记 19 mm、0.50 in 记 13 mm，均按 1 in = 25.4 mm 取整并在档案中标注。

## 验收

- `youpu-api`、`youpu-web`、`youpu-domain-web` 均 active；API 健康检查 HTTP 200。
- 单板列表接口 `total=122`；抽样 5 个新 slug（metropolitan / antidote / gateway / embassy / isolator）详情接口全部 HTTP 200。
- 10 款 `sizeSpecs` 逐码入库（6/7/5/10/8/6/5/5/2/4 条），`data_source` 10 条。
- 未重新构建前台：新商品已入库且 API 可返回，但站点页面仍为旧构建。

## 校验限制

- 全仓 `validate:data` 仍报告 **16 处既有错误**，全部来自 action-cam 与 esports-keyboard 未声明的 `priceSource` / `priceStatus`；滑雪类目零错误。本次未修复该既有问题。
- 线上 `sync-curated-snow-data.ts` 的 `CATEGORIES` 为 **5 类**（不含 `ski-protection`），与本地 6 类不一致。

## 备份与回滚

发布目录：`/opt/youpu-releases/20261016-k2-10-batch/`。

- `database-before.dump`：写入前 PostgreSQL 自定义格式全库备份，486621 字节，202 个归档条目，SHA-256 `9b7d7d6bd7e862c75db50075ca7f9231033584502b8aef1cdd8437859c5f2b43`。
- `database-before.contents`：`pg_restore --list` 清单。
- `source-before-snowboard.tar.gz`：写入前 `data/snowboard` 种子目录归档。
- `preview.json`、`apply.log`（含空 stderr 文件）：写入前差异预览与事务结果。
- `incoming/`：本次上传的 10 个种子原件。

本批 10 款均为本次新增，无既有数据被覆盖。如需回退，删除这 10 款的 `product`、`product_stat`、`data_source` 记录及对应 outbox 事件即可。整库恢复会覆盖备份后产生的用户写入，须先另做当前备份再评估。
