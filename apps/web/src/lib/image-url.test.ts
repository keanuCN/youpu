import assert from "node:assert/strict";
import test from "node:test";

import {
  isAllowedImageUrl,
  isAllowedRemoteImageUrl,
  preferHighResolutionProductImage,
  preferProductThumbnail,
  resolveImageUrl,
} from "./image-url";

const CDN_IMAGE =
  "https://g.cdn.meoo.host/uvayfd7jql5o/ai-images/board-base-01.png?auth_key=test";

test("limits Shopify product images to thumbnail width without changing detail images", () => {
  const largeImage = "https://eu.burton.com/cdn/shop/files/board.webp?v=1&width=2880";
  const thumbnail = preferProductThumbnail(largeImage);
  assert.equal(new URL(thumbnail).searchParams.get("width"), "640");
  assert.equal(new URL(thumbnail).searchParams.get("v"), "1");
  assert.equal(new URL(preferProductThumbnail(largeImage, 480)).searchParams.get("width"), "480");

  const unboundedShopifyImage = "https://cdn.shopify.com/s/files/1/0231/7366/0752/files/board.png?v=1";
  const boundedShopifyImage = preferProductThumbnail(unboundedShopifyImage);
  assert.equal(new URL(boundedShopifyImage).searchParams.get("width"), "640");
  assert.equal(new URL(boundedShopifyImage).searchParams.get("v"), "1");

  const proxiedImage = `/api/image-proxy?url=${encodeURIComponent(largeImage)}`;
  const proxiedThumbnail = preferProductThumbnail(proxiedImage);
  const proxiedUrl = new URL(proxiedThumbnail, "https://youpu.local");
  assert.equal(new URL(proxiedUrl.searchParams.get("url")!).searchParams.get("width"), "640");

  const alreadySmall = "https://us.yonex.com/cdn/shop/files/racket.webp?width=600";
  assert.equal(preferProductThumbnail(alreadySmall), alreadySmall);
  const nonShopify = "https://cdn.dam.salomon.com/product.png?width=2000";
  assert.equal(preferProductThumbnail(nonShopify), nonShopify);
});

test("keeps product detail images high resolution while bounding verified CDN sources", () => {
  const shopify = "https://eu.burton.com/cdn/shop/files/board.webp?v=1&width=800";
  assert.equal(new URL(preferHighResolutionProductImage(shopify)).searchParams.get("width"), "1600");

  const rossignol =
    "https://www.rossignol.com/dw/image/v2/BJJZ_PRD/on/demandware.static/-/Sites-rossignol-catalog/default/ski.jpg?sw=800&sh=1200&sm=fit";
  assert.equal(new URL(preferHighResolutionProductImage(rossignol)).searchParams.get("sw"), "800");
  const oversizedRossignol = rossignol.replace("sw=800", "sw=2400");
  assert.equal(new URL(preferHighResolutionProductImage(oversizedRossignol)).searchParams.get("sw"), "1600");

  const nordica = "https://www.nordica.com/storage/Product/0A668400001_ENFORCER_89_FLAT.png";
  assert.equal(
    new URL(preferHighResolutionProductImage(nordica)).pathname,
    "/storage/thumbs/Product/1280__resize__0A668400001_ENFORCER_89_FLAT.webp",
  );

  const decathlon =
    "https://contents.mediadecathlon.com/p2704355/picture.jpg?f=3000x0&format=auto";
  const decathlonDetail = new URL(preferHighResolutionProductImage(decathlon));
  assert.equal(decathlonDetail.searchParams.get("f"), "1600x0");
  assert.equal(decathlonDetail.searchParams.get("format"), "auto");

  const specialized =
    "https://assets.specialized.com/i/specialized/93325-50_SJ-15-COMP-SEA-SILDST_HERO-SQUARE";
  const specializedDetail = new URL(preferHighResolutionProductImage(specialized));
  assert.equal(specializedDetail.searchParams.get("w"), "1600");
  assert.equal(specializedDetail.searchParams.get("h"), "1600");

  const unknown = "https://unknown.example/product.png";
  assert.equal(preferHighResolutionProductImage(unknown), unknown);

  const proxied = `/api/image-proxy?url=${encodeURIComponent(decathlon)}`;
  const proxiedDetail = new URL(preferHighResolutionProductImage(proxied), "https://youpu.local");
  assert.equal(new URL(proxiedDetail.searchParams.get("url")!).searchParams.get("f"), "1600x0");
});

test("limits approved Salomon DAM thumbnails and preserves their query parameters", () => {
  const paddedImage =
    "https://cdn.dam.salomon.com/fb6d3e52-e631-4fe0-9ca7-b36001082c68/L49290100/PNG-2000px-max-72dpi.png?pad=0.12,0.12,0.12,0.12&v=7&fit=cover";
  const paddedThumbnail = new URL(preferProductThumbnail(paddedImage));
  assert.equal(paddedThumbnail.searchParams.get("width"), "800");
  assert.equal(paddedThumbnail.searchParams.get("pad"), "0.12,0.12,0.12,0.12");
  assert.equal(paddedThumbnail.searchParams.get("v"), "7");
  assert.equal(paddedThumbnail.searchParams.get("fit"), "cover");

  const oversizedImage =
    "https://cdn.dam.salomon.com/af8e2e75-eeed-4307-9ef2-b3b8010090b3/L49291700/PNG-2000px-max-72dpi.png?width=3840&pad=0.1&auto=avif";
  const oversizedThumbnail = new URL(preferProductThumbnail(oversizedImage));
  assert.equal(oversizedThumbnail.searchParams.get("width"), "800");
  assert.equal(oversizedThumbnail.searchParams.get("pad"), "0.1");
  assert.equal(oversizedThumbnail.searchParams.get("auto"), "avif");

  const narrowThumbnail =
    "https://cdn.dam.salomon.com/4e88d690-8431-4ab7-b0f7-b36001082530/L45439300/image.png?width=600&v=2";
  assert.equal(preferProductThumbnail(narrowThumbnail), narrowThumbnail);
  assert.equal(
    new URL(
      preferProductThumbnail(
        "https://cdn.dam.salomon.com/4e88d690-8431-4ab7-b0f7-b36001082530/L45439300/image.png?width=1000",
        480,
      ),
    ).searchParams.get("width"),
    "480",
  );

  const unrelatedSalomon = "https://cdn.dam.salomon.com/unlisted/product.png?width=2000";
  assert.equal(preferProductThumbnail(unrelatedSalomon), unrelatedSalomon);
  const unrelatedHost = "https://other.example/fb6d3e52-e631-4fe0-9ca7-b36001082c68/L49290100/image.png";
  assert.equal(preferProductThumbnail(unrelatedHost), unrelatedHost);
  const otherCdn = "https://cdn.amersports.com/017bc76f-f5cc-42b8-a786-b49f00cdff46/ski.png";
  assert.equal(preferProductThumbnail(otherCdn), otherCdn);
});

