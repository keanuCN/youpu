import { readFile, readdir, mkdir, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { config as loadDotenv } from 'dotenv';
import { parseDocument } from 'yaml';
import { productSeedSchema } from '@youpu/schema';
import { APPROVED_SOURCE_HOSTS, fetchAndNormalize, imageSourceFailureReason } from './product-image-source';
import { isApprovedSourceImageUrl, mirrorObjectKey } from './product-image-mirror';
import { rewriteSeedImageUrls } from './seed-product-image-document';

const PUBLIC_BASE = 'https://youpu.tos-cn-beijing.volces.com';
const DATA_ROOT = path.resolve(__dirname, '../../../../data');
const WINTER_CATEGORIES = ['snowboard', 'snowboard-binding', 'snowboard-boot', 'skis', 'skiing-apparel'];

interface Options { apply: boolean; checkSources: boolean; reuseExisting: boolean; envFile?: string; categories: string[]; limit: number }
interface SeedFile { file: string; original: string; slug: string; category: string; images: Array<{ url: string }> }
interface ImageResult { source: string; target?: string; bytes?: number; error?: string }

function optionsFrom(argv: string[]): Options {
  const options: Options = { apply: false, checkSources: false, reuseExisting: false, categories: WINTER_CATEGORIES, limit: Infinity };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--apply') options.apply = true;
    else if (arg === '--check-sources') options.checkSources = true;
    else if (arg === '--reuse-existing') options.reuseExisting = true;
    else if (arg === '--env-file' && argv[i + 1] && !argv[i + 1]!.startsWith('--')) options.envFile = path.resolve(argv[++i]!);
    else if (arg === '--category' && argv[i + 1]) options.categories = argv[++i]!.split(',');
    else if (arg === '--limit' && argv[i + 1]) options.limit = Number(argv[++i]);
    else throw new Error(`不支持的参数：${arg}`);
  }
  if ([options.apply, options.checkSources, options.reuseExisting].filter(Boolean).length > 1) throw new Error('--apply、--check-sources 与 --reuse-existing 只能选择一个');
  if (options.limit !== Infinity && (!Number.isSafeInteger(options.limit) || options.limit < 1)) throw new Error('--limit 必须为正整数');
  if (!options.categories.every(c => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c))) throw new Error('类目必须为合法 slug');
  options.categories = [...new Set(options.categories)].sort();
  return options;
}

async function readSeeds(categories: string[]): Promise<SeedFile[]> {
  const seeds: SeedFile[] = [];
  for (const category of categories) {
    const directory = path.join(DATA_ROOT, category);
    for (const name of (await readdir(directory)).filter(n => n.endsWith('.yaml')).sort()) {
      const file = path.join(directory, name);
      const original = await readFile(file, 'utf8');
      const seed = productSeedSchema.parse(parseDocument(original).toJS());
      if (seed.category !== category) throw new Error(`文件与类目不匹配：${category}/${name}`);
      if (seed.status === 'published') seeds.push({ file, original, slug: seed.slug, category, images: seed.images });
    }
  }
  return seeds;
}

async function verifyPublicImage(key: string, body: Buffer): Promise<boolean> {
  const response = await fetch(`${PUBLIC_BASE}/${key}`, { method: 'HEAD', signal: AbortSignal.timeout(20_000), redirect: 'error' });
  return response.ok && response.headers.get('content-type')?.split(';')[0] === 'image/webp' && Number(response.headers.get('content-length')) === body.length;
}

