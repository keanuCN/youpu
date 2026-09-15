import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { runCrawl } from './engine/crawler';
import { findRepositoryRoot, resolveOutputDir } from './engine/paths';
import { crawlTargetSchema, type CrawlTarget, type CrawlMode } from './engine/types';

const DEFAULT_USER_AGENT = 'youpu-collector/0.1 (+https://xiaopang.club/)';
const MIN_INTERVAL_MS = 2_000;

interface CliArgs {
  targetFile?: string;
  url?: string;
  slug?: string;
  category: string;
  brand?: string;
  model?: string;
  year?: number;
  mode: CrawlMode;
  representativeSize?: string;
  outDir: string;
  dataDir?: string;
  minIntervalMs: number;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const repositoryRoot = findRepositoryRoot();
  const targets = await loadTargets(args, repositoryRoot);
  const summary = await runCrawl(targets, {
    outDir: resolveOutputDir(args.outDir, repositoryRoot),
    dataDir: args.dataDir,
    userAgent: DEFAULT_USER_AGENT,
    minIntervalMs: args.minIntervalMs,
    maxRequestRetries: 1,
  });

  console.log(JSON.stringify(summary, null, 2));
  if (summary.failed > 0 || summary.blocked > 0) process.exitCode = 1;
}

function parseArgs(argv: string[]): CliArgs {
  const values = new Map<string, string>();
  const normalizedArgv = argv.filter((token) => token !== '--');
  for (let index = 0; index < normalizedArgv.length; index += 1) {
    const token = normalizedArgv[index];
    if (!token?.startsWith('--')) throw new Error(`无法识别参数：${token ?? ''}`);
    const key = token.slice(2);
    const value = normalizedArgv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`参数 --${key} 缺少值`);
    values.set(key, value);
    index += 1;
  }

  const minIntervalMs = values.has('min-interval-ms') ? Number(values.get('min-interval-ms')) : MIN_INTERVAL_MS;
  if (!Number.isInteger(minIntervalMs) || minIntervalMs < MIN_INTERVAL_MS) {
    throw new Error(`--min-interval-ms 必须是大于等于 ${MIN_INTERVAL_MS} 的整数`);
  }

  const mode = (values.get('mode') ?? 'cheerio') as CrawlMode;
  if (mode !== 'cheerio' && mode !== 'playwright') throw new Error('--mode 只能是 cheerio 或 playwright');

  return {
    targetFile: values.get('target-file'),
    url: values.get('url'),
    slug: values.get('slug'),
    category: values.get('category') ?? 'snowboard',
    brand: values.get('brand'),
    model: values.get('model'),
    year: values.has('year') ? Number(values.get('year')) : undefined,
    mode,
    representativeSize: values.get('representative-size'),
    outDir: values.get('out-dir') ?? 'data/tmp/collector',
    dataDir: values.get('data-dir'),
    minIntervalMs,
  };
}

async function loadTargets(args: CliArgs, repositoryRoot: string): Promise<CrawlTarget[]> {
  if (args.targetFile) {
    const filePath = resolve(repositoryRoot, args.targetFile);
    const parsed: unknown = JSON.parse(await readFile(filePath, 'utf8'));
    const values = Array.isArray(parsed) ? parsed : [parsed];
    return values.map((value) => crawlTargetSchema.parse(value));
  }

  if (!args.url || !args.brand || !args.model || !args.year) {
    throw new Error(
      '单条采集至少需要 --url、--brand、--model、--year；批量采集请使用 --target-file targets.json',
    );
  }
  const slug = args.slug ?? `${args.brand}-${args.model}-${args.year}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return [
    crawlTargetSchema.parse({
      slug,
      category: args.category,
      brand: args.brand,
      model: args.model,
      year: args.year,
      url: args.url,
      mode: args.mode,
      representativeSize: args.representativeSize,
    }),
  ];
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
