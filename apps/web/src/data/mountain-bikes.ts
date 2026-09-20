import { resolveImageUrl } from "@/lib/image-url";
import { convertPriceToCny } from "@youpu/schema";
import type { FitGuide, GearItem } from "@/types";
import { MTB_SCORE_DIMS } from "./categories";

type Specs = Record<string, number | string | null>;
type Scores = Record<string, number>;

interface MountainBikeDraft {
  id: string;
  brand: string;
  model: string;
  year: number;
  price?: number;
  scenes: string[];
  specs: Specs;
  scores: Scores;
  image: string;
  whoFor: string[];
  verdict: string;
  strengths: string[];
  weaknesses: string[];
  fits: string[];
  notFits: string[];
}

const NEURON_FIT_GUIDE: FitGuide = {
  rows: [
    { size: "XS", height: "≤166 cm", headAngle: "66°", seatAngle: "76°", wheelbase: 1139, stack: 587, reach: 410, wheelSize: '27.5"' },
    { size: "S", height: "166–175 cm", headAngle: "66°", seatAngle: "76°", wheelbase: 1164, stack: 596, reach: 430, wheelSize: '27.5"' },
    { size: "M", height: "175–183 cm", headAngle: "66°", seatAngle: "76°", wheelbase: 1203, stack: 626, reach: 455, wheelSize: '29"' },
    { size: "L", height: "183–192 cm", headAngle: "66°", seatAngle: "76°", wheelbase: 1234, stack: 639, reach: 480, wheelSize: '29"' },
    { size: "XL", height: "≥192 cm", headAngle: "66°", seatAngle: "76°", wheelbase: 1271, stack: 656, reach: 510, wheelSize: '29"' },
  ],
  note: "Canyon Neuron CF 官方几何表；XS/S 使用 27.5 英寸轮径，M/L/XL 使用 29 英寸轮径。",
};

const SPECTRAL_FIT_GUIDE: FitGuide = {
  rows: [
    { size: "XS", height: "≤168 cm", headAngle: "64°", seatAngle: "76.5°", wheelbase: 1184, stack: 612, reach: 425, wheelSize: 'Mullet（前29 / 后27.5）' },
    { size: "S", height: "163–177 cm", headAngle: "64°", seatAngle: "76.5°", wheelbase: 1213, stack: 621, reach: 450, wheelSize: 'Mullet（前29 / 后27.5）' },
    { size: "M", height: "172–185 cm", headAngle: "64°", seatAngle: "76.5°", wheelbase: 1243, stack: 630, reach: 475, wheelSize: 'Mullet / 29"' },
    { size: "L", height: "180–194 cm", headAngle: "64°", seatAngle: "76.5°", wheelbase: 1272, stack: 639, reach: 500, wheelSize: 'Mullet / 29"' },
    { size: "XL", height: "≥189 cm", headAngle: "64°", seatAngle: "76.5°", wheelbase: 1301, stack: 648, reach: 525, wheelSize: 'Mullet / 29"' },
  ],
  note: "Canyon Spectral CF 官方表中的 Mullet 几何；切换为 29 英寸后，轮距与骑姿会按官方配置表变化，购买前需确认轮径版本。",
};

const STUMPJUMPER_FIT_GUIDE: FitGuide = {
  rows: [
    { size: "S1", wheelSize: '前29" / 后27.5"' },
    { size: "S2", wheelSize: '前29" / 后27.5"' },
    { size: "S3", wheelSize: '29" / 29"' },
    { size: "S4", wheelSize: '29" / 29"' },
    { size: "S5", wheelSize: '29" / 29"' },
    { size: "S6", wheelSize: '29" / 29"' },
  ],
  note: "Specialized Stumpjumper 15 官方尺码表；S1 前叉为 140mm，S2–S6 为 150mm，最终几何需按具体调节与轮径确认。",
};

const EPIC_FIT_GUIDE: FitGuide = {
  rows: [{ size: "S" }, { size: "M" }, { size: "L" }, { size: "XL" }],
  note: "Specialized S-Works Epic 8 官方页面列出 S/M/L/XL 尺码；当前内容只接入尺码选项，Stack、Reach 等完整几何待官方表格补齐。",
};

