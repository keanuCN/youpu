import type { Category, CategoryNode } from "@/types";

/** 品类树：已开档叶子节点由 API 数据驱动，新增品类只需补配置与内容。 */
export const CATEGORY_TREE: CategoryNode[] = [
  {
    slug: "sports",
    name: "运动",
    nameEn: "Sports",
    path: [],
    status: "coming_soon",
    children: [
      {
        slug: "ski",
        name: "滑雪",
        nameEn: "Ski",
        path: ["运动"],
        status: "coming_soon",
        children: [
          { slug: "snowboard", name: "单板", nameEn: "Snowboard", path: ["运动", "滑雪"], status: "live" },
          { slug: "skis", name: "双板", nameEn: "Skis", path: ["运动", "滑雪"], status: "coming_soon" },
          { slug: "bindings", name: "固定器", nameEn: "Bindings", path: ["运动", "滑雪"], status: "coming_soon" },
          { slug: "boots", name: "雪鞋", nameEn: "Boots", path: ["运动", "滑雪"], status: "coming_soon" },
        ],
      },
      {
        slug: "cycling",
        name: "骑行",
        nameEn: "Cycling",
        path: ["运动"],
        status: "coming_soon",
        children: [
          { slug: "road-bike", name: "公路车", nameEn: "Road", path: ["运动", "骑行"], status: "coming_soon" },
          { slug: "mtb", name: "山地车", nameEn: "MTB", path: ["运动", "骑行"], status: "coming_soon" },
        ],
      },
      {
        slug: "imaging",
        name: "影像",
        nameEn: "Imaging",
        path: ["运动"],
        status: "coming_soon",
        children: [
          { slug: "action-cam", name: "运动相机", nameEn: "Action Cam", path: ["运动", "影像"], status: "coming_soon" },
          { slug: "mirrorless", name: "微单", nameEn: "Mirrorless", path: ["运动", "影像"], status: "coming_soon" },
        ],
      },
      {
        slug: "racket-sports",
        name: "球类",
        nameEn: "Racket Sports",
        path: ["运动"],
        status: "coming_soon",
        children: [
          { slug: "badminton-racket", name: "羽毛球拍", nameEn: "Badminton", path: ["运动", "球类"], status: "live" },
        ],
      },
      {
        slug: "fishing",
        name: "垂钓",
        nameEn: "Fishing",
        path: ["运动"],
        status: "coming_soon",
        children: [
          { slug: "casting-rod", name: "路亚竿", nameEn: "Casting Rod", path: ["运动", "垂钓"], status: "live" },
          { slug: "spinning-reel", name: "纺车轮", nameEn: "Spinning Reel", path: ["运动", "垂钓"], status: "coming_soon" },
        ],
      },
    ],
  },
];

export const SNOWBOARD_SCENES = [
  { value: "all-mountain", label: "全山地" },
  { value: "freestyle", label: "自由式" },
  { value: "powder", label: "野雪浮雪" },
  { value: "carving", label: "刻滑" },
  { value: "beginner", label: "新手入门" },
];

export const FLEX_LABELS: Record<string, string> = {
  soft: "软",
  mid: "中",
  midstiff: "中硬",
  stiff: "硬",
};

export function flexBucket(v: number): string {
  if (v < 4) return "soft";
  if (v < 6) return "mid";
  if (v < 8) return "midstiff";
  return "stiff";
}

/**
 * 板型族归一化：品牌专有技术名（如「C2X（板下反弓 + 板头尾 Camber）」）→ 可筛选的板型族。
 * 纯正拱 → camber；明确全反弓 → rocker；其余带反弓/摇臂的混合结构（含 Rocker-Camber-Rocker）→ hybrid。
 * 后端 seed 的 profileFamily 与内容包共用这一条规则（apps/web/scripts/export-seed-yaml.ts 直接读内容包字段）。
 */
export function profileFamilyOf(profile: unknown): "camber" | "rocker" | "hybrid" {
  const text = String(profile ?? "");
  if (/^\s*纯\s*Camber/i.test(text)) return "camber";
  if (/全反弓/.test(text) || /^\s*Rocker\s*$/.test(text)) return "rocker";
  return "hybrid";
}

export const SNOWBOARD_SCORE_DIMS = [
  { key: "stability", label: "稳定性", weight: 0.2 },
  { key: "response", label: "操控响应", weight: 0.18 },
  { key: "float", label: "浮雪", weight: 0.15 },
  { key: "park", label: "公园表现", weight: 0.15 },
  { key: "forgiveness", label: "容错度", weight: 0.17 },
  { key: "value", label: "性价比", weight: 0.15 },
];

