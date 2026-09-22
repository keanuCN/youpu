import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { sha256Json, stableJson } from './hash';
import type { CrawlArtifact } from './types';

export type ArtifactDiffStatus = 'new' | 'changed' | 'unchanged';

export interface FieldChange {
  path: string;
  kind: 'added' | 'removed' | 'changed';
  previous: unknown;
  current: unknown;
}

export interface ArtifactDiff {
  slug: string;
  status: ArtifactDiffStatus;
  rawContentChanged: boolean;
  normalizedSpecChanged: boolean;
  previousHashes: CrawlArtifact['hashes'] | null;
  currentHashes: CrawlArtifact['hashes'];
  specChanges: FieldChange[];
}

export interface CrawlDiffReport {
  schemaVersion: 1;
  kind: 'collector-diff';
  generatedAt: string;
  currentOutDir: string;
  previousOutDir: string;
  requested: number;
  new: number;
  changed: number;
  unchanged: number;
  items: ArtifactDiff[];
}

export function diffValues(previous: unknown, current: unknown, path = ''): FieldChange[] {
  if (stableJson(previous) === stableJson(current)) return [];

  if (isRecord(previous) && isRecord(current)) {
    const keys = [...new Set([...Object.keys(previous), ...Object.keys(current)])].sort();
    return keys.flatMap((key) => {
      const childPath = path ? `${path}.${key}` : key;
      const hasPrevious = Object.prototype.hasOwnProperty.call(previous, key);
      const hasCurrent = Object.prototype.hasOwnProperty.call(current, key);
      if (!hasPrevious) {
        return [{ path: childPath, kind: 'added' as const, previous: null, current: current[key] }];
      }
      if (!hasCurrent) {
        return [{ path: childPath, kind: 'removed' as const, previous: previous[key], current: null }];
      }
      return diffValues(previous[key], current[key], childPath);
    });
  }

  return [{ path: path || '$', kind: 'changed', previous, current }];
}

export function compareArtifacts(previous: CrawlArtifact | undefined, current: CrawlArtifact): ArtifactDiff {
  const currentHashes = current.hashes ?? deriveHashes(current);
  if (!previous) {
    return {
      slug: current.target.slug,
      status: 'new',
      rawContentChanged: true,
      normalizedSpecChanged: true,
      previousHashes: null,
      currentHashes,
      specChanges: diffValues({}, current.adapter.normalizedSpecs),
    };
  }

  const previousHashes = previous.hashes ?? deriveHashes(previous);
  const rawContentChanged = previousHashes.rawContentHash !== currentHashes.rawContentHash;
  const normalizedSpecChanged = previousHashes.normalizedSpecHash !== currentHashes.normalizedSpecHash;
  return {
    slug: current.target.slug,
    status: rawContentChanged || normalizedSpecChanged ? 'changed' : 'unchanged',
    rawContentChanged,
    normalizedSpecChanged,
    previousHashes,
    currentHashes,
    specChanges: diffValues(previous.adapter.normalizedSpecs, current.adapter.normalizedSpecs),
  };
}

export async function compareRawRuns(currentOutDir: string, previousOutDir: string): Promise<CrawlDiffReport> {
  const [current, previous] = await Promise.all([
    loadProductArtifacts(currentOutDir),
    loadProductArtifacts(previousOutDir),
  ]);
  const items = [...current.values()]
    .sort((left, right) => left.target.slug.localeCompare(right.target.slug))
    .map((artifact) => compareArtifacts(previous.get(artifact.target.slug), artifact));

  return {
    schemaVersion: 1,
    kind: 'collector-diff',
    generatedAt: new Date().toISOString(),
    currentOutDir,
    previousOutDir,
    requested: items.length,
    new: items.filter((item) => item.status === 'new').length,
    changed: items.filter((item) => item.status === 'changed').length,
    unchanged: items.filter((item) => item.status === 'unchanged').length,
    items,
  };
}

export async function writeDiffReport(report: CrawlDiffReport): Promise<string> {
  const filePath = resolve(report.currentOutDir, 'diff.json');
  await mkdir(report.currentOutDir, { recursive: true });
  await writeFile(filePath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return filePath;
}

export async function loadProductArtifacts(outDir: string): Promise<Map<string, CrawlArtifact>> {
  const rawDir = resolve(outDir, 'raw');
  let entries;
  try {
    entries = await readdir(rawDir, { withFileTypes: true });
  } catch {
    return new Map();
  }

  const artifacts = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
      .map(async (entry) => {
        try {
          const value: unknown = JSON.parse(await readFile(resolve(rawDir, entry.name), 'utf8'));
          if (!isProductArtifact(value)) return undefined;
          return [value.target.slug, value] as const;
        } catch {
          return undefined;
        }
      }),
  );

  return new Map(artifacts.filter((entry): entry is readonly [string, CrawlArtifact] => entry !== undefined));
}

function deriveHashes(artifact: CrawlArtifact): CrawlArtifact['hashes'] {
  return {
    rawContentHash: sha256Json(artifact.page),
    normalizedSpecHash: sha256Json(artifact.adapter.normalizedSpecs),
  };
}

function isProductArtifact(value: unknown): value is CrawlArtifact {
  if (!isRecord(value)) return false;
  const target = value.target;
  const adapter = value.adapter;
  const page = value.page;
  return (
    value.kind === 'product-crawl' &&
    isRecord(target) &&
    typeof target.slug === 'string' &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(target.slug) &&
    isRecord(adapter) &&
    isRecord(adapter.normalizedSpecs) &&
    isRecord(page)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
