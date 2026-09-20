import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateCommunityRisk } from './community-moderation';

test('clean content stays clear', () => {
  assert.deepEqual(evaluateCommunityRisk({ content: '雪况稳定时抓边很稳', overall: 4 }), {
    risk: 'clear',
    reasons: [],
  });
});

test('sensitive promotion language is marked for review without blocking publication', () => {
  assert.deepEqual(evaluateCommunityRisk({ content: '加微信返现购买', overall: 5 }), {
    risk: 'watch',
    reasons: ['promotion'],
  });
});

test('extreme ratings without text are marked for review', () => {
  assert.deepEqual(evaluateCommunityRisk({ content: null, overall: 1 }), {
    risk: 'watch',
    reasons: ['extreme-rating-without-context'],
  });
});

test('duplicate content adds a duplicate reason', () => {
  assert.deepEqual(evaluateCommunityRisk({ content: '同一段内容', duplicate: true }), {
    risk: 'watch',
    reasons: ['duplicate-content'],
  });
});
