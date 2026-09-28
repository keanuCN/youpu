import type { Review } from "@/types";

/** 站内预置评论（内容库的一部分，非用户生成） */
export const SEED_REVIEWS: Review[] = [
  {
    id: "r-01", gearId: "sb-01", userKey: null, authorName: "刃上有风",
    authorMeta: { years: 8, heightCm: 178, weightKg: 74, level: "高阶", resort: "崇礼 · 万龙" },
    rating: 5, parentId: null, createdAt: "2026-01-18T09:24:00Z", seedHelpful: 148,
    content:
      "第三个雪季换的 Custom，之前一直滑软板。最直观的感受是高速下板面真的不颤，万龙大奔头压到底板子还是安静的。缺点是低速确实累，前几趟需要主动压板才转得动，滑开之后就好了。冰面表现比预期好，边刃咬得很线性。",
    images: [],
  },
  {
    id: "r-02", gearId: "sb-01", userKey: null, authorName: "阿拉斯加没有雪",
    authorMeta: { years: 4, heightCm: 172, weightKg: 68, level: "进阶", resort: "吉林 · 北大湖" },
    rating: 4, parentId: null, createdAt: "2026-01-06T13:10:00Z", seedHelpful: 92,
    content:
      "板子本身没毛病，是我水平不够。68kg 滑 158 偏硬，压不住板头，滑了一天小腿酸到不行。建议体重 70 以下选小一号或者干脆选 Process。做工和用料对得起价格。",
    images: [],
  },
  {
    id: "r-03", gearId: "sb-01", userKey: null, authorName: "刃上有风",
    authorMeta: { years: 8, heightCm: 178, weightKg: 74, level: "高阶", resort: "崇礼 · 万龙" },
    rating: 5, parentId: "r-02", createdAt: "2026-01-07T02:41:00Z", seedHelpful: 31,
    content: "同意，这块板的下限比较高。我 74kg 都觉得 158 偏长，155 会舒服很多。",
    images: [],
  },
  {
    id: "r-04", gearId: "sb-02", userKey: null, authorName: "一季三十天",
    authorMeta: { years: 6, heightCm: 175, weightKg: 72, level: "进阶", resort: "新疆 · 将军山" },
    rating: 5, parentId: null, createdAt: "2026-02-02T07:55:00Z", seedHelpful: 121,
    content:
      "在将军山滑了整整一周，从冰面到春雪烂泥都经历了，这块板没有一天让我失望。板头摇臂让入弯特别轻松，后移站位在深雪里也够用。它不是那种让你「哇」的板子，是那种让你每天都觉得「嗯，对的」的板子。",
    images: [],
  },
  {
    id: "r-05", gearId: "sb-02", userKey: null, authorName: "Momo不滑了",
    authorMeta: { years: 3, heightCm: 168, weightKg: 60, level: "中级", resort: "北京 · 南山" },
    rating: 4, parentId: null, createdAt: "2026-01-22T11:30:00Z", seedHelpful: 58,
    content: "性格确实平淡，滑了两天没什么记忆点。但胜在什么都不差，租板党升级第一块板很合适。",
    images: [],
  },
  {
    id: "r-06", gearId: "sb-03", userKey: null, authorName: "公园保安",
    authorMeta: { years: 7, heightCm: 180, weightKg: 78, level: "高阶", resort: "崇礼 · 富龙" },
    rating: 5, parentId: null, createdAt: "2026-01-29T08:12:00Z", seedHelpful: 176,
    content:
      "跳台党直接买。Pop 是真的强，中速起跳就能拿到足够高度，落地时板面吸收得也不错。真双向意味着你反脚起跳完全不用重新适应。唯一提醒：底面是挤压的，两三天就要打一次蜡。",
    images: [],
  },
  {
    id: "r-07", gearId: "sb-03", userKey: null, authorName: "小铁盒",
    authorMeta: { years: 2, heightCm: 165, weightKg: 55, level: "中级", resort: "四川 · 鹧鸪山" },
    rating: 4, parentId: null, createdAt: "2026-01-11T10:05:00Z", seedHelpful: 44,
    content: "155 对 55kg 来说刚好。道具上很稳，但压雪道高速会抖，我一般控制在中等速度。",
    images: [],
  },
  {
    id: "r-08", gearId: "sb-04", userKey: null, authorName: "第一次站起来的",
    authorMeta: { years: 1, heightCm: 170, weightKg: 65, level: "新手", resort: "河北 · 太舞" },
    rating: 5, parentId: null, createdAt: "2026-01-04T06:40:00Z", seedHelpful: 88,
    content:
      "第一个雪季买的，教练说这板容错高适合新手，确实。整个雪季我只卡刃了两次，同期朋友买的硬板一天卡十次。轻，转板不费力，练基础动作很友好。当然速度起来就飘，但新手也滑不到那个速度。",
    images: [],
  },
  {
    id: "r-09", gearId: "sb-04", userKey: null, authorName: "老王不带板",
    authorMeta: { years: 5, heightCm: 176, weightKg: 80, level: "进阶", resort: "崇礼 · 云顶" },
    rating: 3, parentId: null, createdAt: "2025-12-28T09:15:00Z", seedHelpful: 26,
    content: "帮朋友买的，我自己滑了一趟就还回去了。80kg 压这板像踩纸片，纯新手板，别指望它能陪你进阶。",
    images: [],
  },
  {
    id: "r-10", gearId: "sb-05", userKey: null, authorName: "冰面求生",
    authorMeta: { years: 9, heightCm: 182, weightKg: 82, level: "高阶", resort: "北京 · 军都山" },
    rating: 5, parentId: null, createdAt: "2026-01-15T12:20:00Z", seedHelpful: 103,
    content:
      "军都山的冰面能救命的板子。波浪边刃在纯冰上依然咬得住，这点比同价位的纯 Camber 强太多。大跳台落地也很稳，不会弹。缺点是重，平地滑行和上魔毯的时候能感觉到。",
    images: [],
  },
  {
    id: "r-11", gearId: "sb-06", userKey: null, authorName: "碳板爱好者",
    authorMeta: { years: 6, heightCm: 179, weightKg: 76, level: "高阶", resort: "吉林 · 松花湖" },
    rating: 5, parentId: null, createdAt: "2026-02-08T05:33:00Z", seedHelpful: 79,
    content:
      "出弯的回弹是这块板的灵魂。连续弯的时候能明显感觉到板子在推你，滑起来很有节奏感。碳纤层确实让它偏硬，前两趟不太友好，热开之后就好了。做工没得说。",
    images: [],
  },
  {
    id: "r-12", gearId: "sb-07", userKey: null, authorName: "只走刃",
    authorMeta: { years: 11, heightCm: 181, weightKg: 79, level: "高阶", resort: "崇礼 · 万龙" },
    rating: 5, parentId: null, createdAt: "2026-01-25T07:02:00Z", seedHelpful: 134,
    content:
      "刻滑党的答案。长弧高速时的稳定感是别的板给不了的，你会不自觉地越滑越快。侧切半径大，短弯别指望。板头浮力在深雪里也够用，一块板两种玩法。前提是你能压得住它。",
    images: [],
  },
  {
    id: "r-13", gearId: "sb-07", userKey: null, authorName: "Momo不滑了",
    authorMeta: { years: 3, heightCm: 168, weightKg: 60, level: "中级", resort: "北京 · 南山" },
    rating: 2, parentId: null, createdAt: "2026-01-20T14:48:00Z", seedHelpful: 41,
    content: "中级别买，我租了一次全程在跟板子打架。转弯半径太大，南山的道宽根本转不开。",
    images: [],
  },
  {
    id: "r-14", gearId: "sb-08", userKey: null, authorName: "反脚练习中",
    authorMeta: { years: 2, heightCm: 173, weightKg: 70, level: "中级", resort: "河北 · 太舞" },
    rating: 5, parentId: null, createdAt: "2026-01-09T08:26:00Z", seedHelpful: 96,
    content:
      "从新手板换过来第一感觉是「怎么这么好转」。勺形板头基本消除了卡刃，我练反脚两周就敢下中级道了。春雪烂雪表现意外地好，板头不会往雪里插。",
    images: [],
  },
  {
    id: "r-15", gearId: "sb-09", userKey: null, authorName: "追雪的人",
    authorMeta: { years: 10, heightCm: 177, weightKg: 75, level: "高阶", resort: "新疆 · 可可托海" },
    rating: 5, parentId: null, createdAt: "2026-02-14T04:18:00Z", seedHelpful: 112,
    content:
      "可可托海下了三天大雪，这块板全程浮在雪面上，板头一次都没扎下去。碳梁让高速下的板面非常安静，回到压雪道也依然能走刃。重是真的重，但深雪日你不会在乎。",
    images: [],
  },
  {
    id: "r-16", gearId: "sb-10", userKey: null, authorName: "只走刃",
    authorMeta: { years: 11, heightCm: 181, weightKg: 79, level: "高阶", resort: "崇礼 · 万龙" },
    rating: 5, parentId: null, createdAt: "2025-12-30T10:44:00Z", seedHelpful: 67,
    content: "边刃精度接近硬鞋板，走刃几乎无侧滑。硬度 8.5 不是开玩笑的，技术不到别碰。",
    images: [],
  },
  {
    id: "r-17", gearId: "sb-11", userKey: null, authorName: "预算有限但想滑好",
    authorMeta: { years: 4, heightCm: 174, weightKg: 71, level: "进阶", resort: "吉林 · 北大湖" },
    rating: 5, parentId: null, createdAt: "2026-02-05T09:07:00Z", seedHelpful: 143,
    content:
      "4599 买到这个水平我觉得没什么可挑的。全山公园都能滑，Cam-Out 板型让入弯比纯 Camber 容错高不少。要说缺点就是没有任何一项是顶级的，但在这个价位，「什么都不差」本身就是最大的优点。",
    images: [],
  },
  {
    id: "r-18", gearId: "sb-11", userKey: null, authorName: "小铁盒",
    authorMeta: { years: 2, heightCm: 165, weightKg: 55, level: "中级", resort: "四川 · 鹧鸪山" },
    rating: 4, parentId: null, createdAt: "2026-01-17T13:52:00Z", seedHelpful: 37,
    content: "性价比确实高。157 对我偏长，建议小体重选 154。",
    images: [],
  },
  {
    id: "r-19", gearId: "sb-12", userKey: null, authorName: "冰面求生",
    authorMeta: { years: 9, heightCm: 182, weightKg: 82, level: "高阶", resort: "北京 · 军都山" },
    rating: 4, parentId: null, createdAt: "2026-01-13T15:36:00Z", seedHelpful: 55,
    content: "和 T.Rice Pro 很像的定位，冰面抓地同样出色，弹性更好一点，价格更便宜。板面偏重是共同问题。",
    images: [],
  },
  {
    id: "r-20", gearId: "sb-13", userKey: null, authorName: "追雪的人",
    authorMeta: { years: 10, heightCm: 177, weightKg: 75, level: "高阶", resort: "新疆 · 可可托海" },
    rating: 5, parentId: null, createdAt: "2026-02-11T06:29:00Z", seedHelpful: 128,
    content:
      "浮雪标杆，没有之一。树林里转向比看起来灵活得多，宽板头在深雪里就是船。但请务必记住：这是第二块板。回到压雪道它明显变钝，别指望一板通吃。",
    images: [],
  },
  {
    id: "r-21", gearId: "sb-14", userKey: null, authorName: "公园保安",
    authorMeta: { years: 7, heightCm: 180, weightKg: 78, level: "高阶", resort: "崇礼 · 富龙" },
    rating: 4, parentId: null, createdAt: "2026-01-31T11:14:00Z", seedHelpful: 71,
    content:
      "比 DOA 稳，比 Custom 软，正好卡在中间。如果你公园和全山各占一半，这块比两个极端都合适。弹性够用但不夸张，跳台和道具都能应付。",
    images: [],
  },
  {
    id: "r-22", gearId: "sb-14", userKey: null, authorName: "阿拉斯加没有雪",
    authorMeta: { years: 4, heightCm: 172, weightKg: 68, level: "进阶", resort: "吉林 · 北大湖" },
    rating: 5, parentId: null, createdAt: "2026-02-01T08:50:00Z", seedHelpful: 49,
    content: "从 Custom 换到 Process，整个人轻松了。68kg 果然还是适合软两度的板子。",
    images: [],
  },
  {
    id: "r-23", gearId: "sb-15", userKey: null, authorName: "第一次站起来的",
    authorMeta: { years: 1, heightCm: 170, weightKg: 65, level: "新手", resort: "河北 · 太舞" },
    rating: 4, parentId: null, createdAt: "2025-12-20T07:33:00Z", seedHelpful: 33,
    content: "全反弓真的不卡刃，新手闭眼买。就是冰面有点打滑，速度上来也飘，第二年就该换了。",
    images: [],
  },
  {
    id: "r-24", gearId: "sb-05", userKey: null, authorName: "反脚练习中",
    authorMeta: { years: 2, heightCm: 173, weightKg: 70, level: "中级", resort: "河北 · 太舞" },
    rating: 4, parentId: null, createdAt: "2026-02-09T12:02:00Z", seedHelpful: 28,
    content: "试滑了一次朋友的，冰面抓地确实强。但对我这个水平偏硬，还是选了 Evil Twin。",
    images: [],
  },
];

/** 各榜单类目的社区基础票数（模拟已有投票） */
export const BASE_VOTES: Record<string, Record<string, number>> = {
  overall: { "sb-01": 412, "sb-02": 388, "sb-03": 356, "sb-11": 301, "sb-14": 274, "sb-06": 233, "sb-12": 198, "sb-05": 176, "sb-07": 154, "sb-13": 143, "sb-08": 132, "sb-09": 121, "sb-04": 98, "sb-10": 87, "sb-15": 76 },
  "all-mountain": { "sb-01": 268, "sb-02": 254, "sb-11": 187, "sb-06": 165, "sb-12": 143, "sb-14": 121 },
  freestyle: { "sb-03": 231, "sb-14": 176, "sb-05": 154, "sb-08": 132, "sb-15": 64 },
  powder: { "sb-13": 198, "sb-09": 176, "sb-07": 121 },
  beginner: { "sb-04": 187, "sb-08": 143, "sb-15": 118 },
  value: { "sb-11": 264, "sb-04": 198, "sb-03": 176, "sb-15": 143, "sb-08": 121 },
};
