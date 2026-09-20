import { resolveImageUrl } from "@/lib/image-url";
import type { GearItem } from "@/types";
import { CASTING_ROD_SCORE_DIMS } from "./categories";

type Specs = Record<string, number | string | null>;
type Scores = Record<string, number>;

interface CastingRodDraft {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  priceBand: [number, number];
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

function composite(scores: Scores): number {
  let sum = 0;
  let weightSum = 0;
  for (const dimension of CASTING_ROD_SCORE_DIMS) {
    const value = scores[dimension.key];
    if (typeof value !== "number") continue;
    sum += value * dimension.weight;
    weightSum += dimension.weight;
  }
  return weightSum ? Math.round((sum / weightSum) * 10 * 10) / 10 : 0;
}

function build(draft: CastingRodDraft, index: number): GearItem {
  const image = resolveImageUrl(draft.image);
  return {
    id: draft.id,
    categorySlug: "casting-rod",
    brand: draft.brand,
    model: draft.model,
    year: draft.year,
    price: draft.price,
    priceCurrency: "CNY",
    scenes: draft.scenes,
    flexValue: 0,
    flexLabel: "不适用",
    hero: image,
    gallery: [{ url: image, label: "官方产品图 / PRODUCT" }],
    specs: draft.specs,
    scores: draft.scores,
    composite: composite(draft.scores),
    hardcore: 0,
    // 尚未接入真实埋点与用户实测，不填造热度和用户评分分布。
    heat: 0,
    whoFor: draft.whoFor,
    analysis: {
      verdict: draft.verdict,
      strengths: draft.strengths,
      weaknesses: draft.weaknesses,
      fits: draft.fits,
      notFits: draft.notFits,
    },
    priceBand: { min: draft.priceBand[0], max: draft.priceBand[1] },
    ratingDist: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
    isNew: false,
    addedAt: `2026-09-${String(20 + (index % 5)).padStart(2, "0")}`,
  };
}

const DRAFTS: CastingRodDraft[] = [
  {
    id: "daiwa-tatula-641lfb-bf-2026",
    brand: "Daiwa",
    model: "TATULA 641LFB-BF",
    year: 2026,
    price: 1449,
    priceBand: [1299, 1599],
    scenes: ["freshwater", "finesse"],
    specs: {
      length: 1.93,
      sections: 2,
      weight: 96,
      lureWeight: "1.8-11 g",
      lineWeight: "5-12 lb",
      power: "light",
      rodType: "casting",
      blankMaterial: "碳纤维",
      carbonContent: 91,
      scenes: "淡水 · 精细钓法",
    },
    scores: { sensitivity: 8.7, casting: 8.5, control: 8.6, strength: 5.8, versatility: 7.2, value: 7.2 },
    image: "https://www.point-official.shop/img/goods/L/4550133341434_1.jpg",
    whoFor: ["贝特芬尼斯和轻饵", "需要枪柄抛投反馈", "淡水小型目标鱼"],
    verdict: "TATULA 641LFB-BF 把重点放在轻量枪柄抛投与手上反馈，1.8–11g 的饵重覆盖适合精细钓法，但不应拿它承担重障碍起鱼。",
    strengths: ["轻量枪柄定位清晰", "1.8–11g 覆盖小型硬饵和轻型软虫", "96g 自重便于长时间操作"],
    weaknesses: ["回鱼强度不适合重障碍", "饵重上限限制了泛用性", "价格与图源仍需按地区核对"],
    fits: ["贝特芬尼斯", "轻饵淡水路亚", "重视抛投精度和反馈"],
    notFits: ["大型目标鱼和重障碍", "长期使用 15g 以上饵重", "只需要一支全能重型竿"],
  },
  {
    id: "daiwa-tatula-651mfb-2026",
    brand: "Daiwa",
    model: "TATULA 651MFB",
    year: 2026,
    price: 1449,
    priceBand: [1299, 1599],
    scenes: ["freshwater", "bass"],
    specs: {
      length: 1.96,
      sections: 2,
      weight: 109,
      lureWeight: "5-21 g",
      lineWeight: "8-16 lb",
      power: "medium",
      rodType: "casting",
      blankMaterial: "碳纤维",
      carbonContent: 92,
      scenes: "淡水 · 鲈鱼",
    },
    scores: { sensitivity: 8, casting: 8.4, control: 8.2, strength: 7.5, versatility: 8.8, value: 7.6 },
    image: "https://www.anglerscentral.my/cdn/shop/files/EDFCC126-8552-45A9-A0BB-9E32D4CC4505.jpg?v=1773455787&width=416",
    whoFor: ["需要一支中调全能枪柄竿", "软虫、德州和中小型硬饵", "淡水鲈钓入门到进阶"],
    verdict: "TATULA 651MFB 处在路亚竿里最容易被用上的中调区间，5–21g 让它在常见淡水鲈钓场景中有较好的覆盖面。",
    strengths: ["5–21g 饵重覆盖面实用", "中调和 109g 自重兼顾操控", "适合软虫与硬饵之间切换"],
    weaknesses: ["不是轻饵精细钓或重型竿的专长", "具体先调信息仍需按官方型号核对", "价格区间不是中国区最终售价"],
    fits: ["淡水鲈钓", "软虫、德州和中小型硬饵", "想要一支主力全能枪柄竿"],
    notFits: ["纯 UL 轻饵", "大型重障碍和大克重饵", "只追求极致远投"],
  },
  {
    id: "daiwa-tatula-681mhrb-2026",
    brand: "Daiwa",
    model: "TATULA 681MHRB",
    year: 2026,
    price: 1549,
    priceBand: [1399, 1699],
    scenes: ["freshwater", "bass", "heavy-lure"],
    specs: {
      length: 2.03,
      sections: 2,
      weight: 119,
      lureWeight: "7-28 g",
      lineWeight: "10-20 lb",
      power: "medium-heavy",
      rodType: "casting",
      blankMaterial: "碳纤维",
      carbonContent: 91,
      scenes: "淡水 · 鲈鱼 · 重饵",
    },
    scores: { sensitivity: 7.8, casting: 8.1, control: 8.5, strength: 9, versatility: 8, value: 7.4 },
    image: "https://www.anglerscentral.my/cdn/shop/files/images.png?v=1773456295&width=416",
    whoFor: ["需要起鱼底气", "高比重软虫与重型硬饵", "淡水重障碍路亚"],
    verdict: "TATULA 681MHRB 用更长的竿身和中重调换取控鱼与起鱼余量，7–28g 适合需要一定强度的淡水重饵场景。",
    strengths: ["中重调和 10–20lb 线号适合控鱼", "2.03m 兼顾岸边覆盖和操作距离", "7–28g 覆盖常见中重型饵"],
    weaknesses: ["轻饵细腻度和长时间舒适性不如轻调", "119g 自重更考验持续操作", "重障碍环境仍需结合线组和钩型"],
    fits: ["高比重软虫和德州", "中重型硬饵", "需要更强控鱼能力的鲈钓"],
    notFits: ["UL / L 轻饵", "溪流小型目标鱼", "只做精细慢操作"],
  },
  {
    id: "shimano-limitless-lmt862sp26ml-2024",
    brand: "Shimano",
    model: "LIMITLESS LMT862SP26ML",
    year: 2024,
    price: 1449,
    priceBand: [1299, 1599],
    scenes: ["freshwater", "light-lure"],
    specs: {
      length: 2.59,
      sections: 2,
      weight: null,
      lureWeight: "5-21 g",
      lineWeight: "2-6 kg",
      power: "medium-light",
      rodType: "spinning",
      blankMaterial: "30T / 40T Carbon",
      scenes: "淡水 · 轻饵",
    },
    scores: { sensitivity: 8.6, casting: 8.8, control: 8.4, strength: 6.5, versatility: 8, value: 7.3 },
    image: "https://www.smartmarine.co.nz/cdn/images/products/xlarge/8089900_a.jpg",
    whoFor: ["岸边淡水路亚", "需要远投距离", "中轻调直柄竿用户"],
    verdict: "LIMITLESS LMT862SP26ML 用 2.59m 竿长换取远投覆盖和轻饵操控，适合岸边需要把饵送得更远的淡水场景。",
    strengths: ["2.59m 长度有利于岸边远投", "5–21g 覆盖常见轻中饵", "中轻调兼顾反馈和一定容错"],
    weaknesses: ["长竿在船上和密集障碍中不够灵活", "官方重量未补充", "线号单位需要结合地区规格理解"],
    fits: ["岸边淡水路亚", "需要远投距离", "轻中型硬饵和软饵"],
    notFits: ["狭窄溪流和船上近距离操作", "重障碍强拔", "极轻量便携优先"],
  },
  {
    id: "shimano-streamflight-stf702sp25l-2026",
    brand: "Shimano",
    model: "STREAMFLIGHT STF702SP25L",
    year: 2026,
    price: 799,
    priceBand: [699, 899],
    scenes: ["freshwater", "light-lure"],
    specs: {
      length: 2.13,
      sections: 2,
      weight: null,
      lureWeight: "2-12 g",
      lineWeight: "2-5 kg",
      power: "light",
      rodType: "spinning",
      blankMaterial: "30T Carbon",
      scenes: "淡水 · 轻饵",
    },
    scores: { sensitivity: 8.4, casting: 8.3, control: 8, strength: 5.8, versatility: 7.2, value: 8 },
    image: "https://bbsports.co.nz/cdn/shop/files/Untitled_580x.jpg?v=1760064152",
    whoFor: ["溪流和小河轻饵", "追求落点与鱼讯", "预算有限的轻量直柄入门"],
    verdict: "STREAMFLIGHT STF702SP25L 把重点放在 2–12g 轻饵、落点和鱼讯反馈，适合溪流与小河，不适合拿来硬扛大鱼和重障碍。",
    strengths: ["2–12g 适合轻饵和小型目标鱼", "2.13m 在溪流与小河之间较均衡", "价格进入入门友好区间"],
    weaknesses: ["轻调决定了回鱼强度上限", "官方重量未补充", "重饵和大鱼场景余量有限"],
    fits: ["溪流、小河轻饵", "小型硬饵和软饵", "第一支轻量直柄竿"],
    notFits: ["重障碍和大型目标鱼", "需要 20g 以上饵重", "追求极限远投"],
  },
];

export const CASTING_ROD_GEAR: GearItem[] = DRAFTS.map(build);
