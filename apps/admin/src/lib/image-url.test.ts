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
