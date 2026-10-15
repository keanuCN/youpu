import assert from "node:assert/strict";
import test from "node:test";

import { isAllowedImageUrl, resolveImageUrl } from "./image-url";

const CDN_IMAGE =
  "https://g.cdn.meoo.host/uvayfd7jql5o/ai-images/board-base-01.png?auth_key=test";

test("routes approved remote images through the local proxy in development", () => {
  const officialImage = "https://us.yonex.com/cdn/shop/files/arc11-p.png?v=1&width=1946";
  assert.equal(
    resolveImageUrl(officialImage, true),
    `/api/image-proxy?url=${encodeURIComponent(officialImage)}`,
  );

  assert.equal(resolveImageUrl(CDN_IMAGE, true), "");
});

test("keeps image URLs unchanged outside development", () => {
  assert.equal(resolveImageUrl(CDN_IMAGE, false), "");
  assert.equal(resolveImageUrl("/local-image.png", true), "/local-image.png");
});

test("only allows local paths and approved remote image prefixes", () => {
  assert.equal(isAllowedImageUrl("/local-image.png"), true);
  assert.equal(isAllowedImageUrl(CDN_IMAGE), false);
  assert.equal(
    isAllowedImageUrl(`/api/image-proxy?url=${encodeURIComponent(CDN_IMAGE)}`),
    false,
  );
  assert.equal(isAllowedImageUrl("https://g.cdn.meoo.host/other/file.png"), false);
  assert.equal(isAllowedImageUrl("https://g.cdn.meoo.host:444/uvayfd7jql5o/ai-images/file.png"), false);
  assert.equal(isAllowedImageUrl("https://us.yonex.com/cdn/shop/files/arc11-p.png"), true);
  assert.equal(isAllowedImageUrl("https://shop.au.victorsport.com/cdn/shop/products/racket.jpg"), true);
  assert.equal(isAllowedImageUrl("https://bbsports.co.nz/cdn/shop/files/Untitled_580x.jpg?v=1760064152"), true);
  assert.equal(isAllowedImageUrl("https://www.smartmarine.co.nz/cdn/images/products/xlarge/8089900_a.jpg"), true);
  assert.equal(isAllowedImageUrl("https://www.smartmarine.co.nz/cdn/images/other/8089900_a.jpg"), false);
  assert.equal(isAllowedImageUrl("https://example.com/image.png"), false);
});

test("allows product images from the project TOS bucket only under product-images", () => {
  const mirroredImage = "https://youpu.tos-cn-beijing.volces.com/product-images/mirror.webp";
  assert.equal(isAllowedImageUrl(mirroredImage), true);
  assert.equal(resolveImageUrl(mirroredImage, true), mirroredImage);
  assert.equal(resolveImageUrl(mirroredImage, false), mirroredImage);
  assert.equal(isAllowedImageUrl("https://youpu.tos-cn-beijing.volces.com/private/mirror.webp"), false);
});

test("allows only the official RIDE and Jones snowboard image paths", () => {
  assert.equal(
    isAllowedImageUrl("https://cdn.media.amplience.net/s/ride/ride_2627_deep-fake_RD261850?w=1200&qlt=90&fmt=auto"),
    true,
  );
  assert.equal(
    isAllowedImageUrl("https://cdn.media.amplience.net/s/ride/ride_2627_warpig_RD261857?w=1200&qlt=90&fmt=auto"),
    true,
  );
  assert.equal(
    isAllowedImageUrl("https://www.jonessnowboards.com/cdn/shop/files/J.27.SNM.UFL-gallery-1.webp?v=1782443801&width=1200"),
    true,
  );
  assert.equal(isAllowedImageUrl("https://cdn.media.amplience.net/s/unrelated/file.jpg"), false);
  assert.equal(isAllowedImageUrl("https://www.jonessnowboards.com/private/file.webp"), false);
});

test("allows the audited snowboard image sources only on their product asset paths", () => {
  const auditedImages = [
    "https://www.arbor-collective.ca/cdn/shop/files/1-ARBOR_AFRAME_2024_STUDIO_01-rec.png?v=1724274612",
    "https://www.evo.com/cdn/shop/files/product-image-1103223.jpg?v=1767733151",
    "https://eu.burton.com/cdn/shop/files/1068819AI2_1.webp?v=1776120991&width=2880",
    "https://eu.burton.com/cdn/shop/files/106921CA03_1.webp?v=1776121079&width=2880",
    "https://snowboards.com/files/store/items/lg/f/w/fw26--doa_150.jpg",
    "https://images.blue-tomato.com/is/image/bluetomato/305258540_front.jpg-G2lrQmzSDnKgLSGW6Q13RDLjzzE/Riders+Choice+Snowboard.jpg?$b1$",
    "https://www.jonessnowboards.com/cdn/shop/files/J.26.SNU.HVC-gallery-1.webp?v=1768452295",
    "https://www.evo.com/cdn/shop/files/product-image-1183297.jpg?v=1767736586",
    "https://original.accentuate.io/6939308982453/1758747603396/KORUA-Shapes-Cafe-Racer-Nicholas-Wolken-Thumbnail-01.jpg?v=1758747603396",
    "https://www.evo.com/cdn/shop/files/product-image-1153304.jpg",
    "https://www.evo.com/cdn/shop/files/product-image-1104917.jpg?v=1767733189",
    "https://www.nitrosnow.ca/cdn/shop/files/22_82ac62fb-84b5-43f9-ad67-b43bfc261588.png?v=1784751877",
    "https://www.milosport.com/cdn/shop/files/RD2510321398Large.png?v=1742933585&width=2048",
    "https://salomon.jp/cdn/shop/files/L47924900_0_VIR_SIGHT_156.png?v=1756098039",
  ];

  for (const image of auditedImages) {
    assert.equal(isAllowedImageUrl(image), true, image);
    assert.equal(
      resolveImageUrl(image, true),
      `/api/image-proxy?url=${encodeURIComponent(image)}`,
      image,
    );
  }

  assert.equal(isAllowedImageUrl("https://www.evo.com/private/image.png"), false);
  assert.equal(isAllowedImageUrl("https://snowboards.com/private/image.png"), false);
  assert.equal(isAllowedImageUrl("https://original.accentuate.io/other-shop/file.jpg"), false);
  assert.equal(isAllowedImageUrl("http://www.arbor-collective.ca/cdn/shop/files/image.png"), false);
});