async function main(): Promise<void> {
  const options = optionsFrom(process.argv.slice(2));
  const seeds = await readSeeds(options.categories);
  const allSources = [...new Set(seeds.flatMap(s => s.images.map(i => i.url)))];
  const own = (url: string) => url.startsWith(`${PUBLIC_BASE}/product-images/`);
  const eligible = allSources.filter(url => !own(url) && isApprovedSourceImageUrl(url, APPROVED_SOURCE_HOSTS));
  const blocked = allSources.filter(url => !own(url) && !isApprovedSourceImageUrl(url, APPROVED_SOURCE_HOSTS));
  const selected = eligible.slice(0, options.limit);
  console.log(JSON.stringify({
    mode: options.apply ? 'apply' : options.reuseExisting ? 'reuse-existing' : options.checkSources ? 'check-sources' : 'dry-run',
    categories: options.categories,
    publishedProducts: seeds.length,
    productsWithoutImages: seeds.filter(s => !s.images.length).length,
    distinctImages: allSources.length,
    alreadyOnTos: allSources.filter(own).length,
    eligibleImages: eligible.length,
    selectedImages: selected.length,
    unsupportedImages: blocked.length,
    unsupportedHosts: [...new Set(blocked.map(url => { try { return new URL(url).hostname; } catch { return 'invalid-url'; } }))].sort(),
  }, null, 2));
  if (!options.apply && !options.checkSources && !options.reuseExisting) return;

  // 只在实际上传时读取密钥；预览和源图检查不需要数据库或 TOS 配置。
  let putImage: ((key: string, body: Buffer) => Promise<void>) | undefined;
  if (options.apply) {
    if (options.envFile) {
      const result = loadDotenv({ path: options.envFile, override: true });
      if (result.error) throw new Error('无法读取指定的 TOS 环境文件');
    }
    const env = process.env;
    if (!env.TOS_ACCESS_KEY || !env.TOS_SECRET_KEY) throw new Error('未配置 TOS_ACCESS_KEY / TOS_SECRET_KEY；未上传或修改任何种子文件');
    if (env.TOS_REGION !== 'cn-beijing' || env.TOS_BUCKET !== 'youpu' || env.TOS_PUBLIC_BASE_URL?.replace(/\/$/, '') !== PUBLIC_BASE ||
      env.TOS_ENDPOINT?.replace(/\/$/, '') !== 'https://tos-cn-beijing.volces.com') {
      throw new Error('TOS 配置与已核对的 youpu 北京桶不一致；停止迁移');
    }
    const { TosClient } = await import('@volcengine/tos-sdk');
    const client = new TosClient({ region: env.TOS_REGION, endpoint: new URL(env.TOS_ENDPOINT).host, accessKeyId: env.TOS_ACCESS_KEY, accessKeySecret: env.TOS_SECRET_KEY });
    putImage = async (key, body) => {
      // 内容哈希作文件名，复用已有对象；不覆盖原有图片。
      if (await verifyPublicImage(key, body)) return;
      try {
        await client.putObject({ bucket: 'youpu', key, body, contentType: 'image/webp', cacheControl: 'public, max-age=31536000, immutable', forbidOverwrite: true });
      } catch (error) {
        if (!await verifyPublicImage(key, body)) {
          const failure = error as { statusCode?: unknown; code?: unknown };
          const status = typeof failure.statusCode === 'number' && failure.statusCode >= 100 && failure.statusCode <= 599 ? `HTTP ${failure.statusCode}` : '';
          const code = typeof failure.code === 'string' && /^[A-Za-z_]{1,64}$/.test(failure.code) ? failure.code : '';
          throw new Error(`TOS 上传未成功${status || code ? `（${[status, code].filter(Boolean).join(' / ')}）` : '或对象内容不匹配'}`);
        }
      }
      if (!await verifyPublicImage(key, body)) throw new Error('TOS 图片未通过公开读取验证');
    };
  }

  const runDir = path.join(DATA_ROOT, 'tmp', 'product-image-mirror', `${new Date().toISOString().replace(/[:.]/g, '-')}-${process.pid}`);
  await mkdir(runDir, { recursive: true });
  const results: ImageResult[] = [];
  const changedFiles: Array<{ file: string; backup: string }> = [];
  const reportPath = path.join(runDir, 'report.json');
  let pendingReport = Promise.resolve();
  const saveReport = () => {
    pendingReport = pendingReport.then(async () => {
      await writeFile(`${reportPath}.tmp`, JSON.stringify({ mode: options.apply ? 'apply' : options.reuseExisting ? 'reuse-existing' : 'check-sources', results, changedFiles }, null, 2), 'utf8');
      await rename(`${reportPath}.tmp`, reportPath);
    });
    return pendingReport;
  };
  // 最多并发三张，控制源站压力和内存；报告串行写入，失败不替换 URL。
  const processSource = async (source: string) => {
    try {
      const bytes = await fetchAndNormalize(source);
      const key = mirrorObjectKey(bytes);
      if (putImage) await putImage(key, bytes);
      if (options.reuseExisting && !await verifyPublicImage(key, bytes)) throw new Error('TOS 中未找到可公开读取的同内容图片，保留源 URL');
      results.push({ source, ...(putImage || options.reuseExisting ? { target: `${PUBLIC_BASE}/${key}` } : {}), bytes: bytes.length });
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      // 不输出 SDK 错误对象或请求配置，避免密钥进入报告。
      results.push({ source, error: /TOS/.test(message) ? message : imageSourceFailureReason(error, source) });
    }
    await saveReport();
    if (results.length % 10 === 0 || results.length === selected.length) console.log(`图片处理进度：${results.length}/${selected.length}`);
  };
  let nextSource = 0;
  const workers = await Promise.allSettled(Array.from({ length: Math.min(3, selected.length) }, async () => {
    while (nextSource < selected.length) {
      const source = selected[nextSource++]!;
      await processSource(source);
    }
  }));
  const failedWorker = workers.find(result => result.status === 'rejected');
  if (failedWorker?.status === 'rejected') throw failedWorker.reason;

  if (options.apply || options.reuseExisting) {
    const replacements = new Map(results.filter(r => r.target).map(r => [r.source, r.target!]));
    for (const seed of seeds) {
      if (!seed.images.some(image => replacements.has(image.url))) continue;
      if (await readFile(seed.file, 'utf8') !== seed.original) throw new Error(`文件已被其他操作修改，停止写入：${seed.slug}`);
      const next = rewriteSeedImageUrls(seed.original, replacements);
      const relative = path.relative(DATA_ROOT, seed.file);
      const backup = path.join(runDir, 'backups', relative);
      await mkdir(path.dirname(backup), { recursive: true });
      await writeFile(backup, seed.original, { encoding: 'utf8', flag: 'wx' });
      // 先记录恢复路径，再原子替换；报告中记录的是可恢复的候选文件。
      changedFiles.push({ file: relative, backup: path.relative(runDir, backup) });
      await saveReport();
      await writeFile(`${seed.file}.tos-tmp`, next, 'utf8');
      await rename(`${seed.file}.tos-tmp`, seed.file);
    }
  }
  console.log(JSON.stringify({ successfulImages: results.filter(r => !r.error).length, failedImages: results.filter(r => r.error).length, changedFiles: changedFiles.length, report: reportPath }, null, 2));
  if (results.some(r => r.error) || blocked.length) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : '图片迁移未完成');
  process.exitCode = 1;
});
