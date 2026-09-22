# 有谱采集器

这是 M2 数据采集的第一阶段骨架：只访问公开产品页，先做 robots.txt 检查和单域名限速，再保存 raw JSON；页面身份和适配器结果都通过类目 `spec_schema` 的 partial 校验时，才生成 YAML 草稿。

默认模式只生成草稿，不改正式 seed。临时无人审核时可使用 `--auto-approve`：没有指定代表尺寸的目标会按标准宽度中位策略自动选尺寸，草稿再经过完整 `spec_schema` 校验和 raw 审计文件校验后写入 `data/<category>/`，状态设为 `published`。正式 seed 已存在时跳过，不覆盖已有文案、评分和图片。

默认输出到 `data/tmp/collector`，不会写数据库，也不会修改 `data/products` 下的正式 seed。图片只记录在 raw 页面快照，草稿不自动带图，避免把导航图误当商品图或未经授权发布。每次采集结束还会在输出目录生成 `run-summary.json`，并默认更新独立的 `data/tmp/collector-target-ledger.json`，分别记录本批结果和每个目标的最近状态、hash 与差异状态，便于后续增量复核。

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

`run-summary.json` 中的 `status` 为 `completed` 时，代表本批没有阻塞、质量失败、网络失败、自动通过失败或待复核的更新草稿；出现上述任一情况会标记为 `needs-review`。这个状态只表示批次结果，不替代对草稿、来源和图片授权的复核。

成功采集的 raw artifact 还会写入两个稳定摘要：`rawContentHash` 用于判断页面快照是否变化，`normalizedSpecHash` 用于判断归一化规格是否变化。对象字段会排序后再计算摘要，避免同样的数据因字段顺序不同产生误报；传入上一批目录后即可基于这两个摘要生成字段级 diff。

对同一批目标做增量复核时，可以传入上一批输出目录：

```powershell
pnpm --filter @youpu/collector crawl -- `
  --target-file scripts/collector/examples/tent-phase1-targets.json `
  --out-dir data/tmp/collector-tent-next `
  --previous-out-dir data/tmp/collector-tent-previous
```

当前批次会额外生成 `diff.json`：页面内容变化但归一化规格未变时只标记 `rawContentChanged`；规格字段变化时会列出新增、删除和修改的字段。上一批没有同 slug 记录的产品标记为 `new`，不会把本批没有请求的旧产品误判为下架。

对于已有正式 seed 且规格发生变化的产品，还会生成 `updates/<slug>.yaml` 和 `updates/update-summary.json`。更新草稿是带来源、hash 和字段 diff 的复核 envelope，不会覆盖正式 seed；当前页面缺失的旧字段会保留，删除字段只记录到 `ignoredChanges`，避免一次不完整快照误删有效数据。

需要将台账保存到其他位置时，传入 `--ledger-path`；台账只保留目标运行状态，不作为正式商品数据源。

## 批量采集

`--target-file` 接收一个对象或对象数组。每个对象至少包含：`slug`、`category`、`brand`、`model`、`year`、`url`；可选 `mode`、`representativeSize` 和经过确认的 `identityAliases`。引擎并发固定为 1，默认每个域名请求间隔至少 2 秒。

身份闸门会要求 `model` 或其中一个别名的全部词元出现在页面标题、正文、标题级内容或 JSON-LD 中；字母数字相连的型号（如 `100ZZ` / `100 ZZ`）会统一拆分后比较。正文命中主要用于系列页中的型号规格块，adapter 仍需按目标型号截取并解析，不会因为同页出现其他型号就合并参数。

交接文档 Phase 1 的五款 adapter 冒烟目标见 `examples/phase1-adapter-targets.json`。其中 Jones 和 CAPiTA 使用当前官方页面，目标年份按页面当前 SKU/季节记录，不代表已回溯的历史 seed。

剩余 seed 的只读发现目标见 `examples/phase2-discovery-targets.json`。该文件用于判断页面身份和结构，不指定代表尺寸，也不会生成正式 seed；其中部分 URL 是当前季节页面，不能据此覆盖历史年份。

M2 本地数据扩展目标见 `examples/phase2-expansion-targets.json`。本批使用 Jones 与 CAPiTA 官方产品页，开启 `--auto-approve` 后由代表尺寸选择、采集质量闸门、完整 `spec_schema` 校验和 raw 审计共同决定是否落入正式 seed；本地已新增 22 条通过校验的产品 seed。`jones-stratos-2027` 因当前页面显式季节与目标年份不一致，仅保留 raw，不写入正式目录。

## 草稿差异报告

采集完成后，可用 `audit` 对多个草稿目录做 schema 校验，并比较草稿与同 slug 正式 seed 的字段缺口；正式 seed 不存在时只报告为候选新增，不会写入数据：

```powershell
pnpm --filter @youpu/collector run audit:drafts -- `
  --draft-dir data/tmp/collector-badminton-batch/drafts `
  --draft-dir data/tmp/collector-victor-batch/drafts `
  --diff-file data/tmp/collector-tent-next/diff.json
```

