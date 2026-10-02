import assert from 'node:assert/strict';
import test from 'node:test';
import { assertLocalMirrorDatabase, imageSourceReferer, isApprovedSourceImageUrl, mirrorObjectKey, shouldRetryImageFetch } from './product-image-mirror';

const cloneUrl = 'postgresql://youpu:secret@localhost:5432/youpu_prod_sync_20260930_113514';
const approvedHosts = new Set(['cdn.shopify.com']);

test('accepts only the named production-clone database on loopback', () => {
  assert.equal(assertLocalMirrorDatabase(cloneUrl), 'youpu_prod_sync_20260930_113514');
  assert.throws(
    () => assertLocalMirrorDatabase(cloneUrl.replace('localhost', 'db.example.com')),
    /loopback/,
  );
  assert.throws(
    () => assertLocalMirrorDatabase(cloneUrl.replace('youpu_prod_sync_20260930_113514', 'youpu')),
    /expected clone database/,
  );
});

test('accepts only HTTPS product images on explicitly approved hosts', () => {
  assert.equal(isApprovedSourceImageUrl('https://cdn.shopify.com/s/files/1/image.jpg?width=800', approvedHosts), true);
  assert.equal(isApprovedSourceImageUrl('http://cdn.shopify.com/s/files/1/image.jpg', approvedHosts), false);
  assert.equal(isApprovedSourceImageUrl('https://attacker.example/image.jpg', approvedHosts), false);
  assert.equal(isApprovedSourceImageUrl('https://user:pass@cdn.shopify.com/s/files/1/image.jpg', approvedHosts), false);
  assert.equal(isApprovedSourceImageUrl('https://cdn.shopify.com:444/s/files/1/image.jpg', approvedHosts), false);
});

test('builds deterministic content-addressed keys for normalized WebP bytes', () => {
  const first = Buffer.from('normalized-image-one');
  assert.equal(mirrorObjectKey(first), mirrorObjectKey(Buffer.from(first)));
  assert.notEqual(mirrorObjectKey(first), mirrorObjectKey(Buffer.from('normalized-image-two')));
  assert.match(mirrorObjectKey(first), /^product-images\/mirror\/[a-f0-9]{64}\.webp$/);
});

test('retries network timeouts but not permanent image errors', () => {
  assert.equal(shouldRetryImageFetch(Object.assign(new Error('deadline'), { name: 'TimeoutError' })), true);
  assert.equal(shouldRetryImageFetch(new TypeError('fetch failed')), true);
  assert.equal(shouldRetryImageFetch(new Error('Image source returned HTTP 404')), false);
});

test('uses fixed official referers for known hotlink-protected image sources', () => {
  assert.equal(imageSourceReferer('assets.specialized.com'), 'https://www.specialized.com/');
  assert.equal(imageSourceReferer('www.smartmarine.co.nz'), 'https://www.smartmarine.co.nz/');
  assert.equal(imageSourceReferer('attacker.example'), undefined);
});
