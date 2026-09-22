import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { runCrawl } from './engine/crawler';
import { approveDrafts } from './engine/approval';
import { findRepositoryRoot, resolveDataDir, resolveOutputDir } from './engine/paths';
import { buildRunSummary, writeRunSummary } from './engine/run-summary';
import { compareRawRuns, writeDiffReport } from './engine/diff';
import { generateUpdateDrafts, writeUpdateDraftReport } from './engine/update-draft';
import { updateTargetLedger } from './engine/ledger';
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
  autoApprove: boolean;
  previousOutDir?: string;
  ledgerPath?: string;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const repositoryRoot = findRepositoryRoot();
  const targets = await loadTargets(args, repositoryRoot);
  const startedAt = new Date().toISOString();
  const outDir = resolveOutputDir(args.outDir, repositoryRoot);
  const summary = await runCrawl(targets, {
    outDir,
    dataDir: args.dataDir,
    userAgent: DEFAULT_USER_AGENT,
    minIntervalMs: args.minIntervalMs,
    maxRequestRetries: 1,
    autoSelectRepresentativeSize: args.autoApprove,
  });

  const comparison = args.previousOutDir
    ? await buildComparison(
        outDir,
        resolveOutputDir(args.previousOutDir, repositoryRoot),
        resolveDataDir(args.dataDir, repositoryRoot),
      )
    : undefined;

  const approval = args.autoApprove
    ? await approveDrafts(summary.draftPaths, { dataDir: args.dataDir, status: 'published' })
    : undefined;

  const finishedAt = new Date().toISOString();
  const ledgerPath = resolveOutputDir(args.ledgerPath ?? 'data/tmp/collector-target-ledger.json', repositoryRoot);
  await updateTargetLedger({
    ledgerPath,
    outDir,
    dataDir: resolveDataDir(args.dataDir, repositoryRoot),
    targets,
    finishedAt,
  });

  const runSummary = buildRunSummary({
    startedAt,
    finishedAt,
    outDir,
    targetFile: args.targetFile,
    dataDir: args.dataDir,
    minIntervalMs: args.minIntervalMs,
    autoApprove: args.autoApprove,
    userAgent: DEFAULT_USER_AGENT,
    targets,
    crawl: summary,
    approval,
    ledgerPath,
    comparison,
  });
  const runSummaryPath = await writeRunSummary(runSummary);

  console.log(JSON.stringify(approval ? { crawl: summary, approval, comparison, runSummaryPath } : { ...summary, comparison, runSummaryPath }, null, 2));
  if (
    summary.failed > 0 ||
    summary.blocked > 0 ||
    approval?.failed
  ) process.exitCode = 1;
}

function parseArgs(argv: string[]): CliArgs {
  const values = new Map<string, string>();
  const normalizedArgv = argv.filter((token) => token !== '--');
  const booleanFlags = new Set(['auto-approve']);
  for (let index = 0; index < normalizedArgv.length; index += 1) {
    const token = normalizedArgv[index];
    if (!token?.startsWith('--')) throw new Error(`无法识别参数：${token ?? ''}`);
    const key = token.slice(2);
    if (booleanFlags.has(key)) {
      values.set(key, 'true');
      continue;
    }
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
    autoApprove: values.has('auto-approve'),
    previousOutDir: values.get('previous-out-dir'),
    ledgerPath: values.get('ledger-path'),
  };
}

async function buildComparison(
  currentOutDir: string,
  previousOutDir: string,
  dataDir: string,
): Promise<NonNullable<Awaited<ReturnType<typeof buildRunSummary>>['comparison']>> {
  const report = await compareRawRuns(currentOutDir, previousOutDir);
  const diffPath = await writeDiffReport(report);
  const updateReport = await generateUpdateDrafts({ diff: report, dataDir });
  const updateSummaryPath = await writeUpdateDraftReport(updateReport);
  return {
    previousOutDir,
    diffPath,
    updateSummaryPath,
    updateDraftPaths: updateReport.outputs,
    updateDrafts: {
      generated: updateReport.generated,
      skipped: updateReport.skipped,
      failed: updateReport.failed,
    },
    new: report.new,
    changed: report.changed,
    unchanged: report.unchanged,
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
