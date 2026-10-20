export interface ExternalReviewSnapshot {
  rating: number;
  count: number;
  url: string;
  scope: string;
  checkedAt: string;
}

/** Third-party history stays separate from Youpu ratings and field reports. */
export const EXTERNAL_REVIEW_SNAPSHOTS: Record<string, ExternalReviewSnapshot> = {
  "salomon-huck-knife-2027": {
    rating: 4.8,
    count: 5,
    url: "https://thesnowfever.com/detail/salomon-huck-knife-snowboard-3899",
    scope: "历史款产品页的跨年份评价汇总，非 2026–27 单季评分",
    checkedAt: "2026-10-20",
  },
};
