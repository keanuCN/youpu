export interface ExternalReviewSnapshot {
  rating: number;
  count: number;
  url: string;
  scope: string;
  checkedAt: string;
}

/** Third-party history stays separate from Youpu ratings and field reports. */
export const EXTERNAL_REVIEW_SNAPSHOTS: Record<string, ExternalReviewSnapshot> = {
  "jones-flagship-2025": {
    rating: 4.8,
    count: 487,
    url: "https://www.jonessnowboards.com/products/mens-flagship-snowboard-2025",
    scope: "Jones 官网男女款页面展示相同的汇总评价，可能合并相关产品或年份；不代表本站实测",
    checkedAt: "2026-10-27",
  },
  "jones-mind-expander-2025": {
    rating: 4.8,
    count: 166,
    url: "https://www.jonessnowboards.com/products/mind-expander-snowboard-2025",
    scope: "Jones 官网商品页评价，官网说明其中部分来自商家合并的相关产品；不代表本站实测",
    checkedAt: "2026-10-27",
  },
  "jones-flagship-womens-2025": {
    rating: 4.8, count: 487,
    url: "https://www.jonessnowboards.com/products/womens-flagship-snowboard-2025",
    scope: "Jones 官网男女款页面展示相同的汇总评价，可能合并相关产品或年份；不代表本站实测",
    checkedAt: "2026-10-27",
  },
  "jones-freecarver-6000s-2025": {
    rating: 4.9, count: 46,
    url: "https://www.jonessnowboards.com/products/freecarver-6000s-snowboard-2025",
    scope: "Jones 官网商品页评价，可能合并相关产品或其他年份；不代表本站实测",
    checkedAt: "2026-10-27",
  },
  "jones-freecarver-9000s-2025": {
    rating: 4.9, count: 35,
    url: "https://www.jonessnowboards.com/products/freecarver-9000s-snowboard-2025",
    scope: "Jones 官网商品页评价，官网说明部分来自商家合并的相关产品；不代表本站实测",
    checkedAt: "2026-10-27",
  },
  "jones-storm-wolf-2025": {
    rating: 4.9, count: 124,
    url: "https://www.jonessnowboards.com/products/storm-wolf-snowboard-2025",
    scope: "Jones 官网商品页评价，可能合并相关产品或其他年份；不代表本站实测",
    checkedAt: "2026-10-27",
  },
  "jones-mini-mind-expander-2025": {
    rating: 4.8, count: 26,
    url: "https://www.jonessnowboards.com/products/mini-mind-expander-snowboard-2025",
    scope: "Jones 官网商品页评价，其中可见其他相关型号的评论；不代表本站实测",
    checkedAt: "2026-10-27",
  },
  "jones-frontier-2-0-2026": {
    rating: 4.8, count: 207,
    url: "https://www.jonessnowboards.com/products/mens-frontier-20-snowboard-2026",
    scope: "Jones 官网商品页评价，可能合并相关产品或其他年份；不代表本站实测",
    checkedAt: "2026-10-27",
  },
  "jones-dream-weaver-2-0-2026": {
    rating: 4.9, count: 131,
    url: "https://www.jonessnowboards.com/products/womens-dream-weaver-20-snowboard-2026",
    scope: "Jones 官网商品页评价，可能合并相关产品或其他年份；不代表本站实测",
    checkedAt: "2026-10-27",
  },
  "jones-tweaker-womens-2026": {
    rating: 4.8, count: 56,
    url: "https://www.jonessnowboards.com/products/womens-tweaker-snowboard-2026",
    scope: "Jones 官网商品页评价，可能合并相关产品或其他年份；不代表本站实测",
    checkedAt: "2026-10-27",
  },
  "salomon-huck-knife-2027": {
    rating: 4.8,
    count: 5,
    url: "https://thesnowfever.com/detail/salomon-huck-knife-snowboard-3899",
    scope: "历史款产品页的跨年份评价汇总，非 2026–27 单季评分",
    checkedAt: "2026-10-20",
  },
};
