import assert from 'node:assert/strict';
import test from 'node:test';
import { buildAnalyticsMetrics } from './analytics-metrics';

test('builds a visitor funnel and recommendation completion rate', () => {
  const result = buildAnalyticsMetrics({
    funnel: {
      exposedVisitors: 100,
      clickedVisitors: 40,
      viewedVisitors: 20,
      intentVisitors: 15,
    },
    engagement: {
      searches: 32,
      recommendStarts: 8,
      recommendCompletions: 6,
      signups: 3,
      ratings: 4,
      replies: 2,
    },
  });

  assert.deepEqual(result, {
    funnel: {
      exposedVisitors: 100,
      clickedVisitors: 40,
      viewedVisitors: 20,
      intentVisitors: 15,
      clickRate: 40,
      viewRate: 50,
      intentRate: 75,
    },
    engagement: {
      searches: 32,
      recommendStarts: 8,
      recommendCompletions: 6,
      recommendCompletionRate: 75,
      signups: 3,
      ratings: 4,
      replies: 2,
    },
  });
});

test('does not invent percentages when a funnel step has no visitors', () => {
  const result = buildAnalyticsMetrics({
    funnel: {
      exposedVisitors: 0,
      clickedVisitors: 0,
      viewedVisitors: 0,
      intentVisitors: 0,
    },
    engagement: {
      searches: 0,
      recommendStarts: 0,
      recommendCompletions: 0,
      signups: 0,
      ratings: 0,
      replies: 0,
    },
  });

  assert.equal(result.funnel.clickRate, null);
  assert.equal(result.funnel.viewRate, null);
  assert.equal(result.funnel.intentRate, null);
  assert.equal(result.engagement.recommendCompletionRate, null);
});
