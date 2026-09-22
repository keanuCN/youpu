import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  productSeedSchema,
  validateSpecs,
  type ProductSeed,
  type SpecSchema,
} from '@youpu/schema';
import { parse as parseYaml, stringify } from 'yaml';
import { loadCategorySchema } from './draft';
import { loadProductArtifacts, type ArtifactDiff, type CrawlDiffReport, type FieldChange } from './diff';
import type { CrawlArtifact } from './types';

export interface ProductUpdateDraft {
  schemaVersion: 1;
  kind: 'product-update-draft';
  generatedAt: string;
  baseSeedPath: string;
  target: CrawlArtifact['target'];
  source: {
    originUrl: string;
    currentRawPath: string;
    previousRawPath: string;
    previousHashes: CrawlArtifact['hashes'];
    currentHashes: CrawlArtifact['hashes'];
  };
  changes: FieldChange[];
  ignoredChanges: FieldChange[];
  product: ProductSeed;
}

export interface UpdateDraftItem {
  slug: string;
  status: 'generated' | 'skipped' | 'failed';
  reason?: string;
  path?: string;
  changedPaths: string[];
  ignoredPaths: string[];
}

export interface UpdateDraftReport {
  schemaVersion: 1;
  kind: 'collector-update-drafts';
  generatedAt: string;
  currentOutDir: string;
  previousOutDir: string;
  dataDir: string;
  requested: number;
  generated: number;
  skipped: number;
  failed: number;
  outputs: string[];
  items: UpdateDraftItem[];
}

export interface GenerateUpdateDraftOptions {
  diff: CrawlDiffReport;
  dataDir: string;
}

export interface UpdateDraftSourcePaths {
  currentRawPath: string;
  previousRawPath: string;
}

export function mergeSpecsPreservingMissing(
  previous: Record<string, unknown>,
  current: Record<string, unknown>,
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...previous };
  for (const [key, value] of Object.entries(current)) {
    const previousValue = previous[key];
    if (isRecord(previousValue) && isRecord(value)) {
      merged[key] = mergeSpecsPreservingMissing(previousValue, value);
    } else {
      merged[key] = value;
    }
  }
  return merged;
}

export function buildProductUpdateDraft(
  seed: ProductSeed,
  artifact: CrawlArtifact,
  diff: ArtifactDiff,
  baseSeedPath: string,
  sourcePaths: UpdateDraftSourcePaths,
): ProductUpdateDraft | undefined {
  if (diff.specChanges.length === 0) return undefined;

  const product = productSeedSchema.parse({
    ...seed,
    specs: mergeSpecsPreservingMissing(seed.specs, artifact.adapter.normalizedSpecs),
    data_source: { kind: 'crawl', origin_url: artifact.source.url },
    status: 'draft',
  });

  return {
    schemaVersion: 1,
    kind: 'product-update-draft',
    generatedAt: new Date().toISOString(),
    baseSeedPath,
    target: artifact.target,
    source: {
      originUrl: artifact.source.url,
      currentRawPath: sourcePaths.currentRawPath,
      previousRawPath: sourcePaths.previousRawPath,
      previousHashes: diff.previousHashes ?? diff.currentHashes,
      currentHashes: diff.currentHashes,
    },
    changes: diff.specChanges,
    ignoredChanges: diff.specChanges.filter((change) => change.kind === 'removed'),
    product,
  };
}

/**
 * 基于 diff 生成已有 seed 的更新草稿，不直接覆盖正式数据。
 * 只有当前 raw 通过采集质量闸门且规格确实变化时才会生成文件。
 */
