import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as adminApp from './admin-app';

test('admin image workflow status reflects TOS upload and source review', () => {
  const source = readFileSync(fileURLToPath(new URL('./admin-app.tsx', import.meta.url)), 'utf8');
  assert.doesNotMatch(source, /COS 上传与裁切留到后续版本/);
  assert.match(source, /TOS 上传已可在产品编辑中使用，图片来源与版权仍需审核/);
});

test('buildProductPayload always emits CNY for product prices', () => {
  const { buildProductPayload } = adminApp as unknown as {
    buildProductPayload: (form: unknown, schema: null) => { priceCurrency: string };
  };
  const payload = buildProductPayload({
    slug: 'sample-product-2026', categorySlug: 'snowboard', brandSlug: 'sample',
    model: 'Sample', year: '2026', title: 'Sample', oneLiner: '',
    priceMin: '1000', priceMax: '2000', priceCurrency: 'USD', coverUrl: '',
    status: 'draft', sourceKind: 'manual', sourceUrl: '', snapshotUrl: '',
    specs: {}, editorialScores: {}, images: [],
  }, null);
  assert.equal(payload.priceCurrency, 'CNY');
});

test('uploaded product images become editable base-image rows', () => {
  const { makeUploadedImageDraft } = adminApp as unknown as {
    makeUploadedImageDraft: (url: string, title: string, sortOrder: number) => {
      url: string;
      kind: string;
      alt: string;
      source: string;
      sortOrder: string;
    };
  };

  assert.deepEqual(makeUploadedImageDraft('https://cdn.example/photo.webp', '雪板型号', 2), {
    url: 'https://cdn.example/photo.webp',
    kind: 'base',
    alt: '雪板型号',
    source: '',
    sortOrder: '2',
  });
});
