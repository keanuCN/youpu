import assert from "node:assert/strict";
import test from "node:test";

import { isAllowedImageUrl, resolveImageUrl } from "./image-url";

const CDN_IMAGE =
  "https://g.cdn.meoo.host/uvayfd7jql5o/ai-images/board-base-01.png?auth_key=test";

test("routes approved remote images through the local proxy in development", () => {
  assert.equal(
    resolveImageUrl(CDN_IMAGE, true),
    `/api/image-proxy?url=${encodeURIComponent(CDN_IMAGE)}`,
  );

  const officialImage = "https://us.yonex.com/cdn/shop/files/arc11-p.png?v=1&width=1946";
  assert.equal(
    resolveImageUrl(officialImage, true),
    `/api/image-proxy?url=${encodeURIComponent(officialImage)}`,
  );
});

test("keeps image URLs unchanged outside development", () => {
  assert.equal(resolveImageUrl(CDN_IMAGE, false), CDN_IMAGE);
  assert.equal(resolveImageUrl("/local-image.png", true), "/local-image.png");
});

test("only allows local paths and approved remote image prefixes", () => {
  assert.equal(isAllowedImageUrl("/local-image.png"), true);
  assert.equal(isAllowedImageUrl("https://g.cdn.meoo.host/other/file.png"), false);
  assert.equal(isAllowedImageUrl("https://g.cdn.meoo.host:444/uvayfd7jql5o/ai-images/file.png"), false);
  assert.equal(isAllowedImageUrl("https://us.yonex.com/cdn/shop/files/arc11-p.png"), true);
  assert.equal(isAllowedImageUrl("https://shop.au.victorsport.com/cdn/shop/products/racket.jpg"), true);
  assert.equal(isAllowedImageUrl("https://bbsports.co.nz/cdn/shop/files/Untitled_580x.jpg?v=1760064152"), true);
  assert.equal(isAllowedImageUrl("https://www.smartmarine.co.nz/cdn/images/products/xlarge/8089900_a.jpg"), true);
  assert.equal(isAllowedImageUrl("https://www.smartmarine.co.nz/cdn/images/other/8089900_a.jpg"), false);
  assert.equal(isAllowedImageUrl("https://example.com/image.png"), false);
});

test("allows verified snowboard product image hosts and rejects unrelated paths", () => {
  assert.equal(
    isAllowedImageUrl("https://www.follows.co.jp/pic-labo/2526bc-r2-1a.jpg"),
    true,
  );
  assert.equal(
    isAllowedImageUrl("https://contents.mediadecathlon.com/p2027365/k%247ef3/image.jpg"),
    true,
  );
  assert.equal(
    isAllowedImageUrl("https://cdn.dam.salomon.com/af8e2e75-eeed-4307-9ef2-b3b8010090b3/L49291700/PNG-2000px-max-72dpi.png"),
    true,
  );
  assert.equal(
    isAllowedImageUrl("https://www.milosport.com/cdn/shop/files/KB2616871398Large.png"),
    true,
  );
  assert.equal(isAllowedImageUrl("https://www.follows.co.jp/private/other.jpg"), false);
  assert.equal(isAllowedImageUrl("https://contents.mediadecathlon.com/private/image.jpg"), false);
  assert.equal(isAllowedImageUrl("https://contents.mediadecathlon.com/p/private/image.jpg"), false);
  assert.equal(
    isAllowedImageUrl("https://cdn.shopify.com/s/files/1/0370/4055/4115/files/rome-binding.jpg"),
    true,
  );
  assert.equal(
    isAllowedImageUrl("https://cdn.shopify.com/s/files/1/0685/4131/7295/files/flow-binding.webp"),
    true,
  );
  assert.equal(
    isAllowedImageUrl("https://www.fluxsnowboarding.com/cdn/shop/files/flux-binding.webp"),
    true,
  );
  assert.equal(
    isAllowedImageUrl("https://kailasgear.com/cdn/shop/files/KG2531144_-2.webp?v=1&width=1090"),
    true,
  );
  assert.equal(isAllowedImageUrl("https://kailasgear.com/private/product-image.webp"), false);
  assert.equal(
    isAllowedImageUrl("https://cdn.dam.salomon.com/4e88d690-8431-4ab7-b0f7-b36001082530/L45439300/image.png"),
    true,
  );
  assert.equal(
    isAllowedImageUrl("https://cdn.dam.salomon.com/5b8f5563-c91f-4f49-b794-b36700db5564/L49278500/PNG-2000px-max-72dpi.png"),
    true,
  );
  assert.equal(
    isAllowedImageUrl("https://cdn.media.amplience.net/i/k2/k2_2627_maysis_black_KB261665_1?w=1200"),
    true,
  );
  assert.equal(
    isAllowedImageUrl("https://cdn.media.amplience.net/i/other/unrelated-image.jpg"),
    false,
  );
  assert.equal(isAllowedImageUrl("https://www.fluxsnowboarding.com/private/image.webp"), false);
});

test("allows only selected high-resolution Commons hero photos", () => {
  assert.equal(
    isAllowedImageUrl(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Altay_China_horizon_-_Jiangjunshan_Ski_Resort.jpg/3840px-Altay_China_horizon_-_Jiangjunshan_Ski_Resort.jpg",
    ),
    true,
  );
  assert.equal(
    isAllowedImageUrl(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Snow_Scenery_in_Altay_Prefecture%2C_Xinjiang%2C_China%2C_picture3.jpg/3840px-Snow_Scenery_in_Altay_Prefecture%2C_Xinjiang%2C_China%2C_picture3.jpg",
    ),
    true,
  );
  assert.equal(
    isAllowedImageUrl(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Snow_Scenery_in_Altay_Prefecture%2C_Xinjiang%2C_China%2C_picture10.jpg/3840px-Snow_Scenery_in_Altay_Prefecture%2C_Xinjiang%2C_China%2C_picture10.jpg",
    ),
    true,
  );
  assert.equal(
    isAllowedImageUrl(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Snow_Scenery_in_Altay_Prefecture%2C_Xinjiang%2C_China%2C_picture1.jpg/3840px-Snow_Scenery_in_Altay_Prefecture%2C_Xinjiang%2C_China%2C_picture1.jpg",
    ),
    true,
  );
  assert.equal(
    isAllowedImageUrl("https://upload.wikimedia.org/wikipedia/commons/other-image.jpg"),
    false,
  );
  assert.equal(
    isAllowedImageUrl(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Altay_China_horizon_-_Jiangjunshan_Ski_Resort.jpg/960px-Altay_China_horizon_-_Jiangjunshan_Ski_Resort.jpg",
    ),
    false,
  );
  assert.equal(
    isAllowedImageUrl("https://image.kkday.com/other-product.jpg"),
    false,
  );
});
