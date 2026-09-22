import assert from 'node:assert/strict';
import test from 'node:test';
import { compareArtifacts } from './diff';
import { sha256Json } from './hash';
import { buildProductUpdateDraft, mergeSpecsPreservingMissing } from './update-draft';
import type { CrawlArtifact } from './types';
import type { ProductSeed } from '@youpu/schema';

const seed: ProductSeed = {
  slug: 'naturehike-star-river-2-2026',
  category: 'tent',
  brand: 'naturehike',
  model: 'Star River 2',
  year: 2026,
  title: 'Naturehike Star River 2',
  specs: { capacity: 2, material: { flysheet: '20D' }, oldField: '保留' },
  images: [],
  status: 'published',
};

function artifact(specs: Record<string, unknown>): CrawlArtifact {
  const page = { title: 'Star River 2', headings: ['Star River 2'], jsonLd: [], tables: [], specifications: [], images: [], imageAltTexts: [] };
  return {
    schemaVersion: 1,
    kind: 'product-crawl',
    capturedAt: '2026-09-22T01:00:00.000Z',
    target: { slug: seed.slug, category: seed.category, brand: seed.brand, model: seed.model, year: seed.year, url: 'https://example.com/star-river-2', mode: 'cheerio' },
    hashes: { rawContentHash: sha256Json(page), normalizedSpecHash: sha256Json(specs) },
    source: { url: 'https://example.com/star-river-2', engine: 'cheerio', statusCode: 200, robots: { robotsUrl: 'https://example.com/robots.txt', fetchedAt: '2026-09-22T01:00:00.000Z', status: 200, allowed: true, reason: 'test' }, userAgent: 'test' },
    page,
    adapter: { name: 'test', normalizedSpecs: specs, sourceNotes: [] },
    validation: { identityMatch: true, seasonMatch: true, specSchemaFound: true, partial: true, ok: true, issues: [] },
  };
}

test('merges changed facts without deleting old fields absent from the new page', () => {
  const merged = mergeSpecsPreservingMissing(seed.specs, { capacity: 3, material: { flysheet: '15D' } });
  assert.deepEqual(merged, { capacity: 3, material: { flysheet: '15D' }, oldField: '保留' });
});

test('builds a reviewable update draft with source and ignored removals', () => {
  const previous = artifact({ capacity: 2, material: { flysheet: '20D' }, oldField: '保留' });
  const current = artifact({ capacity: 3, material: { flysheet: '15D' } });
  const diff = compareArtifacts(previous, current);
  const draft = buildProductUpdateDraft(seed, current, diff, 'data/tent/naturehike-star-river-2-2026.yaml', {
    currentRawPath: 'data/tmp/current/raw/naturehike-star-river-2-2026.json',
    previousRawPath: 'data/tmp/previous/raw/naturehike-star-river-2-2026.json',
  });

  assert.equal(draft?.kind, 'product-update-draft');
  assert.equal(draft?.product.status, 'draft');
  assert.equal(draft?.product.specs.capacity, 3);
  assert.equal((draft?.product.specs.material as Record<string, unknown>).flysheet, '15D');
  assert.equal(draft?.product.specs.oldField, '保留');
  assert.deepEqual(draft?.ignoredChanges.map((change) => change.path), ['oldField']);
  assert.equal(draft?.source.originUrl, current.source.url);
  assert.equal(draft?.source.currentRawPath, 'data/tmp/current/raw/naturehike-star-river-2-2026.json');
  assert.equal(draft?.source.previousRawPath, 'data/tmp/previous/raw/naturehike-star-river-2-2026.json');
});

test('keeps a removal-only diff reviewable without deleting the old field', () => {
  const previous = artifact({ capacity: 2, oldField: '保留' });
  const current = artifact({ capacity: 2 });
  const diff = compareArtifacts(previous, current);
  const draft = buildProductUpdateDraft(seed, current, diff, 'data/tent/naturehike-star-river-2-2026.yaml', {
    currentRawPath: 'data/tmp/current/raw/naturehike-star-river-2-2026.json',
    previousRawPath: 'data/tmp/previous/raw/naturehike-star-river-2-2026.json',
  });

  assert.ok(draft);
  assert.equal(draft.product.specs.oldField, '保留');
  assert.deepEqual(draft.ignoredChanges.map((change) => change.path), ['oldField']);
});
