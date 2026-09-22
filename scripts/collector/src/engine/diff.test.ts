import assert from 'node:assert/strict';
import test from 'node:test';
import { compareArtifacts, diffValues } from './diff';
import { sha256Json } from './hash';
import type { CrawlArtifact } from './types';

function artifact(specs: Record<string, unknown>, title = 'Star River 2'): CrawlArtifact {
  const page = {
    title,
    headings: [title],
    jsonLd: [],
    tables: [],
    specifications: [],
    images: [],
    imageAltTexts: [],
  };
  return {
    schemaVersion: 1,
    kind: 'product-crawl',
    capturedAt: '2026-09-22T01:00:00.000Z',
    target: {
      slug: 'naturehike-star-river-2-2026',
      category: 'tent',
      brand: 'naturehike',
      model: 'Star River 2',
      year: 2026,
      url: 'https://example.com/star-river-2',
      mode: 'cheerio',
    },
    hashes: {
      rawContentHash: sha256Json(page),
      normalizedSpecHash: sha256Json(specs),
    },
    source: {
      url: 'https://example.com/star-river-2',
      engine: 'cheerio',
      statusCode: 200,
      robots: { robotsUrl: 'https://example.com/robots.txt', fetchedAt: '2026-09-22T01:00:00.000Z', status: 200, allowed: true, reason: 'test' },
      userAgent: 'test',
    },
    page,
    adapter: { name: 'test', normalizedSpecs: specs, sourceNotes: [] },
    validation: { identityMatch: true, seasonMatch: true, specSchemaFound: true, partial: true, ok: true, issues: [] },
  };
}

test('diffValues reports added, removed and changed fields', () => {
  const changes = diffValues({ length: 2, oldField: '旧' }, { length: 2.1, newField: '新' });
  assert.deepEqual(changes, [
    { path: 'length', kind: 'changed', previous: 2, current: 2.1 },
    { path: 'newField', kind: 'added', previous: null, current: '新' },
    { path: 'oldField', kind: 'removed', previous: '旧', current: null },
  ]);
});

test('distinguishes page-only changes from normalized spec changes', () => {
  const previous = artifact({ length: 2, weight: 120 });
  const pageChanged = artifact({ length: 2, weight: 120 }, 'Star River 2 updated');
  const specsChanged = artifact({ length: 2, weight: 125 });

  const pageDiff = compareArtifacts(previous, pageChanged);
  assert.equal(pageDiff.status, 'changed');
  assert.equal(pageDiff.rawContentChanged, true);
  assert.equal(pageDiff.normalizedSpecChanged, false);
  assert.deepEqual(pageDiff.specChanges, []);

  const specsDiff = compareArtifacts(previous, specsChanged);
  assert.equal(specsDiff.normalizedSpecChanged, true);
  assert.deepEqual(specsDiff.specChanges, [{ path: 'weight', kind: 'changed', previous: 120, current: 125 }]);
});

test('marks an artifact absent from the previous batch as new', () => {
  const current = compareArtifacts(undefined, artifact({ length: 2 }));
  assert.equal(current.status, 'new');
  assert.equal(current.previousHashes, null);
  assert.equal(current.specChanges[0]?.kind, 'added');
});
