import { convertPriceToCny } from "@youpu/schema";
import type { Category, CategoryNode } from "@/types";

/** 品类树：已开档叶子节点由 API 数据驱动，新增品类只需补配置与内容。 */
export const CATEGORY_TREE: CategoryNode[] = [
  {
    slug: "sport",
    name: "运动",
    nameEn: "Sport",
    path: [],
    status: "coming_soon",
    children: [
      {
        slug: "skiing",
        name: "滑雪",
        nameEn: "Skiing",
        path: ["运动"],
        status: "coming_soon",
        children: [
          { slug: "snowboard", name: "单板", nameEn: "Snowboard", path: ["运动", "滑雪"], status: "live" },
          { slug: "skis", name: "双板", nameEn: "Skis", path: ["运动", "滑雪"], status: "coming_soon" },
          { slug: "skiing-apparel", name: "雪服", nameEn: "Ski Apparel", path: ["运动", "滑雪"], status: "coming_soon" },
        ],
      },
      {
        slug: "racket-sports",
        name: "球类",
        nameEn: "Ball Sports",
        path: ["运动"],
        status: "coming_soon",
        children: [
          { slug: "badminton-racket", name: "羽毛球拍", nameEn: "Badminton", path: ["运动", "球类"], status: "live" },
          { slug: "ball-shoes", name: "球鞋", nameEn: "Court Shoes", path: ["运动", "球类"], status: "coming_soon" },
        ],
      },
      {
        slug: "running",
        name: "跑步",
        nameEn: "Running",
        path: ["运动"],
        status: "coming_soon",
        children: [
          { slug: "running-shoes", name: "跑鞋", nameEn: "Running Shoes", path: ["运动", "跑步"], status: "coming_soon" },
          { slug: "sports-watch", name: "运动手表", nameEn: "Sports Watch", path: ["运动", "跑步"], status: "coming_soon" },
          { slug: "heart-rate-monitor", name: "心率带", nameEn: "Heart Rate Monitor", path: ["运动", "跑步"], status: "coming_soon" },
        ],
      },
      {
        slug: "fitness",
        name: "健身",
        nameEn: "Fitness",
        path: ["运动"],
        status: "coming_soon",
        children: [
          { slug: "fitness-equipment", name: "健身器材", nameEn: "Fitness Equipment", path: ["运动", "健身"], status: "coming_soon" },
          { slug: "protective-gear", name: "护具", nameEn: "Protective Gear", path: ["运动", "健身"], status: "coming_soon" },
        ],
      },
      {
        slug: "diving",
        name: "潜水",
        nameEn: "Diving",
        path: ["运动"],
        status: "coming_soon",
        children: [
          { slug: "dive-computer", name: "潜水电脑", nameEn: "Dive Computer", path: ["运动", "潜水"], status: "coming_soon" },
          { slug: "fins", name: "脚蹼", nameEn: "Fins", path: ["运动", "潜水"], status: "coming_soon" },
          { slug: "dive-mask", name: "面镜", nameEn: "Dive Mask", path: ["运动", "潜水"], status: "coming_soon" },
        ],
      },
    ],
  },
  {
    slug: "outdoor-camping",
    name: "户外露营",
    nameEn: "Outdoor",
    path: [],
    status: "coming_soon",
    children: [
      {
        slug: "camping",
        name: "露营",
        nameEn: "Camping",
        path: ["户外露营"],
        status: "coming_soon",
        children: [
          { slug: "tent", name: "帐篷", nameEn: "Tents", path: ["户外露营", "露营"], status: "coming_soon" },
          { slug: "tarp", name: "天幕", nameEn: "Tarps", path: ["户外露营", "露营"], status: "coming_soon" },
          { slug: "sleeping-bag", name: "睡袋", nameEn: "Sleeping Bags", path: ["户外露营", "露营"], status: "coming_soon" },
          { slug: "sleeping-pad", name: "防潮垫", nameEn: "Sleeping Pads", path: ["户外露营", "露营"], status: "coming_soon" },
          { slug: "camping-stove", name: "炉头", nameEn: "Camping Stoves", path: ["户外露营", "露营"], status: "coming_soon" },
          { slug: "gas-canister", name: "气罐", nameEn: "Gas Canisters", path: ["户外露营", "露营"], status: "coming_soon" },
          { slug: "camping-light", name: "露营灯", nameEn: "Camping Lights", path: ["户外露营", "露营"], status: "coming_soon" },
        ],
      },
      {
        slug: "hiking",
        name: "徒步登山",
        nameEn: "Hiking",
        path: ["户外露营"],
        status: "coming_soon",
        children: [
          { slug: "hiking-backpack", name: "户外背包", nameEn: "Backpacks", path: ["户外露营", "徒步登山"], status: "coming_soon" },
          { slug: "hardshell-jacket", name: "冲锋衣", nameEn: "Hardshell Jackets", path: ["户外露营", "徒步登山"], status: "coming_soon" },
          { slug: "trekking-poles", name: "登山杖", nameEn: "Trekking Poles", path: ["户外露营", "徒步登山"], status: "coming_soon" },
          { slug: "gps-watch", name: "GPS 手表", nameEn: "GPS Watches", path: ["户外露营", "徒步登山"], status: "coming_soon" },
          { slug: "water-filter", name: "净水器", nameEn: "Water Filters", path: ["户外露营", "徒步登山"], status: "coming_soon" },
        ],
      },
    ],
  },
  {
    slug: "fishing",
    name: "钓鱼",
    nameEn: "Fishing",
    path: [],
    status: "coming_soon",
    children: [
      {
        slug: "lure",
        name: "路亚",
        nameEn: "Lure Fishing",
        path: ["钓鱼"],
        status: "coming_soon",
        children: [
          { slug: "casting-rod", name: "路亚竿", nameEn: "Casting Rods", path: ["钓鱼", "路亚"], status: "live" },
          { slug: "fishing-reel", name: "渔轮", nameEn: "Fishing Reels", path: ["钓鱼", "路亚"], status: "coming_soon" },
          { slug: "fishing-lure", name: "拟饵", nameEn: "Lures", path: ["钓鱼", "路亚"], status: "coming_soon" },
          { slug: "fishing-line", name: "线组", nameEn: "Fishing Lines", path: ["钓鱼", "路亚"], status: "coming_soon" },
          { slug: "polarized-glasses", name: "偏光镜", nameEn: "Polarized Glasses", path: ["钓鱼", "路亚"], status: "coming_soon" },
          { slug: "fish-finder", name: "探鱼器", nameEn: "Fish Finders", path: ["钓鱼", "路亚"], status: "coming_soon" },
        ],
      },
      {
        slug: "tai-diao",
        name: "台钓",
        nameEn: "Tai Diao",
        path: ["钓鱼"],
        status: "coming_soon",
        children: [
          { slug: "tai-diao-rod", name: "台钓竿", nameEn: "Tai Diao Rods", path: ["钓鱼", "台钓"], status: "coming_soon" },
          { slug: "float", name: "浮漂", nameEn: "Floats", path: ["钓鱼", "台钓"], status: "coming_soon" },
          { slug: "tackle-box", name: "钓箱", nameEn: "Tackle Boxes", path: ["钓鱼", "台钓"], status: "coming_soon" },
          { slug: "rod-bag", name: "竿包", nameEn: "Rod Bags", path: ["钓鱼", "台钓"], status: "coming_soon" },
          { slug: "groundbait-boat", name: "打窝船", nameEn: "Bait Boats", path: ["钓鱼", "台钓"], status: "coming_soon" },
        ],
      },
    ],
  },
  {
    slug: "cycling",
    name: "骑行",
    nameEn: "Cycling",
    path: [],
    status: "coming_soon",
    children: [
      {
        slug: "bicycle",
        name: "自行车",
        nameEn: "Bicycles",
        path: ["骑行"],
        status: "coming_soon",
        children: [
          { slug: "road-bike", name: "公路车", nameEn: "Road Bikes", path: ["骑行", "自行车"], status: "live" },
          { slug: "mtb", name: "山地车", nameEn: "Mountain Bikes", path: ["骑行", "自行车"], status: "live" },
          { slug: "bike-helmet", name: "自行车头盔", nameEn: "Bike Helmets", path: ["骑行", "自行车"], status: "coming_soon" },
          { slug: "bike-computer", name: "码表", nameEn: "Bike Computers", path: ["骑行", "自行车"], status: "coming_soon" },
          { slug: "indoor-bike-trainer", name: "骑行台", nameEn: "Indoor Trainers", path: ["骑行", "自行车"], status: "coming_soon" },
          { slug: "cycling-apparel", name: "骑行服", nameEn: "Cycling Apparel", path: ["骑行", "自行车"], status: "coming_soon" },
          { slug: "bike-tools", name: "工具组", nameEn: "Bike Tools", path: ["骑行", "自行车"], status: "coming_soon" },
        ],
      },
      {
        slug: "motorcycle",
        name: "摩托车",
        nameEn: "Motorcycling",
        path: ["骑行"],
        status: "coming_soon",
        children: [
          { slug: "motorcycle-helmet", name: "摩托头盔", nameEn: "Motorcycle Helmets", path: ["骑行", "摩托车"], status: "coming_soon" },
          { slug: "motorcycle-apparel", name: "摩托骑行服", nameEn: "Motorcycle Apparel", path: ["骑行", "摩托车"], status: "coming_soon" },
          { slug: "motorcycle-dashcam", name: "摩托车记录仪", nameEn: "Motorcycle Cameras", path: ["骑行", "摩托车"], status: "coming_soon" },
        ],
      },
    ],
  },
  {
    slug: "imaging",
    name: "影像",
    nameEn: "Imaging",
    path: [],
    status: "coming_soon",
    children: [
      {
        slug: "photography",
        name: "摄影",
        nameEn: "Photography",
        path: ["影像"],
        status: "coming_soon",
        children: [
          { slug: "camera", name: "相机", nameEn: "Cameras", path: ["影像", "摄影"], status: "coming_soon" },
          { slug: "lens", name: "镜头", nameEn: "Lenses", path: ["影像", "摄影"], status: "coming_soon" },
          { slug: "filter", name: "滤镜", nameEn: "Filters", path: ["影像", "摄影"], status: "coming_soon" },
          { slug: "tripod", name: "三脚架", nameEn: "Tripods", path: ["影像", "摄影"], status: "coming_soon" },
          { slug: "photography-bag", name: "摄影包", nameEn: "Camera Bags", path: ["影像", "摄影"], status: "coming_soon" },
          { slug: "memory-card", name: "存储卡", nameEn: "Memory Cards", path: ["影像", "摄影"], status: "coming_soon" },
        ],
      },
      {
        slug: "videography",
        name: "摄像",
        nameEn: "Videography",
        path: ["影像"],
        status: "coming_soon",
        children: [
          { slug: "video-camera", name: "摄像机", nameEn: "Video Cameras", path: ["影像", "摄像"], status: "coming_soon" },
          { slug: "action-cam", name: "运动相机", nameEn: "Action Cameras", path: ["影像", "摄像"], status: "live" },
          { slug: "gimbal", name: "稳定器", nameEn: "Gimbals", path: ["影像", "摄像"], status: "coming_soon" },
          { slug: "video-light", name: "补光灯", nameEn: "Video Lights", path: ["影像", "摄像"], status: "coming_soon" },
          { slug: "microphone", name: "麦克风", nameEn: "Microphones", path: ["影像", "摄像"], status: "coming_soon" },
        ],
      },
      {
        slug: "drones",
        name: "无人机",
        nameEn: "Drones",
        path: ["影像"],
        status: "coming_soon",
        children: [{ slug: "drone", name: "无人机", nameEn: "Drones", path: ["影像", "无人机"], status: "coming_soon" }],
      },
    ],
  },
  {
    slug: "av-digital",
    name: "影音数码",
    nameEn: "AV & Digital",
    path: [],
    status: "coming_soon",
    children: [
      {
        slug: "audio",
        name: "音频",
        nameEn: "Audio",
        path: ["影音数码"],
        status: "coming_soon",
        children: [
          { slug: "headphones", name: "耳机", nameEn: "Headphones", path: ["影音数码", "音频"], status: "coming_soon" },
          { slug: "audio-player", name: "播放器", nameEn: "Players", path: ["影音数码", "音频"], status: "coming_soon" },
          { slug: "dac-amp", name: "解码耳放", nameEn: "DAC & Amps", path: ["影音数码", "音频"], status: "coming_soon" },
          { slug: "speaker", name: "音箱", nameEn: "Speakers", path: ["影音数码", "音频"], status: "coming_soon" },
        ],
      },
      {
        slug: "network-storage",
        name: "网络与存储",
        nameEn: "Network & Storage",
        path: ["影音数码"],
        status: "coming_soon",
        children: [
          { slug: "nas", name: "NAS", nameEn: "NAS", path: ["影音数码", "网络与存储"], status: "coming_soon" },
          { slug: "router", name: "路由器", nameEn: "Routers", path: ["影音数码", "网络与存储"], status: "coming_soon" },
        ],
      },
      {
        slug: "computer-peripherals",
        name: "电脑与外设",
        nameEn: "Computers & Peripherals",
        path: ["影音数码"],
        status: "coming_soon",
        children: [
          { slug: "monitor", name: "显示器", nameEn: "Monitors", path: ["影音数码", "电脑与外设"], status: "coming_soon" },
          { slug: "mechanical-keyboard", name: "机械键盘", nameEn: "Mechanical Keyboards", path: ["影音数码", "电脑与外设"], status: "coming_soon" },
          { slug: "mouse", name: "鼠标", nameEn: "Mice", path: ["影音数码", "电脑与外设"], status: "coming_soon" },
          { slug: "desktop-pc", name: "主机", nameEn: "Desktop PCs", path: ["影音数码", "电脑与外设"], status: "coming_soon" },
        ],
      },
      {
        slug: "digital-accessories",
        name: "数码配件",
        nameEn: "Accessories",
        path: ["影音数码"],
        status: "coming_soon",
        children: [
          { slug: "charger", name: "充电头", nameEn: "Chargers", path: ["影音数码", "数码配件"], status: "coming_soon" },
          { slug: "cable", name: "线材", nameEn: "Cables", path: ["影音数码", "数码配件"], status: "coming_soon" },
          { slug: "organizer-bag", name: "收纳包", nameEn: "Organizer Bags", path: ["影音数码", "数码配件"], status: "coming_soon" },
        ],
      },
    ],
  },
  {
    slug: "beverage-kitchen",
    name: "咖啡茶酒与厨房",
    nameEn: "Coffee, Tea & Kitchen",
    path: [],
    status: "coming_soon",
    children: [
      {
        slug: "coffee",
        name: "咖啡",
        nameEn: "Coffee",
        path: ["咖啡茶酒与厨房"],
        status: "coming_soon",
        children: [
          { slug: "grinder", name: "磨豆机", nameEn: "Grinders", path: ["咖啡茶酒与厨房", "咖啡"], status: "coming_soon" },
          { slug: "coffee-machine", name: "咖啡机", nameEn: "Coffee Machines", path: ["咖啡茶酒与厨房", "咖啡"], status: "coming_soon" },
          { slug: "pour-over-kettle", name: "手冲壶", nameEn: "Pour-over Kettles", path: ["咖啡茶酒与厨房", "咖啡"], status: "coming_soon" },
          { slug: "dripper", name: "滤杯", nameEn: "Drippers", path: ["咖啡茶酒与厨房", "咖啡"], status: "coming_soon" },
        ],
      },
      {
        slug: "tea",
        name: "茶",
        nameEn: "Tea",
        path: ["咖啡茶酒与厨房"],
        status: "coming_soon",
        children: [
          { slug: "tea-set", name: "茶具", nameEn: "Tea Sets", path: ["咖啡茶酒与厨房", "茶"], status: "coming_soon" },
          { slug: "yixing-teapot", name: "紫砂壶", nameEn: "Yixing Teapots", path: ["咖啡茶酒与厨房", "茶"], status: "coming_soon" },
        ],
      },
      {
        slug: "wine",
        name: "酒",
        nameEn: "Wine & Spirits",
        path: ["咖啡茶酒与厨房"],
        status: "coming_soon",
        children: [
          { slug: "barware", name: "酒具", nameEn: "Barware", path: ["咖啡茶酒与厨房", "酒"], status: "coming_soon" },
          { slug: "decanter", name: "醒酒器", nameEn: "Decanters", path: ["咖啡茶酒与厨房", "酒"], status: "coming_soon" },
        ],
      },
      {
        slug: "kitchen",
        name: "厨具",
        nameEn: "Kitchen",
        path: ["咖啡茶酒与厨房"],
        status: "coming_soon",
        children: [
          { slug: "kitchen-knives", name: "刀具", nameEn: "Kitchen Knives", path: ["咖啡茶酒与厨房", "厨具"], status: "coming_soon" },
          { slug: "cookware", name: "锅具", nameEn: "Cookware", path: ["咖啡茶酒与厨房", "厨具"], status: "coming_soon" },
          { slug: "oven", name: "烤箱", nameEn: "Ovens", path: ["咖啡茶酒与厨房", "厨具"], status: "coming_soon" },
        ],
      },
    ],
  },
  {
    slug: "watches",
    name: "手表",
    nameEn: "Watches",
    path: [],
    status: "coming_soon",
    children: [
      {
        slug: "mechanical-watches",
        name: "机械表",
        nameEn: "Mechanical Watches",
        path: ["手表"],
        status: "coming_soon",
        children: [{ slug: "mechanical-watch", name: "机械表", nameEn: "Mechanical Watches", path: ["手表", "机械表"], status: "coming_soon" }],
      },
      {
        slug: "tool-watches",
        name: "工具表",
        nameEn: "Tool Watches",
        path: ["手表"],
        status: "coming_soon",
        children: [{ slug: "tool-watch", name: "工具表", nameEn: "Tool Watches", path: ["手表", "工具表"], status: "coming_soon" }],
      },
    ],
  },
  {
    slug: "gaming-esports",
    name: "游戏电竞",
    nameEn: "Gaming & Esports",
    path: [],
    status: "coming_soon",
    children: [
      {
        slug: "console-gaming",
        name: "主机游戏",
        nameEn: "Console Gaming",
        path: ["游戏电竞"],
        status: "coming_soon",
        children: [
          { slug: "game-console", name: "游戏主机", nameEn: "Game Consoles", path: ["游戏电竞", "主机游戏"], status: "coming_soon" },
          { slug: "game-controller", name: "手柄", nameEn: "Controllers", path: ["游戏电竞", "主机游戏"], status: "coming_soon" },
        ],
      },
      {
        slug: "esports-peripherals",
        name: "电竞外设",
        nameEn: "Esports Peripherals",
        path: ["游戏电竞"],
        status: "coming_soon",
        children: [
          { slug: "esports-keyboard", name: "电竞键盘", nameEn: "Gaming Keyboards", path: ["游戏电竞", "电竞外设"], status: "live" },
          { slug: "esports-mouse", name: "电竞鼠标", nameEn: "Gaming Mice", path: ["游戏电竞", "电竞外设"], status: "coming_soon" },
          { slug: "esports-headset", name: "电竞耳机", nameEn: "Gaming Headsets", path: ["游戏电竞", "电竞外设"], status: "coming_soon" },
        ],
      },
      {
        slug: "esports-display",
        name: "电竞显示",
        nameEn: "Esports Displays",
        path: ["游戏电竞"],
        status: "coming_soon",
        children: [{ slug: "esports-monitor", name: "电竞显示器", nameEn: "Gaming Monitors", path: ["游戏电竞", "电竞显示"], status: "coming_soon" }],
      },
      {
        slug: "esports-space",
        name: "电竞空间",
        nameEn: "Esports Space",
        path: ["游戏电竞"],
        status: "coming_soon",
        children: [{ slug: "gaming-chair", name: "电竞椅", nameEn: "Gaming Chairs", path: ["游戏电竞", "电竞空间"], status: "coming_soon" }],
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

const ESPORTS_KEYBOARD: Category = {
  slug: "esports-keyboard",
  name: "电竞键盘",
  nameEn: "Gaming Keyboards",
  path: ["游戏电竞", "电竞外设"],
  status: "live",
  issue: "No.01 / 电竞键盘档案",
  priceCurrency: "CNY",
  specTemplate: [
    {
      group: "定位与结构",
      fields: [
        { key: "keyboardType", label: "键盘类型", type: "text", direction: null },
        { key: "switchType", label: "轴体", type: "text", direction: null },
        { key: "mounting", label: "结构", type: "text", direction: null },
        { key: "caseMaterial", label: "外壳材质", type: "text", direction: null },
        { key: "layout", label: "布局", type: "text", direction: null },
        { key: "keycapMaterial", label: "键帽材质", type: "text", direction: null },
      ],
    },
    {
      group: "连接与响应",
      fields: [
        { key: "connection", label: "连接方式", type: "text", direction: null },
        { key: "pollingRate", label: "回报率", unit: " Hz", type: "number", direction: "higher" },
        { key: "scanRate", label: "扫描率", unit: " Hz", type: "number", direction: "higher" },
        { key: "rapidTriggerPrecision", label: "RT 精度", unit: " mm", type: "number", direction: "lower" },
        { key: "actuationRange", label: "触发范围", type: "text", direction: null },
      ],
    },
    {
      group: "自定义与灯效",
      fields: [
        { key: "backlight", label: "背光", type: "text", direction: null },
        { key: "driver", label: "驱动方式", type: "text", direction: null },
        { key: "hotSwap", label: "热插拔", type: "text", direction: null },
        { key: "quickRelease", label: "快拆结构", type: "text", direction: null },
        { key: "customScreen", label: "自定义屏幕", type: "text", direction: null },
      ],
    },
    {
      group: "续航与配件",
      fields: [{ key: "batteryCapacity", label: "电池容量", unit: " mAh", type: "number", direction: "higher" }],
    },
  ],
  filterTemplate: [
    {
      key: "brands",
      label: "品牌",
      control: "multi",
      options: [
        { value: "Akko", label: "Akko" },
        { value: "MonsGeek", label: "MonsGeek" },
        { value: "WOBKEY", label: "WOBKEY" },
        { value: "VXE", label: "VXE" },
        { value: "AULA", label: "AULA" },
      ],
    },
    { key: "price", label: "价格", control: "price", min: 0, max: 3000, step: 100 },
    { key: "years", label: "年份", control: "multi", options: [{ value: "2026", label: "2026" }] },
  ],
  scoreDims: [
    { key: "response", label: "响应表现", weight: 0.3 },
    { key: "customization", label: "可玩性", weight: 0.2 },
    { key: "build", label: "结构做工", weight: 0.2 },
    { key: "connection", label: "连接体验", weight: 0.15 },
    { key: "value", label: "性价比", weight: 0.15 },
  ],
  rankCategories: [
    { key: "overall", label: "综合榜" },
    { key: "response", label: "响应榜" },
    { key: "customization", label: "可玩性榜" },
    { key: "value", label: "性价比" },
  ],
  quizTemplate: [],
  hardcoreWeights: {},
};

export const CASTING_ROD_SCORE_DIMS = [
  { key: "sensitivity", label: "灵敏度", weight: 0.2 },
  { key: "casting", label: "抛投表现", weight: 0.18 },
  { key: "control", label: "操控反馈", weight: 0.18 },
  { key: "strength", label: "回鱼强度", weight: 0.16 },
  { key: "versatility", label: "适用范围", weight: 0.13 },
  { key: "value", label: "性价比", weight: 0.15 },
];

const CASTING_ROD: Category = {
  slug: "casting-rod",
  name: "路亚竿",
  nameEn: "Casting Rod",
  path: ["钓鱼", "路亚"],
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
  scoreDims: CASTING_ROD_SCORE_DIMS,
  rankCategories: [
    { key: "overall", label: "综合榜" },
    { key: "casting", label: "抛投榜" },
    { key: "sensitivity", label: "灵敏度榜" },
    { key: "strength", label: "强度榜" },
  ],
  quizTemplate: [],
  hardcoreWeights: {},
};

export const ACTION_CAM_SCORE_DIMS = [
  { key: "imageQuality", label: "画质表现", weight: 0.22 },
  { key: "stabilization", label: "防抖能力", weight: 0.2 },
  { key: "lowLight", label: "低光表现", weight: 0.17 },
  { key: "battery", label: "续航能力", weight: 0.15 },
  { key: "usability", label: "易用性", weight: 0.12 },
  { key: "value", label: "性价比", weight: 0.14 },
];

const ACTION_CAM: Category = {
  slug: "action-cam",
  name: "运动相机",
  nameEn: "Action Cam",
  path: ["影像", "摄像"],
  status: "live",
  issue: "No.01 / Action Cam Index",
  priceCurrency: "CNY",
  specTemplate: [
    {
      group: "成像与视频",
      fields: [
        { key: "cameraType", label: "相机类型", type: "text", direction: null },
        { key: "sensor", label: "传感器", type: "text", direction: null },
        { key: "maxVideo", label: "最高视频规格", type: "text", direction: null },
        { key: "maxFrameRate", label: "最高帧率", unit: " fps", type: "number", direction: "higher" },
        { key: "maxPhoto", label: "最高照片规格", type: "text", direction: null },
        { key: "fov", label: "视场角", type: "text", direction: null },
      ],
    },
    {
      group: "稳定与耐候",
      fields: [
        { key: "stabilization", label: "防抖系统", type: "text", direction: null },
        { key: "waterproofDepth", label: "裸机防水深度", unit: " m", type: "number", direction: "higher" },
        { key: "weight", label: "机身重量", unit: " g", type: "number", direction: "lower" },
        { key: "batteryLife", label: "官方续航", unit: " min", type: "number", direction: "higher" },
      ],
    },
    {
      group: "使用与存储",
      fields: [
        { key: "screen", label: "屏幕", type: "text", direction: null },
        { key: "storage", label: "存储", type: "text", direction: null },
        { key: "scenes", label: "适用场景", type: "text", direction: null },
      ],
    },
  ],
  filterTemplate: [
    {
      key: "scenes",
      label: "场景",
      control: "multi",
      options: [
        { value: "cycling", label: "骑行" },
        { value: "motorcycle", label: "摩托" },
        { value: "skiing", label: "滑雪" },
        { value: "diving", label: "潜水" },
        { value: "vlogging", label: "Vlog" },
        { value: "travel", label: "旅行" },
      ],
    },
    {
      key: "cameraType",
      label: "形态",
      control: "multi",
      options: [
        { value: "action", label: "传统运动相机" },
        { value: "wearable", label: "拇指 / 佩戴式" },
      ],
    },
    {
      key: "brands",
      label: "品牌",
      control: "multi",
      options: [
        { value: "DJI", label: "DJI" },
        { value: "GoPro", label: "GoPro" },
        { value: "Insta360", label: "Insta360" },
      ],
    },
    { key: "price", label: "价格", control: "price", min: convertPriceToCny(200, "USD"), max: convertPriceToCny(500, "USD"), step: 100 },
    {
      key: "years",
      label: "年份",
      control: "multi",
      options: [
        { value: "2026", label: "2026" },
        { value: "2024", label: "2024" },
        { value: "2023", label: "2023" },
        { value: "2022", label: "2022" },
      ],
    },
  ],
  scoreDims: ACTION_CAM_SCORE_DIMS,
  rankCategories: [
    { key: "overall", label: "综合榜" },
    { key: "imageQuality", label: "画质榜" },
    { key: "stabilization", label: "防抖榜" },
    { key: "battery", label: "续航榜" },
    { key: "value", label: "性价比" },
  ],
  quizTemplate: [],
  hardcoreWeights: {},
};

export const ROAD_BIKE_SCENES = [
  { value: "racing", label: "竞赛" },
  { value: "climbing", label: "爬坡" },
  { value: "endurance", label: "长途耐力" },
  { value: "group-ride", label: "团骑" },
  { value: "all-road", label: "泛铺装" },
];

export const ROAD_BIKE_TYPE_LABELS: Record<string, string> = {
  race: "综合竞赛",
  aero: "空力竞赛",
  endurance: "耐力长途",
  "all-round": "全能入门",
};

export function roadBikeTypeLabel(value: unknown): string {
  return ROAD_BIKE_TYPE_LABELS[String(value ?? "")] ?? String(value ?? "待补充");
}

export const ROAD_BIKE_SCORE_DIMS = [
  { key: "speedEfficiency", label: "速度效率", weight: 0.2 },
  { key: "handling", label: "操控反馈", weight: 0.18 },
  { key: "comfort", label: "长途舒适", weight: 0.18 },
  { key: "climbing", label: "爬坡表现", weight: 0.16 },
  { key: "versatility", label: "适用范围", weight: 0.13 },
  { key: "value", label: "性价比", weight: 0.15 },
];

const ROAD_BIKE: Category = {
  slug: "road-bike",
  name: "公路车",
  nameEn: "Road Bike",
  path: ["骑行", "自行车"],
  status: "live",
  issue: "No.01 / Road Bike Index",
  priceCurrency: "CNY",
  specTemplate: [
    {
      group: "车架与定位",
      fields: [
        { key: "bikeType", label: "车型取向", type: "text", direction: null },
        { key: "frameMaterial", label: "车架材料", type: "text", direction: null },
        { key: "frameWeight", label: "车架重量", unit: " g", type: "number", direction: "lower" },
        { key: "completeWeight", label: "整车重量", unit: " kg", type: "number", direction: "lower" },
        { key: "tireClearance", label: "最大胎宽", unit: " mm", type: "number", direction: "higher" },
      ],
    },
    {
      group: "传动与制动",
      fields: [
        { key: "groupset", label: "变速套件", type: "text", direction: null },
        { key: "drivetrain", label: "传动规格", type: "text", direction: null },
        { key: "brakes", label: "制动形式", type: "text", direction: null },
      ],
    },
    {
      group: "轮组与设定",
      fields: [
        { key: "wheelset", label: "轮组", type: "text", direction: null },
        { key: "gearRange", label: "齿比范围", type: "text", direction: null },
        { key: "fit", label: "骑行设定", type: "text", direction: null },
        { key: "scenes", label: "适用场景", type: "text", direction: null },
      ],
    },
  ],
  filterTemplate: [
    { key: "scenes", label: "场景", control: "multi", options: ROAD_BIKE_SCENES },
    {
      key: "bikeType",
      label: "车型",
      control: "multi",
      options: Object.entries(ROAD_BIKE_TYPE_LABELS).map(([value, label]) => ({ value, label })),
    },
    {
      key: "brands",
      label: "品牌",
      control: "multi",
      options: [
        { value: "Canyon", label: "Canyon" },
        { value: "Specialized", label: "Specialized" },
        { value: "Giant", label: "Giant" },
      ],
    },
    { key: "price", label: "价格", control: "price", min: convertPriceToCny(1500, "USD"), max: convertPriceToCny(14000, "USD"), step: 1000 },
    {
      key: "years",
      label: "年份",
      control: "multi",
      options: [
        { value: "2027", label: "2027" },
        { value: "2026", label: "2026" },
      ],
    },
  ],
  scoreDims: ROAD_BIKE_SCORE_DIMS,
  rankCategories: [
    { key: "overall", label: "综合榜" },
    { key: "racing", label: "竞赛榜", scenes: ["racing"] },
    { key: "climbing", label: "爬坡榜", scenes: ["climbing"] },
    { key: "endurance", label: "耐力榜", scenes: ["endurance"] },
    { key: "value", label: "性价比" },
  ],
  quizTemplate: [],
  hardcoreWeights: {},
};

export const MTB_SCENES = [
  { value: "cross-country", label: "越野 XC" },
  { value: "trail", label: "林道 Trail" },
  { value: "climbing", label: "爬坡" },
  { value: "descending", label: "下坡" },
  { value: "bike-park", label: "Bike Park" },
  { value: "all-mountain", label: "全山地" },
];

export const MTB_TYPE_LABELS: Record<string, string> = {
  xc: "越野竞赛 XC",
  hardtail: "硬尾越野",
  downcountry: "下坡越野 Downcountry",
  trail: "全能林道 Trail",
  enduro: "Enduro 耐力下坡",
};

export function mtbTypeLabel(value: unknown): string {
  return MTB_TYPE_LABELS[String(value ?? "")] ?? String(value ?? "待补充");
}

export const MTB_SCORE_DIMS = [
  { key: "climbing", label: "爬坡效率", weight: 0.18 },
  { key: "descending", label: "下坡能力", weight: 0.2 },
  { key: "control", label: "操控稳定", weight: 0.2 },
  { key: "comfort", label: "颠簸舒适", weight: 0.15 },
  { key: "versatility", label: "场景适应", weight: 0.12 },
  { key: "value", label: "性价比", weight: 0.15 },
];

const MTB: Category = {
  slug: "mtb",
  name: "山地车",
  nameEn: "Mountain Bike",
  path: ["骑行", "自行车"],
  status: "live",
  issue: "No.01 / MTB Index",
  priceCurrency: "CNY",
  specTemplate: [
    {
      group: "车架与定位",
      fields: [
        { key: "bikeType", label: "车型取向", type: "text", direction: null },
        { key: "frameMaterial", label: "车架材料", type: "text", direction: null },
        { key: "completeWeight", label: "整车重量", unit: " kg", type: "number", direction: "lower" },
        { key: "wheelSize", label: "轮径", type: "text", direction: null },
      ],
    },
    {
      group: "悬挂与操控",
      fields: [
        { key: "frontTravel", label: "前叉行程", unit: " mm", type: "number", direction: null },
        { key: "rearTravel", label: "后避震行程", unit: " mm", type: "number", direction: null },
        { key: "suspension", label: "悬挂系统", type: "text", direction: null },
      ],
    },
    {
      group: "传动与制动",
      fields: [
        { key: "groupset", label: "变速套件", type: "text", direction: null },
        { key: "drivetrain", label: "传动规格", type: "text", direction: null },
        { key: "brakes", label: "制动形式", type: "text", direction: null },
      ],
    },
    {
      group: "轮组与接触面",
      fields: [
        { key: "wheelset", label: "轮组", type: "text", direction: null },
        { key: "tireSize", label: "外胎规格", type: "text", direction: null },
        { key: "dropper", label: "升降座管", type: "text", direction: null },
        { key: "scenes", label: "适用场景", type: "text", direction: null },
      ],
    },
  ],
  filterTemplate: [
    { key: "scenes", label: "场景", control: "multi", options: MTB_SCENES },
    {
      key: "bikeType",
      label: "车型",
      control: "multi",
      options: Object.entries(MTB_TYPE_LABELS).map(([value, label]) => ({ value, label })),
    },
    {
      key: "brands",
      label: "品牌",
      control: "multi",
      options: [
        { value: "Canyon", label: "Canyon" },
        { value: "Specialized", label: "Specialized" },
        { value: "Giant", label: "Giant" },
      ],
    },
    { key: "price", label: "价格", control: "price", min: convertPriceToCny(2000, "USD"), max: convertPriceToCny(16000, "USD"), step: 1000 },
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
  scoreDims: MTB_SCORE_DIMS,
  rankCategories: [
    { key: "overall", label: "综合榜" },
    { key: "climbing", label: "爬坡榜", scenes: ["climbing"] },
    { key: "descending", label: "下坡榜", scenes: ["descending"] },
    { key: "control", label: "操控榜" },
    { key: "value", label: "性价比" },
  ],
  quizTemplate: [],
  hardcoreWeights: {},
};

const FLAT: Record<string, Category> = {
  snowboard: SNOWBOARD,
  "badminton-racket": BADMINTON_RACKET,
  "casting-rod": CASTING_ROD,
  "action-cam": ACTION_CAM,
  "road-bike": ROAD_BIKE,
  mtb: MTB,
  "esports-keyboard": ESPORTS_KEYBOARD,
};

function walk(nodes: CategoryNode[]): void {
  for (const n of nodes) {
    if (!FLAT[n.slug]) FLAT[n.slug] = { ...SNOWBOARD, ...n, status: n.status } as Category;
    if (n.children) walk(n.children);
  }
}
walk(CATEGORY_TREE);

/** 目录树中的真实商品叶子；父级只负责导航，不参与商品统计和 SEO。 */
export function leafCategoryList(nodes: CategoryNode[] = CATEGORY_TREE): CategoryNode[] {
  return nodes.flatMap((node) => (node.children?.length ? leafCategoryList(node.children) : [node]));
}

export const CATEGORY_LEAVES = leafCategoryList();

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