export const SNOWBOARD: Category = {
  slug: "snowboard",
  name: "单板",
  nameEn: "Snowboard",
  path: ["运动", "滑雪"],
  status: "live",
  issue: "No.42 / 2026 雪季",
  specTemplate: [
    {
      group: "尺寸与形状",
      fields: [
        { key: "length", label: "长度", unit: "cm", type: "number", direction: null },
        { key: "effectiveEdge", label: "有效边刃", unit: "mm", type: "number", direction: "higher" },
        { key: "sidecut", label: "侧切半径", unit: "m", type: "number", direction: null },
        { key: "waistWidth", label: "板腰宽", unit: "mm", type: "number", direction: null },
        { key: "stanceSetback", label: "站位后移", unit: "mm", type: "number", direction: null },
        { key: "profile", label: "板型", type: "text", direction: null },
        { key: "shape", label: "形状", type: "text", direction: null },
      ],
    },
    {
      group: "板芯与结构",
      fields: [
        { key: "core", label: "板芯", type: "text", direction: null },
        { key: "fiberglass", label: "玻纤层", type: "text", direction: null },
        { key: "base", label: "底面材质", type: "text", direction: null },
        { key: "weight", label: "整板重量", unit: "g", type: "number", direction: "lower" },
      ],
    },
    {
      group: "性能取向",
      fields: [
        { key: "flex", label: "硬度", unit: "/10", type: "number", direction: null },
        { key: "damping", label: "减震", unit: "/10", type: "number", direction: "higher" },
        { key: "pop", label: "弹性", unit: "/10", type: "number", direction: "higher" },
        { key: "turnRadiusFeel", label: "转向手感", type: "text", direction: null },
      ],
    },
    {
      group: "价格与年份",
      fields: [
        { key: "price", label: "官方参考价", unit: "元", type: "number", direction: "lower" },
        { key: "year", label: "年款", type: "number", direction: "higher" },
        { key: "warranty", label: "质保", unit: "年", type: "number", direction: "higher" },
      ],
    },
  ],
  filterTemplate: [
    { key: "scenes", label: "场景", control: "multi", options: SNOWBOARD_SCENES },
    {
      key: "profileFamily",
      label: "板型族",
      control: "multi",
      options: [
        { value: "camber", label: "正拱 Camber" },
        { value: "rocker", label: "反拱 Rocker" },
        { value: "hybrid", label: "混合拱" },
      ],
    },
    {
      key: "flex",
      label: "硬度",
      control: "multi",
      options: [
        { value: "soft", label: "软 · 1–4" },
        { value: "mid", label: "中 · 4–6" },
        { value: "midstiff", label: "中硬 · 6–8" },
        { value: "stiff", label: "硬 · 8–10" },
      ],
    },
    { key: "price", label: "价格", control: "price", min: 2000, max: 8000, step: 100 },
    {
      key: "brands",
      label: "品牌",
      control: "multi",
      options: [
        { value: "Burton", label: "Burton" },
        { value: "Jones", label: "Jones" },
        { value: "Capita", label: "Capita" },
        { value: "Salomon", label: "Salomon" },
        { value: "Lib Tech", label: "Lib Tech" },
        { value: "Never Summer", label: "Never Summer" },
        { value: "Korua", label: "Korua Shapes" },
        { value: "Bataleon", label: "Bataleon" },
        { value: "Ride", label: "Ride" },
        { value: "Arbor", label: "Arbor" },
        { value: "Nitro", label: "Nitro" },
        { value: "GNU", label: "GNU" },
      ],
    },
    {
      key: "years",
      label: "年份",
      control: "multi",
      options: [
        { value: "2026", label: "2026" },
        { value: "2025", label: "2025" },
        { value: "2024", label: "2024" },
      ],
    },
  ],
  scoreDims: SNOWBOARD_SCORE_DIMS,
  rankCategories: [
    { key: "overall", label: "综合榜" },
    { key: "all-mountain", label: "全山地", scenes: ["all-mountain"] },
    { key: "freestyle", label: "自由式", scenes: ["freestyle"] },
    { key: "powder", label: "野雪", scenes: ["powder"] },
    { key: "beginner", label: "新手友好", scenes: ["beginner"] },
    { key: "value", label: "性价比" },
  ],
  quizTemplate: [
    {
      key: "level",
      question: "你现在的水平？",
      hint: "决定容错度与硬度的权重",
      options: [
        { value: "first", label: "第一年", desc: "还在练落叶飘到连续 S 弯" },
        { value: "intermediate", label: "中级", desc: "蓝道稳定，敢下黑道" },
        { value: "advanced", label: "进阶", desc: "全山通吃，开始追求反馈" },
        { value: "expert", label: "高阶", desc: "野雪 / 公园 / 刻滑有明确取向" },
      ],
    },
    {
      key: "scene",
      question: "最常滑的场景？",
      multi: true,
      options: [
        { value: "all-mountain", label: "全山地压道" },
        { value: "freestyle", label: "公园跳台道具" },
        { value: "powder", label: "野雪树林" },
        { value: "carving", label: "刻滑走刃" },
      ],
    },
    {
      key: "weight",
      question: "你的体重区间？",
      hint: "用于推荐板长",
      options: [
        { value: "lt60", label: "60kg 以下" },
        { value: "60to75", label: "60–75kg" },
        { value: "75to90", label: "75–90kg" },
        { value: "gt90", label: "90kg 以上" },
      ],
    },
    {
      key: "budget",
      question: "预算区间？",
      options: [
        { value: "lt4000", label: "4000 以内" },
        { value: "4000to6000", label: "4000–6000" },
        { value: "6000to8000", label: "6000–8000" },
        { value: "any", label: "不设上限" },
      ],
    },
    {
      key: "flex",
      question: "偏好的硬度？",
      options: [
        { value: "soft", label: "软一点，好操控" },
        { value: "mid", label: "中等，什么都想干" },
        { value: "stiff", label: "硬一点，要反馈" },
        { value: "unsure", label: "不确定，你帮我判断" },
      ],
    },
    {
      key: "priority",
      question: "最看重哪一点？",
      options: [
        { value: "stability", label: "高速稳定" },
        { value: "forgiveness", label: "容错不卡刃" },
        { value: "float", label: "浮雪能力" },
        { value: "park", label: "起跳与落地" },
        { value: "value", label: "性价比" },
      ],
    },
  ],
  hardcoreWeights: {
    flex: 0.3,
    effectiveEdge: 0.2,
    sidecut: 0.15,
    damping: 0.2,
    stability: 0.15,
  },
};