传入 `--diff-file` 后，审计结果会额外标记 `unchanged`（无需更新）、`raw-only`（只保留页面快照）、`review-update`（规格需要复核）和 `new-candidate`（新增候选），并统计各类数量；不传时保持原有 seed/草稿字段审计行为。

羽毛球拍第一阶段目标见 `examples/badminton-phase1-targets.json`。当前包含 3 条 Yonex 官方 Shopify 产品页目标，规格列表已接入通用 `b/i` 条目提取器和 Yonex adapter，可生成 raw JSON 与 YAML 草稿；材料只有合并字段时保持缺省，不复制到 frame/shaft 两个字段。

Victor 羽毛球拍第一阶段目标见 `examples/victor-badminton-phase1-targets.json`。当前包含 2 条官方零售页目标，`Product Specifications` 表已接入 Victor adapter，可提取重量等级、最高建议磅数、拍框材料和中杆材料；未出现的平衡、硬度等字段保持缺省。

帐篷第一阶段目标见 `examples/tent-phase1-targets.json`。当前接入 2 条 MSR 官方产品页，先从标题、描述和标题级内容提取容纳人数、帐篷类型、适用季节与自立结构；最低重量、面积、材料等未被当前静态快照确认的字段保持缺省，不根据搜索摘要或图片反推。

天幕第一阶段目标见 `examples/tarp-phase1-targets.json`。当前接入 MSR Front Range 4 官方产品页，先从标题、描述和 JSON-LD 提取容纳人数、天幕类型与适用季节；重量、覆盖面积、收纳尺寸等未被当前静态快照确认的字段保持缺省。

睡袋第一阶段目标见 `examples/sleeping-bag-phase1-targets.json`。当前接入 Rab Ascent Down 官方产品页，从标题与 JSON-LD 提取温标标称、填充类型，并从官方厘米尺寸表提取 Regular / Long / Wide 档位；舒适温度、重量和填充量等未被当前静态快照确认的字段保持缺省。

炉头第一阶段目标见 `examples/camping-stove-phase1-targets.json`。当前接入 MSR PocketRocket Deluxe 官方产品页，从标题、描述、JSON-LD 和图片替代文本提取燃料类型、炉头类型、点火方式与抗风描述；重量、功率和沸腾时间等未被当前静态快照确认的字段保持缺省。

露营灯第一阶段目标见 `examples/camping-light-phase1-targets.json`。当前接入 BioLite AlpenGlow 500 官方产品页，从技术表提取亮度、重量、电池、续航、防水、尺寸和充电时间等字段；未出现的字段保持缺省。

户外背包第一阶段目标见 `examples/hiking-backpack-phase1-targets.json`。当前接入 Osprey Atmos AG 50 官方产品页，从规格表提取 S/M、L/XL 的容量、重量、尺寸和负载范围，并从页面描述确认背包类型与 AntiGravity 悬挂；未确认的面料和腰带细节保持缺省。

国内品牌帐篷第一阶段目标见 `examples/tent-domestic-phase1-targets.json`。当前接入 Naturehike（挪客）官方产品页，从标题、描述和 JSON-LD 提取容纳人数、背包帐定位、适用季节与自立结构；技术规格折叠区未进入当前静态快照的字段保持缺省。

国内品牌露营灯第一阶段目标见 `examples/camping-light-domestic-phase1-targets.json`。当前接入 Xiaomi 官方产品页，从 JSON-LD 规格描述提取亮度范围、可充电、电池容量、电池类型、充电时间、防护等级、重量和尺寸；页面未明确列出的灯光模式数量与续航保持缺省。

国内品牌炉头第一阶段目标见 `examples/camping-stove-domestic-phase1-targets.json`。当前接入 Naturehike（挪客）官方产品页，从标题和 JSON-LD 描述提取气罐燃料、直连气罐炉、功率、抗风场景和页面明确的燃效描述；未确认的重量、收纳尺寸、沸腾时间和点火结构保持缺省。

国内品牌户外背包第一阶段目标见 `examples/hiking-backpack-domestic-phase1-targets.json`。当前接入 Naturehike（挪客）官方产品页，从标题和 JSON-LD 描述提取徒步定位、铝架背负、正文明确的 30 L 容量、多背长选项和主体面料；页面变体控件未完整展开的容量、重量、负载范围和防雨罩保持缺省。

