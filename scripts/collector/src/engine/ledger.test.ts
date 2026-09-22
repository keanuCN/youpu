import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { updateTargetLedger } from './ledger';
import type { CrawlArtifact, CrawlTarget } from './types';

const target: CrawlTarget = {
  slug: 'naturehike-star-river-2-2026',
  category: 'tent',
  brand: 'naturehike',
  model: 'Star River 2',
  year: 2026,
  url: 'https://example.com/star-river-2',
  mode: 'cheerio',
};

const artifact: CrawlArtifact = {
  schemaVersion: 1,
  kind: 'product-crawl',
  capturedAt: '2026-09-22T01:00:00.000Z',
  target,
  hashes: { rawContentHash: 'raw-1', normalizedSpecHash: 'spec-1' },
  source: {
    url: target.url,
    engine: 'cheerio',
    statusCode: 200,
    robots: { robotsUrl: 'https://example.com/robots.txt', fetchedAt: '2026-09-22T01:00:00.000Z', status: 200, allowed: true, reason: 'test' },
    userAgent: 'test',
  },
  page: { title: target.model, headings: [], jsonLd: [], tables: [], specifications: [], images: [], imageAltTexts: [] },
  adapter: { name: 'test', normalizedSpecs: { capacity: 2 }, sourceNotes: [] },
  validation: { identityMatch: true, seasonMatch: true, specSchemaFound: true, partial: false, ok: true, issues: [] },
};

test('writes the latest hashes and preserves entries from previous runs', async () => {
  const root = await mkdtemp(join(tmpdir(), 'youpu-collector-ledger-'));
  try {
    const outDir = resolve(root, 'out');
    const dataDir = resolve(root, 'data');
    const ledgerPath = resolve(root, 'ledger.json');
    await mkdir(resolve(outDir, 'raw'), { recursive: true });
    await mkdir(resolve(outDir, 'drafts'), { recursive: true });
    await mkdir(resolve(dataDir, 'tent'), { recursive: true });
    await writeFile(resolve(outDir, 'raw', `${target.slug}.json`), JSON.stringify(artifact), 'utf8');
    await writeFile(resolve(outDir, 'diff.json'), JSON.stringify({
      schemaVersion: 1,
      kind: 'collector-diff',
      generatedAt: '2026-09-22T01:00:00.000Z',
      currentOutDir: outDir,
      previousOutDir: resolve(root, 'previous'),
      requested: 1,
      new: 0,
      changed: 1,
      unchanged: 0,
      items: [{ slug: target.slug, status: 'changed', rawContentChanged: true, normalizedSpecChanged: true, previousHashes: artifact.hashes, currentHashes: artifact.hashes, specChanges: [] }],
    }), 'utf8');
    await writeFile(ledgerPath, JSON.stringify({
      schemaVersion: 1,
      kind: 'collector-target-ledger',
      updatedAt: '2026-09-21T01:00:00.000Z',
      entries: [{
        ...target,
        status: 'published',
        lastRunAt: '2026-09-21T01:00:00.000Z',
        lastSuccessfulAt: '2026-09-21T01:00:00.000Z',
        lastRawContentHash: 'old-raw',
        lastNormalizedSpecHash: 'old-spec',
        lastDiffStatus: 'unchanged',
        nextReviewAt: null,
      }, {
        ...target,
        slug: 'old-product-2025',
        status: 'published',
        lastRunAt: '2026-09-21T01:00:00.000Z',
        lastSuccessfulAt: '2026-09-21T01:00:00.000Z',
        lastRawContentHash: 'old-raw',
        lastNormalizedSpecHash: 'old-spec',
        lastDiffStatus: 'unchanged',
        nextReviewAt: null,
      }],
    }), 'utf8');

    const ledger = await updateTargetLedger({
      ledgerPath,
      outDir,
      dataDir,
      targets: [target],
      finishedAt: '2026-09-22T01:00:02.000Z',
    });
    const current = ledger.entries.find((entry) => entry.slug === target.slug);
    const preserved = ledger.entries.find((entry) => entry.slug === 'old-product-2025');

    assert.equal(current?.status, 'crawled');
    assert.equal(current?.lastRawContentHash, 'raw-1');
    assert.equal(current?.lastNormalizedSpecHash, 'spec-1');
    assert.equal(current?.lastDiffStatus, 'changed');
    assert.equal(current?.lastSuccessfulAt, artifact.capturedAt);
    assert.equal(preserved?.status, 'published');
    assert.equal(JSON.parse(await readFile(ledgerPath, 'utf8')).kind, 'collector-target-ledger');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('marks a blocked raw result as blocked without discarding the previous success time', async () => {
  const root = await mkdtemp(join(tmpdir(), 'youpu-collector-ledger-blocked-'));
  try {
    const outDir = resolve(root, 'out');
    const dataDir = resolve(root, 'data');
    const ledgerPath = resolve(root, 'ledger.json');
    await mkdir(resolve(outDir, 'raw'), { recursive: true });
    await writeFile(resolve(outDir, 'raw', `${target.slug}.json`), JSON.stringify({ kind: 'product-crawl-blocked' }), 'utf8');
    await writeFile(ledgerPath, JSON.stringify({
      schemaVersion: 1,
      kind: 'collector-target-ledger',
      updatedAt: '2026-09-21T01:00:00.000Z',
      entries: [{
        ...target,
        status: 'published',
        lastRunAt: '2026-09-21T01:00:00.000Z',
        lastSuccessfulAt: '2026-09-21T01:00:00.000Z',
        lastRawContentHash: 'old-raw',
        lastNormalizedSpecHash: 'old-spec',
        lastDiffStatus: null,
        nextReviewAt: null,
      }],
    }), 'utf8');

    const ledger = await updateTargetLedger({ ledgerPath, outDir, dataDir, targets: [target], finishedAt: '2026-09-22T01:00:02.000Z' });
    const current = ledger.entries[0];
    assert.equal(current?.status, 'blocked');
    assert.equal(current?.lastSuccessfulAt, '2026-09-21T01:00:00.000Z');
    assert.equal(current?.lastRawContentHash, 'old-raw');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