const XTC_FIT_GUIDE: FitGuide = {
  rows: [
    { size: "S", height: "163–172 cm", headAngle: "69.5°", seatAngle: "73.5°", wheelbase: 1087, stack: 604, reach: 416, wheelSize: '29"' },
    { size: "M", height: "171–180 cm", headAngle: "69.5°", seatAngle: "73.5°", wheelbase: 1106, stack: 604, reach: 435, wheelSize: '29"' },
    { size: "L", height: "179–188 cm", headAngle: "70°", seatAngle: "73.5°", wheelbase: 1128, stack: 613, reach: 453, wheelSize: '29"' },
    { size: "XL", height: "187–198 cm", headAngle: "70°", seatAngle: "73.5°", wheelbase: 1159, stack: 632, reach: 477, wheelSize: '29"' },
  ],
  note: "Giant XTC Advanced 29 官方几何表；硬尾车的有效骑姿还会明显受前叉下沉量和把位影响。",
};

const TRANCE_FIT_GUIDE: FitGuide = {
  rows: [
    { size: "S", headAngle: "64.4° / 64.8° / 65.1°", seatAngle: "76.8° / 77.2° / 77.5°", wheelSize: '29"；后轮可切换 27.5"' },
    { size: "M", headAngle: "64.4° / 64.8° / 65.1°", seatAngle: "76.8° / 77.2° / 77.5°", wheelSize: '29"；后轮可切换 27.5"' },
    { size: "L", headAngle: "64.4° / 64.8° / 65.1°", seatAngle: "76.8° / 77.2° / 77.5°", wheelSize: '29"；后轮可切换 27.5"' },
    { size: "XL", headAngle: "64.4° / 64.8° / 65.1°", seatAngle: "76.8° / 77.2° / 77.5°", wheelSize: '29"；后轮可切换 27.5"' },
  ],
  note: "Giant Trance X 官方页面给出三档 Flip Chip 几何；当前保留官方角度范围与轮径选项，Stack、Reach 和不同尺码完整表待补齐。",
};

const MTB_FIT_GUIDES: Record<string, FitGuide> = {
  "mtb-canyon-neuron-cf-8-2026": NEURON_FIT_GUIDE,
  "mtb-canyon-spectral-cf-7-2026": SPECTRAL_FIT_GUIDE,
  "mtb-specialized-stumpjumper-15-comp-2025": STUMPJUMPER_FIT_GUIDE,
  "mtb-specialized-s-works-epic-8-2026": EPIC_FIT_GUIDE,
  "mtb-giant-xtc-advanced-29-1-2026": XTC_FIT_GUIDE,
  "mtb-giant-trance-x-advanced-0-2024": TRANCE_FIT_GUIDE,
};

function composite(scores: Scores): number {
  let sum = 0;
  let weightSum = 0;
  for (const dimension of MTB_SCORE_DIMS) {
    const value = scores[dimension.key];
    if (typeof value !== "number") continue;
    sum += value * dimension.weight;
    weightSum += dimension.weight;
  }
  return weightSum ? Math.round((sum / weightSum) * 10 * 10) / 10 : 0;
}

function build(draft: MountainBikeDraft, index: number): GearItem {
  const image = resolveImageUrl(draft.image);
  const price = convertPriceToCny(draft.price ?? 0, "USD");
  return {
    id: draft.id,
    categorySlug: "mtb",
    brand: draft.brand,
    model: draft.model,
    year: draft.year,
    price,
    priceCurrency: "CNY",
    scenes: draft.scenes,
    flexValue: 0,
    flexLabel: "不适用",
    hero: image,
    gallery: [{ url: image, label: "官方产品图 / PRODUCT" }],
    specs: draft.specs,
    fitGuide: MTB_FIT_GUIDES[draft.id],
    scores: draft.scores,
    composite: composite(draft.scores),
    hardcore: 0,
    // 未接入真实埋点与用户实测前，不填造热度和评分分布。
    heat: 0,
    whoFor: draft.whoFor,
    analysis: {
      verdict: draft.verdict,
      strengths: draft.strengths,
      weaknesses: draft.weaknesses,
      fits: draft.fits,
      notFits: draft.notFits,
    },
    priceBand: { min: price, max: price },
    ratingDist: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
    isNew: false,
    addedAt: `2026-09-${String(20 + (index % 8)).padStart(2, "0")}`,
  };
}

