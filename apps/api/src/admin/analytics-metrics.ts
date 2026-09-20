export interface AnalyticsFunnelCounts {
  exposedVisitors: number;
  clickedVisitors: number;
  viewedVisitors: number;
  intentVisitors: number;
}

export interface AnalyticsEngagementCounts {
  searches: number;
  recommendStarts: number;
  recommendCompletions: number;
  signups: number;
  ratings: number;
  replies: number;
}

export interface AnalyticsMetrics {
  funnel: AnalyticsFunnelCounts & {
    clickRate: number | null;
    viewRate: number | null;
    intentRate: number | null;
  };
  engagement: AnalyticsEngagementCounts & {
    recommendCompletionRate: number | null;
  };
}

function rate(numerator: number, denominator: number): number | null {
  if (denominator <= 0) return null;
  return Math.round((numerator / denominator) * 1000) / 10;
}

export function buildAnalyticsMetrics(input: {
  funnel: AnalyticsFunnelCounts;
  engagement: AnalyticsEngagementCounts;
}): AnalyticsMetrics {
  return {
    funnel: {
      ...input.funnel,
      clickRate: rate(input.funnel.clickedVisitors, input.funnel.exposedVisitors),
      viewRate: rate(input.funnel.viewedVisitors, input.funnel.clickedVisitors),
      intentRate: rate(input.funnel.intentVisitors, input.funnel.viewedVisitors),
    },
    engagement: {
      ...input.engagement,
      recommendCompletionRate: rate(input.engagement.recommendCompletions, input.engagement.recommendStarts),
    },
  };
}
