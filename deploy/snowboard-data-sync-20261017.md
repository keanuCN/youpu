# 单板数据补充与生产库同步 · 2026-10-17

## 本轮采集

- 为 2026/27 代表板及 2025/26 历史型号补齐剩余编辑评分；目前本地 135 款单板档案均有六项 `editorial_scores`。这些是目录编辑判断，不是社区评分或实测条数。
- 为 K2 Antidote、Dreamsicle、Embassy 补入可回查的 2025/26 价格参考，并按 ECB 2026-10-16 参考汇率折算为 CNY。Antidote 日本含税标价 JPY 99,000，折算约 CNY 4,188.93；Dreamsicle 官方商品页索引列 USD 489.95 标价 / USD 293.97 折扣价，折算约 CNY 3,275.91 / 1,965.55；Embassy 官方商品页索引列 USD 539.95 标价 / USD 377.96 折扣价，折算约 CNY 3,610.22 / 2,527.12。美元页面当前返回 410，档案明确标为历史索引快照；这些地区价格都不是中国售价。
- 可追溯商品来源：[K2 Japan Antidote 2026](https://www.k2japan.shop/view/item/000000001294)、[K2 Dreamsicle 2025/26](https://k2snow.com/en-us/p/dreamsicle-womens-snowboard-2526)、[K2 Embassy 2025/26](https://k2snow.com/en-nl/p/embassy-mens-snowboard-2526)。汇率来源：[ECB 日参考汇率说明](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html)，ECB 2026-10-16 EUR/JPY 177.82、EUR/USD 1.1253、EUR/CNY 7.5240；换算值按系统价格规范取整入库。
- 在单板类目规格模板新增 `flexType`（柔韧类型），以容纳 Burton 官方记录中的 `Twin Flex`；原有窄板 `waistWidth` 下限 150 mm 保持。

## 生产数据库变更

- 执行前生产商品总数 **367**，单板已发布 **122**；执行后分别为 **379** 和 **134**。
- 新增 12 款 2026/27 单板：Arbor Bryan Iguchi Pro、Burton Custom X Camber、Burton Feelgood Camber、GNU Banked Country、Jones Freecarver 9000s、Jones Storm Wolf、Lib Tech Golden Orca、Never Summer Valhalla、Nidecker Blade Pro、Rome Stale Crewzer、Rome Stale Fish、Salomon Huck Knife Pro。
- 更新 45 款既有单板，包含评分、规格、三款人民币价格参考、COSONE 描述与 Donek 图片。数据预览显示无新品牌、无缺失草稿、无身份冲突。
- 生产单板 134 款均有编辑评分。新建的 12 款图片仍按种子现状处理；没有为无图款加占位图片。
- 事务保护校验通过：账号、用户评分、评分投票与回复、收藏，以及本次新增产品以外的商品浏览统计，前后摘要一致。
- API 保持 active，健康检查为 `db=true`、`redis=true`。仅同步数据库，未重建或发布前台/应用代码。

## 备份与恢复材料

服务器发布目录：`/opt/youpu-releases/20261017-snowboard-data-sync-01/`。写入前 PostgreSQL 全库自定义格式备份为 `database-before.dump`，归档清单为 `database-before.contents`；同时保存本批种子、预览、应用日志和保护数据摘要。数据库回退前需先另做当前备份并核查用户新写入，不要直接恢复旧全库备份覆盖之后产生的用户数据。
