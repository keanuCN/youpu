import type { GearItem, GearSizeSpec } from "@/types";
import { BASE_POOL, DETAIL_POOL, IMG, TOP_POOL } from "./assets";
import { ACTION_CAM_GEAR } from "./action-cams";
import { CASTING_ROD_GEAR } from "./casting-rods";
import { MTB_GEAR } from "./mountain-bikes";
import { ROAD_BIKE_GEAR } from "./road-bikes";
import { SNOWBOARD_SCORE_DIMS, flexBucket, profileFamilyOf } from "./categories";
import { applyCatalogSnapshot } from "./catalog-pack";
import { CATALOG_SNAPSHOT } from "./catalog-snapshot";

type Scores = Record<string, number>;
type Specs = Record<string, number | string | null>;

interface Draft {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  scenes: string[];
  flex: number;
  specs: Specs;
  sizeSpecs?: GearSizeSpec[];
  scores: Scores;
  heat: number;
  whoFor: string[];
  verdict: string;
  strengths: string[];
  weaknesses: string[];
  fits: string[];
  notFits: string[];
  band: [number, number];
  dist: [number, number, number, number, number]; // 1..5 星人数
  isNew?: boolean;
}

function composite(s: Scores): number {
  let sum = 0;
  let w = 0;
  for (const d of SNOWBOARD_SCORE_DIMS) {
    sum += (s[d.key] ?? 5) * d.weight;
    w += d.weight;
  }
  return Math.round((sum / w) * 10 * 10) / 10;
}

/** 进阶指数：硬度 / 有效边刃 / 侧切半径 / 减震 / 稳定性 加权，越高越吃技术 */
function hardcore(specs: Specs, s: Scores): number {
  const flex = Number(specs.flex ?? 5);
  const edge = Number(specs.effectiveEdge ?? 1200);
  const sidecut = Number(specs.sidecut ?? 8);
  const damping = Number(specs.damping ?? 5);
  const stab = s.stability ?? 5;
  const norm = (v: number, lo: number, hi: number) => Math.min(1, Math.max(0, (v - lo) / (hi - lo)));
  const raw =
    norm(flex, 2, 10) * 0.3 +
    norm(edge, 1050, 1400) * 0.2 +
    (1 - norm(sidecut, 6, 11)) * 0.15 +
    norm(damping, 3, 10) * 0.2 +
    norm(stab, 3, 10) * 0.15;
  return Math.round(raw * 100);
}