test("limits approved Salomon DAM URLs nested inside the image proxy", () => {
  const salomonImage =
    "https://cdn.dam.salomon.com/fb6d3e52-e631-4fe0-9ca7-b36001082c68/L49290100/PNG-2000px-max-72dpi.png?pad=0.12,0.12,0.12,0.12&width=2000&v=3";
  const proxiedImage = `/api/image-proxy?url=${encodeURIComponent(salomonImage)}&source=product`;
  const proxiedThumbnail = new URL(preferProductThumbnail(proxiedImage), "https://youpu.local");
  const optimizedSource = new URL(proxiedThumbnail.searchParams.get("url")!);
  assert.equal(optimizedSource.searchParams.get("width"), "800");
  assert.equal(optimizedSource.searchParams.get("pad"), "0.12,0.12,0.12,0.12");
  assert.equal(optimizedSource.searchParams.get("v"), "3");
  assert.equal(proxiedThumbnail.searchParams.get("source"), "product");
});

test("limits approved Rossignol card thumbnails to 480px while preserving other URL data", () => {
  const rossignolImage =
    "https://www.rossignol.com/dw/image/v2/BJJZ_PRD/on/demandware.static/-/Sites-rossignol-catalog/default/ski.jpg?sw=800&sh=1200&sm=fit&fmt=webp";
  const thumbnail = new URL(preferProductThumbnail(rossignolImage));
  assert.equal(thumbnail.searchParams.get("sw"), "480");
  assert.equal(thumbnail.searchParams.get("sh"), "1200");
  assert.equal(thumbnail.searchParams.get("sm"), "fit");
  assert.equal(thumbnail.searchParams.get("fmt"), "webp");
  assert.equal(thumbnail.pathname, new URL(rossignolImage).pathname);

  const smallerImage = rossignolImage.replace("sw=800", "sw=320");
  assert.equal(preferProductThumbnail(smallerImage), smallerImage);

  const noWidthImage = rossignolImage.replace("sw=800&", "");
  assert.equal(preferProductThumbnail(noWidthImage), noWidthImage);

  const customLimitImage = rossignolImage.replace("sw=800", "sw=400");
  assert.equal(
    new URL(preferProductThumbnail(customLimitImage, 240)).searchParams.get("sw"),
    "240",
  );

  const unrelatedHost = rossignolImage.replace("www.rossignol.com", "other.example");
  const unrelatedPath = rossignolImage.replace("Sites-rossignol-catalog", "Sites-unlisted-catalog");
  assert.equal(preferProductThumbnail(unrelatedHost), unrelatedHost);
  assert.equal(preferProductThumbnail(unrelatedPath), unrelatedPath);

  const proxiedImage = `/api/image-proxy?url=${encodeURIComponent(rossignolImage)}&source=product`;
  const proxiedThumbnail = new URL(preferProductThumbnail(proxiedImage), "https://youpu.local");
  const optimizedSource = new URL(proxiedThumbnail.searchParams.get("url")!);
  assert.equal(optimizedSource.searchParams.get("sw"), "480");
  assert.equal(optimizedSource.searchParams.get("sh"), "1200");
  assert.equal(optimizedSource.searchParams.get("fmt"), "webp");
  assert.equal(proxiedThumbnail.searchParams.get("source"), "product");
});

test("uses official Nordica WebP thumbnail widths only for verified product images", () => {
  const image =
    "https://www.nordica.com/storage/Product/0A668400001_ENFORCER_89_FLAT.png?source=official";
  const thumbnail = new URL(preferProductThumbnail(image));
  assert.equal(
    thumbnail.pathname,
    "/storage/thumbs/Product/640__resize__0A668400001_ENFORCER_89_FLAT.webp",
  );
  assert.equal(thumbnail.searchParams.get("source"), "official");

  const compareThumbnail = new URL(preferProductThumbnail(image, 192));
  assert.equal(compareThumbnail.pathname, "/storage/thumbs/Product/168__resize__0A668400001_ENFORCER_89_FLAT.webp");
  const highDensityThumbnail = new URL(preferProductThumbnail(image, 1600));
  assert.equal(highDensityThumbnail.pathname, "/storage/thumbs/Product/1280__resize__0A668400001_ENFORCER_89_FLAT.webp");

  const unverifiedProduct = image.replace("0A668400001_ENFORCER_89_FLAT", "UNVERIFIED_SKU");
  assert.equal(preferProductThumbnail(unverifiedProduct), unverifiedProduct);
  const unrelatedPath = image.replace("/storage/Product/", "/storage/Other/");
  assert.equal(preferProductThumbnail(unrelatedPath), unrelatedPath);

  const proxiedImage = `/api/image-proxy?url=${encodeURIComponent(image)}&source=product`;
  const proxiedThumbnail = new URL(preferProductThumbnail(proxiedImage), "https://youpu.local");
  const optimizedSource = new URL(proxiedThumbnail.searchParams.get("url")!);
  assert.equal(optimizedSource.pathname, "/storage/thumbs/Product/640__resize__0A668400001_ENFORCER_89_FLAT.webp");
  assert.equal(proxiedThumbnail.searchParams.get("source"), "product");
});

