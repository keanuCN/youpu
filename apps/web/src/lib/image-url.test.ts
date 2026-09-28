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

  const burtonImage = "https://eu.burton.com/cdn/shop/files/1068819AI2_1.webp?v=1&width=2880";
  assert.equal(
    resolveImageUrl(burtonImage, true),
    `/api/image-proxy?url=${encodeURIComponent(burtonImage)}`,
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
  assert.equal(isAllowedImageUrl("https://eu.burton.com/cdn/shop/files/1068819AI2_1.webp"), true);
  assert.equal(isAllowedImageUrl("https://eu.burton.com/private/other.webp"), false);
  assert.equal(isAllowedImageUrl("https://shop.au.victorsport.com/cdn/shop/products/racket.jpg"), true);
  assert.equal(isAllowedImageUrl("https://bbsports.co.nz/cdn/shop/files/Untitled_580x.jpg?v=1760064152"), true);
  assert.equal(isAllowedImageUrl("https://www.smartmarine.co.nz/cdn/images/products/xlarge/8089900_a.jpg"), true);
  assert.equal(isAllowedImageUrl("https://www.smartmarine.co.nz/cdn/images/other/8089900_a.jpg"), false);
  assert.equal(isAllowedImageUrl("https://example.com/image.png"), false);
});

test("allows verified snowboard product image hosts and rejects unrelated paths", () => {
  const verifiedSnowboardImages = [
    "https://www.arbor-collective.ca/cdn/shop/files/1-ARBOR_AFRAME_2024_STUDIO_01-rec.png",
    "https://www.evo.com/cdn/shop/files/product-image-1103223.jpg",
    "https://static1.squarespace.com/static/5c969a2f7fdcb8b66429acbe/64592d9a6f0d550268442a87/6941d6d29fe36643f87d5a75/1773517367017/2526_DOA_TOP.webp",
    "https://snowboards.com/files/store/items/lg/f/w/fw26--doa_150.jpg",
    "https://images.blue-tomato.com/is/image/bluetomato/305258540_front.jpg-G2lrQmzSDnKgLSGW6Q13RDLjzzE/Riders+Choice+Snowboard.jpg",
    "https://www.jonessnowboards.com/cdn/shop/files/J.26.SNU.HVC-gallery-1.webp",
    "https://original.accentuate.io/6939308982453/1758747603396/KORUA-Shapes-Cafe-Racer-01.jpg",
    "https://glisshop-glisshop-fr-storage.omn.proximis.com/Imagestorage/imagesSynchro/product.jpeg",
    "https://www.nitrosnow.ca/cdn/shop/files/team-board.png",
    "https://salomon.jp/cdn/shop/files/L47924900_0_VIR_SIGHT_156.png",
  ];
  for (const image of verifiedSnowboardImages) assert.equal(isAllowedImageUrl(image), true, image);

  assert.equal(isAllowedImageUrl("https://www.evo.com/cdn/shop/files/customer-avatar.jpg"), false);
  assert.equal(isAllowedImageUrl("https://static1.squarespace.com/static/unrelated/image.webp"), false);
  assert.equal(isAllowedImageUrl("https://snowboards.com/files/store/items/lg/other/doa.jpg"), false);
  assert.equal(isAllowedImageUrl("https://original.accentuate.io/other-store/image.jpg"), false);
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

test("allows verified alpine-ski product image sources", () => {
  assert.equal(
    isAllowedImageUrl("https://cdn.amersports.com/017bc76f-f5cc-42b8-a786-b49f00cdff46/atomic-ski.png"),
    true,
  );
  assert.equal(isAllowedImageUrl("https://cdn.amersports.com/unrelated/atomic-ski.png"), false);
  assert.equal(isAllowedImageUrl("https://www.nordica.com/storage/Product/enforcer-89.png"), true);
  assert.equal(isAllowedImageUrl("https://www.nordica.com/storage/private/image.png"), false);
  assert.equal(
    isAllowedImageUrl("https://cdn-mdb.head.com/CDN3/D/316225/1/1820x2428/shape-v2-r.webp"),
    true,
  );
  assert.equal(
    isAllowedImageUrl("https://cdn.dam.salomon.com/f142d815-a33c-4a23-ab3a-b31b00bd6bb5/L47824000%2B/ski.png"),
    true,
  );
  assert.equal(
    isAllowedImageUrl("https://cdn.dam.salomon.com/bc1e0c3d-981e-48e7-bd6a-b2f40157afe3/L47232400%2B/ski.png"),
    true,
  );
  assert.equal(
    isAllowedImageUrl("https://cdn.dam.salomon.com/f1b63fed-8741-4144-802d-b2f40156d659/L47232300%2B/ski.png"),
    true,
  );
  assert.equal(
    isAllowedImageUrl("https://img-cdn.heureka.group/v1/d23ae16d-8f92-56f6-a776-2ace62a9bcb1.jpg"),
    true,
  );
  assert.equal(
    isAllowedImageUrl("https://www.rossignol.com/dw/image/v2/BJJZ_PRD/on/demandware.static/-/Sites-rossignol-catalog/default/ski.jpg"),
    true,
  );
  assert.equal(isAllowedImageUrl("https://www.rossignol.com/private/ski.jpg"), false);
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