const DRAFTS: MountainBikeDraft[] = [
  {
    id: "mtb-canyon-neuron-cf-8-2026",
    brand: "Canyon",
    model: "Neuron CF 8",
    year: 2026,
    price: 2799,
    scenes: ["trail", "climbing", "descending", "all-mountain"],
    specs: {
      bikeType: "trail",
      frameMaterial: "Carbon (CF)",
      wheelSize: 'XS/S 27.5"；M/L/XL 29"',
      frontTravel: 140,
      rearTravel: 140,
      suspension: "FOX 34 Float Performance GRIP + FOX Float DPS Performance",
      groupset: "Shimano SLX 12s",
      drivetrain: "1x12，10-51T",
      brakes: "hydraulic-disc",
      wheelset: "DT Swiss XM 1700",
      tireSize: '2.4"（按尺码适配 27.5 / 29）',
      dropper: "Canyon G5，150–200mm（按尺码）",
      scenes: "林道 · 爬坡 · 下坡 · 全山地",
    },
    scores: { climbing: 8.7, descending: 8.5, control: 8.7, comfort: 8.8, versatility: 9.2, value: 8.7 },
    image: "https://www.canyon.com/dw/image/v2/BCML_PRD/on/demandware.static/-/Sites-canyon-master/default/dw07984cc9/images/full/full_2023_/2023/full_2023_3170_neuron-cf-8_sr-bk_P5.png?sw=1145&sh=645&sm=fit&sfrm=png",
    whoFor: ["想要一台全能林道主力车", "长距离爬坡后也要有下坡余量", "希望碳纤车架兼顾舒适与操控"],
    verdict: "Neuron CF 8 的重点不是极端行程，而是让一台车把日常林道、长距离爬升和技术下坡串起来。140mm 前后行程给了足够容错，29 / 27.5 尺码策略也更容易做尺寸适配。",
    strengths: ["140mm 前后避震覆盖面广", "碳纤车架和 DT Swiss XM 1700 轮组配置均衡", "1x12 与 10-51T 齿比适合连续爬坡"],
    weaknesses: ["不是专门为大型跳台或 Bike Park 设计", "完整重量需要按尺码和配置确认", "促销价可能随地区和库存变化"],
    fits: ["周末林道、长距离越野", "爬坡和下坡比例均衡的路线", "想从硬尾升级到全避震的人"],
    notFits: ["只参加纯 XC 竞赛", "主要骑大型落差和连续跳台"],
  },
  {
    id: "mtb-canyon-spectral-cf-7-2026",
    brand: "Canyon",
    model: "Spectral CF 7",
    year: 2026,
    price: 3999,
    scenes: ["trail", "climbing", "descending", "all-mountain"],
    specs: {
      bikeType: "trail",
      frameMaterial: "CF 页面版本（组件材质待复核）",
      completeWeight: 15.99,
      wheelSize: '29"；可按配置切换 Mullet',
      frontTravel: 150,
      rearTravel: 140,
      suspension: "FOX 36 Rhythm + FOX Float X Performance",
      groupset: "Shimano Deore",
      drivetrain: "1x12，10-51T",
      brakes: "hydraulic-disc",
      wheelset: "XC 30 AL / END30AL",
      tireSize: '29x2.4"',
      dropper: "150–230mm（按尺码）",
      scenes: "林道 · 爬坡 · 下坡 · 全山地",
    },
    scores: { climbing: 8.2, descending: 9.3, control: 9.1, comfort: 8.8, versatility: 9.1, value: 8.4 },
    image: "https://dma.canyon.com/image/upload/w_1145,h_645,c_fit/f_jpg/q_auto/v1787554526/2027_FULL_spectral_cf-7_4380_M179_P08_P5_29_yyqkjb",
    whoFor: ["技术林道和高速下坡", "想要一台更有余量的全能车", "需要在 29 与 Mullet 之间调整骑感"],
    verdict: "Spectral CF 7 把重点放在高速稳定、抓地和技术路线余量上。150mm 前叉与 140mm 后避震比 Neuron 更激进，适合愿意用一点爬坡效率换下坡信心的骑手。",
    strengths: ["150 / 140mm 悬挂对复杂林道更有余量", "K.I.S. 稳定系统和可切换轮径增强可玩性", "Deore 1x12 与四活塞碟刹偏耐用取向"],
    weaknesses: ["整车接近 16kg，长距离爬升负担更明显", "官网页面不同位置的车架材质描述需要复核", "不应把它当作轻量 XC 竞赛车"],
    fits: ["复杂林道、碎石和高速下坡", "需要一台偏下坡能力的全能山地车", "愿意通过轮径和几何设置调整手感"],
    notFits: ["把爬坡效率和整车轻量放第一位", "通勤或平缓绿道为主"],
  },
  {
    id: "mtb-specialized-stumpjumper-15-comp-2025",
    brand: "Specialized",
    model: "Stumpjumper 15 Comp",
    year: 2025,
    price: 4999.99,
    scenes: ["trail", "climbing", "descending", "all-mountain"],
    specs: {
      bikeType: "trail",
      frameMaterial: "FACT 11m Carbon",
      completeWeight: 14.87,
      wheelSize: '前 29"；后轮按尺码 27.5" / 29"',
      frontTravel: 150,
      rearTravel: 145,
      suspension: "FOX Float 36 Rhythm + FOX Float Performance GENIE",
      groupset: "SRAM S-1000 Eagle T-Type AXS",
      drivetrain: "1x12，10-52T",
      brakes: "hydraulic-disc",
      wheelset: "Specialized 铝合金轮组，30mm 内宽，真空胎准备",
      tireSize: '前 29x2.3"；后轮按尺码 27.5 / 29',
      dropper: "X-Fusion Manic 升降座管",
      scenes: "林道 · 爬坡 · 下坡 · 全山地",
    },
    scores: { climbing: 8.4, descending: 9.2, control: 9.1, comfort: 9.3, versatility: 9.4, value: 8.1 },
    image: "https://assets.specialized.com/i/specialized/93325-50_SJ-15-COMP-SEA-SILDST_HERO-SQUARE",
    whoFor: ["想要一台覆盖多数林道的主力车", "重视悬挂抓地和舒适性", "希望电子变速与碳纤车架一步到位"],
    verdict: "Stumpjumper 15 Comp 的 GENIE 后避震更强调抓地、支撑和减少触底。它不是单纯堆行程，而是用可调几何和不同后轮尺寸把林道适应面做宽。",
    strengths: ["145mm 后行程和 GENIE 技术兼顾抓地与支撑", "S1–S6 尺码与轮径选择丰富", "电子传动、四活塞碟刹和升降座管配置完整"],
    weaknesses: ["价格已经进入高端整车区间", "轮组不是整车最顶级的部分", "尺寸、轮径和几何设置需要认真匹配"],
    fits: ["技术林道和长距离山地骑行", "希望一台车兼顾爬坡、过弯和下坡", "愿意花时间调悬挂和姿势"],
    notFits: ["只想要最轻的 XC 竞赛车", "不想维护电子变速和全避震系统"],
  },
  {
    id: "mtb-specialized-s-works-epic-8-2026",
    brand: "Specialized",
    model: "S-Works Epic 8",
    year: 2026,
    price: 14999.99,
    scenes: ["cross-country", "climbing", "trail"],
    specs: {
      bikeType: "xc",
      frameMaterial: "S-Works FACT 12m Carbon",
      completeWeight: 10,
      wheelSize: '29"',
      frontTravel: 120,
      rearTravel: 120,
      suspension: "RockShox SID Ultimate + SIDLuxe Ultimate Flight Attendant",
      groupset: "SRAM XX SL Eagle AXS",
      drivetrain: "1x12，10-52T，34T",
      brakes: "hydraulic-disc",
      wheelset: "Roval Control World Cup 碳纤轮组",
      tireSize: '29x2.35"',
      dropper: "RockShox Reverb AXS，125 / 150 / 175mm（按尺码）",
      scenes: "越野 XC · 爬坡 · 林道",
    },
    scores: { climbing: 9.7, descending: 8.8, control: 9.2, comfort: 8.1, versatility: 8.1, value: 6.8 },
    image: "https://assets.specialized.com/i/specialized/90326-00_EPIC-8-SW-CARB-BLUPRL-METWHTSIL_HERO-SQUARE",
    whoFor: ["XC 竞赛和高速越野", "在意爬坡效率与加速", "想要电子悬挂自动调整的旗舰用户"],
    verdict: "S-Works Epic 8 是明确服务于 XC 竞赛的旗舰：120mm 前后行程、轻量车架和 Flight Attendant 都在帮助骑手维持速度。它的价格也意味着购买理由必须来自真实的竞赛需求。",
    strengths: ["官方尺寸参考重量约 10kg", "120mm 悬挂兼顾技术 XC 路线", "高端碳轮组、功率计和 Flight Attendant 配置完整"],
    weaknesses: ["价格极高，性价比不是它的核心卖点", "轻量竞赛设定对尺寸和维护更敏感", "电子系统与专用部件的维护成本高"],
    fits: ["XC 竞赛、爬坡和高速越野", "希望开箱即用的旗舰竞赛车", "能承担高端传动与悬挂维护"],
    notFits: ["主要骑复杂下坡和 Bike Park", "预算更适合先升级轮组或训练装备"],
  },
  {
    id: "mtb-giant-xtc-advanced-29-1-2026",
    brand: "Giant",
    model: "XTC Advanced 29 1",
    year: 2026,
    price: 4000,
    scenes: ["cross-country", "climbing", "trail"],
    specs: {
      bikeType: "hardtail",
      frameMaterial: "Advanced-grade Composite",
      wheelSize: '29"',
      frontTravel: 100,
      rearTravel: 0,
      suspension: "Fox 32 Float Step Cast Performance 100mm，双档锁定",
      groupset: "Shimano Deore XT M8100",
      drivetrain: "1x12，10-51T，32T",
      brakes: "hydraulic-disc",
      wheelset: "Giant XCR 2 Carbon 29 WheelSystem",
      tireSize: '前 29x2.4"；后 29x2.25"',
      dropper: "Giant Contact Switch Core，100 / 120mm（按尺码）",
      scenes: "越野 XC · 爬坡 · 林道",
    },
    scores: { climbing: 9.3, descending: 7.3, control: 8.2, comfort: 6.8, versatility: 7.8, value: 8.4 },
    image: "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_600%2Cq_80%2Cw_800/qrpefgqfjrzq6x21nwsw/MY26XTCAdvanced291_ColorAAbyssBlack_Bronze.jpg",
    whoFor: ["重视踩踏效率和爬坡", "喜欢硬尾反馈和维护简单", "希望原厂就有碳轮组的 XC 用户"],
    verdict: "XTC Advanced 29 1 用硬尾结构把力量传递和维护简单放在前面。它更适合清晰的 XC 和爬坡路线，不能把 100mm 前叉当成全能林道车的替代品。",
    strengths: ["碳纤硬尾和 29 英寸轮径踩踏效率高", "XT 1x12、10-51T 齿比覆盖爬坡", "XCR 2 碳轮组与升降座管配置有吸引力"],
    weaknesses: ["没有后避震，连续碎石路舒适性有限", "100mm 前叉对大落差和高速下坡余量有限", "官方建议由经销商确认实际重量和尺寸"],
    fits: ["XC、爬坡和轻度林道", "想要简单可靠的高性能硬尾", "路线以踩踏和节奏为主"],
    notFits: ["经常骑技术下坡和跳台", "希望一台车覆盖重度全山地"],
  },
  {
    id: "mtb-giant-trance-x-advanced-0-2024",
    brand: "Giant",
    model: "Trance X Advanced 0",
    year: 2024,
    price: 8000,
    scenes: ["trail", "climbing", "descending", "all-mountain"],
    specs: {
      bikeType: "trail",
      frameMaterial: "Advanced-Grade Composite",
      wheelSize: '前 29"；后 29" 或 27.5" Mullet',
      frontTravel: 150,
      rearTravel: 140,
      suspension: "FOX 36 Factory GRIP2 150mm + Giant Maestro 140mm",
      groupset: "SRAM XO T-Type AXS",
      drivetrain: "1x12，30T",
      brakes: "hydraulic-disc",
      wheelset: "Giant TRX 碳纤轮组，30mm 内宽",
      tireSize: '前 29"；后 29" / 27.5"（按设定）',
      dropper: "按尺码与配置",
      scenes: "林道 · 爬坡 · 下坡 · 全山地",
    },
    scores: { climbing: 8.1, descending: 9.4, control: 9.3, comfort: 9.1, versatility: 9.1, value: 7.2 },
    image: "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_400%2Cq_80%2Cw_600/skym90dx4rx42jofovsh/MY24TranceXAdvanced0_ColorABlueDragonfly.jpg",
    whoFor: ["技术林道和高速下坡", "希望调节几何与后轮尺寸", "想要旗舰级碳轮和悬挂配置"],
    verdict: "Trance X Advanced 0 通过 Maestro 后避震、150mm 前叉和可切换后轮尺寸，把技术路线的稳定和可玩性放在首位。它更像一台高规格林道工具，而不是轻量 XC 车。",
    strengths: ["150 / 140mm 悬挂适合技术林道", "Maestro 与三档几何调节提供较强控制感", "FOX Factory、SRAM XO 和 Giant TRX 碳轮组规格高"],
    weaknesses: ["价格高，维护与备件成本也会随之上升", "整车定位偏激进，日常平缓路线未必划算", "后轮尺寸切换后需要重新确认几何和胎压"],
    fits: ["复杂林道、碎石和高速下坡", "愿意调校车辆设定的进阶骑手", "想要旗舰级全能林道车"],
    notFits: ["主要需求是轻量爬坡和 XC 竞赛", "预算有限或不希望复杂维护"],
  },
];

export const MTB_GEAR: GearItem[] = DRAFTS.map(build);
