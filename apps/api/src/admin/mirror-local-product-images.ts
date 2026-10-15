import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { config as loadDotenv } from 'dotenv';
import { APPROVED_SOURCE_HOSTS, fetchAndNormalize } from './product-image-source';
import { assertLocalMirrorDatabase, isApprovedSourceImageUrl, LOCAL_IMAGE_MIRROR_DATABASE, mirrorObjectKey } from './product-image-mirror';

const DOWNLOAD_CONCURRENCY = 3;

interface CliOptions {
  envFile: string;
  apply: boolean;
  checkSources: boolean;
}

interface ProductRow {
  id: string;
  slug: string;
  coverUrl: string | null;
  images: Array<{ id: string; url: string }>;
}

interface ImageReferences {
  imageIds: string[];
  productCovers: Array<{ id: string; slug: string }>;
}

function parseOptions(argv: string[]): CliOptions {
  let envFile = '';
  let apply = false;
  let checkSources = false;
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--env-file') {
      envFile = argv[index + 1] ?? '';
      index += 1;
    } else if (argument === '--apply') {
      apply = true;
    } else if (argument === '--check-sources') {
      checkSources = true;
    } else {
      throw new Error('Usage: --env-file <path> [--check-sources | --apply]');
    }
  }
  if (!envFile || (apply && checkSources)) {
    throw new Error('Usage: --env-file <path> [--check-sources | --apply]');
  }
  return { envFile, apply, checkSources };
}

async function mapWithConcurrency<T, R>(items: T[], concurrency: number, map: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;
  async function worker() {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= items.length) return;
      results[index] = await map(items[index]!);
    }
  }
  const workerResults = await Promise.allSettled(
    Array.from({ length: Math.min(concurrency, items.length) }, worker),
  );
  const failedWorker = workerResults.find((result) => result.status === 'rejected');
  if (failedWorker?.status === 'rejected') throw failedWorker.reason;
  return results;
}

