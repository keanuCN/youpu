import { GEAR, GEAR_BY_ID, reviewCount, userRating } from "@/data/boards";
import { SEASON, SNOWBOARD, getCategory } from "@/data/categories";
import { BASE_VOTES, SEED_REVIEWS } from "@/data/seeds";
import { hasEditorialScores, hasFlex, hasHardcoreIndex, hasPrice, hasUserRating } from "@/lib/gear-state";
import { GUEST, type Persisted } from "@/lib/persisted";
import type { GearItem, QuizQuestion, Review, ScoreDim, SortKey, SpecGroup } from "@/types";

// 说明：涉及本机数据的函数一律显式接收 Persisted（由 usePersisted() 传入），
// 不在内部读模块状态 —— 服务端与客户端首帧因此完全一致，避免水合不一致。

// ---------- 筛选与排序 ----------

export interface Filters {
  scenes: string[];
  profileFamily: string[];
  flex: string[];
  price: [number, number];
  brands: string[];
  years: string[];
  q: string;
}

export const PRICE_BOUNDS: [number, number] = [2000, 8000];
export type PriceBounds = [number, number];

export const DEFAULT_FILTERS: Filters = {
  scenes: [],
  profileFamily: [],
  flex: [],
  price: PRICE_BOUNDS,
  brands: [],
  years: [],
  q: "",
};

export function flexBucketOf(v: number): string {
  if (v < 4) return "soft";
  if (v < 6) return "mid";
  if (v < 8) return "midstiff";
  return "stiff";
}

export function activeFilterCount(f: Filters, priceBounds: PriceBounds = PRICE_BOUNDS): number {
  let n = 0;
  n += f.scenes.length ? 1 : 0;
  n += f.profileFamily.length ? 1 : 0;
  n += f.flex.length ? 1 : 0;
  n += f.brands.length ? 1 : 0;
  n += f.years.length ? 1 : 0;
  if (f.price[0] !== priceBounds[0] || f.price[1] !== priceBounds[1]) n += 1;
  return n;
}