test("uses the verified GoPro WebP optimizer for the three catalog images only", () => {
  const images = [
    "https://gopro.com/on/demandware.static/-/Sites-gopro-products/default/dwd909d4f6/images/Product%20Images/cameras/CHDHX-111-master/compare-h11.png",
    "https://gopro.com/on/demandware.static/-/Sites-gopro-products/default/dwd62f3260/images/Product%20Images/cameras/CHDHX-121-master/plp-product-card-h12.png",
    "https://gopro.com/on/demandware.static/-/Sites-gopro-products/default/dw212f9f28/images/Product%20Images/cameras/CHDHX-131-master/plp-product-card-h13.png",
  ];

  for (const image of images) {
    const thumbnail = new URL(preferProductThumbnail(image));
    assert.equal(thumbnail.pathname, "/_next/image");
    assert.equal(thumbnail.searchParams.get("url"), image);
    assert.equal(thumbnail.searchParams.get("w"), "375");
    assert.equal(thumbnail.searchParams.get("q"), "80");
    assert.equal(isAllowedRemoteImageUrl(thumbnail.toString()), true);

    const detail = new URL(preferHighResolutionProductImage(image));
    assert.equal(detail.searchParams.get("w"), "1280");
  }

  const proxiedImage = `/api/image-proxy?url=${encodeURIComponent(images[2]!)}`;
  const proxiedThumbnail = new URL(preferProductThumbnail(proxiedImage), "https://youpu.local");
  const optimizedImage = new URL(proxiedThumbnail.searchParams.get("url")!);
  assert.equal(optimizedImage.pathname, "/_next/image");
  assert.equal(optimizedImage.searchParams.get("w"), "375");

  const unverified = "https://gopro.com/on/demandware.static/-/Sites-gopro-products/default/other.png";
  assert.equal(preferProductThumbnail(unverified), unverified);
  const arbitraryOptimizer = new URL("https://gopro.com/_next/image");
  arbitraryOptimizer.searchParams.set("url", "https://example.com/image.png");
  arbitraryOptimizer.searchParams.set("w", "375");
  arbitraryOptimizer.searchParams.set("q", "80");
  assert.equal(isAllowedRemoteImageUrl(arbitraryOptimizer.toString()), false);
});

test("uses official small variants only for the verified Follows and Point product images", () => {
  const follows = "https://www.follows.co.jp/pic-labo/2526bc-r2-1a.jpg";
  const followsSmall = "https://image1.shopserve.jp/follows.co.jp/pic-labo/limg/2526bc-r2-1a.jpg";
  assert.equal(preferProductThumbnail(follows), followsSmall);
  assert.equal(preferProductThumbnail(follows, 192), follows);
  assert.equal(preferHighResolutionProductImage(follows), follows);
  assert.equal(isAllowedImageUrl(followsSmall), true);
  assert.equal(isAllowedRemoteImageUrl(`${followsSmall}?width=320`), false);

  for (const image of [
    "https://www.follows.co.jp/pic-labo/2627bc-dr-1.jpg",
    "https://www.follows.co.jp/pic-labo/2627bc-rxn-1.jpg",
  ]) {
    const thumbnail = new URL(preferProductThumbnail(image));
    assert.equal(thumbnail.hostname, "image1.shopserve.jp");
    assert.equal(thumbnail.pathname.replace("/follows.co.jp/pic-labo/limg/", "/pic-labo/"), new URL(image).pathname);
    assert.equal(isAllowedImageUrl(thumbnail.toString()), true);
    assert.equal(preferHighResolutionProductImage(image), image);
  }

  const point = "https://www.point-official.shop/img/goods/L/4550133341434_1.jpg";
  const pointSmall = "https://www.point-official.shop/img/goods/S/4550133341434_1.jpg";
  assert.equal(preferProductThumbnail(point), pointSmall);
  assert.equal(preferProductThumbnail(point, 192), point);
  assert.equal(preferHighResolutionProductImage(point), point);

  const unverifiedFollows = follows.replace("2526bc-r2-1a", "unverified");
  const unverifiedPoint = point.replace("4550133341434", "0000000000000");
  assert.equal(preferProductThumbnail(unverifiedFollows), unverifiedFollows);
  assert.equal(preferProductThumbnail(unverifiedPoint), unverifiedPoint);
  assert.equal(preferProductThumbnail(`${follows}?version=2`), `${follows}?version=2`);

  const proxiedPoint = `/api/image-proxy?url=${encodeURIComponent(point)}&source=product`;
  const thumbnailProxy = new URL(preferProductThumbnail(proxiedPoint), "https://youpu.local");
  assert.equal(thumbnailProxy.searchParams.get("url"), pointSmall);
  assert.equal(thumbnailProxy.searchParams.get("source"), "product");
});

test("uses the verified VICTOR 640px racket image variant only for its exact product asset", () => {
  const image =
    "https://shop.au.victorsport.com/cdn/shop/products/82004_1_20211117175841_2048x.jpg?v=1644645157";
  const thumbnail =
    "https://shop.au.victorsport.com/cdn/shop/products/82004_1_20211117175841_640x.jpg?v=1644645157";
  assert.equal(preferProductThumbnail(image), thumbnail);

  const detail = new URL(preferHighResolutionProductImage(image));
  assert.equal(detail.pathname.endsWith("_2048x.jpg"), true);
  assert.equal(detail.searchParams.get("width"), "1600");

  const otherVersion = image.replace("1644645157", "other-version");
  assert.notEqual(preferProductThumbnail(otherVersion), thumbnail);
});

