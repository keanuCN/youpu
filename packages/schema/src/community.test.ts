import assert from 'node:assert/strict';
import test from 'node:test';
import { ratingInputSchema, ratingListQuerySchema, moderationRiskSchema } from './community';

test('rating input accepts at most five image URLs and defaults to no images', () => {
  const base = { overall: 4.5, content: '实际使用一段时间后的感受' };
  assert.deepEqual(ratingInputSchema.parse(base).images, []);
  assert.equal(ratingInputSchema.safeParse({
    ...base,
    images: Array.from({ length: 5 }, (_, index) => `https://images.example.com/${index}.webp`),
  }).success, true);
  assert.equal(ratingInputSchema.safeParse({
    ...base,
    images: Array.from({ length: 6 }, (_, index) => `https://images.example.com/${index}.webp`),
  }).success, false);
});

test('rating list query applies stable defaults', () => {
  assert.deepEqual(ratingListQuerySchema.parse({}), {
    sort: 'helpful',
    profile: 'all',
  });
});

test('rating list query accepts similar sorting and level filtering', () => {
  assert.deepEqual(ratingListQuerySchema.parse({ sort: 'similar', profile: 'complete', level: 'advanced' }), {
    sort: 'similar',
    profile: 'complete',
    level: 'advanced',
  });
});

test('rating list query rejects unknown query values', () => {
  assert.equal(ratingListQuerySchema.safeParse({ sort: 'random' }).success, false);
  assert.equal(ratingListQuerySchema.safeParse({ profile: 'full' }).success, false);
});

test('moderation risk only accepts clear or watch', () => {
  assert.equal(moderationRiskSchema.safeParse('clear').success, true);
  assert.equal(moderationRiskSchema.safeParse('watch').success, true);
  assert.equal(moderationRiskSchema.safeParse('blocked').success, false);
});
