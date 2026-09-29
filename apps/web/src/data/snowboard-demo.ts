import { getCategory, SNOWBOARD_SCORE_DIMS } from "./categories";
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
  const terrain = String(gear.specs.terrain ?? "");
  return gear.scenes.slice(0, 2).map((scene) => labels[scene] ?? scene).join("与") || terrain || "日常滑行";
}

function generatedSnowboardScores(gear: GearItem, seed: number): Record<string, number> {
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

function generatedBootScores(gear: GearItem, seed: number): Record<string, number> {
  const flexText = String(gear.specs.flex ?? "").toLowerCase();
  const modelText = `${gear.model} ${gear.specs.lacingSystem ?? ""}`.toLowerCase();
  const fitText = String(gear.specs.fit ?? "").toLowerCase();
  const lacing = String(gear.specs.lacingSystem ?? "").toLowerCase();
  const price = gear.price || 0;
  const isWide = /wide|宽楦/.test(fitText + modelText);
  const flex = /硬|stiff|high/.test(flexText) ? 8 : /软|soft|low/.test(flexText) ? 4 : /中|mid|medium/.test(flexText) ? 6 : 5;
  const variation = (offset: number) => (((seed >>> (offset % 24)) % 9) - 4) * 0.1;
  const convenience = /boa|快速旋钮/.test(lacing) ? 8.2 : /tls|speed zone|双拉|系带/.test(lacing) ? 7.2 : 6.4;
  const values: Record<string, number> = {
    fit: (isWide ? 7.4 : 6.8) + variation(1),
    support: 5.4 + flex * 0.38 + (/step on/.test(modelText) ? 0.2 : 0) + variation(4),
    warmth: 6.8 + (/liner|热塑/.test(modelText) ? 0.35 : 0) + variation(7),
    convenience: convenience + variation(10),
    value: (price > 0 ? 7.2 + (4500 - price) / 2200 : 6.6) + variation(13),
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
  if (gear.categorySlug === "snowboard-boot") {
    const lacing = String(gear.specs.lacingSystem ?? "闭合系统资料待补");
    const fit = String(gear.specs.fit ?? "官方鞋楦资料待补，需以试穿为准");
    const compatibility = String(gear.specs.bindingCompatibility ?? "购买前按品牌说明核对固定器兼容性");
    const flexText = String(gear.specs.flex ?? "官方硬度资料待补");
    return [
      {
        title: "贴合与穿脱参考",
        content: `当前档案记录闭合系统：${lacing}；鞋楦信息：${fit}。实际贴合受脚背、脚宽、袜厚与内胆热塑影响，建议穿滑雪袜试穿。`,
      },
      {
        title: "支撑表现推演",
        content: `硬度档案：${flexText}。支撑分按现有硬度与结构关键词推演；字段缺失时采用中性值，不代表品牌官方分级。`,
      },
      {
        title: "固定器兼容核对",
        content: `${compatibility}。若为 Step On 等专有接口，需与同系统固定器配套；鞋码也应与固定器尺码范围匹配。`,
      },
    ];
  }
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

function enrichBootSpecsFromVerifiedSummary(gear: GearItem): GearItem {
  if (gear.categorySlug !== "snowboard-boot") return gear;
  const summary = gear.analysis.verdict;
  const specs = { ...gear.specs };
  // Salomon product pages publish these fields directly. Keep the overlay limited
  // to explicit brand values; leave the user's actual fit and unsupported fields open.
  const salomonSpecs: Record<string, Pick<GearItem["specs"], "flex" | "fit" | "terrain"> & Partial<Pick<GearItem["specs"], "lacingSystem">>> = {
    "dialogue dual boa": { flex: "中等", fit: "常规楦", terrain: "全山/自由式" },
    "dialogue dual boa team": { flex: "中等", fit: "常规楦", terrain: "全山/自由式" },
    "dialogue dual boa wide": { flex: "中等", fit: "宽楦", terrain: "全山/自由式", lacingSystem: "双区 BOA" },
    "dialogue lace sj boa": { flex: "中等", fit: "常规楦", terrain: "全山/自由式" },
    "echo dual boa": { flex: "中等至偏硬", fit: "常规楦", terrain: "自由滑/全山" },
    "faction boa": { flex: "偏软", fit: "常规楦", terrain: "全山" },
    "launch boa sj boa": { flex: "中等", fit: "常规楦", terrain: "全山/自由式" },
    "malamute dual boa": { flex: "偏硬", fit: "常规楦", terrain: "自由滑" },
    "titan boa": { flex: "偏软", fit: "常规楦", terrain: "全山" },
    trek: { flex: "偏硬", fit: "常规楦", terrain: "分体板徒步/登山" },
    "x approach lace sj boa": { flex: "中等", fit: "常规楦", terrain: "全山/自由式" },
  };
  if (gear.brand.toLowerCase() === "salomon") {
    const official = salomonSpecs[gear.model.toLowerCase()];
    if (official) {
      if (specs.flex == null) specs.flex = official.flex;
      if (specs.fit == null) specs.fit = official.fit;
      if (specs.terrain == null) specs.terrain = official.terrain;
      if (official.lacingSystem) specs.lacingSystem = official.lacingSystem;
    }
  }
  if (specs.fit == null && /宽楦/.test(summary)) specs.fit = "宽楦";
  if (specs.flex == null && /官方标注中等硬度/.test(summary)) specs.flex = "中等";
  if (specs.bindingCompatibility == null && /Step On/.test(summary) && /(专用|仅兼容)/.test(summary)) {
    specs.bindingCompatibility = "Step On 专用固定器";
  }
  if (specs.terrain == null && /徒步\/登山取向/.test(summary)) specs.terrain = "分体板徒步/登山";
  return { ...gear, specs };
}

/** 为雪板和雪鞋生成稳定、可复现的规格推演数据；不创建伪造的用户评论。 */
export function withSnowSportDemoData(gear: GearItem): GearItem {
  if (gear.categorySlug !== "snowboard" && gear.categorySlug !== "snowboard-boot") return gear;
  gear = enrichBootSpecsFromVerifiedSummary(gear);
  const seed = hash(`${gear.id}:${gear.brand}:${gear.model}:${gear.year}`);
  const scoreDims = gear.categorySlug === "snowboard" ? SNOWBOARD_SCORE_DIMS : getCategory(gear.categorySlug)?.scoreDims ?? [];
  const scores =
    Object.keys(gear.scores).length > 0
      ? gear.scores
      : gear.categorySlug === "snowboard"
        ? generatedSnowboardScores(gear, seed)
        : generatedBootScores(gear, seed);
  const composite =
    gear.composite > 0
      ? gear.composite
      : Math.round(
          (scoreDims.reduce((sum, dim) => sum + (scores[dim.key] ?? 5) * dim.weight, 0) /
            scoreDims.reduce((sum, dim) => sum + dim.weight, 0)) *
            10 *
            10,
        ) / 10;
  const rankedScores = scoreDims
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
        : [`规格推演中${rankedScores[0]!.label}得分较高（${rankedScores[0]!.value}/10），可优先核对这一取向。`, gear.categorySlug === "snowboard-boot" ? `闭合系统记录为${String(gear.specs.lacingSystem ?? "待补充")}，穿脱便利度请结合个人习惯判断。` : `公开资料记录硬度约 ${flex}/10，可结合个人力量与速度需求选择。`],
    weaknesses:
      gear.analysis.weaknesses.length > 0
        ? gear.analysis.weaknesses
        : [`${rankedScores.at(-1)!.label}得分相对保守（${rankedScores.at(-1)!.value}/10），建议按主要滑行场景复核。`, gear.categorySlug === "snowboard-boot" ? "鞋楦与实际脚型的适配无法仅凭参数判断，尺码选择前应试穿。" : "不同品牌的规格和评分口径不完全一致，样例分数不能替代实际试滑。"],
    fits:
      gear.analysis.fits.length > 0
        ? gear.analysis.fits
        : [`主要滑行场景为${scenes}的用户，可将其列入候选。`, flex >= 7 ? "偏好较强支撑、能主动施力的滑手。" : "偏好较轻松脚感、重视容错的滑手。"],
    notFits:
      gear.analysis.notFits.length > 0
        ? gear.analysis.notFits
        : ["目标场景与该板的参数取向差异较大时，不建议只看综合分。", "新手应先核对尺码、硬度和固定器兼容性。"],
  };
  const generatedHardcore =
    gear.categorySlug === "snowboard" && gear.hardcore === 0
      ? Math.round(Math.min(1, Math.max(0, (flex - 2) / 8)) * 65 + (scores.stability ?? 5) * 3.5)
      : gear.hardcore;
  return {
    ...gear,
    scores,
    composite,
    hardcore: generatedHardcore,
    heat: 680 + (seed % 16800),
    ratingDist: gear.liveRating ? gear.ratingDist : generatedRatingDist(seed),
    whoFor: gear.whoFor.length ? gear.whoFor : [`${scenes}取向`, flex >= 7 ? "中高级滑手参考" : "轻松操控取向"],
    analysis,
    demoMetrics: true,
    demoRating: !gear.liveRating,
    demoNotes: notesFor(gear),
  };
}
