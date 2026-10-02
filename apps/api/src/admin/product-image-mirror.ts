import { createHash } from 'node:crypto';

export const LOCAL_IMAGE_MIRROR_DATABASE = 'youpu_prod_sync_20260930_113514';

export function assertLocalMirrorDatabase(
  databaseUrl: string,
  expectedDatabase = LOCAL_IMAGE_MIRROR_DATABASE,
): string {
  let parsed: URL;
  try {
    parsed = new URL(databaseUrl);
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL URL');
  }

  if (!['postgres:', 'postgresql:'].includes(parsed.protocol)) {
    throw new Error('DATABASE_URL must use PostgreSQL');
  }
  if (!['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname)) {
    throw new Error('Image mirror may only connect to a loopback database host');
  }

  const databaseName = decodeURIComponent(parsed.pathname.replace(/^\//, ''));
  if (databaseName !== expectedDatabase || databaseName !== LOCAL_IMAGE_MIRROR_DATABASE) {
    throw new Error(`Image mirror expected clone database ${LOCAL_IMAGE_MIRROR_DATABASE}`);
  }
  return databaseName;
}

export function isApprovedSourceImageUrl(source: string, approvedHosts: ReadonlySet<string>): boolean {
  try {
    const url = new URL(source);
    return (
      url.protocol === 'https:' &&
      url.port === '' &&
      url.username === '' &&
      url.password === '' &&
      approvedHosts.has(url.hostname.toLowerCase()) &&
      url.pathname !== '/'
    );
  } catch {
    return false;
  }
}

export function shouldRetryImageFetch(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === 'TimeoutError' || error.name === 'AbortError' || (error instanceof TypeError && /fetch failed/i.test(error.message)))
  );
}

export function imageSourceReferer(hostname: string): string | undefined {
  const normalizedHost = hostname.toLowerCase();
  if (normalizedHost === 'assets.specialized.com') return 'https://www.specialized.com/';
  if (normalizedHost === 'point-official.shop' || normalizedHost === 'www.point-official.shop') {
    return 'https://www.point-official.shop/';
  }
  if (normalizedHost === 'anglerscentral.my' || normalizedHost === 'www.anglerscentral.my') {
    return 'https://www.anglerscentral.my/';
  }
  if (normalizedHost === 'bbsports.co.nz') return 'https://bbsports.co.nz/';
  if (normalizedHost === 'www.smartmarine.co.nz') return 'https://www.smartmarine.co.nz/';
  return undefined;
}

export function mirrorObjectKey(normalizedWebpBytes: Buffer): string {
  const digest = createHash('sha256').update(normalizedWebpBytes).digest('hex');
  return `product-images/mirror/${digest}.webp`;
}
