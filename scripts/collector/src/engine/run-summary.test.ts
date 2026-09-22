import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { buildRunSummary, writeRunSummary } from './run-summary';
import type { CrawlTarget } from './types';

const target: CrawlTarget = {
  slug: 'naturehike-star-river-2-2026',
  category: 'tent',
  brand: 'naturehike',
  model: 'Star River 2',
  year: 2026,
  url: 'https://example.com/star-river-2',
  mode: 'cheerio',
};

const crawl = {
  requested: 1,
  blocked: 0,
  succeeded: 1,
  drafts: 1,
  qualityFailed: 0,
  failed: 0,
  outputs: ['C:/tmp/crawl/raw/naturehike-star-river-2-2026.json'],
  draftPaths: ['C:/tmp/crawl/drafts/naturehike-star-river-2-2026.yaml'],
};

test('builds a completed run summary with target and output details', () => {
  const summary = buildRunSummary({
    startedAt: '2026-09-22T01:00:00.000Z',
    finishedAt: '2026-09-22T01:00:02.500Z',
    outDir: 'C:/tmp/crawl',
    targetFile: 'scripts/collector/examples/tent-phase1-targets.json',
    minIntervalMs: 2000,
    autoApprove: false,
    userAgent: 'youpu-collector/test',
    targets: [target],
    crawl,
  });

  assert.equal(summary.status, 'completed');
  assert.equal(summary.durationMs, 2500);
  assert.equal(summary.targets[0]?.slug, target.slug);
  assert.deepEqual(summary.outputPaths, crawl.outputs);
});

test('marks blocked or quality-failed batches for review and writes JSON', async () => {
  const outputDir = await mkdtemp(join(tmpdir(), 'youpu-collector-summary-'));
  try {
    const summary = buildRunSummary({
      startedAt: '2026-09-22T01:00:00.000Z',
      finishedAt: '2026-09-22T01:00:01.000Z',
      outDir: outputDir,
      minIntervalMs: 2000,
      autoApprove: true,
      userAgent: 'youpu-collector/test',
      targets: [target],
      crawl: { ...crawl, blocked: 1, qualityFailed: 1 },
      approval: { requested: 1, approved: 0, skipped: 0, failed: 1, outputs: [], skippedPaths: [], errors: ['blocked'] },
    });

    assert.equal(summary.status, 'needs-review');
    const summaryPath = await writeRunSummary(summary);
    const saved = JSON.parse(await readFile(summaryPath, 'utf8')) as typeof summary;
    assert.equal(saved.kind, 'collector-run');
    assert.equal(saved.approval?.failed, 1);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