test("uses the verified 416px CAPiTA card image while preserving detail resolution", () => {
  const images = [
    "SB04-RESORT-TWIN-TOP.png?v=1776884550",
    "RST02-AERONAUT-TOP.png?v=1776884582",
    "RST01-SUPER-D.O.A.-TOP.png?v=1776884610",
    "RST03-D.O.A.-TOP.png?v=1776884618",
    "RST05-OUTERSPACE-LIVING-TOP.png?v=1776884612",
    "RST06-SIDEWINDER-TOP.png?v=1776884613",
  ].map((asset) => `https://cdn.shopify.com/s/files/1/0231/7366/0752/files/${asset}&width=800`);

  for (const image of images) {
    const thumbnail = new URL(preferProductThumbnail(image));
    assert.equal(thumbnail.searchParams.get("width"), "416");
    assert.equal(thumbnail.searchParams.get("v"), new URL(image).searchParams.get("v"));

    const detail = new URL(preferHighResolutionProductImage(image));
    assert.equal(detail.searchParams.get("width"), "1600");
    assert.equal(detail.searchParams.get("v"), new URL(image).searchParams.get("v"));

    const alreadySmall = image.replace("width=800", "width=320");
    assert.equal(preferProductThumbnail(alreadySmall), alreadySmall);
  }

  const unverifiedImage = images[0]!.replace("SB04-RESORT-TWIN-TOP", "unverified-image");
  assert.equal(new URL(preferProductThumbnail(unverifiedImage)).searchParams.get("width"), "640");
});

test("uses HEAD official ski thumbnails only for the four verified gallery images", () => {
  const images = [
    {
      source: "https://cdn-mdb.head.com/CDN3/D/316485/1/1820x2428/easy-joy-r.webp",
      thumbnail: "https://cdn-mdb.head.com/CDN3/D/316485/1/683x911/easy-joy-r.webp",
      compact: "https://cdn-mdb.head.com/CDN3/D/316485/1/224x298/easy-joy-r.webp",
    },
    {
      source: "https://cdn-mdb.head.com/CDN3/D/316225/1/1820x2428/shape-v2-r.webp",
      thumbnail: "https://cdn-mdb.head.com/CDN3/D/316225/1/683x911/shape-v2-r.webp",
      compact: "https://cdn-mdb.head.com/CDN3/D/316225/1/224x298/shape-v2-r.webp",
    },
    {
      source:
        "https://cdn-mdb.head.com/CDN3/D/313236.SET_WO/5/1820x2428/worldcup-rebels-e-sl-pro-without-binding.webp",
      thumbnail:
        "https://cdn-mdb.head.com/CDN3/D/313236.SET_WO/5/683x911/worldcup-rebels-e-sl-pro-without-binding.webp",
      compact:
        "https://cdn-mdb.head.com/CDN3/D/313236.SET_WO/5/224x298/worldcup-rebels-e-sl-pro-without-binding.webp",
    },
    {
      source:
        "https://cdn-mdb.head.com/CDN3/D/313306.SET_31330602/5/1820x2428/supershape-e-magnum-with-binding-protector-evo-pr-11-gw.webp",
      thumbnail:
        "https://cdn-mdb.head.com/CDN3/D/313306.SET_31330602/5/683x911/supershape-e-magnum-with-binding-protector-evo-pr-11-gw.webp",
      compact:
        "https://cdn-mdb.head.com/CDN3/D/313306.SET_31330602/5/224x298/supershape-e-magnum-with-binding-protector-evo-pr-11-gw.webp",
    },
  ];

  for (const { source, thumbnail, compact } of images) {
    assert.equal(preferProductThumbnail(source), thumbnail);
    assert.equal(preferProductThumbnail(source, 480), compact);
    assert.equal(preferHighResolutionProductImage(source), source);
  }

  const unverified = "https://cdn-mdb.head.com/CDN3/D/313365.SET_WO/4/1820x2428/worldcup-rebels-e-slr-without-binding.webp";
  assert.equal(preferProductThumbnail(unverified), unverified);
});

test("uses official 300x200 Giant thumbnails only for the verified bike images", () => {
  const images = [
    {
      source:
        "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_400%2Cq_80%2Cw_600/u9r0a1uqpr0rustxbxbn/MY27PropelAdvancedPro0-AXS_ColorAObsidianPulse.jpg",
      thumbnail:
        "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_200%2Cq_80%2Cw_300/u9r0a1uqpr0rustxbxbn/MY27PropelAdvancedPro0-AXS_ColorAObsidianPulse.jpg",
    },
    {
      source:
        "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_600%2Cq_80%2Cw_800/qrpefgqfjrzq6x21nwsw/MY26XTCAdvanced291_ColorAAbyssBlack_Bronze.jpg",
      thumbnail:
        "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_200%2Cq_80%2Cw_300/qrpefgqfjrzq6x21nwsw/MY26XTCAdvanced291_ColorAAbyssBlack_Bronze.jpg",
    },
    {
      source:
        "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_400%2Cq_80/ln09xatfxrvyqelva1lt/MY26DefyAdvanced2_ColorAAbyssBlack.jpg",
      thumbnail:
        "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_200%2Cq_80%2Cw_300/ln09xatfxrvyqelva1lt/MY26DefyAdvanced2_ColorAAbyssBlack.jpg",
    },
    {
      source:
        "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_400%2Cq_80/jtismbbz7rrw6bsjelem/MY26TCRAdvancedPro0-AXS_ColorACarbon.jpg",
      thumbnail:
        "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_200%2Cq_80%2Cw_300/jtismbbz7rrw6bsjelem/MY26TCRAdvancedPro0-AXS_ColorACarbon.jpg",
    },
    {
      source:
        "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_400%2Cq_80%2Cw_600/skym90dx4rx42jofovsh/MY24TranceXAdvanced0_ColorABlueDragonfly.jpg",
      thumbnail:
        "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_200%2Cq_80%2Cw_300/skym90dx4rx42jofovsh/MY24TranceXAdvanced0_ColorABlueDragonfly.jpg",
    },
  ];

  for (const { source, thumbnail } of images) {
    assert.equal(preferProductThumbnail(source), thumbnail);
    assert.equal(preferProductThumbnail(source, 480), thumbnail);
    assert.equal(preferHighResolutionProductImage(source), source);
  }

  const unverified = images[0]!.source.replace("MY27PropelAdvancedPro0-AXS", "unverified-bike");
  assert.equal(preferProductThumbnail(unverified), unverified);

  const proxiedSource = `/api/image-proxy?url=${encodeURIComponent(images[0]!.source)}`;
  const thumbnailProxy = new URL(preferProductThumbnail(proxiedSource), "https://youpu.local");
  assert.equal(thumbnailProxy.searchParams.get("url"), images[0]!.thumbnail);
});

