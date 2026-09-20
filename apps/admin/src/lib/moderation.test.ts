import assert from 'node:assert/strict';
import test from 'node:test';
import { formatModerationReasons } from './moderation';

test('maps moderation reason codes to Chinese labels and hides unknown internal codes', () => {
  assert.deepEqual(
    formatModerationReasons(['promotion', 'extreme-rating-without-context', 'duplicate-content', 'future-code']),
    ['推广/导流', '极端评分缺少说明', '重复内容', '未知风险原因'],
  );
});
