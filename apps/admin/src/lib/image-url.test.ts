import assert from 'node:assert/strict';
import test from 'node:test';
import { preferAdminListThumbnail } from './image-url';

test('limits Shopify product-list thumbnails to 96px and preserves other URL data', () => {
  const source = 'https://eu.burton.com/cdn/shop/files/board.webp?v=42&width=800';
  const thumbnail = new URL(preferAdminListThumbnail(source));
  assert.equal(thumbnail.searchParams.get('width'), '96');
  assert.equal(thumbnail.searchParams.get('v'), '42');

  const alreadySmall = 'https://cdn.shopify.com/s/files/1/1234/files/board.webp?v=3&width=80';
  assert.equal(preferAdminListThumbnail(alreadySmall), alreadySmall);
  const unknown = 'https://unknown.example/image.jpg?width=1200';
  assert.equal(preferAdminListThumbnail(unknown), unknown);
  assert.equal(preferAdminListThumbnail('/relative/image.jpg'), '/relative/image.jpg');
});

test('uses the verified HEAD e.SLR 224x298 image only in admin product lists', () => {
  const source =
    'https://cdn-mdb.head.com/CDN3/D/313365.SET_WO/4/1820x2428/worldcup-rebels-e-slr-without-binding.webp?version=7';
  const thumbnail = new URL(preferAdminListThumbnail(source));
  assert.equal(
    thumbnail.pathname,
    '/CDN3/D/313365.SET_WO/4/224x298/worldcup-rebels-e-slr-without-binding.webp',
  );
  assert.equal(thumbnail.searchParams.get('version'), '7');

  const unverified =
    'https://cdn-mdb.head.com/CDN3/D/313365.SET_WO/4/1820x2428/another-product.webp';
  assert.equal(preferAdminListThumbnail(unverified), unverified);
  assert.equal(
    preferAdminListThumbnail(source.replace('cdn-mdb.head.com', 'images.example')),
    source.replace('cdn-mdb.head.com', 'images.example'),
  );
});

test('limits only the verified Salomon admin-list image to 120px and preserves pad', () => {
  const source =
    'https://cdn.dam.salomon.com/5b8f5563-c91f-4f49-b794-b36700db5564/L49278500/PNG-2000px-max-72dpi.png?pad=0.12,0.12,0.12,0.12&width=800';
  const thumbnail = new URL(preferAdminListThumbnail(source));
  assert.equal(thumbnail.searchParams.get('width'), '120');
  assert.equal(thumbnail.searchParams.get('pad'), '0.12,0.12,0.12,0.12');

  const alreadySmall = source.replace('width=800', 'width=96');
  assert.equal(preferAdminListThumbnail(alreadySmall), alreadySmall);
  const unverified = source.replace('L49278500', 'L49278501');
  assert.equal(preferAdminListThumbnail(unverified), unverified);
});