export function applyFilters(items: GearItem[], f: Filters, priceBounds: PriceBounds = PRICE_BOUNDS): GearItem[] {
  const q = f.q.trim().toLowerCase();
  const priceFilterActive = f.price[0] !== priceBounds[0] || f.price[1] !== priceBounds[1];
  return items.filter((g) => {
    if (f.scenes.length && !f.scenes.some((s) => g.scenes.includes(s))) return false;
    if (f.profileFamily.length && !f.profileFamily.includes(String(g.specs.profileFamily ?? ""))) return false;
    // 显式筛选时，缺失 flex 不能被数值 0 误判为 soft。
    if (f.flex.length && (!hasFlex(g) || !f.flex.includes(flexBucketOf(g.flexValue)))) return false;
    // 默认价格区间不能把价格尚未采集的产品误删；用户主动调价时，未知价格不参与匹配。
    if (priceFilterActive && (!hasPrice(g) || g.price < f.price[0] || g.price > f.price[1])) return false;
    if (f.brands.length && !f.brands.includes(g.brand)) return false;
    if (f.years.length && !f.years.includes(String(g.year))) return false;
    if (q) {
      const hay = `${g.brand} ${g.model} ${g.year}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export const SORT_LABELS: Record<SortKey, string> = {
  heat: "热度",
  new: "新品",
  score: "评分",
  hardcore: "进阶指数",
};

export function sortGear(items: GearItem[], sort: SortKey): GearItem[] {
  const list = [...items];
  switch (sort) {
    case "heat":
      return list.sort((a, b) => b.heat + reviewCount(b) - (a.heat + reviewCount(a)));
    case "new":
      return list.sort((a, b) => b.year - a.year || b.addedAt.localeCompare(a.addedAt));
    case "score":
      return list.sort((a, b) => b.composite - a.composite);
    case "hardcore":
      return list.sort((a, b) => b.hardcore - a.hardcore);
    default:
      return list;
  }
}

// ---------- 评论 ----------

export function allReviews(s: Persisted, gearId?: string): Review[] {
  const merged = [...SEED_REVIEWS, ...s.userReviews];
  return gearId ? merged.filter((r) => r.gearId === gearId) : merged;
}

export function helpfulOf(s: Persisted, r: Review): number {
  let extra = 0;
  for (const list of Object.values(s.helpful)) if (list.includes(r.id)) extra += 1;
  return (r.seedHelpful ?? 0) + extra;
}

export function iHelpful(s: Persisted, r: Review): boolean {
  const key = s.sessionKey ?? GUEST;
  return (s.helpful[key] ?? []).includes(r.id);
}

export function repliesOf(s: Persisted, parentId: string): Review[] {
  return allReviews(s)
    .filter((r) => r.parentId === parentId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function topLevelReviews(s: Persisted, gearId: string, mode: "helpful" | "latest"): Review[] {
  const list = allReviews(s, gearId).filter((r) => !r.parentId);
  if (mode === "latest") return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return list.sort((a, b) => helpfulOf(s, b) - helpfulOf(s, a) || b.createdAt.localeCompare(a.createdAt));
}

export function hotReviews(s: Persisted, limit: number): Review[] {
  return allReviews(s)
    .filter((r) => !r.parentId)
    .sort((a, b) => helpfulOf(s, b) - helpfulOf(s, a))
    .slice(0, limit);
}

export function reviewsByUser(s: Persisted, userKey: string): Review[] {
  return allReviews(s)
    .filter((r) => r.userKey === userKey)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// ---------- 雷达图 ----------

export function radarPolygon(values: number[], dims: ScoreDim[], cx: number, cy: number, r: number): string {
  const n = dims.length;
  return dims
    .map((d, i) => {
      const v = Math.max(0, Math.min(10, values[i] ?? 0)) / 10;
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      return `${(cx + Math.cos(angle) * r * v).toFixed(2)},${(cy + Math.sin(angle) * r * v).toFixed(2)}`;
    })
    .join(" ");
}

export function radarRing(level: number, n: number, cx: number, cy: number, r: number): string {
  return Array.from({ length: n }, (_, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return `${(cx + Math.cos(angle) * r * level).toFixed(2)},${(cy + Math.sin(angle) * r * level).toFixed(2)}`;
  }).join(" ");
}

export function radarAnchor(i: number, n: number, cx: number, cy: number, r: number) {
  const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
  return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, angle };
}

// ---------- 对比矩阵 ----------

export interface CompareRow {
  group: string;
  key: string;
  label: string;
  unit?: string;
  values: (number | string | null)[];
  isDiff: boolean;
  winner: number | null;
  kind: "spec" | "score" | "meta";
}

function numericDiff(values: (number | string | null)[], threshold: number): boolean {
  const nums = values.filter((v): v is number => typeof v === "number");
  if (nums.length < 2) return false;
  const max = Math.max(...nums);
  const min = Math.min(...nums);
  if (max === min) return false;
  const base = Math.abs(max) || 1;
  return (max - min) / base >= threshold;
}

function textDiff(values: (number | string | null)[]): boolean {
  const present = values.filter((v) => v !== null && v !== undefined);
  if (present.length < 2) return false;
  return new Set(present.map((v) => String(v))).size > 1;
}

function pickWinner(
  values: (number | string | null)[],
  direction: "higher" | "lower" | null | undefined,
  isDiff: boolean,
): number | null {
  if (!isDiff || !direction) return null;
  let bestIdx = -1;
  let bestVal: number | null = null;
  let tie = false;
  values.forEach((v, i) => {
    if (typeof v !== "number") return;
    if (bestVal === null) {
      bestVal = v;
      bestIdx = i;
      return;
    }
    const better = direction === "higher" ? v > bestVal : v < bestVal;
    if (better) {
      bestVal = v;
      bestIdx = i;
      tie = false;
    } else if (v === bestVal) {
      tie = true;
    }
  });
  return tie || bestIdx < 0 ? null : bestIdx;
}

export function buildCompareMatrix(items: GearItem[], groups: SpecGroup[], dims: ScoreDim[]): CompareRow[] {
  const rows: CompareRow[] = [];
  const meta: [string, string, (g: GearItem) => number | string | null, "higher" | "lower" | null][] = [
    ["概览", "综合指数", (g) => (hasEditorialScores(g) ? g.composite : null), "higher"],
    ["概览", "用户评分", (g) => (hasUserRating(g) ? userRating(g) : null), "higher"],
    ["概览", "参考价", (g) => (hasPrice(g) ? g.price : null), "lower"],
    ["概览", "年款", (g) => g.year, "higher"],
    ["概览", "评论数", (g) => reviewCount(g), "higher"],
  ];
  if (items.length > 0 && items.every((item) => item.categorySlug === "snowboard")) {
    meta.splice(2, 0, ["概览", "进阶指数", (g) => (hasHardcoreIndex(g) ? g.hardcore : null), "higher"]);
  }
  for (const [group, label, get, dir] of meta) {
    const values = items.map(get);
    const isDiff = numericDiff(values, 0.02);
    rows.push({ group, key: label, label, values, isDiff, winner: pickWinner(values, dir, isDiff), kind: "meta" });
  }
  for (const g of groups) {
    for (const f of g.fields) {
      const values = items.map((it) => {
        const v = it.specs[f.key];
        return v === undefined ? null : v;
      });
      const isDiff = f.type === "number" ? numericDiff(values, f.diffThreshold ?? 0.05) : textDiff(values);
      rows.push({
        group: g.group,
        key: f.key,
        label: f.label,
        unit: f.unit,
        values,
        isDiff,
        winner: pickWinner(values, f.direction, isDiff),
        kind: "spec",
      });
    }
  }
  for (const d of dims) {
    const values = items.map((it) => it.scores[d.key] ?? null);
    const isDiff = numericDiff(values, 0.05);
    rows.push({
      group: "分项评分",
      key: d.key,
      label: d.label,
      unit: "/10",
      values,
      isDiff,
      winner: pickWinner(values, "higher", isDiff),
      kind: "score",
    });
  }
  return rows;
}

export function compareConclusion(items: GearItem[]): string[] {
  if (items.length < 2) return [];
  const best = (fn: (g: GearItem) => number, label: string, available: (g: GearItem) => boolean, direction: "higher" | "lower" = "higher") => {
    const candidates = items.filter(available);
    if (!candidates.length) return `${label}：数据待补充`;
    const top = candidates.reduce((current, candidate) => {
      const better = direction === "higher" ? fn(candidate) > fn(current) : fn(candidate) < fn(current);
      return better ? candidate : current;
    });
    return `${label}：${top.brand} ${top.model}`;
  };
  const conclusions = [
    best((g) => g.composite, "综合指数最高", hasEditorialScores),
    best((g) => g.scores.value ?? 0, "性价比最高", (g) => typeof g.scores.value === "number"),
  ];
  if (items.every((item) => item.categorySlug === "snowboard")) {
    conclusions.push(best((g) => g.hardcore, "最吃技术", hasHardcoreIndex));
  }
  conclusions.push(best((g) => g.price, "价格最友好", hasPrice, "lower"));
  return conclusions;
}

// ---------- 榜单 ----------

export interface RankRow {
  gear: GearItem;
  dataScore: number;
  votes: number;
  final: number;
  rank: number;
}

export function voteCount(s: Persisted, rankKey: string, gearId: string): number {
  const base = BASE_VOTES[rankKey]?.[gearId] ?? 0;
  let extra = 0;
  for (const list of Object.values(s.votes)) {
    for (const v of list) if (v.rankKey === rankKey && v.gearId === gearId && v.season === SEASON) extra += 1;
  }
  return base + extra;
}

export function rankRows(
  s: Persisted,
  rankKey: string,
  categorySlug = "snowboard",
  sourcePool: GearItem[] = GEAR,
): RankRow[] {
  const category = getCategory(categorySlug) ?? SNOWBOARD;
  const cat = category.rankCategories.find((c) => c.key === rankKey) ?? category.rankCategories[0];
  let pool = sourcePool.filter((g) => g.categorySlug === categorySlug);
  if (cat?.scenes?.length) pool = pool.filter((g) => g.scenes.some((scene) => cat.scenes!.includes(scene)));
  if (rankKey === "value") pool = pool.filter(hasPrice).sort((a, b) => a.price - b.price).slice(0, 10);

  const withData = pool.map((g) => {
    const isSnowboard = categorySlug === "snowboard";
    const ratingPart = hasEditorialScores(g) ? (g.composite / 100) * (isSnowboard ? 55 : 65) : 0;
    const heatPart = (g.heat / 10000) * (isSnowboard ? 20 : 15);
    const hardPart = isSnowboard
      ? rankKey === "beginner"
        ? ((100 - g.hardcore) / 100) * 15
        : (g.hardcore / 100) * 15
      : 0;
    const userPart = hasUserRating(g) ? (userRating(g) / 5) * (isSnowboard ? 10 : 20) : 0;
    return {
      gear: g,
      dataScore: Math.round((ratingPart + heatPart + hardPart + userPart) * 10) / 10,
      votes: voteCount(s, rankKey, g.id),
    };
  });
  const maxVotes = Math.max(1, ...withData.map((d) => d.votes));
  const scored = withData.map((d) => ({
    ...d,
    final: Math.round((d.dataScore * 0.7 + (d.votes / maxVotes) * 100 * 0.3) * 10) / 10,
  }));
  scored.sort((a, b) => b.final - a.final);
  return scored.map((d, i) => ({ ...d, rank: i + 1 }));
}

// ---------- 问卷推荐 ----------

export interface QuizAnswers {
  level?: string;
  scene?: string[];
  weight?: string;
  budget?: string;
  flex?: string;
  priority?: string;
}

export interface Recommendation {
  gear: GearItem;
  match: number;
  reasons: string[];
  fallback?: boolean;
}

const BUDGET_RANGE: Record<string, [number, number]> = {
  lt4000: [0, 4000],
  "4000to6000": [4000, 6000],
  "6000to8000": [6000, 8000],
  any: [0, 99999],
};

const WEIGHT_LENGTH: Record<string, [number, number]> = {
  lt60: [148, 155],
  "60to75": [153, 159],
  "75to90": [156, 162],
  gt90: [159, 168],
};

export function recommend(a: QuizAnswers): Recommendation[] {
  const scored = GEAR.map((g) => {
    let score = 0;
    const reasons: string[] = [];

    if (a.scene?.length) {
      const hit = a.scene.filter((s) => g.scenes.includes(s));
      if (hit.length) {
        score += 30 * (hit.length / a.scene.length) + (hit.length === a.scene.length ? 8 : 0);
        reasons.push(`场景命中「${hit.map(sceneLabel).join("、")}」`);
      } else {
        score -= 18;
      }
    }

    if (a.budget && BUDGET_RANGE[a.budget] && hasPrice(g)) {
      const [lo, hi] = BUDGET_RANGE[a.budget]!;
      if (g.price >= lo && g.price <= hi) {
        score += 20;
        reasons.push(`价格 ${g.price} 元落在你的预算内`);
      } else if (g.price > hi) {
        score -= 25;
      } else {
        score += 6;
      }
    }

    if (a.weight && WEIGHT_LENGTH[a.weight]) {
      const [lo, hi] = WEIGHT_LENGTH[a.weight]!;
      const len = Number(g.specs.length ?? 157);
      if (len >= lo && len <= hi) {
        score += 12;
        reasons.push(`${len}cm 板长适配你的体重区间`);
      } else {
        score -= 8;
      }
    }

    if (a.flex && a.flex !== "unsure" && g.flexValue > 0) {
      const bucket = flexBucketOf(g.flexValue);
      const want = a.flex === "soft" ? ["soft"] : a.flex === "mid" ? ["mid", "midstiff"] : ["midstiff", "stiff"];
      if (want.includes(bucket)) {
        score += 14;
        reasons.push(`硬度 ${g.flexValue}/10 符合你的偏好`);
      } else {
        score -= 10;
      }
    }

    if (a.level && hasHardcoreIndex(g)) {
      const hard = g.hardcore;
      if (a.level === "first" && hard <= 45) {
        score += 18;
        reasons.push("进阶指数低，容错高，适合第一年");
      } else if (a.level === "intermediate" && hard > 35 && hard <= 62) {
        score += 16;
        reasons.push("难度落在中级舒适区");
      } else if (a.level === "advanced" && hard > 55 && hard <= 78) {
        score += 16;
        reasons.push("有足够的反馈强度，匹配进阶水平");
      } else if (a.level === "expert" && hard > 70) {
        score += 18;
        reasons.push("进阶指数高，能撑住你的技术");
      } else if (a.level === "first" && hard > 65) {
        score -= 22;
      }
    }

    if (a.priority) {
      const dim = a.priority === "value" ? "value" : a.priority;
      const v = g.scores[dim];
      if (v !== undefined) {
        score += (v - 5) * 4;
        if (v >= 8.5) reasons.push(`${dimLabel(dim)} ${v}/10，是它的强项`);
      }
    }

    if (g.composite > 0) score += (g.composite - 70) * 0.4;
    return { gear: g, raw: score, reasons };
  });

  scored.sort((a2, b2) => b2.raw - a2.raw);
  const top = scored.slice(0, 3);
  const maxRaw = top[0]?.raw || 1;
  const minRaw = Math.min(0, top[top.length - 1]?.raw ?? 0);
  return top.map((t, i) => ({
    gear: t.gear,
    match: Math.max(52, Math.min(98, Math.round(((t.raw - minRaw) / (maxRaw - minRaw || 1)) * 30 + 68 - i * 4))),
    reasons: t.reasons.slice(0, 3),
    fallback: t.raw < 0,
  }));
}

export function dimLabel(key: string): string {
  return SNOWBOARD.scoreDims.find((d) => d.key === key)?.label ?? key;
}

const SNOWBOARD_SCENES_LABEL: Record<string, string> = Object.fromEntries(
  SNOWBOARD.filterTemplate.find((f) => f.key === "scenes")?.options?.map((o) => [o.value, o.label]) ?? [],
);

const SCENE_LABELS: Record<string, string> = {
  ...SNOWBOARD_SCENES_LABEL,
  singles: "单打",
  doubles: "双打",
  attack: "进攻",
  control: "控制",
  speed: "速度",
  freshwater: "淡水",
  bass: "鲈鱼",
  finesse: "精细钓法",
  "light-lure": "轻饵",
  "heavy-lure": "重饵",
};

export function sceneLabel(v: string): string {
  return SCENE_LABELS[v] ?? v;
}

/** 参数值统一展示：API 暂存的场景数组不能直接把 JSON 原文露给用户。 */
export function formatSpecValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value !== "string") return String(value);
  const text = value.trim();
  if (text.startsWith("[") && text.endsWith("]")) {
    try {
      const parsed: unknown = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => (typeof item === "string" ? sceneLabel(item) : String(item))).join(" · ");
      }
    } catch {
      // 保留原文，避免单条脏数据阻断整个参数表。
    }
  }
  return value;
}

export function quizQuestions(slug: string): QuizQuestion[] {
  return getCategory(slug)?.quizTemplate ?? SNOWBOARD.quizTemplate;
}

// ---------- 杂项 ----------

export function sameScenePeers(g: GearItem, limit = 4): GearItem[] {
  return GEAR.filter((x) => x.id !== g.id && x.scenes.some((s) => g.scenes.includes(s)))
    .sort((a, b) => b.composite - a.composite)
    .slice(0, limit);
}

export function gearById(id: string): GearItem | undefined {
  return GEAR_BY_ID[id];
}

export function newThisWeek(limit = 6): GearItem[] {
  return GEAR.filter((g) => g.isNew)
    .sort((a, b) => b.year - a.year || b.addedAt.localeCompare(a.addedAt))
    .slice(0, limit);
}

export function pricePosition(g: GearItem): number {
  const span = g.priceBand.max - g.priceBand.min || 1;
  return Math.max(0, Math.min(100, Math.round(((g.price - g.priceBand.min) / span) * 100)));
}

export function ratingPercent(g: GearItem, star: number): number {
  const total = reviewCount(g) || 1;
  return Math.round(((g.ratingDist[String(star) as "1"] ?? 0) / total) * 100);
}