export async function generateUpdateDrafts(options: GenerateUpdateDraftOptions): Promise<UpdateDraftReport> {
  const { diff, dataDir } = options;
  const currentArtifacts = await loadProductArtifacts(diff.currentOutDir);
  const updatesDir = resolve(diff.currentOutDir, 'updates');
  await mkdir(updatesDir, { recursive: true });

  const items: UpdateDraftItem[] = [];
  const outputs: string[] = [];

  for (const diffItem of diff.items) {
    const changedPaths = diffItem.specChanges.filter((change) => change.kind !== 'removed').map((change) => change.path);
    const ignoredPaths = diffItem.specChanges.filter((change) => change.kind === 'removed').map((change) => change.path);
    if (diffItem.status === 'new') {
      items.push({ slug: diffItem.slug, status: 'skipped', reason: 'new-seed-not-update', changedPaths, ignoredPaths });
      continue;
    }
    if (!diffItem.normalizedSpecChanged) {
      items.push({ slug: diffItem.slug, status: 'skipped', reason: 'no-spec-change', changedPaths, ignoredPaths });
      continue;
    }

    const artifact = currentArtifacts.get(diffItem.slug);
    const baseSeedPath = resolve(dataDir, artifact?.target.category ?? 'unknown', `${diffItem.slug}.yaml`);
    if (!artifact) {
      items.push({ slug: diffItem.slug, status: 'failed', reason: 'current-raw-not-found', changedPaths, ignoredPaths });
      continue;
    }
    if (!artifact.validation.ok) {
      items.push({ slug: diffItem.slug, status: 'skipped', reason: 'current-raw-quality-failed', changedPaths, ignoredPaths });
      continue;
    }

    try {
      const seed = await readSeed(baseSeedPath);
      const schema = await loadCategorySchema(seed.category, dataDir);
      validateMergedSeed(seed, artifact, schema);
      const draft = buildProductUpdateDraft(seed, artifact, diffItem, baseSeedPath, {
        currentRawPath: resolve(diff.currentOutDir, 'raw', `${diffItem.slug}.json`),
        previousRawPath: resolve(diff.previousOutDir, 'raw', `${diffItem.slug}.json`),
      });
      if (!draft) {
        items.push({ slug: diffItem.slug, status: 'skipped', reason: 'no-applicable-spec-change', changedPaths, ignoredPaths });
        continue;
      }
      const outputPath = resolve(updatesDir, `${diffItem.slug}.yaml`);
      await writeFile(outputPath, stringify(draft), 'utf8');
      outputs.push(outputPath);
      items.push({ slug: diffItem.slug, status: 'generated', path: outputPath, changedPaths, ignoredPaths });
    } catch (error) {
      items.push({
        slug: diffItem.slug,
        status: 'failed',
        reason: error instanceof Error ? error.message : String(error),
        changedPaths,
        ignoredPaths,
      });
    }
  }

  return {
    schemaVersion: 1,
    kind: 'collector-update-drafts',
    generatedAt: new Date().toISOString(),
    currentOutDir: diff.currentOutDir,
    previousOutDir: diff.previousOutDir,
    dataDir,
    requested: diff.items.length,
    generated: items.filter((item) => item.status === 'generated').length,
    skipped: items.filter((item) => item.status === 'skipped').length,
    failed: items.filter((item) => item.status === 'failed').length,
    outputs,
    items,
  };
}

export async function writeUpdateDraftReport(report: UpdateDraftReport): Promise<string> {
  const filePath = resolve(report.currentOutDir, 'updates', 'update-summary.json');
  await mkdir(resolve(report.currentOutDir, 'updates'), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return filePath;
}

async function readSeed(seedPath: string): Promise<ProductSeed> {
  const parsed = productSeedSchema.safeParse(parseYaml(await readFile(seedPath, 'utf8')));
  if (!parsed.success) {
    throw new Error(`正式 seed 校验失败：${parsed.error.issues.map((issue) => issue.message).join('；')}`);
  }
  return parsed.data;
}

function validateMergedSeed(seed: ProductSeed, artifact: CrawlArtifact, schema: SpecSchema | undefined): void {
  if (!schema) throw new Error(`类目 ${seed.category} 未找到 spec_schema`);
  const mergedSpecs = mergeSpecsPreservingMissing(seed.specs, artifact.adapter.normalizedSpecs);
  const validation = validateSpecs(schema, mergedSpecs);
  if (!validation.ok) {
    throw new Error(`更新后 specs 校验失败：${validation.issues.map((issue) => `${issue.path} ${issue.message}`).join('；')}`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
