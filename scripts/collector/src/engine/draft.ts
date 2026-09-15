import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { productSeedSchema, parseSpecSchema, validateSpecs, type SpecSchema } from '@youpu/schema';
import { parse, stringify } from 'yaml';
import { findRepositoryRoot, resolveDataDir } from './paths';
import type {
  AdapterResult,
  BlockedArtifact,
  CrawlArtifact,
  CrawlTarget,
  FailureArtifact,
  PageSnapshot,
  RobotsResult,
} from './types';
import { readFile } from 'node:fs/promises';

interface CategoryRecord {
  slug: string;
  spec_schema?: unknown;
}

export async function buildArtifact(
  target: CrawlTarget,
  snapshot: PageSnapshot,
  adapterName: string,
  adapterResult: AdapterResult,
  source: CrawlArtifact['source'],
  dataDir?: string,
): Promise<CrawlArtifact> {
  const schema = await loadCategorySchema(target.category, dataDir);
  const specValidation = schema
    ? validateSpecs(schema, adapterResult.normalizedSpecs, { partial: true })
    : { ok: false, issues: [{ path: 'category', message: `未找到类目 ${target.category} 的 spec_schema` }] };
  const identityMatch = targetIdentityMatches(target, snapshot);
  const seasonMatch = targetSeasonMatches(target, snapshot);
  const validationIssues = [...specValidation.issues];
  if (!identityMatch) {
    validationIssues.push({
      path: 'source.identity',
      message: `页面内容未确认包含目标型号“${target.model}”，可能发生重定向、错季节或链接失效`,
    });
  }
  if (seasonMatch === false) {
    validationIssues.push({
      path: 'source.season',
      message: `页面显式年份与目标 ${target.year} 不一致，不能把当前页面当作历史季节数据`,
    });
  }
  const validationOk = identityMatch && seasonMatch !== false && specValidation.ok;

  const artifact: CrawlArtifact = {
    schemaVersion: 1,
    kind: 'product-crawl',
    capturedAt: new Date().toISOString(),
    target,
    source,
    page: snapshot,
    adapter: {
      name: adapterName,
      normalizedSpecs: adapterResult.normalizedSpecs,
      perSize: adapterResult.perSize,
      sourceNotes: adapterResult.sourceNotes,
    },
    validation: {
      identityMatch,
      seasonMatch,
      specSchemaFound: schema !== undefined,
      partial: true,
      ok: validationOk,
      issues: validationIssues,
    },
  };

  if (schema && validationOk) {
    const seed = productSeedSchema.safeParse({
      slug: target.slug,
      category: target.category,
      brand: target.brand,
      model: target.model,
      year: target.year,
      title: snapshot.title ?? target.model,
      specs: adapterResult.normalizedSpecs,
      // 图片 URL 只留在 raw 页面快照；授权和 base/face/side 归类必须人工确认。
      images: [],
      data_source: { kind: 'crawl', origin_url: target.url },
      status: 'draft',
    });
    if (seed.success) {
      artifact.draft = seed.data;
    } else {
      artifact.validation.ok = false;
      artifact.validation.issues = seed.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
    }
  }

  return artifact;
}

function targetIdentityMatches(target: CrawlTarget, snapshot: PageSnapshot): boolean {
  const searchable = normalizeSearchText(
    [snapshot.title, ...snapshot.headings, ...snapshot.jsonLd.map((value) => JSON.stringify(value))]
      .filter(Boolean)
      .join(' '),
  );
  const searchableTokens = new Set(searchable.split(' '));
  const modelTokens = normalizeSearchText(target.model).split(' ').filter((token) => token.length >= 2);
  return modelTokens.length > 0 && modelTokens.every((token) => searchableTokens.has(token));
}

function targetSeasonMatches(target: CrawlTarget, snapshot: PageSnapshot): boolean | null {
  const evidence = [snapshot.title, ...snapshot.headings].filter(Boolean).join(' ');
  const years = new Set(
    [...evidence.matchAll(/\b20\d{2}\b/g)].map((match) => Number(match[0])),
  );
  if (years.size === 0) return null;
  return years.has(target.year);
}

function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function blockedArtifact(target: CrawlTarget, robots: RobotsResult, userAgent: string): BlockedArtifact {
  return {
    schemaVersion: 1,
    kind: 'product-crawl-blocked',
    capturedAt: new Date().toISOString(),
    target,
    source: { url: target.url, robots, userAgent },
  };
}

export function failureArtifact(
  target: CrawlTarget,
  robots: RobotsResult,
  userAgent: string,
  engine: CrawlArtifact['source']['engine'],
  error: unknown,
): FailureArtifact {
  return {
    schemaVersion: 1,
    kind: 'product-crawl-failure',
    capturedAt: new Date().toISOString(),
    target,
    source: { url: target.url, engine, robots, userAgent },
    error: error instanceof Error ? error.message : String(error),
  };
}

export async function writeRawArtifact(artifact: CrawlArtifact | BlockedArtifact | FailureArtifact, outDir: string): Promise<string> {
  const filePath = resolve(outDir, 'raw', `${artifact.target.slug}.json`);
  await mkdir(resolve(outDir, 'raw'), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  return filePath;
}

export async function writeDraftArtifact(artifact: CrawlArtifact, outDir: string): Promise<string | undefined> {
  if (!artifact.draft || !artifact.validation.ok || Object.keys(artifact.draft.specs).length === 0) return undefined;
  const filePath = resolve(outDir, 'drafts', `${artifact.target.slug}.yaml`);
  await mkdir(resolve(outDir, 'drafts'), { recursive: true });
  await writeFile(filePath, stringify(artifact.draft), 'utf8');
  return filePath;
}

async function loadCategorySchema(category: string, dataDir?: string): Promise<SpecSchema | undefined> {
  const repositoryRoot = findRepositoryRoot();
  const categoryFile = resolve(resolveDataDir(dataDir, repositoryRoot), 'categories.yaml');
  const source = await readFile(categoryFile, 'utf8');
  const records = parse(source) as CategoryRecord[];
  const record = records.find((item) => item.slug === category);
  if (!record?.spec_schema) return undefined;
  return parseSpecSchema(record.spec_schema);
}
