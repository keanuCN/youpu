import { SNOWBOARD_SCORE_DIMS } from "./categories";
import type { GearItem } from "../types";

function hash(value: string): number {
  let result = 2166136261;
  for (const char of value) result = Math.imul(result ^ char.charCodeAt(0), 16777619);
  return result >>> 0;
}

function score(value: number): number {
  return Math.round(Math.min(9.6, Math.max(3.2, value)) * 10) / 10;
}

function sceneName(gear: GearItem): string {
  const labels: Record<string, string> = {
    "all-mountain": "全山",
    carving: "刻滑",
    powder: "粉雪",
    freestyle: "自由式",
    park: "公园",
    freeride: "自由滑",
    beginner: "入门练习",
  };
  return gear.scenes.slice(0, 2).map((scene) => labels[scene] ?? scene).join("与") || "日常滑行";
}

function generatedScores(gear: GearItem, seed: number): Record<string, number> {
  const flex = Number(gear.specs.flex ?? gear.flexValue) || 5;
  const edge = Number(gear.specs.effectiveEdge ?? 1200);
  const damping = Number(gear.specs.damping ?? 5);
  const setback = Number(gear.specs.stanceSetback ?? 0);
  const price = gear.price || 5500;
  const scenes = new Set(gear.scenes);
  const profile = String(gear.specs.profile ?? "").toLowerCase();
  const directional = /direction|directional|定向|后移/.test(`${gear.specs.shape ?? ""} ${gear.specs.profile ?? ""}`);
  const rocker = /rocker|反弓|摇臂|hybrid|混合/i.test(profile);
  const variation = (offset: number) => (((seed >>> (offset % 24)) % 9) - 4) * 0.11;
  const values: Record<string, number> = {
    stability: 5.5 + flex * 0.3 + damping * 0.16 + Math.max(0, edge - 1180) / 180 + variation(1),
    response: 5.2 + flex * 0.4 + Math.max(0, edge - 1180) / 230 + variation(4),
    float: 5.4 + (scenes.has("powder") ? 1.6 : 0) + (directional ? 0.7 : 0) + Math.min(1, setback / 25) + variation(7),
    park: 5.5 + (scenes.has("park") || scenes.has("freestyle") ? 1.7 : 0) + Math.max(0, 6 - flex) * 0.25 + variation(10),
    forgiveness: 8.3 - (flex - 4) * 0.43 + (rocker ? 0.45 : 0) + variation(13),
    value: 6.8 + (6500 - price) / 2400 + variation(16),
  };
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, score(value)]));
}

function generatedRatingDist(seed: number): GearItem["ratingDist"] {
  const count = 18 + (seed % 203);
  const rawShares = [
    0.46 + ((seed >>> 3) % 8) / 100,
    0.28 + ((seed >>> 7) % 6) / 100,
    0.13 + ((seed >>> 11) % 4) / 100,
    0.05 + ((seed >>> 15) % 3) / 100,
    0.02,
  ];
  const shareTotal = rawShares.reduce((sum, value) => sum + value, 0);
  const [five, four, three, two] = rawShares.slice(0, 4).map((value) => Math.round((count * value) / shareTotal));
  return { "1": Math.max(0, count - five! - four! - three! - two!), "2": two!, "3": three!, "4": four!, "5": five! };
}

