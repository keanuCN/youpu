import { access, readdir, readFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { productSeedSchema, type ProductSeed } from '@youpu/schema';
import { parse } from 'yaml';
import { findRepositoryRoot, resolveDataDir } from './engine/paths';

interface AuditOptions {
  draftDirs: string[];
  dataDir?: string;
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
  errors: string[];
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const repositoryRoot = findRepositoryRoot();
  const dataDir = resolveDataDir(args.dataDir, repositoryRoot);
  const draftPaths = await collectDraftPaths(args.draftDirs.map((dir) => resolve(repositoryRoot, dir)));
  const items = await Promise.all(draftPaths.map((draftPath) => auditDraft(draftPath, dataDir)));
  const report = {
    requested: items.length,
    validDrafts: items.filter((item) => item.validDraft).length,
    invalidDrafts: items.filter((item) => !item.validDraft).length,
    seedMatches: items.filter((item) => item.seedExists && item.seedValid).length,
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
  const normalizedArgv = argv.filter((token) => token !== '--');
  for (let index = 0; index < normalizedArgv.length; index += 1) {
    const token = normalizedArgv[index];
    if (!token?.startsWith('--')) throw new Error(`无法识别参数：${token ?? ''}`);
    const key = token.slice(2);
    const value = normalizedArgv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`参数 --${key} 缺少值`);
    if (key === 'draft-dir') draftDirs.push(value);
    else if (key === 'data-dir') dataDir = value;
    else throw new Error(`无法识别参数：--${key}`);
    index += 1;
  }
  if (draftDirs.length === 0) throw new Error('至少需要一个 --draft-dir');
  return { draftDirs, dataDir };
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

async function auditDraft(draftPath: string, dataDir: string): Promise<AuditItem> {
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
    errors,
  };
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
