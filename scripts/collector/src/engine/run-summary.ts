import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { ApprovalReport } from './approval';
import type { CrawlRunSummary, CrawlTarget } from './types';

export interface CollectorRunSummary {
  schemaVersion: 1;
  kind: 'collector-run';
  status: 'completed' | 'needs-review';
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  outDir: string;
  targetFile: string | null;
  options: {
    dataDir: string | null;
    minIntervalMs: number;
    autoApprove: boolean;
    userAgent: string;
  };
  targets: Array<{
    slug: string;
    category: string;
    brand: string;
    model: string;
    year: number;
    url: string;
    mode: CrawlTarget['mode'];
    representativeSize?: string;
  }>;
  crawl: CrawlRunSummary;
  approval?: ApprovalReport;
  comparison?: {
    previousOutDir: string;
    diffPath: string;
    updateSummaryPath: string;
    updateDraftPaths: string[];
    updateDrafts: {
      generated: number;
      skipped: number;
      failed: number;
    };
    new: number;
    changed: number;
    unchanged: number;
  };
  outputPaths: string[];
}

export interface BuildRunSummaryInput {
  startedAt: string;
  finishedAt: string;
  outDir: string;
  targetFile?: string;
  dataDir?: string;
  minIntervalMs: number;
  autoApprove: boolean;
  userAgent: string;
  targets: CrawlTarget[];
  crawl: CrawlRunSummary;
  approval?: ApprovalReport;
  comparison?: CollectorRunSummary['comparison'];
}

export function buildRunSummary(input: BuildRunSummaryInput): CollectorRunSummary {
  const durationMs = Math.max(0, Date.parse(input.finishedAt) - Date.parse(input.startedAt));
  const needsReview =
    input.crawl.blocked > 0 ||
    input.crawl.qualityFailed > 0 ||
    input.crawl.failed > 0 ||
    (input.approval?.failed ?? 0) > 0 ||
    (input.comparison?.updateDrafts.generated ?? 0) > 0 ||
    (input.comparison?.updateDrafts.failed ?? 0) > 0;

  return {
    schemaVersion: 1,
    kind: 'collector-run',
    status: needsReview ? 'needs-review' : 'completed',
    startedAt: input.startedAt,
    finishedAt: input.finishedAt,
    durationMs,
    outDir: input.outDir,
    targetFile: input.targetFile ?? null,
    options: {
      dataDir: input.dataDir ?? null,
      minIntervalMs: input.minIntervalMs,
      autoApprove: input.autoApprove,
      userAgent: input.userAgent,
    },
    targets: input.targets.map((target) => ({
      slug: target.slug,
      category: target.category,
      brand: target.brand,
      model: target.model,
      year: target.year,
      url: target.url,
      mode: target.mode,
      ...(target.representativeSize ? { representativeSize: target.representativeSize } : {}),
    })),
    crawl: input.crawl,
    ...(input.approval ? { approval: input.approval } : {}),
    ...(input.comparison ? { comparison: input.comparison } : {}),
    outputPaths: [
      ...new Set([
        ...input.crawl.outputs,
        ...(input.approval?.outputs ?? []),
        ...(input.comparison
          ? [input.comparison.diffPath, input.comparison.updateSummaryPath, ...input.comparison.updateDraftPaths]
          : []),
      ]),
    ],
  };
}

export async function writeRunSummary(summary: CollectorRunSummary): Promise<string> {
  const filePath = resolve(summary.outDir, 'run-summary.json');
  await mkdir(summary.outDir, { recursive: true });
  await writeFile(filePath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  return filePath;
}
