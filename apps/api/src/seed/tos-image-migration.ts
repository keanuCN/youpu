import { createHash, randomUUID } from 'node:crypto';
import { lstat, mkdir, readdir, readFile, realpath, rename, writeFile } from 'node:fs/promises';
import { basename, dirname, relative, resolve, sep } from 'node:path';
import { parseDocument } from 'yaml';
import { z } from 'zod';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const DOWNLOAD_TIMEOUT_MS = 20_000;
const IMAGE_CONTENT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export type ImageMigrationStatus = 'pending' | 'done' | 'failed';

export interface ImageMigrationEntry {
  id: string;
  file: string;
  productSlug: string;
  imageIndex: number;
  originalUrl: string;
  sourceNote: string;
  approved: boolean;
  status: ImageMigrationStatus;
  migratedUrl?: string;
  error?: string;
}

export interface ImageMigrationManifest {
  version: 1;
  createdAt: string;
  publicBaseUrl: string;
  entries: ImageMigrationEntry[];
}

export interface DownloadedImage {
  buffer: Buffer;
  contentType: string;
}

export interface ApplyImageMigrationOptions {
  dataDir: string;
  fetchImage: (url: string) => Promise<DownloadedImage>;
  upload: (buffer: Buffer, contentType: string) => Promise<{ url: string }>;
  onEntryUpdated?: (manifest: ImageMigrationManifest) => Promise<void>;
}

export type ImageMigrationCommand =
  | { mode: 'plan'; outputPath: string }
  | { mode: 'apply'; manifestPath: string };

const migrationEntrySchema = z.object({
  id: z.string().min(1),
  file: z.string().min(1),
  productSlug: z.string().min(1),
  imageIndex: z.number().int().nonnegative(),
  originalUrl: z.string().url().refine(isHttpsUrl, '只允许 HTTPS 原始地址'),
  sourceNote: z.string(),
  approved: z.boolean(),
  status: z.enum(['pending', 'done', 'failed']),
  migratedUrl: z.string().url().optional(),
  error: z.string().optional(),
});

const migrationManifestSchema = z.object({
  version: z.literal(1),
  createdAt: z.string().datetime(),
  publicBaseUrl: z.string().url().refine(isHttpsUrl, 'TOS 公共地址必须使用 HTTPS'),
  entries: z.array(migrationEntrySchema),
});

export function parseImageMigrationManifest(value: unknown): ImageMigrationManifest {
  return migrationManifestSchema.parse(value);
}