test("uses the measured 543px Canyon JPEG thumbnail without changing its detail image", () => {
  const image =
    "https://www.canyon.com/dw/image/v2/BCML_PRD/on/demandware.static/-/Sites-canyon-master/default/dw07984cc9/images/full/full_2023_/2023/full_2023_3170_neuron-cf-8_sr-bk_P5.png?sw=1145&sh=645&sm=fit&sfrm=png";
  const thumbnail = new URL(preferProductThumbnail(image));
  assert.equal(thumbnail.pathname.endsWith("_P5.jpg"), true);
  assert.equal(thumbnail.searchParams.get("sw"), "543");
  assert.equal(thumbnail.searchParams.get("sh"), null);
  assert.equal(thumbnail.searchParams.get("sm"), null);
  assert.equal(thumbnail.searchParams.get("sfrm"), "png");
  assert.equal(thumbnail.searchParams.get("q"), "90");
  assert.equal(thumbnail.searchParams.get("bgcolor"), "F2F2F2");

  assert.equal(preferHighResolutionProductImage(image), image);
  assert.equal(preferProductThumbnail(image, 480), image);

  const unrelatedImage = image.replace("3170_neuron-cf-8", "unverified-bike");
  assert.equal(preferProductThumbnail(unrelatedImage), unrelatedImage);
});

test("uses the verified 416px Flow Fuse thumbnail only for its exact Shopify asset", () => {
  const image =
    "https://cdn.shopify.com/s/files/1/0674/9582/1405/files/High-_0024_FLOW_FUSE_WHITE_fusion.jpg?v=1788232288&width=800";
  const thumbnail = new URL(preferProductThumbnail(image));
  assert.equal(thumbnail.searchParams.get("width"), "416");
  assert.equal(thumbnail.searchParams.get("v"), "1788232288");

  const detail = new URL(preferHighResolutionProductImage(image));
  assert.equal(detail.searchParams.get("width"), "1600");
  assert.equal(detail.searchParams.get("v"), "1788232288");

  const unverifiedVersion = image.replace("1788232288", "other-version");
  const unverifiedThumbnail = new URL(preferProductThumbnail(unverifiedVersion));
  assert.equal(unverifiedThumbnail.searchParams.get("width"), "640");
  assert.equal(unverifiedThumbnail.searchParams.get("v"), "other-version");
});

test("uses the verified SmartMarine 600px image only for the exact fishing rod", () => {
  const image = "https://www.smartmarine.co.nz/cdn/images/products/xlarge/8089900_a.jpg";
  const thumbnail = new URL(preferProductThumbnail(image));
  assert.equal(thumbnail.pathname, "/cdn/images/products/large/8089900_a.jpg");
  assert.equal(preferHighResolutionProductImage(image), image);
  assert.equal(preferProductThumbnail(image, 480), image);

  const unverifiedImage = image.replace("8089900_a.jpg", "8089900_b.jpg");
  assert.equal(preferProductThumbnail(unverifiedImage), unverifiedImage);
});

test("limits approved Decathlon f=<width>x0 thumbnails and preserves other URL data", () => {
  const oversizedImage =
    "https://contents.mediadecathlon.com/p2704355/k%243bbcff8c29e8445fef3bb62d38588b81/picture.jpg?f=3000x0&format=auto&quality=80";
  const thumbnail = new URL(preferProductThumbnail(oversizedImage));
  assert.equal(thumbnail.searchParams.get("f"), "800x0");
  assert.equal(thumbnail.searchParams.get("format"), "auto");
  assert.equal(thumbnail.searchParams.get("quality"), "80");
  assert.equal(thumbnail.pathname, new URL(oversizedImage).pathname);

  const customLimit = new URL(preferProductThumbnail(oversizedImage, 480));
  assert.equal(customLimit.searchParams.get("f"), "480x0");
  assert.equal(customLimit.searchParams.get("format"), "auto");

  const smallWidth = oversizedImage.replace("3000x0", "600x0");
  const atLimit = oversizedImage.replace("3000x0", "800x0");
  const nonZeroHeight = oversizedImage.replace("3000x0", "3000x1000");
  const nonNumericWidth = oversizedImage.replace("3000x0", "auto");
  const missingFormat = oversizedImage.replace("f=3000x0&", "");
  for (const unchanged of [smallWidth, atLimit, nonZeroHeight, nonNumericWidth, missingFormat]) {
    assert.equal(preferProductThumbnail(unchanged), unchanged);
  }

  const unrelatedHost = oversizedImage.replace("contents.mediadecathlon.com", "other.example");
  const unrelatedPath = oversizedImage.replace("/p2704355/", "/private/");
  assert.equal(preferProductThumbnail(unrelatedHost), unrelatedHost);
  assert.equal(preferProductThumbnail(unrelatedPath), unrelatedPath);
});