const BADMINTON_RACKET: Category = {
  slug: "badminton-racket",
  name: "羽毛球拍",
  nameEn: "Badminton Racket",
  path: ["运动", "球类"],
  status: "live",
  issue: "No.01 / 羽毛球拍档案",
  specTemplate: [
    {
      group: "重量与手感",
      fields: [
        { key: "weightClass", label: "重量等级", type: "text", direction: null },
        { key: "balance", label: "平衡点", type: "text", direction: null },
        { key: "flex", label: "中杆硬度", type: "text", direction: null },
      ],
    },
    {
      group: "穿线与结构",
      fields: [
        { key: "maxTension", label: "最高磅数", unit: " lbs", type: "number", direction: "higher" },
        { key: "frameMaterial", label: "拍框材料", type: "text", direction: null },
        { key: "shaftMaterial", label: "中杆材料", type: "text", direction: null },
        { key: "lengthNote", label: "长度说明", type: "text", direction: null },
        { key: "stringPattern", label: "穿线范围", type: "text", direction: null },
      ],
    },
    {
      group: "使用取向",
      fields: [
        { key: "scenes", label: "使用场景", type: "text", direction: null },
        { key: "playerLevel", label: "适合水平", type: "text", direction: null },
      ],
    },
  ],
  filterTemplate: [
    {
      key: "scenes",
      label: "取向",
      control: "multi",
      options: [
        { value: "singles", label: "单打" },
        { value: "doubles", label: "双打" },
        { value: "attack", label: "进攻" },
        { value: "control", label: "控制" },
        { value: "speed", label: "速度" },
      ],
    },
    {
      key: "brands",
      label: "品牌",
      control: "multi",
      options: [
        { value: "YONEX", label: "YONEX" },
        { value: "VICTOR", label: "VICTOR" },
      ],
    },
    { key: "price", label: "价格", control: "price", min: 500, max: 2500, step: 100 },
    { key: "years", label: "年份", control: "multi", options: [{ value: "2026", label: "2026" }] },
  ],
  scoreDims: [
    { key: "power", label: "进攻力量", weight: 0.2 },
    { key: "control", label: "控球精度", weight: 0.2 },
    { key: "speed", label: "挥拍速度", weight: 0.18 },
    { key: "defense", label: "防守连贯", weight: 0.15 },
    { key: "forgiveness", label: "容错度", weight: 0.12 },
    { key: "value", label: "性价比", weight: 0.15 },
  ],
  rankCategories: [
    { key: "overall", label: "综合榜" },
    { key: "power", label: "进攻榜" },
    { key: "control", label: "控制榜" },
    { key: "speed", label: "速度榜" },
  ],
  quizTemplate: [],
  hardcoreWeights: {},
};