function notesFor(gear: GearItem): GearItem["demoNotes"] {
  const flex = Number(gear.specs.flex ?? gear.flexValue) || 5;
  const profile = String(gear.specs.profile ?? "当前板型");
  const shape = String(gear.specs.shape ?? "当前形状");
  const scenes = sceneName(gear);
  const turn = String(gear.specs.turnRadiusFeel ?? "转弯表现仍需结合尺码和雪况判断");
  const sidecut = Number(gear.specs.sidecut);
  const shortTurn = Number.isFinite(sidecut) && sidecut > 0 && sidecut < 8;
  return [
    {
      title: "场景匹配参考",
      content: `${scenes}取向，规格记录为${profile}、${shape}。页面按这些公开参数整理选板参考，不代表真实试滑反馈。`,
    },
    {
      title: "操控特征推演",
      content: `参数硬度约 ${flex}/10，${shortTurn ? "较小侧切半径通常更容易进入短弯" : "板长、有效刃和侧切半径会共同影响弯道节奏"}；当前资料对转向的描述为“${turn}”。`,
    },
    {
      title: "购买前核对",
      content: "请结合身高、体重、鞋码、常滑雪况和目标尺码复核。不同品牌的硬度量表并不统一，数值只作同系列参考。",
    },
  ];
}

/** 为静态演示目录生成稳定、可复现的规格推演数据；不创建伪造的用户评论。 */
export function withSnowboardDemoData(gear: GearItem): GearItem {
  if (gear.categorySlug !== "snowboard") return gear;
  const seed = hash(`${gear.id}:${gear.brand}:${gear.model}:${gear.year}`);
  const scores = Object.keys(gear.scores).length ? gear.scores : generatedScores(gear, seed);
  const composite =
    gear.composite > 0
      ? gear.composite
      : Math.round(
          (SNOWBOARD_SCORE_DIMS.reduce((sum, dim) => sum + (scores[dim.key] ?? 5) * dim.weight, 0) /
            SNOWBOARD_SCORE_DIMS.reduce((sum, dim) => sum + dim.weight, 0)) *
            10 *
            10,
        ) / 10;
  const rankedScores = SNOWBOARD_SCORE_DIMS
    .map((dim) => ({ ...dim, value: scores[dim.key] ?? 5 }))
    .sort((a, b) => b.value - a.value);
  const scenes = sceneName(gear);
  const flex = Number(gear.specs.flex ?? gear.flexValue) || 5;
  const analysis = {
    ...gear.analysis,
    verdict:
      gear.analysis.verdict ||
      `${gear.brand} ${gear.model} 的公开参数偏向${scenes}。以下评分和适配建议是规格推演样例，实际表现还会受尺码、雪况与滑手影响。`,
    strengths:
      gear.analysis.strengths.length > 0
        ? gear.analysis.strengths
        : [`规格推演中${rankedScores[0]!.label}得分较高（${rankedScores[0]!.value}/10），可优先核对这一取向。`, `公开资料记录硬度约 ${flex}/10，可结合个人力量与速度需求选择。`],
    weaknesses:
      gear.analysis.weaknesses.length > 0
        ? gear.analysis.weaknesses
        : [`${rankedScores.at(-1)!.label}得分相对保守（${rankedScores.at(-1)!.value}/10），建议按主要滑行场景复核。`, "不同品牌的规格和评分口径不完全一致，样例分数不能替代实际试滑。"],
    fits:
      gear.analysis.fits.length > 0
        ? gear.analysis.fits
        : [`主要滑行场景为${scenes}的用户，可将其列入候选。`, flex >= 7 ? "偏好较强支撑、能主动施力的滑手。" : "偏好较轻松脚感、重视容错的滑手。"],
    notFits:
      gear.analysis.notFits.length > 0
        ? gear.analysis.notFits
        : ["目标场景与该板的参数取向差异较大时，不建议只看综合分。", "新手应先核对尺码、硬度和固定器兼容性。"],
  };
  return {
    ...gear,
    scores,
    composite,
    heat: 680 + (seed % 16800),
    ratingDist: gear.liveRating ? gear.ratingDist : generatedRatingDist(seed),
    whoFor: gear.whoFor.length ? gear.whoFor : [`${scenes}取向`, flex >= 7 ? "中高级滑手参考" : "轻松操控取向"],
    analysis,
    demoMetrics: true,
    demoRating: !gear.liveRating,
    demoNotes: notesFor(gear),
  };
}