test("limits approved Decathlon thumbnails through recursively nested image proxies", () => {
  const decathlonImage =
    "https://contents.mediadecathlon.com/p2704355/k%243bbcff8c29e8445fef3bb62d38588b81/picture.jpg?format=auto&f=3000x0";
  const nestedProxy =
    "/api/image-proxy?url=" +
    encodeURIComponent(`/api/image-proxy?url=${encodeURIComponent(decathlonImage)}&source=inner`) +
    "&source=outer";
  const optimizedOuter = new URL(preferProductThumbnail(nestedProxy), "https://youpu.local");
  const optimizedInner = new URL(optimizedOuter.searchParams.get("url")!, "https://youpu.local");
  const optimizedImage = new URL(optimizedInner.searchParams.get("url")!);

  assert.equal(optimizedImage.searchParams.get("f"), "800x0");
  assert.equal(optimizedImage.searchParams.get("format"), "auto");
  assert.equal(optimizedInner.searchParams.get("source"), "inner");
  assert.equal(optimizedOuter.searchParams.get("source"), "outer");
});

test("limits only square Specialized hero assets using their verified w/h parameters", () => {
  const specializedImage =
    "https://assets.specialized.com/i/specialized/93325-50_SJ-15-COMP-SEA-SILDST_HERO-SQUARE?version=2";
  const thumbnail = new URL(preferProductThumbnail(specializedImage));
  assert.equal(thumbnail.searchParams.get("w"), "800");
  assert.equal(thumbnail.searchParams.get("h"), "800");
  assert.equal(thumbnail.searchParams.get("version"), "2");

  const customLimit = new URL(preferProductThumbnail(specializedImage, 320));
  assert.equal(customLimit.searchParams.get("w"), "320");
  assert.equal(customLimit.searchParams.get("h"), "320");

  const smallerImage = `${specializedImage}&w=640&h=640`;
  assert.equal(preferProductThumbnail(smallerImage), smallerImage);
  const oversizedImage = `${specializedImage}&w=1200&h=1200`;
  const boundedImage = new URL(preferProductThumbnail(oversizedImage));
  assert.equal(boundedImage.searchParams.get("w"), "800");
  assert.equal(boundedImage.searchParams.get("h"), "800");

  const widthTallImage = new URL(preferProductThumbnail(`${specializedImage}&w=640&h=1200`));
  assert.equal(widthTallImage.searchParams.get("w"), "427");
  assert.equal(widthTallImage.searchParams.get("h"), "800");
  const wideImage = new URL(preferProductThumbnail(`${specializedImage}&w=1200&h=640`));
  assert.equal(wideImage.searchParams.get("w"), "800");
  assert.equal(wideImage.searchParams.get("h"), "427");
  const oneDimension = `${specializedImage}&w=1200`;
  assert.equal(preferProductThumbnail(oneDimension), oneDimension);
  const malformedDimensions = `${specializedImage}&w=0&h=1200`;
  assert.equal(preferProductThumbnail(malformedDimensions), malformedDimensions);

  const unrelatedPath = specializedImage.replace("_HERO-SQUARE", "_DETAIL");
  const unrelatedHost = specializedImage.replace("assets.specialized.com", "other.example");
  assert.equal(preferProductThumbnail(unrelatedPath), unrelatedPath);
  assert.equal(preferProductThumbnail(unrelatedHost), unrelatedHost);

  const proxiedImage = `/api/image-proxy?url=${encodeURIComponent(specializedImage)}&source=product`;
  const proxiedThumbnail = new URL(preferProductThumbnail(proxiedImage), "https://youpu.local");
  const optimizedSource = new URL(proxiedThumbnail.searchParams.get("url")!);
  assert.equal(optimizedSource.searchParams.get("w"), "800");
  assert.equal(optimizedSource.searchParams.get("h"), "800");
  assert.equal(proxiedThumbnail.searchParams.get("source"), "product");
});

test("bounds approved Amer Sports fit=bounds images without changing fit or quality", () => {
  const atomicImage =
    "https://cdn.amersports.com/0acef4a9-61b7-47b0-84f4-b49f00cdfc5f/ATP_AASS03784_0_GHO_Redster_Q9_I12_GW_FullImageWebOptimized.png?fit=bounds&format=auto&height=10380&quality=80&width=1445";
  const thumbnail = new URL(preferProductThumbnail(atomicImage));
  assert.equal(thumbnail.searchParams.get("width"), "800");
  assert.equal(thumbnail.searchParams.get("height"), "800");
  assert.equal(thumbnail.searchParams.get("fit"), "bounds");
  assert.equal(thumbnail.searchParams.get("format"), "auto");
  assert.equal(thumbnail.searchParams.get("quality"), "80");

  const detail = new URL(preferHighResolutionProductImage(atomicImage));
  assert.equal(detail.searchParams.get("width"), "1445");
  assert.equal(detail.searchParams.get("height"), "1600");

  const smallImage = atomicImage.replace("height=10380", "height=600").replace("width=1445", "width=500");
  assert.equal(preferProductThumbnail(smallImage), smallImage);

  for (const invalidDimensions of [
    atomicImage.replace("width=1445", "width=0"),
    atomicImage.replace("height=10380", "height=-10"),
    atomicImage.replace("width=1445", "width=12.5"),
    atomicImage.replace("&width=1445", ""),
    atomicImage.replace("&height=10380", ""),
    atomicImage.replace("width=1445", "width="),
  ]) {
    assert.equal(preferProductThumbnail(invalidDimensions), invalidDimensions);
  }

  const otherHost = atomicImage.replace("cdn.amersports.com", "other.example");
  const otherPath = atomicImage.replace("0acef4a9-61b7-47b0-84f4-b49f00cdfc5f", "unlisted");
  assert.equal(preferProductThumbnail(otherHost), otherHost);
  assert.equal(preferProductThumbnail(otherPath), otherPath);
});