国内品牌户外背包补充目标见 `examples/hiking-backpack-domestic-phase1-targets.json`。当前接入 KAILAS（凯乐石）官方国际站产品页，从规格描述提取长线徒步定位、内架、48+5 L 容量、重量、尺寸、负载范围、三档背长调节、330D Cordura 和内置防雨罩；比较值 53 L 由页面的 48+5 L 容量标注计算得到，并在 raw 说明中保留口径。

国内热门产品第一阶段目标见 `examples/domestic-hot-phase1-targets.json`。当前接入 Naturehike（挪客）Star River 2 和 Mongar Pro 2 官方产品页，作为 P0 国内热门帐篷批次；采集器仍只提取当前静态快照能够确认的字段，未确认的技术参数保持缺省。

国内热门睡袋第一阶段目标见 `examples/domestic-hot-sleeping-bag-phase1-targets.json`。当前接入 Naturehike（挪客）CW400 官方产品页，从标题、规格描述和页面说明提取温标标称、填充类型、舒适/极限/极端温度、重量、填充重量、收纳尺寸和面料；未明确的字段保持缺省。

国内热门徒步背包第一阶段目标见 `examples/domestic-hot-hiking-backpack-phase1-targets.json`。当前接入 Naturehike（挪客）Seek Wind Pro 官方产品页，额外识别 AIR FLOAT 背负系统、35 L/65 L 容量档位、主面料、防雨罩和 X 型腰带；重量与变体级背负数据未完整确认时保持缺省。

国内热门路亚竿第一阶段目标见 `examples/domestic-hot-casting-rod-phase1-targets.json`。当前接入钓之屋（TSURINOYA）睿系列、霸龙官方产品页，从标题和产品详情表提取两节结构、超快调、鲈鱼和虫竿场景；长度、重量、饵重、线重、力度、轮座、竿胚和碳布含量等图片规格未做 OCR，保持缺省。

国内热门无人机第一阶段目标见 `examples/domestic-hot-drone-phase1-targets.json`。当前接入 DJI Mini 4 Pro、Avata 2 官方技术参数页；Mini 4 Pro 使用 Cheerio，Avata 2 使用 Playwright 渲染兜底。adapter 从页面摘要和去除脚本后的正文提取重量说明、最高视频规格、图传距离、传感器、续航、电池容量、全向避障、智能跟随和竖拍，仍未根据图片或搜索摘要补写字段。

国内热门码表第一阶段目标见 `examples/domestic-hot-bike-computer-phase1-targets.json`。当前接入 iGPSPORT（迹驰）BSC500、iGS800 官方产品页，从页面描述和图片替代文本提取屏幕、触控、续航、导航、离线/在线路书、语音播报和传感器兼容；详细参数表未进入当前静态快照的字段保持缺省。

国内热门摄像第一阶段目标见 `examples/domestic-hot-video-camera-phase1-targets.json`。当前接入 DJI Osmo Pocket 3 官方技术参数页，从页面描述和 JSON-LD 提取 1 英寸 CMOS、4K/120fps、2 英寸屏幕、三轴机械云台增稳和横竖拍；续航、重量和收音未从当前静态页面确认，保持缺省。

国内热门相机第一阶段目标见 `examples/domestic-hot-camera-phase1-targets.json`。当前接入影石 Insta360 X4 官方产品页，从页面正文和规格列表提取 360°全景相机、1/2 英寸传感器、8K/30fps 与 5.7K/60fps、72MP、FlowState 防抖、2.5 英寸屏幕、135 分钟续航、2290 mAh、203 g 和裸机 10 m 防水；身份闸门支持 `X4` 这类短型号的紧凑匹配。

国内热门镜头第一阶段目标见 `examples/domestic-hot-lens-phase1-targets.json`。当前接入 Viltrox 唯卓仕 AF 56mm F1.2 Pro XF 官方商店产品页，从页面正文、规格列表和 JSON-LD 提取 X-mount 卡口、56 mm 焦距、85 mm 等效焦距、F1.2 最大光圈、13/8 光学结构、0.5 m 最近对焦、0.13x 放大倍率、自动对焦、67 mm 滤镜口径、575 g 重量和全天候防护；未合并其他卡口版本。

国内热门滤镜第一阶段目标见 `examples/domestic-hot-filter-phase1-targets.json`。当前接入 NiSi 耐司 TRUE COLOR 色彩保真 CPL 官方中文产品页，从标题、正文和 JSON-LD 提取 CPL 偏振镜、40.5–95 mm 可选口径、True Color 偏振材料、双面低反射纳米镀膜、色彩中性、防水防油、边缘涂黑和标准框 / 铜框选项；可选口径不合并铜框版本额外的 105 mm。