async function main(): Promise<void> {
  const options = parseOptions(process.argv.slice(2));
  const dotenvResult = loadDotenv({ path: options.envFile, override: true });
  if (dotenvResult.error) throw new Error('Could not load the specified local API env file');
  const baseDatabaseUrl = process.env.DATABASE_URL;
  if (!baseDatabaseUrl) throw new Error('The local API env file must define DATABASE_URL');

  const targetDatabaseUrl = new URL(baseDatabaseUrl);
  targetDatabaseUrl.pathname = `/${LOCAL_IMAGE_MIRROR_DATABASE}`;
  assertLocalMirrorDatabase(targetDatabaseUrl.toString());
  process.env.DATABASE_URL = targetDatabaseUrl.toString();

  const tosConfig = {
    region: process.env.TOS_REGION,
    bucket: process.env.TOS_BUCKET,
    endpoint: process.env.TOS_ENDPOINT,
    accessKey: process.env.TOS_ACCESS_KEY,
    secretKey: process.env.TOS_SECRET_KEY,
    publicBaseUrl: process.env.TOS_PUBLIC_BASE_URL,
  };
  const requiredTos = Object.values(tosConfig);
  if (requiredTos.some((value) => !value)) throw new Error('Project TOS settings are incomplete');
  const publicBase = new URL(tosConfig.publicBaseUrl!);
  if (
    publicBase.protocol !== 'https:' ||
    publicBase.username ||
    publicBase.password ||
    publicBase.port ||
    publicBase.search ||
    publicBase.hash ||
    publicBase.pathname !== '/' ||
    publicBase.hostname !== 'youpu.tos-cn-beijing.volces.com'
  ) {
    throw new Error('TOS public base does not match the configured project product-image host');
  }

  const { PrismaClient } = await import('../common/db');
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    const currentDatabase = await prisma.$queryRaw<Array<{ databaseName: string }>>`SELECT current_database() AS "databaseName"`;
    if (currentDatabase[0]?.databaseName !== LOCAL_IMAGE_MIRROR_DATABASE) {
      throw new Error('Connected database did not match the approved local clone');
    }

    const products = (await prisma.product.findMany({
      where: { status: 'published' },
      select: { id: true, slug: true, coverUrl: true, images: { select: { id: true, url: true } } },
    })) as ProductRow[];
    const references = new Map<string, ImageReferences>();
    const missingImageCount = products.filter((product) => !product.coverUrl && product.images.length === 0).length;
    const register = (sourceUrl: string, kind: 'image' | 'cover', id: string, slug: string) => {
      if (!references.has(sourceUrl)) references.set(sourceUrl, { imageIds: [], productCovers: [] });
      const current = references.get(sourceUrl)!;
      if (kind === 'image') current.imageIds.push(id);
      else current.productCovers.push({ id, slug });
    };

    for (const product of products) {
      if (product.coverUrl && !product.coverUrl.startsWith(`${tosConfig.publicBaseUrl!.replace(/\/$/, '')}/product-images/`)) {
        register(product.coverUrl, 'cover', product.id, product.slug);
      }
      for (const image of product.images) {
        if (!image.url.startsWith(`${tosConfig.publicBaseUrl!.replace(/\/$/, '')}/product-images/`)) {
          register(image.url, 'image', image.id, product.slug);
        }
      }
    }

    const sourceUrls = [...references.keys()];
    for (const sourceUrl of sourceUrls) {
      if (!isApprovedSourceImageUrl(sourceUrl, APPROVED_SOURCE_HOSTS)) {
        const sourceHost = (() => { try { return new URL(sourceUrl).hostname; } catch { return 'invalid-url'; } })();
        throw new Error(`A published image source is outside the reviewed HTTPS host set (${sourceHost})`);
      }
    }

    const mode = options.apply ? 'APPLY' : options.checkSources ? 'CHECK' : 'DRY-RUN';
    console.log(`Mode: ${mode}`);
    console.log(`Database: ${LOCAL_IMAGE_MIRROR_DATABASE}`);
    console.log(`TOS host: ${publicBase.hostname}`);
    console.log(`Published products: ${products.length}`);
    console.log(`Products with no image source: ${missingImageCount}`);
    console.log(`Distinct source images to mirror: ${sourceUrls.length}`);
    if (!options.apply && !options.checkSources) return;

    const checkedImages = await mapWithConcurrency(sourceUrls, DOWNLOAD_CONCURRENCY, async (sourceUrl) => {
      try {
        const normalized = await fetchAndNormalize(sourceUrl);
        return { sourceUrl, normalized, failure: null as string | null };
      } catch (error) {
        const host = new URL(sourceUrl).hostname;
        const message = error instanceof Error ? error.message : '';
        const status = message.match(/HTTP source returned (\d+)|returned HTTP (\d+)/i);
        const format = message.match(/Unsupported source image format ([^ ]+)/i);
        const failure = status
          ? `HTTP ${status[1] ?? status[2]} (${host})`
          : format
            ? `unsupported ${format[1]} (${host})`
            : /not approved/i.test(message)
              ? `unapproved redirect host (${host})`
              : /10 MiB/i.test(message)
                ? `over 10 MiB (${host})`
                : /non-image content/i.test(message)
                  ? `non-image response (${host})`
                  : /timeout/i.test(message)
                    ? `request timeout (${host})`
                    : `fetch/decode failure (${host})`;
        return { sourceUrl, normalized: null as Buffer | null, failure };
      }
    });
    const successfulImages = checkedImages.filter(
      (result): result is { sourceUrl: string; normalized: Buffer; failure: null } => result.normalized !== null,
    );
    const failedImages = checkedImages.filter((result) => result.failure !== null);
    const failureGroups = new Map<string, number>();
    for (const result of failedImages) {
      const category = result.failure!;
      failureGroups.set(category, (failureGroups.get(category) ?? 0) + 1);
    }
    for (const [category, count] of failureGroups) console.log(`Unavailable source images: ${count} (${category})`);
    if (!successfulImages.length) throw new Error('No source images passed validation; no storage or database writes were made');

    if (options.checkSources) {
      const normalizedBytes = successfulImages.reduce((total, result) => total + result.normalized.length, 0);
      console.log(`Source images fetched and normalized: ${successfulImages.length}`);
      console.log(`Source images left unchanged: ${failedImages.length}`);
      console.log(`Normalized image data checked: ${normalizedBytes} bytes`);
      return;
    }

    const { TosClient } = await import('@volcengine/tos-sdk');
    const tos = new TosClient({
      region: tosConfig.region!,
      endpoint: new URL(tosConfig.endpoint!).host,
      accessKeyId: tosConfig.accessKey!,
      accessKeySecret: tosConfig.secretKey!,
    });
    const migratedUrls = new Map<string, string>();
    let bytesUploaded = 0;
    await mapWithConcurrency(successfulImages, DOWNLOAD_CONCURRENCY, async ({ sourceUrl, normalized }) => {
      const key = mirrorObjectKey(normalized);
      await tos.putObject({
        bucket: tosConfig.bucket!,
        key,
        body: normalized,
        contentType: 'image/webp',
        cacheControl: 'public, max-age=31536000, immutable',
        forbidOverwrite: true,
      });
      const mirroredUrl = `${tosConfig.publicBaseUrl!.replace(/\/$/, '')}/${key}`;
      const verification = await fetch(mirroredUrl, { method: 'HEAD', signal: AbortSignal.timeout(20_000) });
      if (!verification.ok || !verification.headers.get('content-type')?.toLowerCase().includes('image/webp')) {
        throw new Error(`Uploaded image failed public verification (${verification.status})`);
      }
      migratedUrls.set(sourceUrl, mirroredUrl);
      bytesUploaded += normalized.length;
    });

    const manifestDir = path.join(tmpdir(), `youpu-image-mirror-${new Date().toISOString().replace(/[:.]/g, '-')}`);
    await mkdir(manifestDir, { recursive: true, mode: 0o700 });
    const manifestPath = path.join(manifestDir, 'rollback-manifest.json');
    const manifest = [...references]
      .filter(([sourceUrl]) => migratedUrls.has(sourceUrl))
      .map(([sourceUrl, refs]) => ({ sourceUrl, targetUrl: migratedUrls.get(sourceUrl), ...refs }));
    await writeFile(manifestPath, JSON.stringify({ database: LOCAL_IMAGE_MIRROR_DATABASE, manifest }, null, 2), {
      encoding: 'utf8',
      mode: 0o600,
      flag: 'wx',
    });

    await prisma.$transaction(async (tx) => {
      for (const [sourceUrl, refs] of references) {
        const targetUrl = migratedUrls.get(sourceUrl);
        if (!targetUrl) continue;
        for (const imageId of refs.imageIds) {
          const result = await tx.productImage.updateMany({ where: { id: imageId, url: sourceUrl }, data: { url: targetUrl } });
          if (result.count !== 1) throw new Error('A local product image changed during the migration; transaction aborted');
        }
        for (const productCover of refs.productCovers) {
          const result = await tx.product.updateMany({ where: { id: productCover.id, coverUrl: sourceUrl }, data: { coverUrl: targetUrl } });
          if (result.count !== 1) throw new Error(`A local product cover changed during the migration (${productCover.slug}); transaction aborted`);
        }
      }
    }, { timeout: 120_000 });

    console.log(`Database references updated: ${migratedUrls.size} source images`);
    console.log(`Unavailable source URLs left unchanged: ${failedImages.length}`);
    console.log(`Verified mirrored bytes: ${bytesUploaded}`);
    console.log(`Private rollback manifest: ${manifestPath}`);
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown image mirror failure';
  console.error(`Image mirror stopped: ${message}`);
  process.exitCode = 1;
});
