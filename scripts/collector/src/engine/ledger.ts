import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { ArtifactDiffStatus, CrawlDiffReport } from './diff';
import { loadProductArtifacts } from './diff';
import type { CrawlArtifact, CrawlTarget } from './types';

export type TargetLedgerStatus =
  | 'planned'
  | 'crawled'
  | 'draft'
  | 'audited'
  | 'published'
  | 'stale'
  | 'blocked'
  | 'retired';

export interface TargetLedgerEntry {
  slug: string;
  category: string;
  brand: string;
  model: string;
  year: number;
  url: string;
  mode: CrawlTarget['mode'];
  status: TargetLedgerStatus;
  lastRunAt: string | null;
  lastSuccessfulAt: string | null;
  lastRawContentHash: string | null;
  lastNormalizedSpecHash: string | null;
  lastDiffStatus: ArtifactDiffStatus | null;
  nextReviewAt: string | null;
}

export interface TargetLedger {
  schemaVersion: 1;
  kind: 'collector-target-ledger';
  updatedAt: string;
  entries: TargetLedgerEntry[];
}

export interface UpdateTargetLedgerOptions {
  ledgerPath: string;
  outDir: string;
  dataDir: string;
  targets: CrawlTarget[];
  finishedAt: string;
}

export async function updateTargetLedger(options: UpdateTargetLedgerOptions): Promise<TargetLedger> {
  const previous = await readExistingLedger(options.ledgerPath);
  const currentArtifacts = await loadProductArtifacts(options.outDir);
  const diff = await readDiffReport(options.outDir);
  const diffBySlug = new Map((diff?.items ?? []).map((item) => [item.slug, item]));
  const currentEntries = await Promise.all(
    options.targets.map(async (target) => {
      const previousEntry = previous.get(target.slug);
      const artifact = currentArtifacts.get(target.slug);
      const diffItem = diffBySlug.get(target.slug);
      const status = await resolveTargetStatus(target, artifact, options.outDir, options.dataDir);

      return {
        slug: target.slug,
        category: target.category,
        brand: target.brand,
        model: target.model,
        year: target.year,
        url: target.url,
        mode: target.mode,
        status,
        lastRunAt: options.finishedAt,
        lastSuccessfulAt: artifact?.validation.ok ? artifact.capturedAt : previousEntry?.lastSuccessfulAt ?? null,
        lastRawContentHash: artifact?.hashes.rawContentHash ?? previousEntry?.lastRawContentHash ?? null,
        lastNormalizedSpecHash: artifact?.hashes.normalizedSpecHash ?? previousEntry?.lastNormalizedSpecHash ?? null,
        lastDiffStatus: diffItem?.status ?? null,
        nextReviewAt: previousEntry?.nextReviewAt ?? null,
      } satisfies TargetLedgerEntry;
    }),
  );

  const currentSlugs = new Set(currentEntries.map((entry) => entry.slug));
  const entries = [
    ...currentEntries,
    ...[...previous.values()].filter((entry) => !currentSlugs.has(entry.slug)),
  ].sort((left, right) => left.slug.localeCompare(right.slug));
  const ledger: TargetLedger = {
    schemaVersion: 1,
    kind: 'collector-target-ledger',
    updatedAt: new Date().toISOString(),
    entries,
  };
  await mkdir(resolve(options.ledgerPath, '..'), { recursive: true });
  await writeFile(options.ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`, 'utf8');
  return ledger;
}

async function resolveTargetStatus(
  target: CrawlTarget,
  artifact: CrawlArtifact | undefined,
  outDir: string,
  dataDir: string,
): Promise<TargetLedgerStatus> {
  const rawKind = await readRawKind(outDir, target.slug);
  if (rawKind === 'product-crawl-blocked' || rawKind === 'product-crawl-failure') return 'blocked';
  if (artifact && !artifact.validation.ok) return 'stale';
  if (await exists(resolve(outDir, 'updates', `${target.slug}.yaml`))) return 'draft';
  if (await exists(resolve(dataDir, target.category, `${target.slug}.yaml`))) return 'published';
  if (await exists(resolve(outDir, 'drafts', `${target.slug}.yaml`))) return 'draft';
  if (artifact?.validation.ok) return 'crawled';
  return 'planned';
}

async function readExistingLedger(ledgerPath: string): Promise<Map<string, TargetLedgerEntry>> {
  try {
    const value: unknown = JSON.parse(await readFile(ledgerPath, 'utf8'));
    if (!isTargetLedger(value)) throw new Error(`目标台账格式无效：${ledgerPath}`);
    return new Map(value.entries.map((entry) => [entry.slug, entry]));
  } catch (error) {
    if (isFileNotFound(error)) return new Map();
    throw error;
  }
}

async function readDiffReport(outDir: string): Promise<CrawlDiffReport | undefined> {
  try {
    const value: unknown = JSON.parse(await readFile(resolve(outDir, 'diff.json'), 'utf8'));
    return isDiffReport(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

async function readRawKind(outDir: string, slug: string): Promise<string | undefined> {
  try {
    const value: unknown = JSON.parse(await readFile(resolve(outDir, 'raw', `${slug}.json`), 'utf8'));
    return isRecord(value) && typeof value.kind === 'string' ? value.kind : undefined;
  } catch {
    return undefined;
  }
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function isTargetLedger(value: unknown): value is TargetLedger {
  return isRecord(value) && value.kind === 'collector-target-ledger' && Array.isArray(value.entries) && value.entries.every(isTargetLedgerEntry);
}

function isTargetLedgerEntry(value: unknown): value is TargetLedgerEntry {
  return (
    isRecord(value) &&
    typeof value.slug === 'string' &&
    typeof value.category === 'string' &&
    typeof value.brand === 'string' &&
    typeof value.model === 'string' &&
    typeof value.year === 'number' &&
    typeof value.url === 'string' &&
    (value.mode === 'cheerio' || value.mode === 'playwright') &&
    typeof value.status === 'string' &&
    (value.lastRunAt === null || typeof value.lastRunAt === 'string') &&
    (value.lastSuccessfulAt === null || typeof value.lastSuccessfulAt === 'string') &&
    (value.lastRawContentHash === null || typeof value.lastRawContentHash === 'string') &&
    (value.lastNormalizedSpecHash === null || typeof value.lastNormalizedSpecHash === 'string') &&
    (value.lastDiffStatus === null || value.lastDiffStatus === 'new' || value.lastDiffStatus === 'changed' || value.lastDiffStatus === 'unchanged') &&
    (value.nextReviewAt === null || typeof value.nextReviewAt === 'string')
  );
}

function isDiffReport(value: unknown): value is CrawlDiffReport {
  return isRecord(value) && value.kind === 'collector-diff' && Array.isArray(value.items);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFileNotFound(error: unknown): boolean {
  return isRecord(error) && error.code === 'ENOENT';
}
