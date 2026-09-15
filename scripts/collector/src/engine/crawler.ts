import { CheerioCrawler, PlaywrightCrawler } from 'crawlee';
import { findCategoryAdapter } from '../categories/snowboard';
import { buildArtifact, blockedArtifact, failureArtifact, writeDraftArtifact, writeRawArtifact } from './draft';
import { snapshotFromHtml } from './jsonld';
import { DomainRateLimiter } from './rate-limit';
import { chooseAutomaticRepresentativeSize } from './representative';
import { checkRobots } from './robots';
import type { CrawlArtifact, CrawlOptions, CrawlRunSummary, CrawlTarget, RobotsResult } from './types';

export async function runCrawl(targets: CrawlTarget[], options: CrawlOptions): Promise<CrawlRunSummary> {
  const limiter = new DomainRateLimiter();
  const robotsByUrl = new Map<string, RobotsResult>();
  const outputs: string[] = [];
  const allowedTargets: CrawlTarget[] = [];
  let blocked = 0;
  const succeeded = new Set<string>();
  const drafts = new Set<string>();
  const draftPaths: string[] = [];
  const qualityFailed = new Set<string>();

  for (const target of targets) {
    await limiter.waitFor(target.url, options.minIntervalMs);
    const robots = await checkRobots(target.url, options.userAgent);
    robotsByUrl.set(target.url, robots);
    if (!robots.allowed) {
      const output = await writeRawArtifact(blockedArtifact(target, robots, options.userAgent), options.outDir);
      outputs.push(output);
      blocked += 1;
      continue;
    }
    allowedTargets.push(target);
  }

  const failedBeforeCrawl = new Set<string>();
  for (const mode of ['cheerio', 'playwright'] as const) {
    const modeTargets = allowedTargets.filter((target) => (target.mode ?? 'cheerio') === mode);
    if (modeTargets.length === 0) continue;

    if (mode === 'cheerio') {
      await runCheerio(
        modeTargets,
        options,
        robotsByUrl,
        limiter,
        outputs,
        succeeded,
        drafts,
        draftPaths,
        qualityFailed,
        failedBeforeCrawl,
      );
    } else {
      await runPlaywright(
        modeTargets,
        options,
        robotsByUrl,
        limiter,
        outputs,
        succeeded,
        drafts,
        draftPaths,
        qualityFailed,
        failedBeforeCrawl,
      );
    }
  }

  return {
    requested: targets.length,
    blocked,
    succeeded: succeeded.size,
    drafts: drafts.size,
    qualityFailed: qualityFailed.size,
    failed: failedBeforeCrawl.size,
    outputs,
    draftPaths,
  };
}

async function runCheerio(
  targets: CrawlTarget[],
  options: CrawlOptions,
  robotsByUrl: Map<string, RobotsResult>,
  limiter: DomainRateLimiter,
  outputs: string[],
  succeeded: Set<string>,
  drafts: Set<string>,
  draftPaths: string[],
  qualityFailed: Set<string>,
  failed: Set<string>,
): Promise<void> {
  const crawler = new CheerioCrawler({
    maxConcurrency: 1,
    maxRequestsPerCrawl: targets.length,
    maxRequestRetries: options.maxRequestRetries,
    sameDomainDelaySecs: options.minIntervalMs / 1000,
    respectRobotsTxtFile: { userAgent: options.userAgent },
    requestHandler: async ({ request, $, response }) => {
      const target = request.userData.target as CrawlTarget;
      await limiter.waitFor(target.url, options.minIntervalMs);
      const snapshot = snapshotFromHtml($.root().html() ?? '', target.url);
      const artifact = await makeArtifact(target, snapshot, 'cheerio', response?.statusCode ?? null, robotsByUrl, options);
      if (artifact.validation.ok) succeeded.add(target.slug);
      else qualityFailed.add(target.slug);
      outputs.push(await writeRawArtifact(artifact, options.outDir));
      const draft = await writeDraftArtifact(artifact, options.outDir);
      if (draft) {
        drafts.add(target.slug);
        draftPaths.push(draft);
        outputs.push(draft);
      }
    },
    failedRequestHandler: async ({ request, error }) => {
      const target = request.userData.target as CrawlTarget;
      failed.add(target.slug);
      outputs.push(
        await writeRawArtifact(
          failureArtifact(target, robotsByUrl.get(target.url)!, options.userAgent, 'cheerio', error),
          options.outDir,
        ),
      );
    },
  });

  await crawler.run(
    targets.map((target) => ({ url: target.url, userData: { target } })),
  );
}