const DRAFTS: Draft[] = [
  {
    id: "sb-01",
    brand: "Burton",
    model: "Custom Camber",
    year: 2026,
    price: 6299,
    scenes: ["all-mountain", "carving"],
    flex: 7,
    specs: {
      length: 158, effectiveEdge: 1215, sidecut: 7.9, waistWidth: 254, stanceSetback: 15,
      profile: "纯 Camber", shape: "定向双向", core: "Super Fly II 700G Core + Dualzone EGD（FSC 认证）", fiberglass: "45° Carbon Highlights",
      base: "WFO 烧结底板", weight: 2980, damping: 8, pop: 7.5, turnRadiusFeel: "长弧稳、短弧需发力",
      price: 6299, year: 2026, warranty: 3, flex: 7,
    },
    scores: { stability: 8.5, response: 8.5, float: 6, park: 5.5, forgiveness: 5, value: 6.5 },
    heat: 9620,
    whoFor: ["有一定技术基础的全山地玩家", "常滑压雪道、喜欢主动走刃", "希望兼顾跳台和偶尔公园"],
    verdict: "经典全山地 Camber：压雪道刻滑和常规雪场速度下稳定、响应直接；遇到烂雪或极高速仍会有震动与性能边界。",
    strengths: ["压雪道走刃反馈直接，适合主动刻滑", "常规雪场速度下稳定且响应明确", "传统 Camber 支持有力的弹跳与跳台表现"],
    weaknesses: ["需要一定技术和主动发力，低速搓雪不算轻松", "深雪表现不及专门粉雪板", "极高速或破碎雪面仍会感到板头板尾震动"],
    fits: ["已有稳定换刃和控速能力的中高级玩家", "主要滑压雪道、硬雪并偶尔跳台", "喜欢传统 Camber 的直接支撑感"],
    notFits: ["第一年新手", "只玩公园", "只在深雪树林里钻"],
    band: [5200, 7400],
    dist: [3, 8, 26, 88, 141],
    isNew: true,
  },
  {
    id: "sb-02",
    brand: "Jones",
    model: "Mountain Twin",
    year: 2026,
    price: 5899,
    scenes: ["all-mountain", "freestyle"],
    flex: 6,
    specs: {
      length: 157, effectiveEdge: 1210, sidecut: 7.8, waistWidth: 254, stanceSetback: 20,
      profile: "Camber + 板头板尾微摇臂", shape: "定向双向", core: "Master Core（杨木 / 泡桐 1:1）", fiberglass: "Biax + BComp Carbon/Flax Stringers",
      base: "烧结 8000", weight: 2800, damping: 7.5, pop: 7, turnRadiusFeel: "中性，长短弧都好带",
      price: 5899, year: 2026, warranty: 3, flex: 6,
    },
    scores: { stability: 8, response: 7.5, float: 7.5, park: 7.5, forgiveness: 7, value: 8 },
    heat: 8840,
    whoFor: ["一板走天下", "进阶全山地", "偶尔进公园"],
    verdict: "全山地定向双向板，硬雪抓边、switch 与跳台都能兼顾；高速会有板头 chatter，粉雪浮力也不及专门 freeride 板。",
    strengths: ["Traction Tech 在硬雪与冰面提供可靠抓边", "较软板头板尾与 3D 轮廓利于 butter、press 和容错落地", "Sintered 8000 底板保养到位时滑速表现好"],
    weaknesses: ["高速强压时板头会传来 chatter，不是纯高速稳定型", "浮雪表现中等，深粉日需充分后移站位", "烧结底板需要定期打蜡，且并非专职 jib 板"],
    fits: ["一个雪季只买一块板的人", "中高级、什么都想滑一点", "常去雪况多变的雪场"],
    notFits: ["专职公园玩家", "追求极致刻滑的人"],
    band: [5000, 6800],
    dist: [2, 6, 22, 74, 118],
    isNew: true,
  },
  {
    id: "sb-03",
    brand: "Capita",
    model: "Defenders of Awesome",
    year: 2026,
    price: 5299,
    scenes: ["freestyle", "all-mountain"],
    flex: 5.5,
    specs: {
      length: 156, effectiveEdge: 1233, sidecut: 8, waistWidth: 252, stanceSetback: 0,
      profile: "Resort V1 + Flat Kick Tech", shape: "True Twin", core: "P2 Superlight Core", fiberglass: "Hybrid Carbon HolySheet Bi/Bi + Magic Bean Resin",
      base: "Quantum Drive（Sublimation）", weight: 2760, damping: 6, pop: 9, turnRadiusFeel: "灵活，短半径很快",
      price: 5299, year: 2026, warranty: 2, flex: 5.5,
    },
    scores: { stability: 7, response: 8, float: 5.5, park: 9.5, forgiveness: 7, value: 8.5 },
    heat: 9310,
    whoFor: ["公园跳台与雪场全山", "中阶/进阶自由式", "需要 True Twin"],
    verdict: "Resort True Twin 配 Resort V1 + Flat Kick Tech；P2 Superlight 芯材与 Hybrid Carbon HolySheet 主打轻量、响应和弹性。",
    strengths: ["True Twin 对称板型", "Resort V1 + Flat Kick Tech 结合 camber、zero camber 与 reverse camber 区域", "P2 Superlight Core 与碳纤维增强的 Hybrid HolySheet 主打轻量和 pop"],
    weaknesses: ["同季试滑指出深粉浮力偏弱", "不平雪面高速时板头/板尾会 chatter", "接触点对不熟悉该板型的初学者可能显得易咬刃"],
    fits: ["想要公园跳台与雪场多用途", "中阶或进阶自由式", "偏好 True Twin 与弹性反馈"],
    notFits: ["深粉雪是主要用途", "优先追求颠簸高速下的安定感", "第一年新手且需要更宽容的接触点"],
    band: [4400, 6000],
    dist: [4, 11, 30, 96, 132],
    isNew: true,
  },
  {
    id: "sb-04",
    brand: "Salomon",
    model: "Sight",
    year: 2026,
    price: 3299,
    scenes: ["beginner", "all-mountain"],
    flex: 4,
    specs: {
      length: 153, effectiveEdge: 1160, sidecut: 6.8, waistWidth: 250, stanceSetback: 20,
      profile: "Cross Profile Camber", shape: "锥形定向（Tapered Directional）", core: "Aspen Strong Core", fiberglass: "BA MD Fiberglass",
      base: "Extruded EG", weight: 2680, damping: 5.5, pop: 4.5, turnRadiusFeel: "Quadratic，易于入弯与换刃",
      price: 3299, year: 2026, warranty: 2, flex: 4,
    },
    scores: { stability: 5.5, response: 5, float: 6, park: 5, forgiveness: 9.5, value: 9 },
    heat: 6120,
    whoFor: ["初学至中级进阶", "偏好全山与轻 freeride", "希望容易起弯、逐步建立信心"],
    verdict: "偏全山与轻 freeride 的锥形定向板；Cross Profile 以脚下 camber 配合板头尾 rocker，Royal Cork Pads 辅助过滤硬雪振动。",
    strengths: ["Cross Profile 以脚下 camber 和板头尾 rocker 兼顾压雪道控制与浮力", "Tapered Directional 与 Quadratic 侧切强调易起弯和顺畅换刃", "Royal Cork Pads 辅助减振；挤压底板维护相对简便"],
    weaknesses: ["缺少 25/26 同季独立试滑，实际高速稳定、浮力和公园上限尚未验证"],
    fits: ["初学至中级、希望由压雪道向全山/轻 freeride 拓展的骑手"],
    notFits: [],
    band: [2600, 3900],
    dist: [5, 9, 34, 71, 63],
    isNew: true,
  },
  {
    id: "sb-05",
    brand: "Lib Tech",
    model: "T.Rice Pro",
    year: 2025,
    price: 5699,
    scenes: ["freestyle", "all-mountain"],
    flex: 6.5,
    specs: {
      length: 157, sidecut: 8.2, waistWidth: 258, stanceSetback: 0,
      profile: "C2 Hybrid（官方定位）", shape: "Twin（品牌分类；未核为 True Twin）", core: "Aspen / Paulownia 混合", fiberglass: "Biax + Triax",
      base: "Sintered（官方描述：competition-ready）", weight: 2890, damping: 7, pop: 8.5, turnRadiusFeel: "Magne-Traction® 波浪边刃",
      price: 5699, year: 2025, warranty: 3, flex: 6.5,
    },
    sizeSpecs: [
      { size: "148", widthVariant: "standard", contactLengthCm: 116, sidecutRadiusM: 7.5, noseWidthCm: 29.7, waistWidthCm: 25.2, tailWidthCm: 29.7, stanceMinInches: 19.5, stanceMaxInches: 24.5, stanceMinCm: 49.5, stanceMaxCm: 62.25, setbackInches: 0, brandFlexOutOf10: 6, riderWeightRaw: "75+ lb / 35+ kg" },
      { size: "153", widthVariant: "standard", contactLengthCm: 118, sidecutRadiusM: 8, noseWidthCm: 29.5, waistWidthCm: 25.3, tailWidthCm: 29.5, stanceMinInches: 20.25, stanceMaxInches: 25, stanceMinCm: 51.5, stanceMaxCm: 63.5, setbackInches: 0, brandFlexOutOf10: 6, riderWeightRaw: "100+ lb / 45+ kg" },
      { size: "155", widthVariant: "standard", contactLengthCm: 119, sidecutRadiusM: 8.1, noseWidthCm: 29.8, waistWidthCm: 25.5, tailWidthCm: 29.8, stanceMinInches: 20.25, stanceMaxInches: 25, stanceMinCm: 51.5, stanceMaxCm: 63.5, setbackInches: 0, brandFlexOutOf10: 6.5, riderWeightRaw: "110+ lb / 50+ kg" },
      { size: "157", widthVariant: "standard", contactLengthCm: 121, sidecutRadiusM: 8.2, noseWidthCm: 30.1, waistWidthCm: 25.8, tailWidthCm: 30.1, stanceMinInches: 20.25, stanceMaxInches: 25, stanceMinCm: 51.5, stanceMaxCm: 63.5, setbackInches: 0, brandFlexOutOf10: 7, riderWeightRaw: "120+ lb / 55+ kg" },
      { size: "157W", widthVariant: "wide", contactLengthCm: 121, sidecutRadiusM: 8.2, noseWidthCm: 30.5, waistWidthCm: 26.3, tailWidthCm: 30.5, stanceMinInches: 20.25, stanceMaxInches: 25, stanceMinCm: 51.5, stanceMaxCm: 63.5, setbackInches: 0, brandFlexOutOf10: 7, riderWeightRaw: "125+ lb / 60+ kg" },
      { size: "159", widthVariant: "standard", contactLengthCm: 122, sidecutRadiusM: 8.3, noseWidthCm: 30.2, waistWidthCm: 25.9, tailWidthCm: 30.2, stanceMinInches: 20.25, stanceMaxInches: 25, stanceMinCm: 51.5, stanceMaxCm: 63.5, setbackInches: 0, brandFlexOutOf10: 7, riderWeightRaw: "125+ lb / 60+ kg" },
      { size: "161", widthVariant: "standard", contactLengthCm: 124.5, sidecutRadiusM: 8.4, noseWidthCm: 30.4, waistWidthCm: 26, tailWidthCm: 30.4, stanceMinInches: 20.25, stanceMaxInches: 25, stanceMinCm: 51.5, stanceMaxCm: 63.5, setbackInches: 0, brandFlexOutOf10: 7, riderWeightRaw: "130+ lb / 60+ kg" },
      { size: "161W", widthVariant: "wide", contactLengthCm: 124.5, sidecutRadiusM: 8.4, noseWidthCm: 31.1, waistWidthCm: 26.5, tailWidthCm: 31.1, stanceMinInches: 20.25, stanceMaxInches: 25, stanceMinCm: 51.5, stanceMaxCm: 63.5, setbackInches: 0, brandFlexOutOf10: 7, riderWeightRaw: "135+ lb / 65+ kg" },
      { size: "164", widthVariant: "standard", contactLengthCm: 127, sidecutRadiusM: 8.5, noseWidthCm: 31, waistWidthCm: 26.2, tailWidthCm: 31, stanceMinInches: 20.25, stanceMaxInches: 25, stanceMinCm: 51.5, stanceMaxCm: 63.5, setbackInches: 0, brandFlexOutOf10: 7, riderWeightRaw: "140+ lb / 65+ kg" },
      { size: "164W", widthVariant: "wide", contactLengthCm: 127, sidecutRadiusM: 8.5, noseWidthCm: 31.2, waistWidthCm: 26.7, tailWidthCm: 31.2, stanceMinInches: 20.25, stanceMaxInches: 25, stanceMinCm: 51.5, stanceMaxCm: 63.5, setbackInches: 0, brandFlexOutOf10: 7, riderWeightRaw: "145+ lb / 70+ kg" },
    ],
    scores: { stability: 7.5, response: 8, float: 6.5, park: 9, forgiveness: 6, value: 7 },
    heat: 7480,
    whoFor: ["公园与全山兼顾", "寻找 resort 日常板", "偏好 C2 rocker/camber 混合轮廓"],
    verdict: "品牌将 T.Rice Pro 定位为全山自由式 Twin，采用 C2 混合板型与 Horsepower 构造；主打公园和全山多用途。",
    strengths: ["官方 24/25 页面定位为 freestyle / all mountain - twin", "官方描述采用 C2 Hybrid 轮廓与 Horsepower 构造", "官方定位为可覆盖全山并兼作日常 resort 板"],
    weaknesses: ["十个官方历史尺码已录入，但历史页已下线且 153 contact length 存在 118/118.5 cm 来源差异", "未找到可确认目标 24/25 样板与雪况的独立评测；板重、价格口径及图片授权仍待核"],
    fits: ["公园与全山均有需求", "偏好品牌 C2 混合板型"],
    notFits: ["新手", "野雪党", "追求轻量"],
    band: [4800, 6500],
    dist: [3, 9, 28, 68, 84],
  },
  {
    id: "sb-06",
    brand: "Never Summer",
    model: "Proto Slinger",
    year: 2025,
    price: 5499,
    scenes: ["all-mountain", "freestyle"],
    flex: 6,
    specs: {
      length: 156, effectiveEdge: 1190, sidecutRadii: "8.18 / 7.36 m (VARIO; source order)", waistWidth: 253, stanceSetback: 0,
      profile: "Original Rocker Camber（Shock Wave Rocker Camber）", shape: "不对称双向", core: "NS Superlight Wood Core（白杨/泡桐/桦木）", fiberglass: "Carbon VXR Laminate Technology",
      base: "烧结 DuraSurf XT 5501", damping: 4, pop: 8, turnRadiusFeel: "非对称侧切帮助快速换刃，板感偏软、易压板",
      price: 5499, year: 2025, warranty: 3, flex: 4,
    },
    scores: { stability: 7, response: 8.5, float: 5.5, park: 9, forgiveness: 8, value: 7.5 },
    heat: 6890,
    whoFor: ["偏公园的自由式玩家", "喜欢压板、butter 与跳台", "希望在雪道也能轻松转弯"],
    verdict: "偏软、易压且有弹性的公园向双向板；非对称侧切帮助换刃和 carving，日常雪道可用，但不应把它当作深粉雪或高速刻滑专板。",
    strengths: ["软板易压，butter 与 jib 友好", "跳台有足够弹性与 pop", "非对称侧切令转弯和抓边更轻松"],
    weaknesses: ["双向居中设定限制深粉浮力", "不是强攻型高速刻滑板", "中国市场价格来源与板重未核实"],
    fits: ["中级及以上公园/全山自由式玩家", "常玩跳台、道具、butter 或 switch", "希望一块软硬适中的日常公园板"],
    notFits: ["经常滑深粉雪", "追求强支撑的高速刻滑", "需要经官方来源确认重量或本地售价"],
    band: [4600, 6300],
    dist: [2, 7, 24, 61, 79],
  },
  {
    id: "sb-07",
    brand: "Korua Shapes",
    model: "Cafe Racer",
    year: 2026,
    price: 6899,
    scenes: ["carving", "powder"],
    flex: 7.5,
    specs: {
      length: 159, effectiveEdge: 1200, sidecut: 8.2, waistWidth: 269, stanceSetback: 35,
      profile: "全长 Camber（板头平顺过渡）", shape: "定向锥形", core: "轻质杨木芯", fiberglass: "Biaxial",
      base: "高级烧结底板", damping: 8.5, pop: 5, turnRadiusFeel: "以刻滑长弧为主",
      price: 6899, year: 2026, warranty: 2, flex: 7.5,
    },
    sizeSpecs: [
      { size: "144", effectiveEdge: 1050, runningLength: 930, waistWidth: 252, noseWidth: 301, tailWidth: 273, sidecutRadii: "8.0 m", sidecutRadiusM: 8, stanceWidth: "530 mm (ref); 490–570 mm (range)", recommendedStanceCm: 53, adjustableStanceRangeCm: [49, 57], setback: 20, taperMm: 18, boardWeightKg: { gloss: 2.4, brushed: null }, selectableOnCapturedProductPage: false, maxBootSizeEU: 41, maxBootSoleLengthCm: 29.7, recommendedRiderWeightKg: [40, 60], maxRiderHeightCm: 168 },
      { size: "150", effectiveEdge: 1100, runningLength: 950, waistWidth: 254, noseWidth: 302, tailWidth: 276, sidecutRadii: "7.9 m", sidecutRadiusM: 7.9, stanceWidth: "530 mm (ref); 490–570 mm (range)", recommendedStanceCm: 53, adjustableStanceRangeCm: [49, 57], setback: 35, taperMm: 26, boardWeightKg: { gloss: 2.6, brushed: 2.5 }, selectableOnCapturedProductPage: true, maxBootSizeEU: 41, maxBootSoleLengthCm: 30.1, recommendedRiderWeightKg: [45, 75], maxRiderHeightCm: 175 },
      { size: "156", effectiveEdge: 1160, runningLength: 1010, waistWidth: 260, noseWidth: 311, tailWidth: 284, sidecutRadii: "8.0 m", sidecutRadiusM: 8, stanceWidth: "540 mm (ref); 500–580 mm (range)", recommendedStanceCm: 54, adjustableStanceRangeCm: [50, 58], setback: 35, taperMm: 27, boardWeightKg: { gloss: 3.1, brushed: 2.7 }, selectableOnCapturedProductPage: true, maxBootSizeEU: 44, maxBootSoleLengthCm: 30.4, recommendedRiderWeightKg: [50, 80], maxRiderHeightCm: 185 },
      { size: "159", effectiveEdge: 1200, runningLength: 1050, waistWidth: 269, noseWidth: 322, tailWidth: 294, sidecutRadii: "8.2 m", sidecutRadiusM: 8.2, stanceWidth: "550 mm (ref); 510–590 mm (range)", recommendedStanceCm: 55, adjustableStanceRangeCm: [51, 59], setback: 35, taperMm: 28, boardWeightKg: { gloss: 3.2, brushed: 2.8 }, selectableOnCapturedProductPage: true, maxBootSizeEU: 46, maxBootSoleLengthCm: 31.4, productPageRiderWeightKg: [55, 85], sizeGuideRiderWeightKg: [55, 90], maxRiderHeightCm: 190 },
      { size: "164", effectiveEdge: 1230, runningLength: 1090, waistWidth: 276, noseWidth: 330, tailWidth: 302, sidecutRadii: "8.5 m", sidecutRadiusM: 8.5, stanceWidth: "550 mm (ref); 510–590 mm (range)", recommendedStanceCm: 55, adjustableStanceRangeCm: [51, 59], setback: 35, taperMm: 28, boardWeightKg: { gloss: 3.3, brushed: 3.1 }, selectableOnCapturedProductPage: true, maxBootSizeEU: { productPage: 49, sizeGuide: 48 }, maxBootSoleLengthCm: 32.3, recommendedRiderWeightRaw: "65–95+ kg", maxRiderHeightCm: "195+" },
    ],
    scores: { stability: 9.5, response: 8, float: 8.5, park: 2, forgiveness: 3.5, value: 5.5 },
    heat: 5340,
    whoFor: ["刻滑玩家", "长弧高速", "野雪巡航"],
    verdict: "全长 Camber 为刻滑提供持续抓边，顺滑过渡的板头也为软雪保留浮力；它以刻滑为核心，同时覆盖全山地形。",
    strengths: ["全长 Camber 提供从头到尾的抓边感", "28 mm taper 与 35 mm setback 支持定向刻滑", "官方定位兼顾刻滑、全山与一定粉雪浮力"],
    weaknesses: ["全长 Camber 对新手的容错不如摇臂板", "不以公园玩法见长", "官方标注的重量因 Brushed/Gloss 版本而异"],
    fits: ["刻滑爱好者", "追求高速长弧", "常滑野雪开阔面"],
    notFits: ["公园玩家", "新手与中级", "喜欢灵活短弯"],
    band: [6000, 7800],
    dist: [8, 6, 14, 41, 96],
    isNew: true,
  },
  {
    id: "sb-08",
    brand: "Bataleon",
    model: "Evil Twin",
    year: 2025,
    price: 4899,
    scenes: ["freestyle", "all-mountain"],
    flex: 5,
    specs: {
      length: 154, effectiveEdge: 1175, sidecut: 7.94, waistWidth: 250, stanceSetback: 0,
      profile: "3BT + Sidekick（中等 Camber）", shape: "真双向", core: "Ultra Light Core（70%泡桐木/30%白杨木）+ Central Super Tube 碳管", fiberglass: "Triax + 碳纤维加强条",
      base: "Hyper Glide S 烧结底板", weight: 2720, damping: 6, pop: 7.5, turnRadiusFeel: "中等半径，勺形边缘降低入弯咬刃感",
      price: 4899, year: 2025, warranty: 2, flex: 5,
    },
    scores: { stability: 5.5, response: 7.5, float: 7, park: 8.5, forgiveness: 9, value: 8 },
    heat: 6410,
    whoFor: ["公园与全山混合玩法", "常练反脚与双向起跳"],
    verdict: "3BT 与 Sidekick 配合中等 Camber 和真双向板型，定位公园与全山自由式；试滑反馈偏灵活、宽容，但板头尾在高速和烂雪中不适合强压。",
    strengths: ["真双向设计适合 switch", "3BT 与 Sidekick 提供勺形边缘过渡", "同季试滑反馈弹跳扎实、ollie 容易，适合小中型跳台"],
    weaknesses: ["高速或烂雪中强压板头/板尾时稳定性有限", "未有目标季粉雪实测，深粉表现不能确认", "不适合大公园线或重落地；大跳台表现证据有限"],
    fits: ["想兼顾公园与全山的中级及以上骑手", "常练 switch、press 与小中型跳台"],
    notFits: ["追求高速刻滑", "冰面为主的雪场"],
    band: [4100, 5600],
    dist: [2, 8, 27, 78, 82],
  },
  {
    id: "sb-09",
    brand: "Ride",
    model: "Algorhythm",
    year: 2026,
    price: 7299,
    scenes: ["all-mountain", "freestyle", "powder"],
    flex: 8,
    specs: {
      length: 160, widthVariant: "wide", effectiveEdge: 1197, sidecut: 6.9, sidecutRadii: "9.4 / 6.9 / 9.4 m", waistWidth: 264, stanceSetback: 19,
      profile: "Standard Camber", profileFamily: "camber", shape: "Directional Twin", core: "Performance Core（Aspen / Bamboo / Paulownia）",
      fiberglass: "Pre-Cured Glass + Carbon Array 5 + Double Impact Plates", base: "Sintered 4000", damping: 9, pop: 6,
      price: 7299, year: 2026, warranty: 3, flex: 8,
    },
    sizeSpecs: [
      { size: "147", widthVariant: "standard", effectiveEdgeMm: 1096, waistWidthMm: 245, sidecutRadiiMSourceOrder: "9 / 6.5 / 9", stanceWidthIn: 20, stanceSetbackInches: 0.75, riderWeightLbRaw: "75-165" },
      { size: "151", widthVariant: "standard", effectiveEdgeMm: 1121, waistWidthMm: 248, sidecutRadiiMSourceOrder: "9.1 / 6.6 / 9.1", stanceWidthIn: 21, stanceSetbackInches: 0.75, riderWeightLbRaw: "100-180" },
      { size: "154", widthVariant: "standard", effectiveEdgeMm: 1147, waistWidthMm: 251, sidecutRadiiMSourceOrder: "9.2 / 6.7 / 9.2", stanceWidthIn: 22, stanceSetbackInches: 0.75, riderWeightLbRaw: "115-195" },
      { size: "155W", widthVariant: "wide", effectiveEdgeMm: 1159, waistWidthMm: 258, sidecutRadiiMSourceOrder: "9.2 / 6.7 / 9.2", stanceWidthIn: 22, stanceSetbackInches: 0.75, riderWeightLbRaw: "125-205" },
      { size: "157", widthVariant: "standard", effectiveEdgeMm: 1172, waistWidthMm: 254, sidecutRadiiMSourceOrder: "9.3 / 6.8 / 9.3", stanceWidthIn: 22, stanceSetbackInches: 0.75, riderWeightLbRaw: "125-205" },
      { size: "160W", widthVariant: "wide", effectiveEdgeMm: 1197, waistWidthMm: 264, sidecutRadiiMSourceOrder: "9.4 / 6.9 / 9.4", stanceWidthIn: 22, stanceSetbackInches: 0.75, riderWeightLbRaw: "160-220+", noseWidthMm: 311, tailWidthMm: 311, referenceStanceMm: 559 },
      { size: "161", widthVariant: "standard", effectiveEdgeMm: 1197, waistWidthMm: 257, sidecutRadiiMSourceOrder: "9.4 / 6.9 / 9.4", stanceWidthIn: 22, stanceSetbackInches: 0.75, riderWeightLbRaw: "130-210" },
      { size: "164W", widthVariant: "wide", effectiveEdgeMm: 1223, waistWidthMm: 266, sidecutRadiiMSourceOrder: "9.5 / 7 / 9.5", stanceWidthIn: 23, stanceSetbackInches: 0.75, riderWeightLbRaw: "170-220+" },
    ],
    scores: { stability: 9, response: 8.5, float: 9.5, park: 2.5, forgiveness: 4, value: 5 },
    heat: 4980,
    whoFor: ["全山地形", "公园跳台与粉雪线路兼顾", "中高级玩家"],
    verdict: "全山定向双向板，官方定位覆盖公园跳台、粉雪线路与高速压雪道。",
    strengths: ["官方定位覆盖公园、粉雪与压雪道", "官方板型定义为 Directional Twin", "官方尺码表列有 160W 宽版"],
    weaknesses: ["缺少品牌官方 25/26 历史技术表；完整尺码规格目前来自零售商，细分性能仍缺同季直接雪测"],
    fits: ["希望一块板覆盖全山、公园跳台与粉雪线路", "需要 160W 宽版的中高级玩家"],
    notFits: [],
    band: [6400, 8200],
    dist: [4, 5, 11, 33, 72],
    isNew: true,
  },
  {
    id: "sb-10",
    brand: "Arbor",
    model: "A-Frame",
    year: 2025,
    price: 6599,
    scenes: ["carving", "all-mountain"],
    flex: 8.5,
    specs: {
      length: 162, effectiveEdge: 1196, waistWidth: 256, stanceSetback: 10,
      sidecutRadii: "9.3 / 8.4 / 9.3 m",
      profile: "Parabolic Camber / System Camber", shape: "定向", core: "Highland III Core", fiberglass: "Mixed Glassing",
      base: "Sintered Base", weight: 3180, damping: 8.5, pop: 5.5, turnRadiusFeel: "长弧，需要主动压板",
      price: 6599, year: 2025, warranty: 3, flex: 8.5,
    },
    sizeSpecs: [
      { size: "158", overallLength: 1580, waistWidth: 254, effectiveEdge: 1160, sidecutRadii: "9.1 / 8.2 / 9.1 m", noseLength: 310, tailLength: 190, noseWidth: 296, tailWidth: 288, setback: 10 },
      { size: "159W", overallLength: 1590, waistWidth: 267, effectiveEdge: 1170, sidecutRadii: "9.0 / 8.1 / 9.0 m", noseLength: 310, tailLength: 190, noseWidth: 310, tailWidth: 301, setback: 10 },
      { size: "162", overallLength: 1620, waistWidth: 256, effectiveEdge: 1196, sidecutRadii: "9.3 / 8.4 / 9.3 m", noseLength: 312, tailLength: 192, noseWidth: 300, tailWidth: 291, setback: 10 },
      { size: "165MW", overallLength: 1650, waistWidth: 266, effectiveEdge: 1222, sidecutRadii: "9.45 / 8.55 / 9.45 m", noseLength: 314, tailLength: 194, noseWidth: 311, tailWidth: 302, setback: 10 },
      { size: "170W", overallLength: 1700, waistWidth: 274, effectiveEdge: 1268, sidecutRadii: "9.45 / 8.8 / 9.45 m", noseLength: 316, tailLength: 196, noseWidth: 320, tailWidth: 311, setback: 10 },
    ],
    scores: { stability: 7.5, response: 7.5, float: 8.5, park: 2, forgiveness: 3, value: 5.5 },
    heat: 4210,
    whoFor: ["中高级全山骑手", "偏重粉雪浮力", "技术型定向板使用者"],
    verdict: "长半径侧切与 RWD 碳纤维结构，主打粉雪中的控制力，同时也可作为日常全山板滑行。",
    strengths: ["官方配置 2.25 mm Grip Tech 与 3° Fender", "RWD Carbon A-Frames 碳纤维嵌条", "品牌定位兼顾粉雪与日常全山滑行"],
    weaknesses: ["偏硬且尾部刚性高，低速需要主动适应", "单季 162 评测称中速已显飘、高速压雪道信心不足", "不以公园/自由式为主要用途"],
    fits: ["中高级全山骑手", "重视粉雪浮力与软雪控制", "接受其压雪道高速表现有局限"],
    notFits: ["新手", "以高速压雪道刻滑为主", "公园/自由式主滑"],
    band: [5800, 7400],
    dist: [6, 5, 12, 30, 61],
  },
  {
    id: "sb-11",
    brand: "Nitro",
    model: "Team",
    year: 2026,
    price: 4599,
    scenes: ["all-mountain", "freestyle"],
    flex: 6,
    specs: {
      length: 157, effectiveEdge: 1170, sidecut: 7.3, waistWidth: 252, stanceSetback: 15,
      sidecutRadii: "11.3 / 7.3 / 11.3 m",
      profile: "Trüe Camber", profileFamily: "camber", shape: "Directional Twin", core: "Powerlite Core", fiberglass: "Bi-Lite Laminates",
      base: "Sintered EcoSpeed HD Base", weight: 2810, damping: 7, pop: 7.5, turnRadiusFeel: "中性偏快，好带",
      price: 4599, year: 2026, warranty: 2, flex: 6,
    },
    scores: { stability: 7.5, response: 7.5, float: 6.5, park: 7.5, forgiveness: 7, value: 9 },
    heat: 7020,
    whoFor: ["性价比首选", "进阶全山地", "一板多用"],
    verdict: "25/26 Team 采用 Trüe Camber 与 Directional Twin 结构，强调全山控制和弹性，同时覆盖公园与多种雪况。",
    strengths: ["Trüe Camber 提供控制与弹性", "Directional Twin 兼顾正反脚与全山滑行", "官方列出标准与宽版并提供完整尺码数据"],
    weaknesses: ["没有极致项，任何单项都不是第一", "板面图案偏保守", "质保只有两年"],
    fits: ["预算 5000 以内的进阶玩家", "想一块板覆盖全山与公园", "第 3–5 个雪季"],
    notFits: ["追求单项极致", "预算充足想要顶级用料"],
    band: [3900, 5300],
    dist: [1, 6, 25, 82, 96],
    isNew: true,
  },
  {
    id: "sb-12",
    brand: "GNU",
    model: "Rider's Choice",
    year: 2025,
    price: 5199,
    scenes: ["all-mountain", "freestyle"],
    flex: 6.5,
    specs: {
      length: 157.5, effectiveEdge: 1200, waistWidth: 255, stanceSetback: 0,
      sidecutRadii: "7.8 / 8.2 m",
      profile: "C2 Hybrid / GNU C2x", shape: "非对称双向", core: "3-D Delightwood Asym Chip",
      base: "烧结 UHMW", weight: 2860, damping: 7.5, pop: 8, turnRadiusFeel: "抓刃强，波浪边刃",
      price: 5199, year: 2025, warranty: 3, flex: 6.5,
    },
    sizeSpecs: [
      { size: "151.5", widthVariant: "standard", contactLengthCm: 113, sidecutRadiiMSourceOrder: "7.9 / 8.2", noseWidthCm: 29.2, tailWidthCm: 29.2, waistWidthMm: 251, stanceMinInches: 20, stanceMaxInches: 26, stanceSetbackInches: 0, stanceMinCm: 50.8, stanceMaxCm: 66, brandFlex: 5.5, riderWeightRaw: "90+ lb / 60+ kg" },
      { size: "154.5", widthVariant: "standard", contactLengthCm: 116, sidecutRadiiMSourceOrder: "7.7 / 8.1", noseWidthCm: 29.3, tailWidthCm: 29.3, waistWidthMm: 252, stanceMinInches: 20.25, stanceMaxInches: 25, stanceSetbackInches: 0, stanceMinCm: 51.5, stanceMaxCm: 63.5, brandFlex: 5.5, riderWeightRaw: "120+ lb / 60+ kg" },
      { size: "155W", widthVariant: "wide", contactLengthCm: 116, sidecutRadiiMSourceOrder: "7.7 / 8.1", noseWidthCm: 30.7, tailWidthCm: 30.7, waistWidthMm: 265, stanceMinInches: 20.25, stanceMaxInches: 25, stanceSetbackInches: 0, stanceMinCm: 51.5, stanceMaxCm: 63.5, brandFlex: 6, riderWeightRaw: "130+ lb / 60+ kg" },
      { size: "157.5", widthVariant: "standard", contactLengthCm: 119, sidecutRadiiMSourceOrder: "7.8 / 8.2", noseWidthCm: 29.9, tailWidthCm: 29.9, waistWidthMm: 255, stanceMinInches: 20.25, stanceMaxInches: 25, stanceSetbackInches: 0, stanceMinCm: 51.5, stanceMaxCm: 63.5, brandFlex: 6, riderWeightRaw: "130+ lb / 65+ kg" },
      { size: "158W", widthVariant: "wide", contactLengthCm: 119, sidecutRadiiMSourceOrder: "7.8 / 8.2", noseWidthCm: 31.2, tailWidthCm: 31.2, waistWidthMm: 268, stanceMinInches: 20.25, stanceMaxInches: 25, stanceSetbackInches: 0, stanceMinCm: 51.5, stanceMaxCm: 63.5, brandFlex: 6, riderWeightRaw: "130+ lb / 65+ kg" },
      { size: "159.5", widthVariant: "standard", contactLengthCm: 120, sidecutRadiiMSourceOrder: "7.9 / 8", noseWidthCm: 30, tailWidthCm: 30, waistWidthMm: 256, stanceMinInches: 20.25, stanceMaxInches: 25, stanceSetbackInches: 0, stanceMinCm: 51.5, stanceMaxCm: 63.5, brandFlex: 6, riderWeightRaw: "135+ lb / 65+ kg" },
      { size: "161.5", widthVariant: "standard", contactLengthCm: 122, sidecutRadiiMSourceOrder: "8 / 8.4", noseWidthCm: 30.2, tailWidthCm: 30.2, waistWidthMm: 258, stanceMinInches: 20.25, stanceMaxInches: 25, stanceSetbackInches: 0, stanceMinCm: 51.5, stanceMaxCm: 63.5, brandFlex: 7, riderWeightRaw: "140+ lb / 65+ kg" },
      { size: "162W", widthVariant: "wide", contactLengthCm: 122, sidecutRadiiMSourceOrder: "8 / 8.4", noseWidthCm: 31.3, tailWidthCm: 31.3, waistWidthMm: 268, stanceMinInches: 20.25, stanceMaxInches: 25, stanceSetbackInches: 0, stanceMinCm: 51.5, stanceMaxCm: 63.5, brandFlex: 7, riderWeightRaw: "140+ lb / 70+ kg" },
    ],
    scores: { stability: 8, response: 8, float: 7, park: 7.5, forgiveness: 6.5, value: 8 },
    heat: 6630,
    whoFor: ["全能取向", "冰面雪场", "中高阶"],
    verdict: "非对称双向板型结合 C2 Hybrid 轮廓，定位全山自由式；现有旧款滑测更支持其跳台与 switch 表现，深粉雪并非强项。",
    strengths: ["Magne-Traction 波浪边刃增强抓雪", "C2 Hybrid 轮廓兼顾弹跳、滑行与浮雪", "3-D Delightwood Asym Chip 平台强化能量传递"],
    weaknesses: ["深粉雪浮力有限", "道具/jib 表现不如跳台与 switch 突出", "25/26 款缺少同季独立滑测，以上为旧款方向性参考"],
    fits: ["中高阶全山自由式玩家", "偏好跳台、switch 与硬雪抓边", "希望一块板兼顾雪道和公园跳台"],
    notFits: ["新手", "深粉雪专用需求", "以 jib/道具为主"],
    band: [4400, 6000],
    dist: [2, 7, 23, 66, 78],
  },
  {
    id: "sb-13",
    brand: "Jones",
    model: "Hovercraft 2.0",
    year: 2026,
    price: 6999,
    scenes: ["powder"],
    flex: 7,
    specs: {
      length: 160, effectiveEdge: 1260, sidecut: 9.3, waistWidth: 267, stanceSetback: 50,
      profile: "Camber + 大勺形板头", shape: "强定向锥形", core: "FSC 白杨 / 竹", fiberglass: "Triax Basalt",
      base: "烧结 9000", weight: 3200, damping: 8, pop: 5.5, turnRadiusFeel: "深雪里灵活，硬雪面偏钝",
      price: 6999, year: 2026, warranty: 3, flex: 7,
    },
    scores: { stability: 8.5, response: 7, float: 10, park: 1.5, forgiveness: 5, value: 6 },
    heat: 5870,
    whoFor: ["深雪日专用", "野雪树林", "第二块板"],
    verdict: "浮雪的标杆。板头宽度和后移量让它在新雪里像船一样浮着，树林里转向比看起来灵活得多。",
    strengths: ["浮雪能力顶级", "宽板头 + 强锥形，深雪不扎", "树林里转向意外地灵活"],
    weaknesses: ["回到压雪道明显变钝", "只能当第二块板", "价格高"],
    fits: ["已有主力板、想补深雪日", "常去降雪量大的雪场", "野雪树林爱好者"],
    notFits: ["只有一块板的人", "公园玩家", "新手"],
    band: [6100, 7900],
    dist: [3, 4, 13, 38, 104],
    isNew: true,
  },
  {
    id: "sb-14",
    brand: "Burton",
    model: "Process",
    year: 2026,
    price: 5499,
    scenes: ["freestyle", "all-mountain"],
    flex: 5,
    specs: {
      length: 157, effectiveEdge: 1215, sidecut: 8.1, waistWidth: 252, stanceSetback: 12.5,
      profile: "PurePop Camber", shape: "Twin（真双向）", core: "Super Fly II 700G Core + Dualzone EGD",
      fiberglass: "Triax", base: "Sintered Base", damping: 7, pop: 8.5, turnRadiusFeel: "灵活，中短半径",
      price: 5499, year: 2026, warranty: 3, flex: 5,
    },
    sizeSpecs: [
      { size: "152", waistWidth: 249, runningLength: 1125, effectiveEdge: 1165, sidecutRadius: 7.7, sidecutDepth: 20.6, stanceLocation: -12.5, stanceWidth: "530 mm", noseWidth: 290.1, tailWidth: 290.1, riderWeightRange: "54–82 kg", bindingSize: "Men's L, Women's L" },
      { size: "155", waistWidth: 251, runningLength: 1155, effectiveEdge: 1195, sidecutRadius: 7.9, sidecutDepth: 21.1, stanceLocation: -12.5, stanceWidth: "530 mm", noseWidth: 293.2, tailWidth: 293.2, riderWeightRange: "54–82 kg", bindingSize: "Men's L, Women's L" },
      { size: "157", waistWidth: 252, runningLength: 1175, effectiveEdge: 1215, sidecutRadius: 8.1, sidecutDepth: 21.4, stanceLocation: -12.5, stanceWidth: "560 mm", noseWidth: 294.9, tailWidth: 294.9, riderWeightRange: "68–91 kg", bindingSize: "Men's L, Women's L" },
      { size: "159", waistWidth: 255, runningLength: 1195, effectiveEdge: 1235, sidecutRadius: 8.2, sidecutDepth: 21.8, stanceLocation: -12.5, stanceWidth: "560 mm", noseWidth: 298.6, tailWidth: 298.6, riderWeightRange: "68–91 kg", bindingSize: "Men's L, Women's L" },
      { size: "162", waistWidth: 257, runningLength: 1225, effectiveEdge: 1265, sidecutRadius: 8.4, sidecutDepth: 22.4, stanceLocation: -12.5, stanceWidth: "560 mm", noseWidth: 301.8, tailWidth: 301.8, riderWeightRange: "82–118 kg+", bindingSize: "Men's L, Women's L" },
      { size: "155W", waistWidth: 256, runningLength: 1155, effectiveEdge: 1195, sidecutRadius: 7.9, sidecutDepth: 21.1, stanceLocation: -12.5, stanceWidth: "530 mm", noseWidth: 298.2, tailWidth: 298.2, riderWeightRange: "54–82 kg", bindingSize: "Men's L, Women's L" },
      { size: "157W", waistWidth: 257, runningLength: 1175, effectiveEdge: 1215, sidecutRadius: 8.1, sidecutDepth: 21.4, stanceLocation: -12.5, stanceWidth: "560 mm", noseWidth: 299.9, tailWidth: 299.9, riderWeightRange: "68–91 kg", bindingSize: "Men's L, Women's L" },
      { size: "159W", waistWidth: 260, runningLength: 1195, effectiveEdge: 1235, sidecutRadius: 8.2, sidecutDepth: 21.8, stanceLocation: -12.5, stanceWidth: "560 mm", noseWidth: 303.6, tailWidth: 303.6, riderWeightRange: "68–91 kg", bindingSize: "Men's L, Women's L" },
      { size: "162W", waistWidth: 262, runningLength: 1225, effectiveEdge: 1265, sidecutRadius: 8.4, sidecutDepth: 22.4, stanceLocation: -12.5, stanceWidth: "560 mm", noseWidth: 306.8, tailWidth: 306.8, riderWeightRange: "82–118 kg+", bindingSize: "Men's L, Women's L" },
    ],
    scores: { stability: 7, response: 7.5, float: 5.5, park: 8.5, forgiveness: 7.5, value: 7.5 },
    heat: 8120,
    whoFor: ["公园 + 全山", "中阶自由式", "喜欢双向板"],
    verdict: "PurePop Camber、Twin Shape 与 Twin Flex 带来双向自由式脚感，官方定位覆盖跳台、侧击与全山巡航；它不是深粉雪或强攻刻滑专板。",
    strengths: ["Twin Shape 与 Twin Flex 适合 switch 和旋转", "官方定位强调 pop、跳台与侧击", "中等弹性兼顾自由式和全山用途"],
    weaknesses: ["深粉雪需要明显后腿发力，不是粉雪专板", "强压高速与重烂雪能力有限", "公园取向偏跳台/侧击，不以全天技术道具为核心"],
    fits: ["公园与全山各半", "中阶想练跳台", "喜欢真双向"],
    notFits: ["追求高速刻滑", "野雪党"],
    band: [4700, 6300],
    dist: [2, 8, 29, 84, 101],
    isNew: true,
  },
  {
    id: "sb-15",
    brand: "Capita",
    model: "Pathfinder Reverse",
    year: 2024,
    price: 3096,
    scenes: ["beginner", "freestyle"],
    flex: 4,
    specs: {
      length: 151, effectiveEdge: 1202, sidecut: 7.7, waistWidth: 252, stanceSetback: 0,
      profile: "Park V2（插入区平底，插入区外反弓 + Flat Kick）", shape: "真双向", core: "FSC Certified Dual Core（杨木芯 + 山毛榉木条）", fiberglass: "Special Blend 双轴玻纤 + Magic Bean 树脂",
      base: "Superdrive EX（sintruded）", damping: 5, pop: 7, turnRadiusFeel: "灵活、平底滑行感明显，重压和高速下稳定性有限",
      price: 3096, year: 2024, warranty: 2, flex: 4,
    },
    scores: { stability: 5.8, response: 7.2, float: 5.5, park: 8.5, forgiveness: 9, value: 8.1 },
    heat: 5230,
    whoFor: ["想从平花/小道具开始进公园", "喜欢松弛、容易压板的反弓脚感"],
    verdict: "2024 Pathfinder Reverse 用 Park V2 和真双向板型提供松弛、容易转向的自由式脚感；更适合平花、小中型道具与初中阶公园，不是为高速刻滑或硬雪强抓边设计。",
    strengths: ["Park V2 让压板、滑行和转向更宽容", "真双向板型适合 switch 与公园玩法", "Superdrive EX 比普通挤压底更耐磨、维护更省心"],
    weaknesses: ["高速与烂雪稳定性有限", "抓边感不及传统 Camber 板", "本地价格、板重和图片授权仍未核实"],
    fits: ["有基础的公园/平花入门", "偏好低速灵活、松弛脚感"],
    notFits: ["已能连续 S 弯", "追求速度", "冰面为主的雪场"],
    band: [3000, 4300],
    dist: [4, 10, 31, 66, 58],
  },
];

