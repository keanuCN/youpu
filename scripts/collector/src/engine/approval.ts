import { access, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { productSeedSchema, validateSpecs, type ProductSeed } from '@youpu/schema';
import { parse as parseYaml, stringify } from 'yaml';
import { loadCategorySchema } from './draft';
import { resolveDataDir } from './paths';

export interface ApprovalOptions {
  dataDir?: string;
  /** 自动通过默认发布；保留参数是为了后续需要只落 draft 时复用同一管线。 */
  status?: ProductSeed['status'];
}

export interface ApprovalReport {
  requested: number;
  approved: number;
  skipped: number;
  failed: number;
  outputs: string[];
  skippedPaths: string[];
  errors: string[];
}

/**
 * 将本次采集产生的、已经通过采集质量闸门的草稿自动写入正式 seed 目录。
 * 仍然执行完整 specs 校验，并要求存在对应 raw 审计文件；已有正式 seed 不覆盖。
 */
export async function approveDrafts(
  draftPaths: string[],
  options: ApprovalOptions = {},
): Promise<ApprovalReport> {
  const report: ApprovalReport = {
    requested: draftPaths.length,
    approved: 0,
    skipped: 0,
    failed: 0,
    outputs: [],
    skippedPaths: [],
    errors: [],
  };
  const dataDir = resolveDataDir(options.dataDir);
  const uniquePaths = [...new Set(draftPaths)];

  for (const draftPath of uniquePaths) {
    try {
      const result = await approveOneDraft(draftPath, dataDir, options.status ?? 'published');
      if (result.kind === 'approved') {
        report.approved += 1;
        report.outputs.push(result.path);
      } else {
        report.skipped += 1;
        report.skippedPaths.push(`${result.path}：${result.reason}`);
      }
    } catch (error) {
      report.failed += 1;
      report.errors.push(`${draftPath}：${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return report;
}

async function approveOneDraft(
  draftPath: string,
  dataDir: string,
  status: ProductSeed['status'],
): Promise<{ kind: 'approved'; path: string } | { kind: 'skipped'; path: string; reason: string }> {
  const draft = productSeedSchema.safeParse(parseYaml(await readFile(draftPath, 'utf8')));
  if (!draft.success) {
    throw new Error(`草稿 schema 校验失败：${draft.error.issues.map((issue) => issue.message).join('; ')}`);
  }
  const seed = draft.data;
  if (Object.keys(seed.specs).length === 0) throw new Error('草稿没有可导入的 specs');

  const categorySchema = await loadCategorySchema(seed.category, dataDir);
  if (!categorySchema) throw new Error(`类目 ${seed.category} 未找到 spec_schema`);
  const specValidation = validateSpecs(categorySchema, seed.specs);
  if (!specValidation.ok) {
    throw new Error(
      `完整 specs 校验失败：${specValidation.issues.map((issue) => `${issue.path} ${issue.message}`).join('; ')}`,
    );
  }

  await verifyRawArtifact(draftPath, seed.slug);

  const categoryDir = resolve(dataDir, seed.category);
  const destination = resolve(categoryDir, `${seed.slug}.yaml`);
  if (!destination.startsWith(`${categoryDir}${sep}`) && !destination.startsWith(`${categoryDir}/`)) {
    throw new Error('目标路径越界');
  }
  if (await exists(destination)) {
    return { kind: 'skipped', path: destination, reason: '正式 seed 已存在，默认不覆盖' };
  }

  const approvedSeed = productSeedSchema.parse({ ...seed, status });
  await mkdir(categoryDir, { recursive: true });
  const tempPath = `${destination}.${process.pid}.tmp`;
  await writeFile(tempPath, stringify(approvedSeed), 'utf8');
  await rename(tempPath, destination);
  return { kind: 'approved', path: destination };
}

async function verifyRawArtifact(draftPath: string, slug: string): Promise<void> {
  const rawPath = resolve(dirname(draftPath), '..', 'raw', `${slug}.json`);
  let raw: unknown;
  try {
    raw = JSON.parse(await readFile(rawPath, 'utf8')) as unknown;
  } catch {
    throw new Error(`缺少对应 raw 审计文件：${rawPath}`);
  }
  if (!isRecord(raw) || raw.kind !== 'product-crawl') throw new Error('对应 raw 不是 product-crawl artifact');
  const validation = raw.validation;
  if (!isRecord(validation) || validation.ok !== true) throw new Error('raw artifact 未通过采集质量闸门');
  const target = raw.target;
  if (!isRecord(target) || target.slug !== slug) throw new Error('raw artifact 与草稿 slug 不一致');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
