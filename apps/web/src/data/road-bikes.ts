import { resolveImageUrl } from "@/lib/image-url";
import type { FitGuide, GearItem } from "@/types";
import { ROAD_BIKE_SCORE_DIMS } from "./categories";

type Specs = Record<string, number | string | null>;
type Scores = Record<string, number>;

interface RoadBikeDraft {
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

const ENDURACE_FIT_GUIDE: FitGuide = {
  rows: [
    { size: "2XS", height: "≤165 cm", headAngle: "70.3°", seatAngle: "73.5°", wheelbase: 1006, stack: 525, reach: 382 },
    { size: "XS", height: "165–171 cm", headAngle: "71°", seatAngle: "73.5°", wheelbase: 1010, stack: 545, reach: 386 },
    { size: "S", height: "171–178 cm", headAngle: "71.8°", seatAngle: "73.5°", wheelbase: 1013, stack: 563, reach: 390 },
    { size: "M", height: "178–185 cm", headAngle: "72.5°", seatAngle: "73.5°", wheelbase: 1014, stack: 584, reach: 392 },
    { size: "L", height: "185–192 cm", headAngle: "72.5°", seatAngle: "73.5°", wheelbase: 1030, stack: 605, reach: 401 },
    { size: "XL", height: "192–198 cm", headAngle: "72.8°", seatAngle: "73.5°", wheelbase: 1043, stack: 629, reach: 409 },
    { size: "2XL", height: "≥198 cm", headAngle: "72.8°", seatAngle: "73.5°", wheelbase: 1067, stack: 649, reach: 427 },
  ],
  note: "Canyon Endurace CF 官方几何表；Endurace CF 7 与 CF 7 Di2 使用同一车架平台，配置与价格仍需分别核对。",
};

const AEROAD_FIT_GUIDE: FitGuide = {
  rows: [
    { size: "2XS", height: "≤166 cm", headAngle: "70°", seatAngle: "73.5°", wheelbase: 975, stack: 498, reach: 372 },
    { size: "XS", height: "166–172 cm", headAngle: "71.2°", seatAngle: "73.5°", wheelbase: 979, stack: 520, reach: 378 },
    { size: "S", height: "172–178 cm", headAngle: "72.8°", seatAngle: "73.5°", wheelbase: 982, stack: 539, reach: 390 },
    { size: "M", height: "178–184 cm", headAngle: "73.25°", seatAngle: "73.5°", wheelbase: 988, stack: 560, reach: 393 },
    { size: "L", height: "184–190 cm", headAngle: "73.3°", seatAngle: "73.5°", wheelbase: 1003, stack: 580, reach: 401 },
    { size: "XL", height: "190–196 cm", headAngle: "73.5°", seatAngle: "73.5°", wheelbase: 1029, stack: 606, reach: 419 },
    { size: "2XL", height: "≥196 cm", headAngle: "73.8°", seatAngle: "73.5°", wheelbase: 1042, stack: 624, reach: 429 },
  ],
  note: "Canyon Aeroad CF SLX 官方几何表；Aeroad 的把组宽度与座垫高度也会影响最终骑行姿势。",
};

const TARMAC_FIT_GUIDE: FitGuide = {
  rows: [
    { size: "44", headAngle: "70.5°", stack: 501, reach: 366 },
    { size: "49", headAngle: "71.75°", stack: 514, reach: 375 },
    { size: "52", headAngle: "72.5°", stack: 527, reach: 380 },
    { size: "54", headAngle: "73°", stack: 544, reach: 384 },
    { size: "56", headAngle: "73.5°", stack: 565, reach: 395 },
    { size: "58", headAngle: "73.5°", stack: 591, reach: 402 },
    { size: "61", headAngle: "74°", stack: 612, reach: 408 },
  ],
  note: "Specialized Tarmac SL8 官方几何表；官方页面未在同一表格中给出骑手身高区间，因此这里保留车架尺码、Stack、Reach 和头管角。",
};

const DEFY_FIT_GUIDE: FitGuide = {
  rows: [
    { size: "XS", stack: 527, reach: 369 },
    { size: "S", stack: 541, reach: 375 },
    { size: "M", stack: 558, reach: 380 },
    { size: "M/L", stack: 577, reach: 384 },
    { size: "L", stack: 596, reach: 393 },
    { size: "XL", stack: 615, reach: 402 },
  ],
  note: "Giant Defy Advanced 2 官方几何表；Giant 建议结合身高、内长与经销商尺寸向导确认。",
};

const TCR_FIT_GUIDE: FitGuide = {
  rows: [
    { size: "XS", stack: 517, reach: 376 },
    { size: "S", stack: 528, reach: 383 },
    { size: "M", stack: 545, reach: 388 },
    { size: "M/L", stack: 562, reach: 393 },
    { size: "L", stack: 581, reach: 402 },
    { size: "XL", stack: 596, reach: 412 },
  ],
  note: "Giant TCR Advanced Pro 官方几何表；竞赛姿势对把位和坐垫高度更敏感，不能只按身高单项决定。",
};

const PROPEL_FIT_GUIDE: FitGuide = {
  rows: [
    { size: "XS", stack: 515, reach: 377, wheelSize: "700C" },
    { size: "S", stack: 530, reach: 383, wheelSize: "700C" },
    { size: "M", stack: 546, reach: 388, wheelSize: "700C" },
    { size: "M/L", stack: 565, reach: 392, wheelSize: "700C" },
    { size: "L", stack: 582, reach: 402, wheelSize: "700C" },
    { size: "XL", stack: 596, reach: 412, wheelSize: "700C" },
  ],
  note: "Giant Propel Advanced Pro 2027 官方几何表；一体式把组的宽度、把立和座杆设定需在购买前确认。",
};

const ROAD_FIT_GUIDES: Record<string, FitGuide> = {
  "rb-canyon-endurace-cf-7-2027": ENDURACE_FIT_GUIDE,
  "rb-canyon-endurace-cf-7-di2-2027": ENDURACE_FIT_GUIDE,
  "rb-canyon-aeroad-cf-slx-7-di2-2027": AEROAD_FIT_GUIDE,
  "rb-specialized-tarmac-sl8-comp-rival-axs-2026": TARMAC_FIT_GUIDE,
  "rb-specialized-s-works-tarmac-sl8-red-axs-2026": TARMAC_FIT_GUIDE,
  "rb-giant-defy-advanced-2-2026": DEFY_FIT_GUIDE,
  "rb-giant-tcr-advanced-pro-0-axs-2026": TCR_FIT_GUIDE,
  "rb-giant-propel-advanced-pro-0-axs-2027": PROPEL_FIT_GUIDE,
};

function composite(scores: Scores): number {
  let sum = 0;
  let weightSum = 0;
  for (const dimension of ROAD_BIKE_SCORE_DIMS) {
    const value = scores[dimension.key];
    if (typeof value !== "number") continue;
    sum += value * dimension.weight;
    weightSum += dimension.weight;
  }
  return weightSum ? Math.round((sum / weightSum) * 10 * 10) / 10 : 0;
}

function build(draft: RoadBikeDraft, index: number): GearItem {
  const image = resolveImageUrl(draft.image);
  const price = draft.price ?? 0;
  return {
    id: draft.id,
    categorySlug: "road-bike",
    brand: draft.brand,
    model: draft.model,
    year: draft.year,
    price,
    priceCurrency: "USD",
    scenes: draft.scenes,
    flexValue: 0,
    flexLabel: "不适用",
    hero: image,
    gallery: [{ url: image, label: "官方产品图 / PRODUCT" }],
    specs: draft.specs,
    fitGuide: ROAD_FIT_GUIDES[draft.id],
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

const DRAFTS: RoadBikeDraft[] = [
  {
    id: "rb-canyon-endurace-cf-7-2027",
    brand: "Canyon",
    model: "Endurace CF 7",
    year: 2027,
    price: 2999,
    scenes: ["endurance", "all-road", "group-ride"],
    specs: {
      bikeType: "endurance",
      frameMaterial: "Carbon (CF)",
      frameWeight: 1080,
      tireClearance: 38,
      groupset: "Shimano 105 RD-R7100 12s",
      drivetrain: "2x12，50/34，11-36",
      brakes: "hydraulic-disc",
      wheelset: "DT Swiss Endurance LN，铝合金",
      gearRange: "11-36T / 50-34T",
      fit: "Sport Geometry，偏舒适的长途设定",
      scenes: "长途耐力 · 泛铺装 · 团骑",
    },
    scores: { speedEfficiency: 8.1, handling: 8.2, comfort: 9.1, climbing: 7.9, versatility: 9.1, value: 8.8 },
    image: "https://dma.canyon.com/image/upload/w_1145,h_645,c_fit/f_jpg/q_auto/v1779435706/2027_FULL_endurace_cf-7_4627_R129_P01_okspta",
    whoFor: ["第一次买碳纤公路车", "长途和周末团骑", "希望兼顾舒适与速度"],
    verdict: "Endurace CF 7 把关注点放在可持续骑行上：38mm 胎容、Sport Geometry 和 105 机械套件让它更适合长时间待在车上，而不是只在短冲时追求数字。",
    strengths: ["38mm 胎容对破损路面更宽容", "碳纤车架与耐力几何适合长距离", "105 12 速维护和替换相对容易"],
    weaknesses: ["空力和瞬时加速不如竞赛车", "铝合金轮组升级空间明显", "官网价格可能随促销变化"],
    fits: ["日常训练、长途和团骑", "路况不稳定的公路路线", "希望一台车覆盖大多数周末骑行"],
    notFits: ["只追求平路冲刺和竞赛姿态", "已经拥有耐力车、想要第二台纯竞赛车"],
  },
  {
    id: "rb-canyon-endurace-cf-7-di2-2027",
    brand: "Canyon",
    model: "Endurace CF 7 Di2",
    year: 2027,
    price: 3599,
    scenes: ["endurance", "all-road", "group-ride"],
    specs: {
      bikeType: "endurance",
      frameMaterial: "Carbon (CF)",
      frameWeight: 1080,
      tireClearance: 38,
      groupset: "Shimano 105 Di2",
      drivetrain: "2x12，50/34，11-36",
      brakes: "hydraulic-disc",
      wheelset: "DT Swiss Endurance LN，铝合金",
      gearRange: "11-36T / 50-34T",
      fit: "Sport Geometry，偏舒适的长途设定",
      scenes: "长途耐力 · 泛铺装 · 团骑",
    },
    scores: { speedEfficiency: 8.3, handling: 8.3, comfort: 9.1, climbing: 8, versatility: 9.2, value: 8.5 },
    image: "https://dma.canyon.com/image/upload/w_1145,h_645,c_fit/f_jpg/q_auto/v1777355662/2027_FULL_endurace_cf-7-di2_4421_R129_P01_oopfry",
    whoFor: ["长途训练用户", "喜欢电子变速的耐力骑手", "要一台顺手的全能公路车"],
    verdict: "Endurace CF 7 Di2 保留耐力车的舒适和宽胎容，再用 105 Di2 降低频繁变速时的操作负担，适合把骑行时间拉长的人。",
    strengths: ["电子变速操作直接，长途更省心", "耐力几何对腰背更友好", "38mm 胎容覆盖更多非完美铺装"],
    weaknesses: ["铝合金轮组让升级预算仍然存在", "电池和电子系统需要额外维护意识", "更适合长途，不是纯竞赛设定"],
    fits: ["长距离、爬坡和团骑", "愿意为电子变速付费", "需要一台稳定的主力车"],
    notFits: ["预算优先考虑轮组升级", "完全不想处理电子变速系统"],
  },
  {
    id: "rb-canyon-aeroad-cf-slx-7-di2-2027",
    brand: "Canyon",
    model: "Aeroad CF SLX 7 Di2",
    year: 2027,
    price: 4999,
    scenes: ["racing", "group-ride"],
    specs: {
      bikeType: "aero",
      frameMaterial: "Carbon (CF SLX)",
      frameWeight: 1050,
      completeWeight: 7.96,
      tireClearance: 32,
      groupset: "Shimano 105 Di2，带 4iiii 功率计",
      drivetrain: "2x12",
      brakes: "hydraulic-disc",
      wheelset: "DT Swiss ARC 1600，65mm 碳纤轮组",
      gearRange: "105 Di2，竞赛取向",
      fit: "PACE 可调一体式把组，偏空力竞赛",
      scenes: "竞赛 · 团骑",
    },
    scores: { speedEfficiency: 9.4, handling: 8.5, comfort: 7.3, climbing: 8.4, versatility: 7.6, value: 8.1 },
    image: "https://dma.canyon.com/image/upload/w_1145,h_645,c_fit/b_rgb:F2F2F2/f_jpg/q_auto/v1777532962/2027_FULL_aeroad_cf-slx-7-di2_4531_R107_P01_zsqbop",
    whoFor: ["平路高速和竞赛", "重视空力效率", "希望车上直接带功率计"],
    verdict: "Aeroad CF SLX 7 Di2 是一台先谈速度的空力竞赛车。65mm 碳纤轮组和一体式把组把平路效率推到前面，但骑手需要接受更激进的姿势。",
    strengths: ["空力车架和深框轮组适合高速巡航", "105 Di2 与功率计对训练更实用", "PACE 把组可以微调骑行姿势"],
    weaknesses: ["深框和激进设定对横风与柔韧性要求更高", "舒适性不如 Endurace", "复杂一体式部件的维护成本更高"],
    fits: ["平路、比赛和快速团骑", "愿意做姿势适应和尺寸调校", "已有耐力车、想补一台竞赛车"],
    notFits: ["以长途舒适为第一优先", "路线经常是碎石或复杂非铺装"],
  },
  {
    id: "rb-specialized-tarmac-sl8-comp-rival-axs-2026",
    brand: "Specialized",
    model: "Tarmac SL8 Comp SRAM Rival AXS",
    year: 2026,
    scenes: ["racing", "climbing", "group-ride"],
    specs: {
      bikeType: "race",
      frameMaterial: "Tarmac SL8 FACT 10r Carbon",
      groupset: "SRAM Rival AXS E1",
      drivetrain: "2x12，48/35，10-36",
      brakes: "hydraulic-disc",
      wheelset: "DT Swiss R470，支持真空胎",
      gearRange: "10-36T / 48-35T",
      fit: "Rider First Engineered，竞赛取向",
      scenes: "竞赛 · 爬坡 · 团骑",
    },
    scores: { speedEfficiency: 9.1, handling: 9, comfort: 7.9, climbing: 9, versatility: 8.4, value: 7.9 },
    image: "https://assets.specialized.com/i/specialized/94926-54_TARMAC-SL8-COMP-AXS-CARB-WHT_HERO-SQUARE",
    whoFor: ["竞赛和爬坡训练", "希望兼顾操控与速度", "喜欢 SRAM 无线变速体验"],
    verdict: "Tarmac SL8 Comp 更像一台没有明显短板的竞赛车：车架和操控给得很足，Rival AXS 让配置保持实用，但轮组会是后续升级的第一候选。",
    strengths: ["竞赛几何和操控反馈清晰", "SRAM Rival AXS 操作直接", "车架适用面不只局限于比赛"],
    weaknesses: ["原厂轮组不是整车最亮眼的部分", "竞赛姿态需要合适的把位和尺寸", "官网价格需按地区与库存确认"],
    fits: ["训练、爬坡和周末比赛", "想从铝车升级到碳纤竞赛车", "愿意逐步升级轮组"],
    notFits: ["以舒适长途和宽胎为第一需求", "希望开箱即拥有顶级碳纤轮组"],
  },
  {
    id: "rb-specialized-s-works-tarmac-sl8-red-axs-2026",
    brand: "Specialized",
    model: "S-Works Tarmac SL8 SRAM RED AXS",
    year: 2026,
    scenes: ["racing", "climbing", "group-ride"],
    specs: {
      bikeType: "race",
      frameMaterial: "S-Works Tarmac SL8 FACT 12r Carbon",
      completeWeight: 6.62,
      groupset: "SRAM RED AXS E1，带 Quarq 功率计",
      drivetrain: "2x12，48/35，10-33",
      brakes: "hydraulic-disc",
      wheelset: "Roval Rapide CLX III，碳纤轮组",
      gearRange: "10-33T / 48-35T",
      fit: "Rider First Engineered，轻量竞赛取向",
      scenes: "竞赛 · 爬坡 · 团骑",
    },
    scores: { speedEfficiency: 9.6, handling: 9.3, comfort: 8, climbing: 9.6, versatility: 8.2, value: 6.8 },
    image: "https://assets.specialized.com/i/specialized/94926-02_TARMAC-SL8-SW-AXS-PRMFJDMET-METWHT_HERO-SQUARE",
    whoFor: ["追求轻量和爬坡效率", "高强度训练与比赛", "希望功率计随车配置"],
    verdict: "S-Works Tarmac SL8 把轻量、刚性和操控放在同一台旗舰竞赛车上。6.62kg 是官方尺寸参考，实际重量仍会随尺码、涂装和配置变化。",
    strengths: ["旗舰级 FACT 12r 车架", "官方参考重量轻，爬坡响应直接", "RED AXS、功率计和高端碳轮组配置完整"],
    weaknesses: ["价格与维护成本都处在旗舰区间", "轻量竞赛设定对尺寸和姿势更敏感", "官网规格会随尺码和涂装变化"],
    fits: ["高阶竞赛与爬坡", "追求开箱即用的旗舰配置", "能承担长期保养成本的骑手"],
    notFits: ["刚开始公路骑行", "预算更适合先升级基础车架或轮组"],
  },
  {
    id: "rb-giant-defy-advanced-2-2026",
    brand: "Giant",
    model: "Defy Advanced 2",
    year: 2026,
    price: 3300,
    scenes: ["endurance", "all-road", "group-ride"],
    specs: {
      bikeType: "endurance",
      frameMaterial: "Advanced-grade Composite",
      tireClearance: 40,
      groupset: "Shimano 105",
      drivetrain: "2x12，50/34，11-36",
      brakes: "hydraulic-disc",
      wheelset: "Giant P-R1 Disc，铝合金",
      gearRange: "11-36T / 50-34T",
      fit: "D-Fuse 车把与座杆，耐力长途设定",
      scenes: "长途耐力 · 泛铺装 · 团骑",
    },
    scores: { speedEfficiency: 7.9, handling: 8.3, comfort: 9.2, climbing: 7.7, versatility: 9.3, value: 8.7 },
    image: "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_400%2Cq_80/ln09xatfxrvyqelva1lt/MY26DefyAdvanced2_ColorAAbyssBlack.jpg",
    whoFor: ["长途和耐力骑行", "路况复杂的公路路线", "想要碳纤车但不想姿势太激进"],
    verdict: "Defy Advanced 2 通过 D-Fuse 系统和 40mm 胎容把舒适性放在核心位置。它不是最锋利的竞赛车，却很适合稳定地把一整天骑完。",
    strengths: ["40mm 胎容带来较强路况适应性", "碳纤车架和 D-Fuse 系统强调舒适", "105 套件的维修和替换成本相对可控"],
    weaknesses: ["平路冲刺和空力不如 Propel", "原厂铝轮组仍有升级空间", "舒适几何会牺牲一部分激进响应"],
    fits: ["长距离、烂路和周末团骑", "需要一台能稳定使用多年的主力车", "不追求极限竞赛姿势"],
    notFits: ["只参加短距离竞赛", "主要需求是平路高速和冲刺"],
  },
  {
    id: "rb-giant-tcr-advanced-pro-0-axs-2026",
    brand: "Giant",
    model: "TCR Advanced Pro 0 AXS",
    year: 2026,
    price: 7000,
    scenes: ["racing", "climbing", "group-ride"],
    specs: {
      bikeType: "race",
      frameMaterial: "Advanced-grade Composite",
      groupset: "SRAM Force AXS E1，带 Quarq 功率计",
      drivetrain: "2x12，35/48",
      brakes: "hydraulic-disc",
      wheelset: "Giant SLR 碳纤轮组",
      gearRange: "SRAM Force AXS，竞赛取向",
      fit: "TCR 综合竞赛几何",
      scenes: "竞赛 · 爬坡 · 团骑",
    },
    scores: { speedEfficiency: 9.1, handling: 9, comfort: 8.2, climbing: 9.1, versatility: 8.8, value: 7.8 },
    image: "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_400%2Cq_80/jtismbbz7rrw6bsjelem/MY26TCRAdvancedPro0-AXS_ColorACarbon.jpg",
    whoFor: ["综合竞赛和爬坡", "希望功率计随车配置", "想要一台不偏科的竞赛车"],
    verdict: "TCR Advanced Pro 0 AXS 的取向很清楚：在爬坡、过弯和下坡之间做平衡。它不靠单一的空力数字吸引人，而是让整车在真实路线里更容易发挥。",
    strengths: ["综合竞赛属性强，适用路线广", "Force AXS 与功率计适合训练", "车架和碳轮组配置完整"],
    weaknesses: ["价格已经进入高端区间", "具体轮组与配置应按官网型号再次核对", "竞赛设定对尺寸和坐垫高度更敏感"],
    fits: ["爬坡、竞赛和快速团骑", "已经明确需要功率计", "想用一台车覆盖训练与比赛"],
    notFits: ["只做轻松通勤", "希望车辆尽量简单、低维护"],
  },
  {
    id: "rb-giant-propel-advanced-pro-0-axs-2027",
    brand: "Giant",
    model: "Propel Advanced Pro 0 AXS",
    year: 2027,
    price: 7800,
    scenes: ["racing", "group-ride"],
    specs: {
      bikeType: "aero",
      frameMaterial: "Advanced-grade Composite",
      groupset: "SRAM Force AXS E1，带功率计",
      drivetrain: "2x12，35/48",
      brakes: "hydraulic-disc",
      wheelset: "Giant SLR 0 50 Carbon WheelSystem",
      gearRange: "SRAM Force AXS，空力竞赛取向",
      fit: "Vector 复合座杆与一体式空力把组",
      scenes: "竞赛 · 团骑",
    },
    scores: { speedEfficiency: 9.6, handling: 8.7, comfort: 7.8, climbing: 8.3, versatility: 7.8, value: 7.6 },
    image: "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_400%2Cq_80%2Cw_600/u9r0a1uqpr0rustxbxbn/MY27PropelAdvancedPro0-AXS_ColorAObsidianPulse.jpg",
    whoFor: ["平路高速和冲刺", "竞赛型团骑", "愿意适应一体式空力把组"],
    verdict: "Propel Advanced Pro 0 AXS 把气动效率放在首位，50mm 碳轮和空力把组适合稳定维持高速；它更需要在购买前做好尺寸和把位确认。",
    strengths: ["50mm 碳轮组和空力车架适合高速", "Force AXS 与功率计配置完整", "Vector 座杆兼顾空力与一定的垂向顺应"],
    weaknesses: ["一体式把组调整和维护更依赖车店", "横风与姿势适应需要时间", "不适合作为宽胎泛铺装主力车"],
    fits: ["平路竞赛、冲刺和快速团骑", "有明确空力需求的进阶骑手", "能接受专业尺寸设定和维护"],
    notFits: ["主要骑烂路或长途耐力路线", "希望自行快速更换把组和线管"],
  },
];

export const ROAD_BIKE_GEAR: GearItem[] = DRAFTS.map(build);