const CASTING_ROD: Category = {
  slug: "casting-rod",
  name: "路亚竿",
  nameEn: "Casting Rod",
  path: ["运动", "垂钓"],
  status: "live",
  issue: "No.01 / 路亚竿档案",
  specTemplate: [
    {
      group: "尺寸与负载",
      fields: [
        { key: "length", label: "全长", unit: " m", type: "number", direction: null },
        { key: "sections", label: "节数", type: "number", direction: "lower" },
        { key: "weight", label: "标准自重", unit: " g", type: "number", direction: "lower" },
        { key: "lureWeight", label: "路亚重量", type: "text", direction: null },
        { key: "lineWeight", label: "适用钓线", type: "text", direction: null },
      ],
    },
    {
      group: "调性与结构",
      fields: [
        { key: "power", label: "调性强度", type: "text", direction: null },
        { key: "action", label: "先调", type: "text", direction: null },
        { key: "rodType", label: "轮座类型", type: "text", direction: null },
        { key: "blankMaterial", label: "竿胚材料", type: "text", direction: null },
        { key: "carbonContent", label: "碳纤维含量", unit: "%", type: "number", direction: "higher" },
      ],
    },
    {
      group: "使用取向",
      fields: [{ key: "scenes", label: "使用水域", type: "text", direction: null }],
    },
  ],
  filterTemplate: [
    {
      key: "scenes",
      label: "取向",
      control: "multi",
      options: [
        { value: "freshwater", label: "淡水" },
        { value: "bass", label: "鲈鱼" },
        { value: "finesse", label: "精细钓法" },
        { value: "light-lure", label: "轻饵" },
        { value: "heavy-lure", label: "重饵" },
      ],
    },
    {
      key: "brands",
      label: "品牌",
      control: "multi",
      options: [
        { value: "Daiwa", label: "Daiwa" },
        { value: "Shimano", label: "Shimano" },
      ],
    },
    { key: "price", label: "价格", control: "price", min: 500, max: 2000, step: 100 },
    {
      key: "years",
      label: "年份",
      control: "multi",
      options: [
        { value: "2026", label: "2026" },
        { value: "2024", label: "2024" },
      ],
    },
  ],
  scoreDims: [
    { key: "sensitivity", label: "灵敏度", weight: 0.2 },
    { key: "casting", label: "抛投表现", weight: 0.18 },
    { key: "control", label: "操控反馈", weight: 0.18 },
    { key: "strength", label: "回鱼强度", weight: 0.16 },
    { key: "versatility", label: "适用范围", weight: 0.13 },
    { key: "value", label: "性价比", weight: 0.15 },
  ],
  rankCategories: [
    { key: "overall", label: "综合榜" },
    { key: "casting", label: "抛投榜" },
    { key: "sensitivity", label: "灵敏度榜" },
    { key: "strength", label: "强度榜" },
  ],
  quizTemplate: [],
  hardcoreWeights: {},
};

const FLAT: Record<string, Category> = {
  snowboard: SNOWBOARD,
  "badminton-racket": BADMINTON_RACKET,
  "casting-rod": CASTING_ROD,
};

function walk(nodes: CategoryNode[]): void {
  for (const n of nodes) {
    if (!FLAT[n.slug]) FLAT[n.slug] = { ...SNOWBOARD, ...n, status: n.status } as Category;
    if (n.children) walk(n.children);
  }
}
walk(CATEGORY_TREE);

export const CATEGORIES = FLAT;

export function getCategory(slug: string): Category | undefined {
  return FLAT[slug];
}

export function isLive(slug: string): boolean {
  return FLAT[slug]?.status === "live";
}

/** 首页品类入口用的扁平列表（含一级与末级） */
export function flatCategoryList(): CategoryNode[] {
  const out: CategoryNode[] = [];
  const walk2 = (nodes: CategoryNode[]) => {
    for (const n of nodes) {
      out.push(n);
      if (n.children) walk2(n.children);
    }
  };
  walk2(CATEGORY_TREE);
  return out;
}

export const SEASON = "2026";