export async function resolveImageMigrationManifestPath(dataDir: string, requestedPath: string): Promise<string> {
  const root = resolve(dataDir);
  const output = resolve(requestedPath);
  const temporaryDir = resolve(root, 'tmp');
  if (dirname(output) !== temporaryDir || !output.toLowerCase().endsWith('.json')) {
    throw new Error('迁移清单只能保存为 data/tmp/ 下的 JSON 文件');
  }

  await mkdir(temporaryDir, { recursive: true });
  const realRoot = await realpath(root);
  const realTemporaryDir = await realpath(temporaryDir);
  if (realTemporaryDir !== resolve(realRoot, 'tmp')) throw new Error('迁移清单目录不能指向 data 目录之外或其他目录');
  try {
    const target = await lstat(output);
    if (target.isSymbolicLink() || !target.isFile()) throw new Error('迁移清单目标必须是普通 JSON 文件，不能是链接');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
  return output;
}

export function assertImageMigrationTarget(manifest: ImageMigrationManifest, configuredPublicBaseUrl: string): void {
  if (normalizeBaseUrl(manifest.publicBaseUrl) !== normalizeBaseUrl(configuredPublicBaseUrl)) {
    throw new Error('迁移清单的 TOS 公共地址与当前 API 配置不一致；请重新生成清单');
  }
}

export async function createImageMigrationManifest(
  dataDir: string,
  publicBaseUrl: string,
): Promise<ImageMigrationManifest> {
  const root = await realpath(dataDir);
  const publicBase = normalizeBaseUrl(publicBaseUrl);
  const entries: ImageMigrationEntry[] = [];
  const categories = await readdir(root, { withFileTypes: true });

  for (const category of categories.filter((entry) => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const categoryDir = resolve(root, category.name);
    const files = await readdir(categoryDir, { withFileTypes: true });
    for (const fileEntry of files.filter((entry) => entry.isFile() && /\.ya?ml$/i.test(entry.name)).sort((a, b) => a.name.localeCompare(b.name))) {
      const absoluteFile = resolve(categoryDir, fileEntry.name);
      const document = parseDocument(await readFile(absoluteFile, 'utf8'));
      if (document.errors.length) throw new Error(`无法解析 ${relative(root, absoluteFile)}：${document.errors.map((error) => error.message).join('; ')}`);
      const product = document.toJS() as { slug?: unknown; images?: unknown };
      const productSlug = product.slug;
      const images = product.images;
      if (typeof productSlug !== 'string' || !Array.isArray(images)) continue;
      const relativeFile = toManifestPath(relative(root, absoluteFile));

      images.forEach((image, imageIndex) => {
        if (!image || typeof image !== 'object' || Array.isArray(image)) return;
        const imageRecord = image as Record<string, unknown>;
        const originalUrl = imageRecord.url;
        if (typeof originalUrl !== 'string' || !isHttpsUrl(originalUrl) || isSameOrigin(originalUrl, publicBase)) return;
        const sourceNote = imageRecord.source;
        const id = createHash('sha256').update(`${relativeFile}\0${imageIndex}\0${originalUrl}`).digest('hex').slice(0, 24);
        entries.push({
          id,
          file: relativeFile,
          productSlug,
          imageIndex,
          originalUrl,
          sourceNote: typeof sourceNote === 'string' ? sourceNote : '',
          approved: false,
          status: 'pending',
        });
      });
    }
  }

  return { version: 1, createdAt: new Date().toISOString(), publicBaseUrl: publicBase, entries };
}

export async function applyImageMigrationManifest(
  manifest: ImageMigrationManifest,
  options: ApplyImageMigrationOptions,
): Promise<ImageMigrationManifest> {
  manifest = parseImageMigrationManifest(manifest);
  const root = await realpath(options.dataDir);
  const publicBase = normalizeBaseUrl(manifest.publicBaseUrl);

  for (const entry of manifest.entries) {
    if (!entry.approved || entry.status === 'done' || (entry.status !== 'pending' && entry.status !== 'failed')) continue;
    try {
      const absoluteFile = await resolveManifestFile(root, entry.file);
      const document = parseDocument(await readFile(absoluteFile, 'utf8'));
      if (document.errors.length) throw new Error(`无法解析商品资料：${document.errors.map((error) => error.message).join('; ')}`);
      if (document.get('slug') !== entry.productSlug || document.getIn(['images', entry.imageIndex, 'url']) !== entry.originalUrl) {
        throw new Error('商品图片地址或商品标识已变化，请重新生成迁移清单');
      }

      const downloaded = await options.fetchImage(entry.originalUrl);
      const contentType = normalizeImageContentType(downloaded.contentType);
      if (!IMAGE_CONTENT_TYPES.has(contentType)) throw new Error(`不支持的图片类型：${contentType || '未知'}`);
      if (!downloaded.buffer.length || downloaded.buffer.length > MAX_IMAGE_BYTES) throw new Error('图片为空或超过 10 MiB');

      const uploaded = await options.upload(downloaded.buffer, contentType);
      if (!isTosObjectUrl(uploaded.url, publicBase)) throw new Error('上传返回地址不属于配置的 TOS 公共地址');
      const latestDocument = parseDocument(await readFile(absoluteFile, 'utf8'));
      if (latestDocument.errors.length) throw new Error(`上传后商品资料无法解析：${latestDocument.errors.map((item) => item.message).join('; ')}`);
      if (latestDocument.get('slug') !== entry.productSlug || latestDocument.getIn(['images', entry.imageIndex, 'url']) !== entry.originalUrl) {
        throw new Error('上传期间商品图片地址或商品标识发生变化，已保留当前资料，请重新生成迁移清单');
      }
      latestDocument.setIn(['images', entry.imageIndex, 'url'], uploaded.url);
      await writeYamlAtomically(absoluteFile, latestDocument.toString());
      entry.status = 'done';
      entry.migratedUrl = uploaded.url;
      delete entry.error;
    } catch (error) {
      entry.status = 'failed';
      entry.error = (error instanceof Error ? error.message : String(error)).slice(0, 500);
    }
    await options.onEntryUpdated?.(manifest);
  }

  return manifest;
}

export async function downloadRemoteImage(
  url: string,
  request: typeof fetch = fetch,
): Promise<DownloadedImage> {
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== 'https:' || parsedUrl.username || parsedUrl.password) {
    throw new Error('图片来源仅允许 HTTPS 且不含访问凭据');
  }

  const response = await request(parsedUrl, {
    method: 'GET',
    redirect: 'manual',
    signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
    headers: { accept: 'image/jpeg,image/png,image/webp' },
  });
  if (response.status >= 300 && response.status < 400) throw new Error('图片来源返回重定向；为安全起见不允许重定向');
  if (!response.ok) throw new Error(`图片来源请求失败：HTTP ${response.status}`);

  const contentType = normalizeImageContentType(response.headers.get('content-type') ?? '');
  if (!IMAGE_CONTENT_TYPES.has(contentType)) throw new Error(`不支持的图片类型：${contentType || '未知'}`);
  const contentLength = Number(response.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_IMAGE_BYTES) throw new Error('图片超过 10 MiB');
  if (!response.body) throw new Error('图片来源没有返回内容');

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_IMAGE_BYTES) {
        await reader.cancel();
        throw new Error('图片超过 10 MiB');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  if (totalBytes === 0) throw new Error('图片为空');
  return { buffer: Buffer.concat(chunks, totalBytes), contentType };
}

export function parseImageMigrationArgs(args: string[]): ImageMigrationCommand {
  const [mode, ...rest] = args;
  const values = new Map<string, string>();
  let applyConfirmed = false;
  for (let index = 0; index < rest.length; index += 1) {
    const flag = rest[index];
    if (flag === '--apply') {
      applyConfirmed = true;
      continue;
    }
    if (!flag || !['--out', '--manifest'].includes(flag)) throw new Error(`未知参数：${flag ?? ''}`);
    const value = rest[index + 1];
    if (typeof value !== 'string' || !value || value.startsWith('--')) throw new Error(`${flag} 后需要填写路径`);
    values.set(flag, value);
    index += 1;
  }

  if (mode === 'plan') {
    if (applyConfirmed || values.has('--manifest')) throw new Error('plan 模式只接受 --out 参数');
    return { mode, outputPath: values.get('--out') ?? '../../data/tmp/tos-image-migration.json' };
  }
  if (mode === 'apply') {
    const manifestPath = values.get('--manifest');
    if (!applyConfirmed) throw new Error('apply 模式必须显式传入 --apply');
    if (!manifestPath) throw new Error('apply 模式必须提供 --manifest 路径');
    if (values.has('--out')) throw new Error('apply 模式不接受 --out 参数');
    return { mode, manifestPath };
  }
  throw new Error('请指定 plan 或 apply 模式');
}

export function summarizeImageMigration(manifest: ImageMigrationManifest): {
  pending: number;
  approvedPending: number;
  done: number;
  approvedFailed: number;
} {
  return {
    pending: manifest.entries.filter((entry) => entry.status === 'pending').length,
    approvedPending: manifest.entries.filter((entry) => entry.approved && entry.status === 'pending').length,
    done: manifest.entries.filter((entry) => entry.status === 'done').length,
    approvedFailed: manifest.entries.filter((entry) => entry.approved && entry.status === 'failed').length,
  };
}

export function normalizeImageContentType(value: string): string {
  return (value.split(';', 1)[0] ?? '').trim().toLowerCase();
}

function normalizeBaseUrl(value: string): string {
  const parsed = new URL(value);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw new Error('TOS 公共地址必须是 HTTPS URL');
  return value.replace(/\/+$/, '');
}

function isHttpsUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}

