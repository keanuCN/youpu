import type { GearItem } from "@/types";
import { BASE_POOL, DETAIL_POOL, IMG, TOP_POOL } from "./assets";
import { ACTION_CAM_GEAR } from "./action-cams";
import { CASTING_ROD_GEAR } from "./casting-rods";
import { MTB_GEAR } from "./mountain-bikes";
import { ROAD_BIKE_GEAR } from "./road-bikes";
import { SNOWBOARD_SCORE_DIMS, flexBucket, profileFamilyOf } from "./categories";

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
      length: 158, effectiveEdge: 1250, sidecut: 7.9, waistWidth: 253, stanceSetback: 15,
      profile: "纯 Camber", shape: "定向双向", core: "FSC 认证杨木 / 双轴玻纤", fiberglass: "Triax + Biax",
      base: "烧结 7200", weight: 2980, damping: 8, pop: 7.5, turnRadiusFeel: "长弧稳、短弧需发力",
      price: 6299, year: 2026, warranty: 3, flex: 7,
    },
    scores: { stability: 9, response: 8.5, float: 6, park: 5.5, forgiveness: 5, value: 6.5 },
    heat: 9620,
    whoFor: ["进阶全山地", "追求高速稳定", "有刻滑基础"],
    verdict: "全山地基准板。它不试图讨好任何人，只是把「稳定 + 精准」这两件事做到该价位的上限。",
    strengths: ["高速下板面几乎不颤", "边刃咬雪非常线性，压雪道走刃反馈清晰", "板芯回弹持久，一整天不软"],
    weaknesses: ["低速时偏硬，需要主动压板才转得动", "深雪浮力一般，板头会往下扎", "新手第一天会觉得累腿"],
    fits: ["滑了 3 季以上、体重 65kg+ 的进阶玩家", "主要在压雪道与硬雪面滑", "喜欢用刃而不是用板面滑"],
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
      length: 157, effectiveEdge: 1225, sidecut: 8.0, waistWidth: 255, stanceSetback: 20,
      profile: "Camber + 板头板尾微摇臂", shape: "定向双向", core: "FSC 白杨 / 玄武岩纤维", fiberglass: "Biax + Basalt",
      base: "烧结 8000", weight: 2870, damping: 7.5, pop: 7, turnRadiusFeel: "中性，长短弧都好带",
      price: 5899, year: 2026, warranty: 3, flex: 6,
    },
    scores: { stability: 8, response: 7.5, float: 7.5, park: 6.5, forgiveness: 6.5, value: 8 },
    heat: 8840,
    whoFor: ["一板走天下", "进阶全山地", "偶尔进公园"],
    verdict: "最没有短板的一块。它不会在任何一项上给你惊喜，但也不会让你在任何一天后悔带它出门。",
    strengths: ["雪况适应面极宽，冰面到烂雪都能应付", "板头摇臂让入弯很轻松", "重量控制得好，长时间滑不累"],
    weaknesses: ["没有鲜明的性格，喜欢刺激的人会觉得平淡", "公园落地偏硬，不如纯双向板宽容", "外观偏保守"],
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
      length: 155, effectiveEdge: 1195, sidecut: 7.6, waistWidth: 252, stanceSetback: 0,
      profile: "Resort V1（Camber 主导 + 板头尾反弓）", shape: "真双向", core: "Dual Core 白杨", fiberglass: "Biax Carbon",
      base: "挤压 4000", weight: 2760, damping: 6, pop: 9, turnRadiusFeel: "灵活，短半径很快",
      price: 5299, year: 2026, warranty: 2, flex: 5.5,
    },
    scores: { stability: 6.5, response: 8, float: 5.5, park: 9.5, forgiveness: 7.5, value: 8.5 },
    heat: 9310,
    whoFor: ["公园主力", "中阶自由式", "喜欢起跳反馈"],
    verdict: "公园里的通用答案。弹性是它的全部性格，起跳时机对了它会把你送得比预期更高。",
    strengths: ["Pop 极强，中低速度也能起跳", "真双向，反脚落地和正脚一样稳", "板面抗刮，道具党友好"],
    weaknesses: ["高速压雪道板头会抖", "底面是挤压工艺，蜡保持时间短", "深雪完全不行"],
    fits: ["一半以上时间在公园", "中阶想练跳台与道具", "喜欢软一点的手感"],
    notFits: ["追求高速稳定", "常滑野雪", "第一年新手（弹性太强不好控）"],
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
      length: 155, effectiveEdge: 1180, sidecut: 7.8, waistWidth: 254, stanceSetback: 10,
      profile: "Rocker-Camber-Rocker", shape: "定向", core: "白杨 + 泡棉", fiberglass: "Biax",
      base: "挤压 3500", weight: 2650, damping: 5.5, pop: 4.5, turnRadiusFeel: "宽松，容错高",
      price: 3299, year: 2026, warranty: 2, flex: 4,
    },
    scores: { stability: 5.5, response: 5, float: 6, park: 5, forgiveness: 9.5, value: 9 },
    heat: 6120,
    whoFor: ["第一年", "预算有限", "怕卡刃"],
    verdict: "它存在的意义就是让你少摔几次。板头板尾的反弓把卡刃概率压到很低，价格还留在入门区间。",
    strengths: ["容错度极高，重心偏了也不容易咬刃", "轻，转板省力，适合练基础", "价格友好，摔了不心疼"],
    weaknesses: ["速度上来后板面发飘", "几乎没有弹性", "进阶后会明显觉得不够用"],
    fits: ["第一个雪季", "一年只滑三五天", "想低成本试水"],
    notFits: ["已经能连续 S 弯的人", "追求速度或公园"],
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
      length: 157, effectiveEdge: 1210, sidecut: 7.7, waistWidth: 256, stanceSetback: 0,
      profile: "C2（板下反弓 + 板头尾 Camber）", shape: "真双向", core: "Aspen / Paulownia 混合", fiberglass: "Biax + Triax",
      base: "烧结 UHMW", weight: 2890, damping: 7, pop: 8.5, turnRadiusFeel: "抓刃强，波浪边刃",
      price: 5699, year: 2025, warranty: 3, flex: 6.5,
    },
    scores: { stability: 7.5, response: 8, float: 6.5, park: 9, forgiveness: 6, value: 7 },
    heat: 7480,
    whoFor: ["大跳台", "进阶公园", "冰面雪场"],
    verdict: "为硬雪面和大跳台设计。波浪边刃在冰面上咬得住，落地时板面吸收冲击的能力比同硬度对手好一档。",
    strengths: ["冰面抓地力突出", "大跳台落地稳，不容易弹飞", "双向对称，反脚无差别"],
    weaknesses: ["板面偏重，慢速灵活度一般", "深雪浮力有限", "价格偏高"],
    fits: ["公园为主但也滑全山", "常在硬冰雪面滑", "中高阶"],
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
      length: 157, effectiveEdge: 1215, sidecut: 7.9, waistWidth: 254, stanceSetback: 12,
      profile: "Ripsaw（Camber 主导 + 板头长摇臂）", shape: "定向双向", core: "白杨 + 竹条", fiberglass: "Triax Carbon",
      base: "烧结 Durasurf", weight: 2840, damping: 7.5, pop: 8, turnRadiusFeel: "入弯快，出弯有推背感",
      price: 5499, year: 2025, warranty: 3, flex: 6,
    },
    scores: { stability: 8, response: 8.5, float: 7, park: 7, forgiveness: 6, value: 7.5 },
    heat: 6890,
    whoFor: ["进阶全山地", "喜欢有反馈", "偶尔公园"],
    verdict: "全山地里性格最鲜明的一块。碳纤层让它的回弹比同价位明显更快，出弯时能感觉到板子在推你。",
    strengths: ["出弯回弹强，连续弯很爽", "板头摇臂兼顾了入弯轻松与浮雪", "做工扎实，美国本土压制"],
    weaknesses: ["碳纤层让板面偏硬，低速不友好", "价格在同规格里偏高", "外观见仁见智"],
    fits: ["中高阶、滑压雪道为主", "喜欢板子给反馈", "体重 70kg+"],
    notFits: ["新手", "只玩公园道具", "喜欢软板手感"],
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
      length: 161, effectiveEdge: 1310, sidecut: 9.4, waistWidth: 262, stanceSetback: 45,
      profile: "纯 Camber + 长板头", shape: "强定向", core: "白杨 / 竹混合", fiberglass: "Triax",
      base: "烧结 9000", weight: 3120, damping: 8.5, pop: 5, turnRadiusFeel: "大半径长弧，越滑越快",
      price: 6899, year: 2026, warranty: 2, flex: 7.5,
    },
    scores: { stability: 9.5, response: 8, float: 8.5, park: 2, forgiveness: 3.5, value: 5.5 },
    heat: 5340,
    whoFor: ["刻滑玩家", "长弧高速", "野雪巡航"],
    verdict: "一块只为「走刃」存在的板子。它不会跳、不会转得快，但当你把刃压下去时，它给你的稳定感是别的板给不了的。",
    strengths: ["长弧高速稳定性顶级", "大板头 + 强后移，深雪浮力好", "边刃咬雪极其扎实"],
    weaknesses: ["几乎不能玩公园", "短半径急转很吃力", "容错低，重心错了立刻惩罚你"],
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
    scenes: ["freestyle", "beginner"],
    flex: 5,
    specs: {
      length: 154, effectiveEdge: 1170, sidecut: 7.4, waistWidth: 251, stanceSetback: 0,
      profile: "3BT（板头尾勺形 + 板下 Camber）", shape: "真双向", core: "白杨", fiberglass: "Biax",
      base: "烧结 4400", weight: 2720, damping: 6, pop: 7.5, turnRadiusFeel: "极宽松，入弯无阻力",
      price: 4899, year: 2025, warranty: 2, flex: 5,
    },
    scores: { stability: 6, response: 6.5, float: 7, park: 8.5, forgiveness: 9, value: 8 },
    heat: 6410,
    whoFor: ["公园入门", "怕卡刃", "想练反脚"],
    verdict: "勺形板头把卡刃这件事基本消除了。它是从新手过渡到公园最平滑的一块板，容错高但不软塌。",
    strengths: ["几乎不卡刃，容错极高", "真双向，练反脚很合适", "烂雪与春雪表现好"],
    weaknesses: ["高速时边刃抓地不如纯 Camber", "冰面表现一般", "弹性偏温和，大跳台不够"],
    fits: ["第 2–3 个雪季", "公园入门", "常滑春雪烂雪"],
    notFits: ["追求高速刻滑", "冰面为主的雪场"],
    band: [4100, 5600],
    dist: [2, 8, 27, 78, 82],
  },
  {
    id: "sb-09",
    brand: "Ride",
    model: "Algorythm",
    year: 2026,
    price: 7299,
    scenes: ["powder", "carving"],
    flex: 8,
    specs: {
      length: 160, effectiveEdge: 1265, sidecut: 8.6, waistWidth: 264, stanceSetback: 40,
      profile: "Camber + 大板头摇臂", shape: "强定向锥形", core: "白杨 / 竹 / 碳纤维梁", fiberglass: "Triax Carbon",
      base: "烧结 9000", weight: 3050, damping: 9, pop: 6, turnRadiusFeel: "大弧为主，深雪里转向轻盈",
      price: 7299, year: 2026, warranty: 3, flex: 8,
    },
    scores: { stability: 9, response: 8.5, float: 9.5, park: 2.5, forgiveness: 4, value: 5 },
    heat: 4980,
    whoFor: ["野雪主力", "深雪日", "高阶玩家"],
    verdict: "为深雪日准备的重武器。板头浮力大到你会忘记自己脚下有 3 公斤的东西，回到压雪道也依然稳。",
    strengths: ["浮雪能力顶级，深雪不扎头", "碳梁让高速下板面极安静", "回到硬雪面依然能走刃"],
    weaknesses: ["价格高", "重，长时间平地滑行累", "公园完全不适合"],
    fits: ["有野雪需求的高阶玩家", "一季有 10 天以上深雪", "追求安静的高速板面"],
    notFits: ["预算有限", "公园玩家", "新手"],
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
      length: 162, effectiveEdge: 1330, sidecut: 9.1, waistWidth: 260, stanceSetback: 25,
      profile: "纯 Camber", shape: "定向", core: "FSC 白杨 / 竹", fiberglass: "Triax + 碳纤维带",
      base: "烧结 7200", weight: 3180, damping: 8.5, pop: 5.5, turnRadiusFeel: "长弧，需要主动压板",
      price: 6599, year: 2025, warranty: 3, flex: 8.5,
    },
    scores: { stability: 9.5, response: 9, float: 6, park: 2, forgiveness: 3, value: 5.5 },
    heat: 4210,
    whoFor: ["硬核刻滑", "高速长弧", "技术流"],
    verdict: "一块要求你先把技术练好的板子。它的边刃精度接近硬鞋刻滑板，但依然保留了软鞋的舒适站位。",
    strengths: ["边刃精度极高，走刃几乎无侧滑", "高速下极其安静", "竹木芯回弹线性"],
    weaknesses: ["硬度高，低速很难驾驭", "容错极低", "重，搬运和抬板累"],
    fits: ["刻滑技术成型", "体重 75kg+", "追求边刃精度"],
    notFits: ["中级以下", "公园", "野雪深雪"],
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
      length: 157, effectiveEdge: 1205, sidecut: 7.8, waistWidth: 253, stanceSetback: 15,
      profile: "Cam-Out Camber", shape: "定向双向", core: "Powerlite 白杨", fiberglass: "Biax",
      base: "烧结 Speedlite", weight: 2810, damping: 7, pop: 7.5, turnRadiusFeel: "中性偏快，好带",
      price: 4599, year: 2026, warranty: 2, flex: 6,
    },
    scores: { stability: 7.5, response: 7.5, float: 6.5, park: 7.5, forgiveness: 7, value: 9 },
    heat: 7020,
    whoFor: ["性价比首选", "进阶全山地", "一板多用"],
    verdict: "同价位里最难被挑出毛病的一块。它把全山地和公园的边界模糊掉了，价格还压在 5000 以内。",
    strengths: ["性价比突出", "Cam-Out 让入弯容错比纯 Camber 高", "适应面宽，什么雪况都能滑"],
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
      length: 156, effectiveEdge: 1200, sidecut: 7.6, waistWidth: 255, stanceSetback: 10,
      profile: "C2X（板下反弓 + 板头尾 Camber）", shape: "定向双向", core: "Aspen / Paulownia", fiberglass: "Biax Triax 混合",
      base: "烧结 UHMW", weight: 2860, damping: 7.5, pop: 8, turnRadiusFeel: "抓刃强，波浪边刃",
      price: 5199, year: 2025, warranty: 3, flex: 6.5,
    },
    scores: { stability: 8, response: 8, float: 7, park: 7.5, forgiveness: 6.5, value: 8 },
    heat: 6630,
    whoFor: ["全能取向", "冰面雪场", "中高阶"],
    verdict: "波浪边刃 + C2X 板型的组合让它在冰面上比同级别更抓得住，同时保留了公园需要的弹性。",
    strengths: ["冰面抓地力强", "弹性与稳定的平衡做得好", "环保用料，本土生产"],
    weaknesses: ["板面偏重", "深雪浮力一般", "外观风格强烈，不是所有人都喜欢"],
    fits: ["中高阶全能玩家", "常滑硬冰雪面", "偶尔进公园"],
    notFits: ["新手", "纯野雪党"],
    band: [4400, 6000],
    dist: [2, 7, 23, 66, 78],
  },
  {
    id: "sb-13",
    brand: "Jones",
    model: "Hovercraft",
    year: 2026,
    price: 6999,
    scenes: ["powder"],
    flex: 7,
    specs: {
      length: 160, effectiveEdge: 1240, sidecut: 8.9, waistWidth: 268, stanceSetback: 50,
      profile: "Camber + 大勺形板头", shape: "强定向锥形", core: "FSC 白杨 / 竹", fiberglass: "Triax Basalt",
      base: "烧结 9000", weight: 2990, damping: 8, pop: 5.5, turnRadiusFeel: "深雪里灵活，硬雪面偏钝",
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
      length: 157, effectiveEdge: 1200, sidecut: 7.7, waistWidth: 252, stanceSetback: 12,
      profile: "纯 Camber", shape: "真双向", core: "FSC 杨木 / 双轴玻纤", fiberglass: "Triax + Biax",
      base: "烧结 7200", weight: 2790, damping: 7, pop: 8.5, turnRadiusFeel: "灵活，中短半径",
      price: 5499, year: 2026, warranty: 3, flex: 5,
    },
    scores: { stability: 7, response: 7.5, float: 6, park: 8.5, forgiveness: 7.5, value: 7.5 },
    heat: 8120,
    whoFor: ["公园 + 全山", "中阶自由式", "喜欢双向板"],
    verdict: "比 Custom 软两度、比 DOA 稳一档，正好卡在公园与全山之间的那个位置。",
    strengths: ["弹性好，起跳轻松", "双向对称，反脚无差别", "比纯公园板更稳，能应付全山"],
    weaknesses: ["高速稳定不如 Custom", "深雪浮力一般", "性格不够极端，两头都不是最强"],
    fits: ["公园与全山各半", "中阶想练跳台", "喜欢真双向"],
    notFits: ["追求高速刻滑", "野雪党"],
    band: [4700, 6300],
    dist: [2, 8, 29, 84, 101],
    isNew: true,
  },
  {
    id: "sb-15",
    brand: "Capita",
    model: "Horrorscope",
    year: 2024,
    price: 3699,
    scenes: ["beginner", "freestyle"],
    flex: 4,
    specs: {
      length: 153, effectiveEdge: 1160, sidecut: 7.3, waistWidth: 250, stanceSetback: 0,
      profile: "Rocker（全反弓）", shape: "真双向", core: "Dual Core 白杨", fiberglass: "Biax",
      base: "挤压 4000", weight: 2580, damping: 5, pop: 5, turnRadiusFeel: "极宽松，几乎无阻力",
      price: 3699, year: 2024, warranty: 2, flex: 4,
    },
    scores: { stability: 4.5, response: 4.5, float: 6.5, park: 7, forgiveness: 9.5, value: 8.5 },
    heat: 5230,
    whoFor: ["第一年", "公园入门", "预算有限"],
    verdict: "全反弓板型让卡刃几乎不可能发生。它是新手最友好的入门板之一，也能陪你滑完第一个公园季。",
    strengths: ["容错极高，几乎不卡刃", "轻，转板省力", "价格友好"],
    weaknesses: ["速度上来后板面发飘", "边刃抓地弱，冰面打滑", "弹性不足，跳台起跳靠腿"],
    fits: ["第一个雪季", "公园入门", "预算 4000 以内"],
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

export const GEAR: GearItem[] = [...DRAFTS.map(build), ...ACTION_CAM_GEAR, ...ROAD_BIKE_GEAR, ...MTB_GEAR, ...CASTING_ROD_GEAR];

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
