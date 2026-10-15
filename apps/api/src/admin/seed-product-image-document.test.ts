import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { rewriteSeedImageUrls } from './seed-product-image-document';

const original = '# 中文来源与人工备注必须保留\n' + readFileSync(path.resolve(__dirname, '../../../../data/snowboard/burton-custom-camber-2027.yaml'), 'utf8');
const target = `https://youpu.tos-cn-beijing.volces.com/product-images/mirror/${'a'.repeat(64)}.webp`;

test('rewrites only image URLs while preserving all product facts, source metadata and comments', () => {
  const before = parse(original);
  const source = before.images[0].url as string;
  const rewritten = rewriteSeedImageUrls(original, new Map([[source, target]]));
  const after = parse(rewritten);
  const expected = structuredClone(before);
  expected.images[0].url = target;
  assert.deepEqual(after, expected);
  assert.ok(rewritten.startsWith('# 中文来源与人工备注必须保留\n'));
  assert.equal(rewriteSeedImageUrls(rewritten, new Map([[source, target]])), rewritten);
});

test('leaves unmapped seeds byte-for-byte unchanged and refuses foreign replacement URLs', () => {
  assert.equal(rewriteSeedImageUrls(original, new Map()), original);
  const source = parse(original).images[0].url as string;
  assert.throws(() => rewriteSeedImageUrls(original, new Map([[source, 'https://example.com/fake.webp']])));
  assert.throws(() => rewriteSeedImageUrls(original, new Map([[source, target + '?token=private']])));
});
