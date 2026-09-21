import type { ProductSeed } from '@youpu/schema';
import { z } from 'zod';

export const crawlModeSchema = z.enum(['cheerio', 'playwright']);

export const crawlTargetSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  category: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  identityAliases: z.array(z.string().min(1)).optional(),
  year: z.number().int().min(2000).max(2100),
  url: z.string().url(),
  mode: crawlModeSchema.default('cheerio'),
  representativeSize: z.string().min(1).optional(),
});

export type CrawlMode = z.infer<typeof crawlModeSchema>;
export type CrawlTarget = z.infer<typeof crawlTargetSchema>;

export interface RobotsResult {
  robotsUrl: string;
  fetchedAt: string;
  status: number | null;
  allowed: boolean;
  reason: string;
  matchedRule?: string;
}

export interface PageTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface PageSpecification {
  label: string;
  value: string;
}

export interface PageSnapshot {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  headings: string[];
  jsonLd: unknown[];
  tables: PageTable[];
  specifications: PageSpecification[];
  images: string[];
  imageAltTexts: string[];
}

export interface AdapterResult {
  normalizedSpecs: Record<string, unknown>;
  perSize?: Array<Record<string, unknown>>;
  sourceNotes: string[];
}

export interface CrawlArtifact {
  schemaVersion: 1;
  kind: 'product-crawl';
  capturedAt: string;
  target: CrawlTarget;
  source: {
    url: string;
    engine: CrawlMode;
    statusCode: number | null;
    robots: RobotsResult;
    userAgent: string;
  };
  page: PageSnapshot;
  adapter: {
    name: string;
    normalizedSpecs: Record<string, unknown>;
    perSize?: Array<Record<string, unknown>>;
    sourceNotes: string[];
  };
  draft?: ProductSeed;
  validation: {
    identityMatch: boolean;
    seasonMatch: boolean | null;
    specSchemaFound: boolean;
    partial: boolean;
    ok: boolean;
    issues: Array<{ path: string; message: string }>;
  };
}

export interface BlockedArtifact {
  schemaVersion: 1;
  kind: 'product-crawl-blocked';
  capturedAt: string;
  target: CrawlTarget;
  source: {
    url: string;
    robots: RobotsResult;
    userAgent: string;
  };
}

export interface FailureArtifact {
  schemaVersion: 1;
  kind: 'product-crawl-failure';
  capturedAt: string;
  target: CrawlTarget;
  source: {
    url: string;
    engine: CrawlMode;
    robots: RobotsResult;
    userAgent: string;
  };
  error: string;
}

export interface CrawlOptions {
  outDir: string;
  dataDir?: string;
  userAgent: string;
  minIntervalMs: number;
  maxRequestRetries: number;
  /** 自动通过模式下，为没有指定代表尺寸的目标选择标准宽度中位尺寸。 */
  autoSelectRepresentativeSize?: boolean;
}

export interface CrawlRunSummary {
  requested: number;
  blocked: number;
  succeeded: number;
  drafts: number;
  qualityFailed: number;
  failed: number;
  outputs: string[];
  draftPaths: string[];
}
