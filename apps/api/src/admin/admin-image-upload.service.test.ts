import assert from 'node:assert/strict';
import test from 'node:test';
import sharp from 'sharp';
import { normalizeProductImage, normalizeTosEndpoint, uploadProductImage, type TosImageConfig } from './admin-image-upload.service';

test('normalizes a TOS endpoint URL to the host expected by the SDK', () => {
  assert.equal(normalizeTosEndpoint('https://tos-cn-beijing.volces.com'), 'tos-cn-beijing.volces.com');
});

test('normalizes a valid JPEG to a bounded WebP image', async () => {
  const input = await sharp({ create: { width: 1800, height: 900, channels: 3, background: '#456' } })
    .jpeg()
    .toBuffer();

  const output = await normalizeProductImage(input, 'image/jpeg');
  const metadata = await sharp(output).metadata();

  assert.equal(metadata.format, 'webp');
  assert.equal(metadata.width, 1600);
  assert.equal(metadata.height, 800);
});

test('rejects an SVG payload even when its declared MIME type looks like an image', async () => {
  await assert.rejects(
    normalizeProductImage(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>'), 'image/png'),
    /仅支持 JPEG、PNG 或 WebP 图片/,
  );
});

test('rejects a raster image whose declared MIME type does not match its contents', async () => {
  const jpeg = await sharp({ create: { width: 2, height: 2, channels: 3, background: '#456' } }).jpeg().toBuffer();

  await assert.rejects(normalizeProductImage(jpeg, 'image/png'), /图片内容与文件类型不匹配/);
});

test('stores only normalized WebP under the public product image prefix', async () => {
  const input = await sharp({ create: { width: 4, height: 3, channels: 3, background: '#456' } }).png().toBuffer();
  const config: TosImageConfig = {
    region: 'cn-beijing',
    bucket: 'youpu',
    endpoint: 'https://tos-cn-beijing.volces.com',
    accessKey: 'test-access-key',
    secretKey: 'test-secret-key',
    publicBaseUrl: 'https://youpu.tos-cn-beijing.volces.com',
  };
  let uploaded: { key: string; body: Buffer; contentType: string } | undefined;

  const result = await uploadProductImage(
    config,
    { buffer: input, mimetype: 'image/png' },
    async (object) => { uploaded = object; },
    () => '123e4567-e89b-42d3-a456-426614174000',
  );

  assert.equal(uploaded?.key, 'product-images/123e4567-e89b-42d3-a456-426614174000.webp');
  assert.equal(uploaded?.contentType, 'image/webp');
  assert.equal(await sharp(uploaded!.body).metadata().then((metadata) => metadata.format), 'webp');
  assert.equal(result.url, 'https://youpu.tos-cn-beijing.volces.com/product-images/123e4567-e89b-42d3-a456-426614174000.webp');
  assert.equal(result.size, uploaded?.body.length);
});