test("uses officially referenced DJI small image variants only for verified product IDs", () => {
  const action5Image =
    "https://se-cdn.djiits.com/tpc/uploads/spu/cover/e4781624a38ba00d1b4a8bc3a204bd97@ultra.png?campaign=product";
  const thumbnail = new URL(preferProductThumbnail(action5Image));
  assert.equal(
    thumbnail.pathname,
    "/tpc/uploads/spu/cover/e4781624a38ba00d1b4a8bc3a204bd97@retina_small.png",
  );
  assert.equal(thumbnail.searchParams.get("campaign"), "product");

  const action4Image = action5Image.replace(
    "e4781624a38ba00d1b4a8bc3a204bd97@ultra",
    "e1b8110f65a5a3321fe487f0a1a061ac@ultra",
  );
  const action4Thumbnail = new URL(preferProductThumbnail(action4Image));
  assert.ok(action4Thumbnail.pathname.endsWith("e1b8110f65a5a3321fe487f0a1a061ac@retina_small.png"));

  const action6Image =
    "https://se-cdn.djiits.com/tpc/uploads/spu/cover/12bba4939cd4f341e741cdf5d2c8d9b0@ultra.png?format=webp";
  const action6Thumbnail = new URL(preferProductThumbnail(action6Image));
  assert.ok(action6Thumbnail.pathname.endsWith("12bba4939cd4f341e741cdf5d2c8d9b0@retina_small.png"));
  assert.equal(action6Thumbnail.searchParams.get("format"), "webp");

  const otherHost = action5Image.replace("se-cdn.djiits.com", "other.example");
  assert.equal(preferProductThumbnail(otherHost), otherHost);

  const proxiedImage = `/api/image-proxy?url=${encodeURIComponent(action5Image)}&source=product`;
  const proxiedThumbnail = new URL(preferProductThumbnail(proxiedImage), "https://youpu.local");
  const optimizedSource = new URL(proxiedThumbnail.searchParams.get("url")!);
  assert.ok(optimizedSource.pathname.endsWith("@retina_small.png"));
  assert.equal(proxiedThumbnail.searchParams.get("source"), "product");
});

test("limits approved K2 Amplience thumbnail widths and preserves other query parameters", () => {
  const missingWidth = new URL(
    preferProductThumbnail("https://cdn.media.amplience.net/i/k2/board.jpg?qlt=85&fmt=webp"),
  );
  assert.equal(missingWidth.searchParams.get("w"), "800");
  assert.equal(missingWidth.searchParams.get("qlt"), "85");
  assert.equal(missingWidth.searchParams.get("fmt"), "webp");

  const oversizedWidth = new URL(
    preferProductThumbnail("https://cdn.media.amplience.net/s/k2/board.jpg?w=1600&qlt=80&fmt=jpg"),
  );
  assert.equal(oversizedWidth.searchParams.get("w"), "800");
  assert.equal(oversizedWidth.searchParams.get("qlt"), "80");
  assert.equal(oversizedWidth.searchParams.get("fmt"), "jpg");

  const atLimit = "https://cdn.media.amplience.net/i/k2/board.jpg?w=800&qlt=80";
  const belowLimit = "https://cdn.media.amplience.net/s/k2/board.jpg?w=480&fmt=webp";
  assert.equal(preferProductThumbnail(atLimit), atLimit);
  assert.equal(preferProductThumbnail(belowLimit), belowLimit);

  const customLimit = new URL(
    preferProductThumbnail("https://cdn.media.amplience.net/i/k2/board.jpg?w=1200&qlt=85", 480),
  );
  assert.equal(customLimit.searchParams.get("w"), "480");
  assert.equal(customLimit.searchParams.get("qlt"), "85");

  const proxiedImage =
    "/api/image-proxy?url=" +
    encodeURIComponent("https://cdn.media.amplience.net/i/k2/board.jpg?qlt=85&fmt=webp") +
    "&source=product";
  const proxiedThumbnail = new URL(preferProductThumbnail(proxiedImage), "https://youpu.local");
  const optimizedSource = new URL(proxiedThumbnail.searchParams.get("url")!);
  assert.equal(optimizedSource.searchParams.get("w"), "800");
  assert.equal(optimizedSource.searchParams.get("qlt"), "85");
  assert.equal(optimizedSource.searchParams.get("fmt"), "webp");
  assert.equal(proxiedThumbnail.searchParams.get("source"), "product");

  const unrelatedHost = "https://other.example/i/k2/board.jpg?w=1600";
  const unrelatedPath = "https://cdn.media.amplience.net/i/other/board.jpg?w=1600";
  assert.equal(preferProductThumbnail(unrelatedHost), unrelatedHost);
  assert.equal(preferProductThumbnail(unrelatedPath), unrelatedPath);
});

test("limits approved Canyon Cloudinary widths while preserving transformation components", () => {
  const canyonImage =
    "https://dma.canyon.com/image/upload/c_fit,w_1600,h_645,f_jpg,q_auto/products/bike.jpg";
  const thumbnail = preferProductThumbnail(canyonImage);
  assert.equal(
    thumbnail,
    "https://dma.canyon.com/image/upload/c_fit,w_800,h_645,f_jpg,q_auto/products/bike.jpg",
  );

  const smallerImage = "https://dma.canyon.com/image/upload/c_fit,w_600,h_645,f_jpg,q_auto/products/bike.jpg";
  assert.equal(preferProductThumbnail(smallerImage), smallerImage);
  assert.equal(
    preferProductThumbnail(canyonImage, 480),
    "https://dma.canyon.com/image/upload/c_fit,w_480,h_645,f_jpg,q_auto/products/bike.jpg",
  );

  const withoutWidth = "https://dma.canyon.com/image/upload/c_fit,h_645,f_jpg,q_auto/products/bike.jpg";
  assert.equal(preferProductThumbnail(withoutWidth), withoutWidth);
  assert.equal(
    preferProductThumbnail("https://other.example/image/upload/c_fit,w_1600,h_645/products/bike.jpg"),
    "https://other.example/image/upload/c_fit,w_1600,h_645/products/bike.jpg",
  );
  assert.equal(
    preferProductThumbnail("https://dma.canyon.com/products/bike.jpg?width=1600"),
    "https://dma.canyon.com/products/bike.jpg?width=1600",
  );
});