function isTosObjectUrl(value: string, publicBase: string): boolean {
  return value === publicBase || value.startsWith(`${publicBase}/`);
}

function isSameOrigin(value: string, other: string): boolean {
  return new URL(value).origin === new URL(other).origin;
}

async function resolveManifestFile(root: string, manifestPath: string): Promise<string> {
  const candidate = resolve(root, manifestPath);
  const resolvedFile = await realpath(candidate);
  if (!resolvedFile.startsWith(`${root}${sep}`)) throw new Error('迁移清单中的文件路径超出 data 目录');
  if (!/\.ya?ml$/i.test(resolvedFile)) throw new Error('迁移清单只能引用商品 YAML 文件');
  if (basename(resolvedFile).startsWith('.')) throw new Error('不允许迁移隐藏文件');
  return resolvedFile;
}

async function writeYamlAtomically(file: string, contents: string): Promise<void> {
  const temporaryFile = resolve(dirname(file), `.tos-image-${randomUUID()}.tmp`);
  try {
    await writeFile(temporaryFile, contents, { encoding: 'utf8', flag: 'wx' });
    await rename(temporaryFile, file);
  } catch (error) {
    const { unlink } = await import('node:fs/promises');
    await unlink(temporaryFile).catch(() => undefined);
    throw error;
  }
}

function toManifestPath(value: string): string {
  return value.split(sep).join('/');
}