国内热门三脚架第一阶段目标见 `examples/domestic-hot-tripod-phase1-targets.json`。当前接入 SIRUI 思锐 T-S 系列官方产品页，按型号规格块提取 T-1204SK 的碳纤维材质、兼容云台、4 节脚管、管径、高度、独脚架转换高度、1.2 kg 重量和 12 kg 承重；同页其他型号不会混入目标数据，中文规格标签和英文规格标签均可解析。

国内热门稳定器第一阶段目标见 `examples/domestic-hot-gimbal-phase1-targets.json`。当前接入 DJI 大疆 Osmo Mobile 7 系列官方技术参数页，按型号文本提取 Osmo Mobile 7P 的手机稳定器类型、三轴云台、智能跟随 7.0、追踪模块、368 g 重量、3350 mAh 电池、10 小时工作时间、兼容手机范围、215 mm 延长杆、内置三脚架和补光灯参数；同页 Osmo Mobile 7 的型号级参数不会混入。

国内热门麦克风第一阶段目标见 `examples/domestic-hot-microphone-phase1-targets.json`。当前接入 DJI 大疆 DJI Mic Mini 官方技术参数页，按发射器、接收器、充电盒和通用麦克风区块提取组件重量、电池、充电、续航、指向性、频率响应、最大声压级、等效噪声和传输距离；组件字段保持独立，不合并成整套设备的单一重量或续航。

国内热门补光灯第一阶段目标见 `examples/domestic-hot-video-light-phase1-targets.json`。当前接入神牛 Godox SL60II 官方中文产品页，按参数表头定位 SL60IIBi 列，提取功率、色温、最高照度、调光范围、CRI、TLCI、FX 光效、控制距离、尺寸、重量、保荣卡口和低噪风扇；表格中的跨型号公共行会复用明确公共值，不读取 SL60IID 列。

国内热门存储卡第一阶段目标见 `examples/domestic-hot-memory-card-phase1-targets.json`。当前接入 Lexar 雷克沙 Professional 1066x SDXC UHS-I SILVER 系列官方中文产品页，从正文和 JSON-LD 提取 SDXC / UHS-I、64GB–1TB 容量、160 MB/s 读取速度、按容量区分的写入速度、Class 10/U3/V30、4K 视频支持、尺寸、温度、防护和质保；不把不同容量的写入速度合并。

国内热门运动相机第一阶段目标见 `examples/domestic-hot-action-cam-phase1-targets.json`。当前接入影石 Insta360 X5 官方中文产品页，从正文提取 1/1.28 英寸传感器、8K/30fps、最高帧率、7200 万像素、360° 视场、FlowState 防抖、15 m 裸机防水、200 g、208 分钟续航、microSD 和适用场景；页面内的 X6 对比栏不会混入 X5 seed。

国内热门运动手表第一阶段目标见 `examples/domestic-hot-sports-watch-phase1-targets.json`。当前接入 Amazfit 台湾官方 T-Rex 3 Pro 产品页，按 48mm 规格区块提取屏幕、亮度、盖板、重量、防水、材质、电池、GNSS 续航、定位、离线导航、运动模式和传感器；同页的 44mm 规格不会混入 48mm seed。

## 当前边界

- 已接入 Cheerio 静态抓取和 Playwright 渲染兜底。
- 已接入 robots 预检、Crawlee robots 选项、单域名限速、失败 raw 留痕。
- 已接入页面身份一致性闸门；重定向到首页、错季节或型号不匹配时只留 raw，并计入 `qualityFailed`。
- 页面标题或标题级内容出现与目标年份冲突的显式年份时，只留 raw 并阻止草稿；没有年份证据时记录 `seasonMatch: null`，不自行推断季节。
- 已实现 Burton、Jones、CAPiTA、KORUA、Bataleon、Nitro、RIDE 和 Never Summer 单板规格表 adapter；其他品牌先保留通用快照，未猜测字段。
- Jones 当前稳定官方产品页的 SKU 为 `J.27`，示例目标按 2027 保存；原 2026 历史链接不作为当前季节数据来源。
- flex、damping、pop、scenes、编辑评分、中文改写、价格和图片授权不会由采集器猜测；自动通过模式会以现有页面事实为准，其余字段保持缺省。
- raw JSON 是审计材料；自动通过模式要求 raw 的采集质量闸门和正式 seed 的完整（非 partial）校验均通过。