function build(d: Draft, i: number): GearItem {
  const base = BASE_POOL[i % BASE_POOL.length]!;
  const top = TOP_POOL[i % TOP_POOL.length]!;
  const detail = DETAIL_POOL[i % DETAIL_POOL.length]!;
  const comp = composite(d.scores);
  return {
    id: d.id,
    categorySlug: "snowboard",
    brand: d.brand,
    model: d.model,
    year: d.year,
    price: d.price,
    scenes: d.scenes,
    flexValue: d.flex,
    flexLabel: ({ soft: "软", mid: "中", midstiff: "中硬", stiff: "硬" } as Record<string, string>)[flexBucket(d.flex)]!,
    hero: base,
    gallery: [
      { url: base, label: "底面 / BASE" },
      { url: top, label: "板面 / TOPSHEET" },
      { url: detail, label: "细节 / DETAIL" },
      { url: IMG.heroRidge, label: "实地 / FIELD" },
    ],
    specs: { ...d.specs, profileFamily: profileFamilyOf(d.specs.profile) },
    sizeSpecs: d.sizeSpecs,
    scores: d.scores,
    composite: comp,
    hardcore: hardcore(d.specs, d.scores),
    heat: d.heat,
    whoFor: d.whoFor,
    analysis: {
      verdict: d.verdict,
      strengths: d.strengths,
      weaknesses: d.weaknesses,
      fits: d.fits,
      notFits: d.notFits,
    },
    priceBand: { min: d.band[0], max: d.band[1] },
    ratingDist: { "1": d.dist[0], "2": d.dist[1], "3": d.dist[2], "4": d.dist[3], "5": d.dist[4] },
    isNew: !!d.isNew,
    addedAt: `${d.year}-${String(((i * 3) % 12) + 1).padStart(2, "0")}-1${i % 9}`,
  };
}

