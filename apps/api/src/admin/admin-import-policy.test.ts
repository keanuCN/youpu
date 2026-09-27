import assert from 'node:assert/strict';
import test from 'node:test';
import { applyCollectorChanges, assertCollectorChangesStillCurrent, parseCollectorImportPayload } from './admin-import-policy';

const product = {
  slug: 'brand-model-2026',
  category: 'snowboard',
  brand: 'brand',
  model: 'Model',
  year: 2026,
  title: 'Brand Model',
  specs: { width: 250 },
  data_source: { kind: 'crawl', origin_url: 'https://brand.example/products/model' },
  status: 'published',
};

test('new collector seed is always staged as a draft regardless of its source status', () => {
  const parsed = parseCollectorImportPayload(product);

  assert.equal(parsed.kind, 'new');
  assert.equal(parsed.product.status, 'draft');
  assert.equal(parsed.product.slug, product.slug);
});

test('update envelope retains reviewed changes but strips machine-local file paths', () => {
  const parsed = parseCollectorImportPayload({
    schemaVersion: 1,
    kind: 'product-update-draft',
    generatedAt: '2026-09-27T00:00:00.000Z',
    baseSeedPath: 'C:/collector/private/products/model.yaml',
    target: { slug: product.slug },
    source: {
      originUrl: 'https://brand.example/products/model',
      currentRawPath: 'C:/collector/private/raw/model.json',
      previousRawPath: 'C:/collector/private/old/model.json',
      previousHashes: { rawContentHash: 'old', normalizedSpecHash: 'old' },
      currentHashes: { rawContentHash: 'new', normalizedSpecHash: 'new' },
    },
    changes: [{ path: 'specs.width', kind: 'changed', previous: 249, current: 250 }],
    ignoredChanges: [],
    product,
  });

  assert.equal(parsed.kind, 'update');
  assert.deepEqual(parsed.changes, [{ path: 'specs.width', kind: 'changed', previous: 249, current: 250 }]);
  assert.equal(parsed.source.originUrl, 'https://brand.example/products/model');
  assert.equal('baseSeedPath' in parsed, false);
  assert.equal('currentRawPath' in parsed.source, false);
});

test('update envelope slug must match its product seed', () => {
  assert.throws(
    () => parseCollectorImportPayload({
      kind: 'product-update-draft',
      target: { slug: product.slug },
      source: { originUrl: 'https://brand.example/products/model' },
      changes: [{ path: 'specs.width', kind: 'changed', previous: 249, current: 250 }],
      product: { ...product, slug: 'other' },
    }),
    /target\.slug/,
  );
});

test('unknown collector envelope kinds are rejected', () => {
  assert.throws(() => parseCollectorImportPayload({ kind: 'product-crawl-failure' }), /采集文件格式/);
});

test('update changes are rejected when the product changed after the crawler snapshot', () => {
  assert.throws(
    () => assertCollectorChangesStillCurrent({ width: 252 }, [
      { path: 'width', kind: 'changed', previous: 249, current: 250 },
    ]),
    /采集后发生变化/,
  );
});

test('an added collector field conflicts if a human has since populated that field', () => {
  assert.throws(
    () => assertCollectorChangesStillCurrent({ width: 252 }, [
      { path: 'width', kind: 'added', previous: null, current: 250 },
    ]),
    /采集后发生变化/,
  );
});

test('approved crawler changes patch only changed fields and preserve unrelated manual edits', () => {
  const result = applyCollectorChanges(
    { width: 249, flex: 6, shape: { nose: 'traditional', tail: 'tapered' } },
    [
      { path: 'width', kind: 'changed', previous: 249, current: 250 },
      { path: 'shape.nose', kind: 'changed', previous: 'traditional', current: 'directional' },
    ],
  );

  assert.deepEqual(result, { width: 250, flex: 6, shape: { nose: 'directional', tail: 'tapered' } });
});