async function runPlaywright(
  targets: CrawlTarget[],
  options: CrawlOptions,
  robotsByUrl: Map<string, RobotsResult>,
  limiter: DomainRateLimiter,
  outputs: string[],
  succeeded: Set<string>,
  drafts: Set<string>,
  draftPaths: string[],
  qualityFailed: Set<string>,
  failed: Set<string>,
): Promise<void> {
  const crawler = new PlaywrightCrawler({
    maxConcurrency: 1,
    maxRequestsPerCrawl: targets.length,
    maxRequestRetries: options.maxRequestRetries,
    sameDomainDelaySecs: options.minIntervalMs / 1000,
    respectRobotsTxtFile: { userAgent: options.userAgent },
    launchContext: { launchOptions: { headless: true } },
    requestHandler: async ({ request, page, response }) => {
      const target = request.userData.target as CrawlTarget;
      await limiter.waitFor(target.url, options.minIntervalMs);
      const html = await page.content();
      const snapshot = snapshotFromHtml(html, target.url);
      const statusCode = response ? response.status() : null;
      const artifact = await makeArtifact(target, snapshot, 'playwright', statusCode, robotsByUrl, options);
      if (artifact.validation.ok) succeeded.add(target.slug);
      else qualityFailed.add(target.slug);
      outputs.push(await writeRawArtifact(artifact, options.outDir));
      const draft = await writeDraftArtifact(artifact, options.outDir);
      if (draft) {
        drafts.add(target.slug);
        draftPaths.push(draft);
        outputs.push(draft);
      }
    },
    failedRequestHandler: async ({ request, error }) => {
      const target = request.userData.target as CrawlTarget;
      failed.add(target.slug);
      outputs.push(
        await writeRawArtifact(
          failureArtifact(target, robotsByUrl.get(target.url)!, options.userAgent, 'playwright', error),
          options.outDir,
        ),
      );
    },
  });

  await crawler.run(
    targets.map((target) => ({ url: target.url, userData: { target } })),
  );
}

async function makeArtifact(
  target: CrawlTarget,
  snapshot: ReturnType<typeof snapshotFromHtml>,
  engine: CrawlArtifact['source']['engine'],
  statusCode: number | null,
  robotsByUrl: Map<string, RobotsResult>,
  options: CrawlOptions,
): Promise<CrawlArtifact> {
  const adapter = findCategoryAdapter(target);
  let effectiveTarget = target;
  let adapterResult = adapter.normalize(target, snapshot);
  if (options.autoSelectRepresentativeSize && !target.representativeSize) {
    const representativeSize = chooseAutomaticRepresentativeSize(adapterResult.perSize);
    if (representativeSize) {
      effectiveTarget = { ...target, representativeSize };
      adapterResult = adapter.normalize(effectiveTarget, snapshot);
      adapterResult = {
        ...adapterResult,
        sourceNotes: [
          ...adapterResult.sourceNotes,
          `自动通过模式按标准宽度中位策略选择代表尺寸 ${representativeSize}；未覆盖宽版。`,
        ],
      };
    }
  }
  return buildArtifact(
    effectiveTarget,
    snapshot,
    adapter.name,
    adapterResult,
    {
      url: target.url,
      engine,
      statusCode,
      robots: robotsByUrl.get(target.url)!,
      userAgent: options.userAgent,
    },
    options.dataDir,
  );
}
