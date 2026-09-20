import assert from 'node:assert/strict';
import test from 'node:test';
import { ratingListQuerySchema } from '@youpu/schema';
import { filterAndSortRatings, type RatingQueryRow } from './rating-query';

function row(
  id: string,
  riderProfile: Record<string, unknown>,
  helpfulCount: number,
  createdAt: string,
): RatingQueryRow {
  return { id, riderProfile, helpfulCount, createdAt: new Date(createdAt) };
}

test('filters to ratings with a complete rider profile and requested level', () => {
  const rows = [
    row('complete', { level: 'intermediate', years: 3 }, 1, '2026-09-01T00:00:00.000Z'),
    row('missing-extra', { level: 'intermediate' }, 9, '2026-09-03T00:00:00.000Z'),
    row('wrong-level', { level: 'advanced', years: 5 }, 9, '2026-09-04T00:00:00.000Z'),
  ];

  const result = filterAndSortRatings(rows, ratingListQuerySchema.parse({ profile: 'complete', level: 'intermediate' }));

  assert.deepEqual(result.map((item) => item.id), ['complete']);
});

test('sorts helpful ratings by helpful count and then newest creation time', () => {
  const rows = [
    row('older-tie', { level: 'beginner' }, 4, '2026-09-01T00:00:00.000Z'),
    row('newer-tie', { level: 'beginner' }, 4, '2026-09-02T00:00:00.000Z'),
    row('most-helpful', { level: 'beginner' }, 7, '2026-08-01T00:00:00.000Z'),
  ];

  const result = filterAndSortRatings(rows, ratingListQuerySchema.parse({ sort: 'helpful' }));

  assert.deepEqual(result.map((item) => item.id), ['most-helpful', 'newer-tie', 'older-tie']);
});

test('sorts latest ratings newest first', () => {
  const rows = [
    row('old', { level: 'beginner' }, 99, '2026-09-01T00:00:00.000Z'),
    row('new', { level: 'beginner' }, 0, '2026-09-05T00:00:00.000Z'),
  ];

  const result = filterAndSortRatings(rows, ratingListQuerySchema.parse({ sort: 'latest' }));

  assert.deepEqual(result.map((item) => item.id), ['new', 'old']);
});

test('sorts similar ratings by level, shared profile fields, then deterministic fallbacks', () => {
  const rows = [
    row('same-level', { level: 'intermediate' }, 0, '2026-09-01T00:00:00.000Z'),
    row('richer-match', { level: 'advanced', years: 3, height: 170, home_resort: 'yabuli' }, 0, '2026-09-02T00:00:00.000Z'),
    row('unrelated', { level: 'beginner', years: 1 }, 99, '2026-09-03T00:00:00.000Z'),
  ];

  const result = filterAndSortRatings(
    rows,
    ratingListQuerySchema.parse({ sort: 'similar' }),
    { level: 'intermediate', years: 3, height: 170, home_resort: 'yabuli' },
  );

  assert.deepEqual(result.map((item) => item.id), ['same-level', 'richer-match', 'unrelated']);
});

test('falls back to helpful ordering when similar sorting has no viewer profile', () => {
  const rows = [
    row('less-helpful', { level: 'advanced' }, 1, '2026-09-05T00:00:00.000Z'),
    row('more-helpful', { level: 'beginner' }, 2, '2026-09-01T00:00:00.000Z'),
  ];

  const result = filterAndSortRatings(rows, ratingListQuerySchema.parse({ sort: 'similar' }));

  assert.deepEqual(result.map((item) => item.id), ['more-helpful', 'less-helpful']);
});
