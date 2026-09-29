import assert from "node:assert/strict";
import test from "node:test";

import {
  isAllowedImageUrl,
  preferHighResolutionProductImage,
  preferProductThumbnail,
  resolveImageUrl,
} from "./image-url";

const CDN_IMAGE =
  "https://g.cdn.meoo.host/uvayfd7jql5o/ai-images/board-base-01.png?auth_key=test";

test("limits Shopify product images to thumbnail width without changing detail images", () => {
  const largeImage = "https://eu.burton.com/cdn/shop/files/board.webp?v=1&width=2880";
  const thumbnail = preferProductThumbnail(largeImage);
  assert.equal(new URL(thumbnail).searchParams.get("width"), "800");
  assert.equal(new URL(thumbnail).searchParams.get("v"), "1");
  assert.equal(new URL(preferProductThumbnail(largeImage, 480)).searchParams.get("width"), "480");

  const unboundedShopifyImage = "https://cdn.shopify.com/s/files/1/0231/7366/0752/files/board.png?v=1";
  const boundedShopifyImage = preferProductThumbnail(unboundedShopifyImage);
  assert.equal(new URL(boundedShopifyImage).searchParams.get("width"), "800");
  assert.equal(new URL(boundedShopifyImage).searchParams.get("v"), "1");

  const proxiedImage = `/api/image-proxy?url=${encodeURIComponent(largeImage)}`;
  const proxiedThumbnail = preferProductThumbnail(proxiedImage);
  const proxiedUrl = new URL(proxiedThumbnail, "https://youpu.local");
  assert.equal(new URL(proxiedUrl.searchParams.get("url")!).searchParams.get("width"), "800");

  const alreadySmall = "https://us.yonex.com/cdn/shop/files/racket.webp?width=600";
  assert.equal(preferProductThumbnail(alreadySmall), alreadySmall);
  const nonShopify = "https://cdn.dam.salomon.com/product.png?width=2000";
  assert.equal(preferProductThumbnail(nonShopify), nonShopify);
});

test("keeps product detail images high resolution while bounding verified CDN sources", () => {
  const shopify = "https://eu.burton.com/cdn/shop/files/board.webp?v=1&width=800";
  assert.equal(new URL(preferHighResolutionProductImage(shopify)).searchParams.get("width"), "1600");

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

  const otherHost = atomicImage.replace("cdn.amersports.com", "other.example");
  const otherPath = atomicImage.replace("0acef4a9-61b7-47b0-84f4-b49f00cdfc5f", "unlisted");
  assert.equal(preferProductThumbnail(otherHost), otherHost);
  assert.equal(preferProductThumbnail(otherPath), otherPath);
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
