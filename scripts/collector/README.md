# 有谱采集器

这是 M2 数据采集的第一阶段骨架：只访问公开产品页，先做 robots.txt 检查和单域名限速，再保存 raw JSON；页面身份和适配器结果都通过类目 `spec_schema` 的 partial 校验时，才生成 YAML 草稿。

默认模式只生成草稿，不改正式 seed。临时无人审核时可使用 `--auto-approve`：没有指定代表尺寸的目标会按标准宽度中位策略自动选尺寸，草稿再经过完整 `spec_schema` 校验和 raw 审计文件校验后写入 `data/<category>/`，状态设为 `published`。正式 seed 已存在时跳过，不覆盖已有文案、评分和图片。

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

## 自动通过

自动选择代表尺寸并直接写入正式 seed：

```powershell
node C:\nvm4w\nodejs\node_modules\pnpm\bin\pnpm.mjs --filter @youpu/collector crawl -- `
  --target-file scripts/collector/examples/phase1-adapter-targets.json `
  --out-dir data/tmp/collector-auto-approve `
  --auto-approve
```

自动通过不会绕过 robots、型号身份、显式年份、字段范围或完整 schema 闸门；失败记录只保留在 `raw/`，不会写入正式 seed。

## 批量采集

`--target-file` 接收一个对象或对象数组。每个对象至少包含：`slug`、`category`、`brand`、`model`、`year`、`url`；可选 `mode`、`representativeSize` 和经过确认的 `identityAliases`。引擎并发固定为 1，默认每个域名请求间隔至少 2 秒。

身份闸门会要求 `model` 或其中一个别名的全部词元出现在页面标题、标题级内容或 JSON-LD 中；字母数字相连的型号（如 `100ZZ` / `100 ZZ`）会统一拆分后比较。

交接文档 Phase 1 的五款 adapter 冒烟目标见 `examples/phase1-adapter-targets.json`。其中 Jones 和 CAPiTA 使用当前官方页面，目标年份按页面当前 SKU/季节记录，不代表已回溯的历史 seed。

剩余 seed 的只读发现目标见 `examples/phase2-discovery-targets.json`。该文件用于判断页面身份和结构，不指定代表尺寸，也不会生成正式 seed；其中部分 URL 是当前季节页面，不能据此覆盖历史年份。

M2 本地数据扩展目标见 `examples/phase2-expansion-targets.json`。本批使用 Jones 与 CAPiTA 官方产品页，开启 `--auto-approve` 后由代表尺寸选择、采集质量闸门、完整 `spec_schema` 校验和 raw 审计共同决定是否落入正式 seed；本地已新增 22 条通过校验的产品 seed。`jones-stratos-2027` 因当前页面显式季节与目标年份不一致，仅保留 raw，不写入正式目录。

## 草稿差异报告

采集完成后，可用 `audit` 对多个草稿目录做 schema 校验，并比较草稿与同 slug 正式 seed 的字段缺口；正式 seed 不存在时只报告为候选新增，不会写入数据：

```powershell
pnpm --filter @youpu/collector run audit:drafts -- `
  --draft-dir data/tmp/collector-badminton-batch/drafts `
  --draft-dir data/tmp/collector-victor-batch/drafts
```

羽毛球拍第一阶段目标见 `examples/badminton-phase1-targets.json`。当前包含 3 条 Yonex 官方 Shopify 产品页目标，规格列表已接入通用 `b/i` 条目提取器和 Yonex adapter，可生成 raw JSON 与 YAML 草稿；材料只有合并字段时保持缺省，不复制到 frame/shaft 两个字段。

Victor 羽毛球拍第一阶段目标见 `examples/victor-badminton-phase1-targets.json`。当前包含 2 条官方零售页目标，`Product Specifications` 表已接入 Victor adapter，可提取重量等级、最高建议磅数、拍框材料和中杆材料；未出现的平衡、硬度等字段保持缺省。

帐篷第一阶段目标见 `examples/tent-phase1-targets.json`。当前接入 2 条 MSR 官方产品页，先从标题、描述和标题级内容提取容纳人数、帐篷类型、适用季节与自立结构；最低重量、面积、材料等未被当前静态快照确认的字段保持缺省，不根据搜索摘要或图片反推。

天幕第一阶段目标见 `examples/tarp-phase1-targets.json`。当前接入 MSR Front Range 4 官方产品页，先从标题、描述和 JSON-LD 提取容纳人数、天幕类型与适用季节；重量、覆盖面积、收纳尺寸等未被当前静态快照确认的字段保持缺省。

睡袋第一阶段目标见 `examples/sleeping-bag-phase1-targets.json`。当前接入 Rab Ascent Down 官方产品页，从标题与 JSON-LD 提取温标标称、填充类型，并从官方厘米尺寸表提取 Regular / Long / Wide 档位；舒适温度、重量和填充量等未被当前静态快照确认的字段保持缺省。

## 当前边界

- 已接入 Cheerio 静态抓取和 Playwright 渲染兜底。
- 已接入 robots 预检、Crawlee robots 选项、单域名限速、失败 raw 留痕。
- 已接入页面身份一致性闸门；重定向到首页、错季节或型号不匹配时只留 raw，并计入 `qualityFailed`。
- 页面标题或标题级内容出现与目标年份冲突的显式年份时，只留 raw 并阻止草稿；没有年份证据时记录 `seasonMatch: null`，不自行推断季节。
- 已实现 Burton、Jones、CAPiTA、KORUA、Bataleon、Nitro、RIDE 和 Never Summer 单板规格表 adapter；其他品牌先保留通用快照，未猜测字段。
- Jones 当前稳定官方产品页的 SKU 为 `J.27`，示例目标按 2027 保存；原 2026 历史链接不作为当前季节数据来源。
- flex、damping、pop、scenes、编辑评分、中文改写、价格和图片授权不会由采集器猜测；自动通过模式会以现有页面事实为准，其余字段保持缺省。
- raw JSON 是审计材料；自动通过模式要求 raw 的采集质量闸门和正式 seed 的完整（非 partial）校验均通过。
