import { BadRequestException, ConflictException } from '@nestjs/common';
import { z } from 'zod';
import { productSeedSchema, type ProductSeed } from '@youpu/schema';

const changeSchema = z.object({
  path: z.string().min(1).max(256).refine(
    (path) => {
      const segments = path.replace(/^specs\./, '').split('.');
      return segments.every((segment) => segment.length > 0)
        && !segments.some((segment) => ['__proto__', 'prototype', 'constructor'].includes(segment));
    },
    '参数路径无效',
  ),
  kind: z.enum(['added', 'removed', 'changed']),
  previous: z.unknown(),
  current: z.unknown(),
});

const updateEnvelopeSchema = z.object({
  kind: z.literal('product-update-draft'),
  target: z.object({ slug: z.string().min(1) }),
  source: z.object({ originUrl: z.string().url() }),
  changes: z.array(changeSchema).min(1),
  ignoredChanges: z.array(changeSchema).default([]),
  product: productSeedSchema,
});

export type ParsedCollectorImport =
  | { kind: 'new'; product: ProductSeed; changes: []; ignoredChanges: []; source: { originUrl: string | null } }
  | {
      kind: 'update';
      product: ProductSeed;
      changes: z.infer<typeof changeSchema>[];
      ignoredChanges: z.infer<typeof changeSchema>[];
      source: { originUrl: string };
    };

export function assertCollectorChangesStillCurrent(
  existingSpecs: Record<string, unknown>,
  changes: z.infer<typeof changeSchema>[],
): void {
  const stalePaths = changes
    .filter((change) => change.kind !== 'removed')
    .filter((change) => {
      const path = change.path.replace(/^specs\./, '');
      const current = readPath(existingSpecs, path);
      if (change.kind === 'added') return current.exists;
      return !current.exists || stableJson(current.value) !== stableJson(change.previous);
    })
    .map((change) => change.path);
  if (stalePaths.length) {
    throw new ConflictException(`商品参数在采集后发生变化（${stalePaths.join('、')}），请重新采集后再审核`);
  }
}

export function applyCollectorChanges(
  existingSpecs: Record<string, unknown>,
  changes: z.infer<typeof changeSchema>[],
): Record<string, unknown> {
  const result = cloneRecord(existingSpecs);
  for (const change of changes) {
    if (change.kind === 'removed') continue;
    const path = change.path.replace(/^specs\./, '');
    setPath(result, path, change.current);
  }
  return result;
}

export function parseCollectorImportPayload(value: unknown): ParsedCollectorImport {
  if (!isRecord(value)) throw new BadRequestException('采集文件格式无效');

  if (value.kind === 'product-update-draft') {
    const parsed = updateEnvelopeSchema.safeParse(value);
    if (!parsed.success) {
      const detail = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('；');
      throw new BadRequestException(`更新草稿校验失败：${detail}`);
    }
    if (parsed.data.target.slug !== parsed.data.product.slug) {
      throw new BadRequestException('更新草稿 target.slug 与 product.slug 不一致');
    }
    return {
      kind: 'update',
      product: { ...parsed.data.product, status: 'draft' },
      changes: parsed.data.changes,
      ignoredChanges: parsed.data.ignoredChanges,
      source: { originUrl: parsed.data.source.originUrl },
    };
  }

  if ('kind' in value) throw new BadRequestException('不支持此采集文件格式');
  const parsed = productSeedSchema.safeParse(value);
  if (!parsed.success) {
    const detail = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('；');
    throw new BadRequestException(`商品草稿校验失败：${detail}`);
  }
  return {
    kind: 'new',
    product: { ...parsed.data, status: 'draft' },
    changes: [],
    ignoredChanges: [],
    source: { originUrl: parsed.data.data_source?.origin_url ?? null },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readPath(value: unknown, path: string): { exists: boolean; value: unknown } {
  let current = value;
  for (const segment of path.split('.')) {
    if (!isRecord(current) || !Object.prototype.hasOwnProperty.call(current, segment)) return { exists: false, value: undefined };
    current = current[segment];
  }
  return { exists: true, value: current };
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (isRecord(value)) {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value) ?? 'undefined';
}

function cloneRecord(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, cloneValue(child)]));
}

function cloneValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(cloneValue);
  if (isRecord(value)) return cloneRecord(value);
  return value;
}

function setPath(target: Record<string, unknown>, path: string, value: unknown): void {
  const segments = path.split('.');
  let current = target;
  for (const segment of segments.slice(0, -1)) {
    const child = current[segment];
    if (!isRecord(child)) current[segment] = {};
    current = current[segment] as Record<string, unknown>;
  }
  const leaf = segments.at(-1);
  if (leaf) current[leaf] = cloneValue(value);
}
