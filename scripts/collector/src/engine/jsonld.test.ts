import assert from 'node:assert/strict';
import test from 'node:test';
import { snapshotFromHtml } from './jsonld';

test('captures visible body text without script and style content', () => {
  const snapshot = snapshotFromHtml(
    '<html><head><style>.hidden{display:none}</style><script>not a product fact</script></head><body><h1>产品参数</h1><div>4K/120fps</div><script>secret value</script></body></html>',
    'https://example.com/product',
  );

  assert.match(snapshot.bodyText ?? '', /产品参数/);
  assert.match(snapshot.bodyText ?? '', /4K\/120fps/);
  assert.doesNotMatch(snapshot.bodyText ?? '', /not a product fact|secret value|hidden/);
});
