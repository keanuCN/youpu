import { access, readdir, readFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { productSeedSchema, type ProductSeed } from '@youpu/schema';
import { parse } from 'yaml';
import { findRepositoryRoot, resolveDataDir } from './engine/paths';
import type { ArtifactDiff, CrawlDiffReport } from './engine/diff';
import { summarizeArtifactDiff, type AuditComparisonSummary } from './engine/audit-comparison';

interface AuditOptions {
  draftDirs: string[];
  dataDir?: string;
  diffFile?: string;
}

interface AuditItem {
  slug: string;
  draftPath: string;
  validDraft: boolean;
  seedPath?: string;
  seedExists: boolean;
  seedValid?: boolean;
  draftFields: string[];
  seedFields: string[];
  missingFromDraft: string[];
  additionalInDraft: string[];
  changedFields: string[];
  comparison?: AuditComparisonSummary;
  errors: string[];
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const repositoryRoot = findRepositoryRoot();
  const dataDir = resolveDataDir(args.dataDir, repositoryRoot);
  const draftPaths = await collectDraftPaths(args.draftDirs.map((dir) => resolve(repositoryRoot, dir)));
  const diff = args.diffFile ? await readDiffReport(resolve(repositoryRoot, args.diffFile)) : undefined;
  const diffBySlug = new Map((diff?.items ?? []).map((item) => [item.slug, item]));
  const comparisonSummaries = diff?.items.map((item) => summarizeArtifactDiff(item)) ?? [];
  const items = await Promise.all(draftPaths.map((draftPath) => auditDraft(draftPath, dataDir, diffBySlug)));
  const report = {
    requested: items.length,
    validDrafts: items.filter((item) => item.validDraft).length,
    invalidDrafts: items.filter((item) => !item.validDraft).length,
    seedMatches: items.filter((item) => item.seedExists && item.seedValid).length,
    ...(diff
      ? {
          comparison: {
            diffFile: resolve(repositoryRoot, args.diffFile!),
            compared: comparisonSummaries.length,
            unchanged: comparisonSummaries.filter((item) => item.decision === 'unchanged').length,
            rawOnly: comparisonSummaries.filter((item) => item.decision === 'raw-only').length,
            reviewUpdates: comparisonSummaries.filter((item) => item.decision === 'review-update').length,
            newCandidates: comparisonSummaries.filter((item) => item.decision === 'new-candidate').length,
          },
        }
      : {}),
    items,
  };
  console.log(JSON.stringify(report, null, 2));
  if (report.invalidDrafts > 0 || items.some((item) => item.seedExists && item.seedValid === false)) {
    process.exitCode = 1;
  }
}

function parseArgs(argv: string[]): AuditOptions {
  const draftDirs: string[] = [];
  let dataDir: string | undefined;
  let diffFile: string | undefined;
  const normalizedArgv = argv.filter((token) => token !== '--');
  for (let index = 0; index < normalizedArgv.length; index += 1) {
    const token = normalizedArgv[index];
    if (!token?.startsWith('--')) throw new Error(`无法识别参数：${token ?? ''}`);
    const key = token.slice(2);
    const value = normalizedArgv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`参数 --${key} 缺少值`);
    if (key === 'draft-dir') draftDirs.push(value);
    else if (key === 'data-dir') dataDir = value;
    else if (key === 'diff-file') diffFile = value;
    else throw new Error(`无法识别参数：--${key}`);
    index += 1;
  }
  if (draftDirs.length === 0) throw new Error('至少需要一个 --draft-dir');
  return { draftDirs, dataDir, diffFile };
}

async function collectDraftPaths(draftDirs: string[]): Promise<string[]> {
  const paths: string[] = [];
  for (const directory of draftDirs) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.yaml')) paths.push(resolve(directory, entry.name));
    }
  }
  return [...new Set(paths)].sort();
}

async function auditDraft(
  draftPath: string,
  dataDir: string,
  diffBySlug: Map<string, ArtifactDiff>,
): Promise<AuditItem> {
  const errors: string[] = [];
  const draftSlug = basename(draftPath, '.yaml');
  const parsedDraft = productSeedSchema.safeParse(parse(await readFile(draftPath, 'utf8')));
  if (!parsedDraft.success) {
    return {
      slug: draftSlug,
      draftPath,
      validDraft: false,
      seedExists: false,
      draftFields: [],
      seedFields: [],
      missingFromDraft: [],
      additionalInDraft: [],
      changedFields: [],
      errors: parsedDraft.error.issues.map((issue) => `${issue.path.join('.')} ${issue.message}`),
    };
  }

  const draft = parsedDraft.data;
  const comparison = diffBySlug.get(draft.slug);
  const seedPath = resolve(dataDir, draft.category, `${draft.slug}.yaml`);
  const seedExists = await fileExists(seedPath);
  const draftFields = Object.keys(draft.specs).sort();
  if (!seedExists) {
    return {
      slug: draft.slug,
      draftPath,
      validDraft: true,
      seedPath,
      seedExists: false,
      draftFields,
      seedFields: [],
      missingFromDraft: [],
      additionalInDraft: draftFields,
      changedFields: [],
      ...(comparison ? { comparison: summarizeArtifactDiff(comparison) } : {}),
      errors,
    };
  }

  const parsedSeed = productSeedSchema.safeParse(parse(await readFile(seedPath, 'utf8')));
  if (!parsedSeed.success) {
    return {
      slug: draft.slug,
      draftPath,
      validDraft: true,
      seedPath,
      seedExists: true,
      seedValid: false,
      draftFields,
      seedFields: [],
      missingFromDraft: [],
      additionalInDraft: draftFields,
      changedFields: [],
      ...(comparison ? { comparison: summarizeArtifactDiff(comparison) } : {}),
      errors: parsedSeed.error.issues.map((issue) => `正式 seed ${issue.path.join('.')} ${issue.message}`),
    };
  }

  const seed = parsedSeed.data;
  const seedFields = Object.keys(seed.specs).sort();
  return {
    slug: draft.slug,
    draftPath,
    validDraft: true,
    seedPath,
    seedExists: true,
    seedValid: true,
    draftFields,
    seedFields,
    missingFromDraft: seedFields.filter((key) => !(key in draft.specs)),
    additionalInDraft: draftFields.filter((key) => !(key in seed.specs)),
    changedFields: draftFields.filter(
      (key) => key in seed.specs && JSON.stringify(draft.specs[key]) !== JSON.stringify(seed.specs[key]),
    ),
    ...(comparison ? { comparison: summarizeArtifactDiff(comparison) } : {}),
    errors,
  };
}

async function readDiffReport(path: string): Promise<CrawlDiffReport> {
  const parsed: unknown = JSON.parse(await readFile(path, 'utf8'));
  if (!isDiffReport(parsed)) throw new Error(`diff 文件格式无效：${path}`);
  return parsed;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function isDiffReport(value: unknown): value is CrawlDiffReport {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && (value as { kind?: unknown }).kind === 'collector-diff' && Array.isArray((value as { items?: unknown }).items);
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
