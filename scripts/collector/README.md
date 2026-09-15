# 有谱采集器

这是 M2 数据采集的第一阶段骨架：只访问公开产品页，先做 robots.txt 检查和单域名限速，再保存 raw JSON；页面身份和适配器结果都通过类目 `spec_schema` 的 partial 校验时，才生成 YAML 草稿。

默认输出到 `data/tmp/collector`，不会写数据库，也不会修改 `data/products` 下的正式 seed。图片只记录在 raw 页面快照，草稿不自动带图，避免把导航图误当商品图或未经授权发布。

## 单条采集

在仓库根目录执行：

```powershell
node C:\nvm4w\nodejs\node_modules\pnpm\bin\pnpm.mjs --filter @youpu/collector crawl -- `
  --url "https://eu.burton.com/en-gb/products/mens-burton-custom-camber-snowboard-106881a-o" `
  --brand burton `
  --model "Custom Camber" `
  --year 2026 `
  --slug burton-custom-camber-2026 `
  --mode cheerio
```

`--representative-size 158` 只应在人工确认代表尺寸后传入。未传该参数时，Burton/Jones adapter 仍会把完整 per-size 表保存到 raw，但不会生成可导入的 YAML 草稿。

## 批量采集

`--target-file` 接收一个对象或对象数组。每个对象至少包含：`slug`、`category`、`brand`、`model`、`year`、`url`；可选 `mode` 和 `representativeSize`。引擎并发固定为 1，默认每个域名请求间隔至少 2 秒。

交接文档 Phase 1 的五款 adapter 冒烟目标见 `examples/phase1-adapter-targets.json`。其中 Jones 和 CAPiTA 使用当前官方页面，目标年份按页面当前 SKU/季节记录，不代表已回溯的历史 seed。

剩余 seed 的只读发现目标见 `examples/phase2-discovery-targets.json`。该文件用于判断页面身份和结构，不指定代表尺寸，也不会生成正式 seed；其中部分 URL 是当前季节页面，不能据此覆盖历史年份。

## 当前边界

- 已接入 Cheerio 静态抓取和 Playwright 渲染兜底。
- 已接入 robots 预检、Crawlee robots 选项、单域名限速、失败 raw 留痕。
- 已接入页面身份一致性闸门；重定向到首页、错季节或型号不匹配时只留 raw，并计入 `qualityFailed`。
- 页面标题或标题级内容出现与目标年份冲突的显式年份时，只留 raw 并阻止草稿；没有年份证据时记录 `seasonMatch: null`，不自行推断季节。
- 已实现 Burton、Jones、CAPiTA、KORUA、Bataleon、Nitro、RIDE 和 Never Summer 单板规格表 adapter；其他品牌先保留通用快照，未猜测字段。
- Jones 当前稳定官方产品页的 SKU 为 `J.27`，示例目标按 2027 保存；原 2026 历史链接不作为当前季节数据来源。
- flex、damping、pop、scenes、编辑评分、中文改写、价格和图片授权仍需人工确认。
- raw JSON 是审计材料，不等于已发布数据；导入前仍需人工 diff 和完整（非 partial）校验。
