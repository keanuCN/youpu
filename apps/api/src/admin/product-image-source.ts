import sharp from 'sharp';
import { imageSourceReferer, isApprovedSourceImageUrl, shouldRetryImageFetch } from './product-image-mirror';

const MAX_SOURCE_BYTES = 10 * 1024 * 1024;
const MAX_REDIRECTS = 4;
const FETCH_ATTEMPTS = 2;
export const APPROVED_SOURCE_HOSTS = new Set([
  'assets.specialized.com',
  'bbsports.co.nz',
  'blauerboardshop.com',
  'cdn-mdb.head.com',
  'cdn.amersports.com',
  'cdn.dam.salomon.com',
  'cdn.media.amplience.net',
  'cdn.shopify.com',
  'contents.mediadecathlon.com',
  'dma.canyon.com',
  'eu.burton.com',
  'gopro.com',
  'graysnowboards.co.jp',
  'images.blue-tomato.com',
  'images2.giant-bicycles.com',
  'img-cdn.heureka.group',
  'img01.yzcdn.cn',
  'kailasgear.com',
  'original.accentuate.io',
  'res.insta360.com',
  'salomon.jp',
  'se-cdn.djiits.com',
  'shop.au.victorsport.com',
  'snowboards.com',
  'us.yonex.com',
  'wassets.insta360.com',
  'www.anglerscentral.my',
  'www.arbor-collective.ca',
  'www.canyon.com',
  'www.evo.com',
  'www.fluxsnowboarding.com',
  'www.follows.co.jp',
  'www.jonessnowboards.com',
  'www.milosport.com',
  'www.nitrosnow.ca',
  'www.nordica.com',
  'www.ogasaka-snowboard.com',
  'www.outdoorsports.com',
  'www.point-official.shop',
  'www.rossignol.com',
  'www.smartmarine.co.nz',
  'www.burton.com',
  'www.nidecker.com',
  'eu.nidecker.com',
  'www.nitrosnowboards.com',
  'nitrosnowboards.com.au',
  'flux-bindings.com',
  'unionbindingcompany.com',
  'jp.unionbindingcompany.com',
  'www.arborcollective.com',
  'ca.koruashapes.com',
  'www.melbournesnowboard.com.au',
  'www.sport-schindele.de',
  'nobaday.com',
  'images.evo.com',
  'www.bestboards.gr',
  'scene7.zumiez.com',
  'billandpauls.com',
  'cdn11.bigcommerce.com',
  'd2j6dbq0eux0bg.cloudfront.net',
  'img.yzcdn.cn',
  'shop.r10s.jp',
  'www.hasco.co.jp',
  'www.skitreff.de',
  'xgamesnow.co.kr',
  'www.xgamesnow.co.kr',
]);

async function readResponseBounded(response: Response): Promise<Buffer> {
  const declaredLength = Number(response.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_SOURCE_BYTES) {
    throw new Error('Source image exceeds the 10 MiB limit');
  }
  if (!response.body) throw new Error('Source image response has no body');

  const reader = response.body.getReader();
  const chunks: Buffer[] = [];
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_SOURCE_BYTES) {
      await reader.cancel();
      throw new Error('Source image exceeds the 10 MiB limit');
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks, totalBytes);
}

async function fetchAndNormalizeOnce(sourceUrl: string): Promise<Buffer> {
  let currentUrl = new URL(sourceUrl);
  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
    if (!isApprovedSourceImageUrl(currentUrl.href, APPROVED_SOURCE_HOSTS)) {
      throw new Error(`Image URL host is not approved (${currentUrl.hostname})`);
    }
    const response = await fetch(currentUrl, {
      redirect: 'manual',
      signal: AbortSignal.timeout(45_000),
      headers: {
        accept: 'image/webp,image/png,image/jpeg,*/*;q=0.5',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36',
        ...(imageSourceReferer(currentUrl.hostname) ? { referer: imageSourceReferer(currentUrl.hostname)! } : {}),
      },
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location || redirect === MAX_REDIRECTS) throw new Error(`Too many image redirects (${currentUrl.hostname})`);
      currentUrl = new URL(location, currentUrl);
      continue;
    }
    if (!response.ok) throw new Error(`Image source returned HTTP ${response.status} (${currentUrl.hostname})`);
    const responseType = (response.headers.get('content-type') ?? '').split(';')[0]?.trim().toLowerCase() ?? '';
    if (responseType && !responseType.startsWith('image/') && responseType !== 'application/octet-stream') {
      throw new Error(`Source returned non-image content (${currentUrl.hostname})`);
    }

    const sourceBytes = await readResponseBounded(response);
    const image = sharp(sourceBytes, { limitInputPixels: 40_000_000 });
    const metadata = await image.metadata();
    if (!['jpeg', 'png', 'webp'].includes(metadata.format ?? '') || (metadata.pages ?? 1) > 1) {
      throw new Error(`Unsupported image format (${currentUrl.hostname})`);
    }
    const normalized = await image
      .rotate()
      .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    return normalized;
  }
  throw new Error('Image redirect limit exceeded');
}

export async function fetchAndNormalize(sourceUrl: string): Promise<Buffer> {
  for (let attempt = 1; attempt <= FETCH_ATTEMPTS; attempt += 1) {
    try {
      return await fetchAndNormalizeOnce(sourceUrl);
    } catch (error) {
      if (attempt === FETCH_ATTEMPTS || !shouldRetryImageFetch(error)) throw error;
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  }
  throw new Error('Image source retry limit exceeded');
}

/** 仅记录可操作的失败分类和源站域名，不暴露请求头或 URL 中的凭据。 */
export function imageSourceFailureReason(error: unknown, sourceUrl: string): string {
  const host = new URL(sourceUrl).hostname;
  const message = error instanceof Error ? error.message : '';
  const status = message.match(/returned HTTP (\d{3})/);
  if (status) return `源图返回 HTTP ${status[1]}（${host}）`;
  if (error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name)) return `源图读取超时（${host}）`;
  if (/not approved/i.test(message)) return `图片重定向来源未登记（${host}）`;
  if (/Unsupported image format/i.test(message)) return `图片格式不受支持（${host}）`;
  if (/10 MiB/i.test(message)) return `源图超过 10 MiB（${host}）`;
  if (/non-image content/i.test(message)) return `源站返回非图片内容（${host}）`;
  return `源图下载或转换失败（${host}）`;
}