/** Raw authored catalog content, before the generated runtime snapshot overlay. */
export const PROTOTYPE_GEAR: GearItem[] = [
  ...DRAFTS.map(build),
  ...ACTION_CAM_GEAR,
  ...ROAD_BIKE_GEAR,
  ...MTB_GEAR,
  ...CASTING_ROD_GEAR,
];

/**
 * 统一目录出口：静态构建时优先使用最近一次导出的云端快照，未匹配的人工内容继续保留。
 */
function preserveVerifiedKoruaFacts(item: GearItem): GearItem {
  if (item.id !== "sb-07") return item;
  const draft = DRAFTS.find((entry) => entry.id === item.id);
  if (!draft) return item;

  const { weight: _unverifiedSnapshotWeight, ...snapshotSpecs } = item.specs;
  return {
    ...item,
    model: draft.model,
    year: draft.year,
    specs: {
      ...snapshotSpecs,
      ...draft.specs,
      profileFamily: profileFamilyOf(draft.specs.profile),
    },
    sizeSpecs: draft.sizeSpecs,
    analysis: {
      ...item.analysis,
      verdict: draft.verdict,
      strengths: draft.strengths,
      weaknesses: draft.weaknesses,
      fits: draft.fits,
      notFits: draft.notFits,
    },
  };
}

export const GEAR: GearItem[] = applyCatalogSnapshot(PROTOTYPE_GEAR, CATALOG_SNAPSHOT).map(preserveVerifiedKoruaFacts);

export const GEAR_BY_ID: Record<string, GearItem> = Object.fromEntries(GEAR.map((g) => [g.id, g]));

export function gearOfCategory(slug: string): GearItem[] {
  return GEAR.filter((gear) => gear.categorySlug === slug);
}

export function getGear(id: string): GearItem | undefined {
  return GEAR_BY_ID[id];
}

export function userRating(g: GearItem): number {
  const d = g.ratingDist;
  const total = d["1"] + d["2"] + d["3"] + d["4"] + d["5"];
  if (!total) return 0;
  const sum = d["1"] * 1 + d["2"] * 2 + d["3"] * 3 + d["4"] * 4 + d["5"] * 5;
  return Math.round((sum / total) * 10) / 10;
}

export function reviewCount(g: GearItem): number {
  const d = g.ratingDist;
  return d["1"] + d["2"] + d["3"] + d["4"] + d["5"];
}