test("uses measured 543px Canyon bike thumbnails only for verified Cloudinary images", () => {
  const images: Array<{ source: string; thumbnail: string }> = [
    {
      source:
        "https://dma.canyon.com/image/upload/w_1145,h_645,c_fit/f_jpg/q_auto/v1779435706/2027_FULL_endurace_cf-7_4627_R129_P01_okspta",
      thumbnail:
        "https://dma.canyon.com/image/upload/w_543,c_fit/f_jpg/q_auto/v1779435706/2027_FULL_endurace_cf-7_4627_R129_P01_okspta",
    },
    {
      source:
        "https://dma.canyon.com/image/upload/w_1145,h_645,c_fit/f_jpg/q_auto/v1777355662/2027_FULL_endurace_cf-7-di2_4421_R129_P01_oopfry",
      thumbnail:
        "https://dma.canyon.com/image/upload/w_543,c_fit/f_jpg/q_auto/v1777355662/2027_FULL_endurace_cf-7-di2_4421_R129_P01_oopfry",
    },
    {
      source:
        "https://dma.canyon.com/image/upload/w_1145,h_645,c_fit/b_rgb:F2F2F2/f_jpg/q_auto/v1777532962/2027_FULL_aeroad_cf-slx-7-di2_4531_R107_P01_zsqbop",
      thumbnail:
        "https://dma.canyon.com/image/upload/w_543,c_fit/b_rgb:F2F2F2/f_jpg/q_auto/v1777532962/2027_FULL_aeroad_cf-slx-7-di2_4531_R107_P01_zsqbop",
    },
    {
      source:
        "https://dma.canyon.com/image/upload/w_1145,h_645,c_fit/f_jpg/q_auto/v1787554526/2027_FULL_spectral_cf-7_4380_M179_P08_P5_29_yyqkjb",
      thumbnail:
        "https://dma.canyon.com/image/upload/w_543,c_fit/f_jpg/q_auto/v1787554526/2027_FULL_spectral_cf-7_4380_M179_P08_P5_29_yyqkjb",
    },
  ];

  for (const { source, thumbnail } of images) {
    assert.equal(preferProductThumbnail(source), thumbnail);
    assert.equal(preferHighResolutionProductImage(source), source);
  }

  const unverified = images[0]!.source.replace("endurace_cf-7_4627", "unverified-bike");
  assert.equal(
    preferProductThumbnail(unverified),
    unverified.replace("w_1145", "w_800"),
  );
});

test("limits approved Canyon Cloudinary URLs nested inside the image proxy", () => {
  const canyonImage =
    "https://dma.canyon.com/image/upload/c_fit,w_1600,h_645,f_jpg,q_auto/products/bike.jpg";
  const proxiedImage = `/api/image-proxy?url=${encodeURIComponent(canyonImage)}&source=product`;
  const proxiedThumbnail = new URL(preferProductThumbnail(proxiedImage), "https://youpu.local");

  assert.equal(
    proxiedThumbnail.searchParams.get("url"),
    "https://dma.canyon.com/image/upload/c_fit,w_800,h_645,f_jpg,q_auto/products/bike.jpg",
  );
  assert.equal(proxiedThumbnail.searchParams.get("source"), "product");
});

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

  const commonsPhoto = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Altay_China_horizon_-_Jiangjunshan_Ski_Resort.jpg/1920px-Altay_China_horizon_-_Jiangjunshan_Ski_Resort.jpg";
  assert.equal(resolveImageUrl(commonsPhoto, true), commonsPhoto);
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
  assert.equal(isAllowedImageUrl("https://www.burton.com/cdn/shop/files/107121CA03_1.webp"), true);
  assert.equal(isAllowedImageUrl("https://eu.burton.com/private/other.webp"), false);
  assert.equal(isAllowedImageUrl("https://shop.au.victorsport.com/cdn/shop/products/racket.jpg"), true);
  assert.equal(isAllowedImageUrl("https://youpu.tos-cn-beijing.volces.com/review-images/rating-photo.webp"), true);
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
    "https://www.nitrosnowboards.com/cdn/shop/files/11SB11022-101-149_T1_Product-1.jpg",
    "https://www.nitrosnowboards.com/cdn/shop/files/11SB11023-101-146_Optisym_Product-1.jpg",
    "https://capitasnowboarding.com/cdn/shop/files/RST04-BOAF-148.png",
    "https://neversummer.com/cdn/shop/files/ProtoFR_TOP2.webp",
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
    isAllowedImageUrl("https://cdn.dam.salomon.com/952a91a1-77dc-4243-9975-b3b801009c2d/L49293700/PNG-2000px-max-72dpi.png"),
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

test("allows only selected 1920px Commons hero photos", () => {
  assert.equal(
    isAllowedImageUrl(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Altay_China_horizon_-_Jiangjunshan_Ski_Resort.jpg/1920px-Altay_China_horizon_-_Jiangjunshan_Ski_Resort.jpg",
    ),
    true,
  );
  assert.equal(
    isAllowedImageUrl(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Snow_Scenery_in_Altay_Prefecture%2C_Xinjiang%2C_China%2C_picture3.jpg/1920px-Snow_Scenery_in_Altay_Prefecture%2C_Xinjiang%2C_China%2C_picture3.jpg",
    ),
    true,
  );
  assert.equal(
    isAllowedImageUrl(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Snow_Scenery_in_Altay_Prefecture%2C_Xinjiang%2C_China%2C_picture10.jpg/1920px-Snow_Scenery_in_Altay_Prefecture%2C_Xinjiang%2C_China%2C_picture10.jpg",
    ),
    true,
  );
  assert.equal(
    isAllowedImageUrl(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Snow_Scenery_in_Altay_Prefecture%2C_Xinjiang%2C_China%2C_picture1.jpg/1920px-Snow_Scenery_in_Altay_Prefecture%2C_Xinjiang%2C_China%2C_picture1.jpg",
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
