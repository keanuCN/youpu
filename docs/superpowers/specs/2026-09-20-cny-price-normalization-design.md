# 商品价格统一人民币设计

## 目标

将项目中所有商品价格统一为人民币（CNY）。前台展示、价格筛选、API 响应、后台管理、推荐预算和 SEO 结构化数据都只使用人民币金额；官方页面或采集草稿中的原始币种仍可保留在源文件和原始抓取快照中，便于追溯。

本次固定换算规则为 `1 USD = 7.2 CNY`。换算结果四舍五入到元，人民币原价不再换算。当前资料中出现的非人民币价格只有 USD；共享换算器会明确拒绝未配置的其它币种，避免静默产生错误价格。

## 不做的事情

- 不接入实时汇率服务，避免同一商品价格随时间变化。
- 不在商品主表同时保存两套可筛选价格；数据库中的标准价格只有 CNY。
- 不修改商品的规格、评分、图片或来源链接。
- 不把价格转换扩展为市场价格、促销价或税费计算；本次只处理已有官方参考价。

## 方案

### 1. 共享价格规范化模块

在 `packages/schema/src/price.ts` 提供共享常量和函数：

- `CANONICAL_PRICE_CURRENCY = 'CNY'`
- `PRICE_RATES_TO_CNY = { CNY: 1, USD: 7.2 }`
- `convertPriceToCny(value, currency)`：校验有限非负数字，按币种转换并四舍五入到元。
- `normalizePriceRange(range)`：同时处理 `min`、`max` 和空值，保证输出 `currency: 'CNY'` 且 `min <= max`。

API、seed 导入和 web 本地内容都调用同一套逻辑，不在各应用内复制汇率或舍入规则。

### 2. 数据写入边界统一为 CNY

`apps/api/src/seed/importer.ts` 在写入 Product 前，将 seed 中的价格按其 `currency` 转换为 CNY，再写入 `price_min`、`price_max` 和 `price_currency = 'CNY'`。这样采集器仍可以记录官方页面显示的 USD，正式资料库不会混入 USD。

`packages/schema/src/admin.ts` 将后台商品输入的 `priceCurrency` 限定为 CNY，`apps/api/src/admin/admin.service.ts` 再做一次服务端保护。后台表单移除可编辑的货币代码输入，仅显示“人民币（CNY）”，防止手工录入其它币种。

已有数据库通过一条 Prisma SQL migration 转换现存 USD 行，并增加 `product_price_currency_cny` 检查约束。迁移会在发现未配置币种时直接失败，不会悄悄写入未经换算的金额。

### 3. 本地资料包和 API 读取防线

运动相机、公路车和山地车的本地资料目前以 USD 数字保存。三个资料构建器和对应类目价格筛选范围改用共享换算器生成人民币金额，并统一标记 `priceCurrency: 'CNY'`。已有人民币资料保持原值。

`apps/web/src/lib/content.ts` 在映射 API 产品时增加防御性规范化：即使旧 API 记录暂时返回非 CNY，也会在前台价格、价格区间和币种字段中转换为 CNY。`apps/web/src/lib/format.ts` 的价格格式化统一输出 `¥` 和人民币数字，不再输出 `US$`、`€` 等符号。

## 数据流

```text
官方页面 / seed 草稿（可为 USD）
              |
              v
     共享价格规范化模块
              |
      +-------+--------+
      |                |
      v                v
数据库 Product      本地 web 资料包
price_* = CNY       price/priceBand = CNY
      |                |
      +-------+--------+
              v
   API / 搜索筛选 / 后台 / SEO
          只输出 CNY
```

数据库迁移完成后，搜索服务、推荐预算和 Elasticsearch 同步事件读取到的都是人民币金额，因此价格范围不会出现不同币种混算。若部署环境启用了 Elasticsearch，迁移后执行现有重建索引命令；未启用时不影响数据库和本地资料包。

## 错误处理

- 价格为空时保持为空，不把缺失价格转换成 0。
- 价格不是有限非负数字时，seed 导入和后台请求返回校验错误。
- 币种未在汇率表配置时，seed 导入明确报错并跳过该商品；数据库迁移则整体失败并保留迁移前状态。
- 转换后若最小价大于最大价，拒绝写入。
- 后台直接提交非 CNY 币种时返回参数错误；前端不会提供该输入路径。

## 测试与验收

需要覆盖以下行为：

1. CNY 不变、USD 按 7.2 换算并四舍五入，空值保持为空。
2. 未知币种、负数、非有限数字和反向价格区间被拒绝。
3. seed 导入将 USD 价格写成 CNY。
4. API/web 映射和本地资料包输出的 `priceCurrency` 始终为 CNY。
5. 价格格式化、筛选范围和后台表单不再出现 USD 或其它币种。
6. 数据库迁移后现有 USD 商品的价格、币种和价格范围正确。

完成后运行共享 schema、API 和 web 的相关测试，并执行类型检查与构建；最后通过本地 API、前台和后台页面各抽查一个商品确认显示为人民币。
