const IMAGE_PROXY_PATH = "/api/image-proxy";
const PRODUCT_THUMBNAIL_WIDTH = 800;
const DJI_SMALL_IMAGE_VARIANTS = new Map([
  [
    "/tpc/uploads/spu/cover/e1b8110f65a5a3321fe487f0a1a061ac@ultra.png",
    "/tpc/uploads/spu/cover/e1b8110f65a5a3321fe487f0a1a061ac@retina_small.png",
  ],
  [
    "/tpc/uploads/spu/cover/e4781624a38ba00d1b4a8bc3a204bd97@ultra.png",
    "/tpc/uploads/spu/cover/e4781624a38ba00d1b4a8bc3a204bd97@retina_small.png",
  ],
]);

/** AI 素材只用于装饰性页面，不作为商品详情的商品实拍图。 */
export function isAiGeneratedImageUrl(source: string): boolean {
  try {
    const image = new URL(source, "https://youpu.local");
    const proxiedSource = image.searchParams.get("url");
    if (proxiedSource) return isAiGeneratedImageUrl(proxiedSource);
    return image.hostname === "g.cdn.meoo.host" && image.pathname.startsWith("/uvayfd7jql5o/ai-images/");
  } catch {
    return false;
  }
}

/** 详情大图至少请求 1600px 的 Shopify 变体，并限制其他已验证来源的超大原图。 */
export function preferHighResolutionProductImage(source: string): string {
  try {
    const image = new URL(source, "https://youpu.local");
    if (image.pathname === IMAGE_PROXY_PATH) {
      const proxiedSource = image.searchParams.get("url");
      if (!proxiedSource) return source;
      image.searchParams.set("url", preferHighResolutionProductImage(proxiedSource));
      return `${image.pathname}${image.search}`;
    }
    const boundedSource = preferProductThumbnail(source, 1600);
    const boundedImage = new URL(boundedSource, "https://youpu.local");
    const isShopifyImage =
      boundedImage.pathname.includes("/cdn/shop/") ||
      (boundedImage.hostname === "cdn.shopify.com" && boundedImage.pathname.startsWith("/s/files/"));
    let upgradedShopifyImage = false;
    if (isShopifyImage) {
      const requestedWidth = boundedImage.searchParams.get("width");
      const width = Number(requestedWidth);
      if (requestedWidth === null || (Number.isFinite(width) && width > 0 && width < 1600)) {
        boundedImage.searchParams.set("width", "1600");
        upgradedShopifyImage = true;
      }
    }
    return upgradedShopifyImage ? boundedImage.toString() : boundedSource;
  } catch {
    return source;
  }
}

/** 商品卡片只显示缩略图；对支持 Shopify width 参数的图片限制请求尺寸。 */
export function preferProductThumbnail(source: string, maxWidth = PRODUCT_THUMBNAIL_WIDTH): string {
  try {
    const widthLimit = Number.isFinite(maxWidth) && maxWidth > 0 ? Math.floor(maxWidth) : PRODUCT_THUMBNAIL_WIDTH;
    const image = new URL(source, "https://youpu.local");
    if (image.pathname === IMAGE_PROXY_PATH) {
      const proxiedSource = image.searchParams.get("url");
      if (!proxiedSource) return source;
      image.searchParams.set("url", preferProductThumbnail(proxiedSource, widthLimit));
      return `${image.pathname}${image.search}`;
    }
    const isShopifyImage =
      image.pathname.includes("/cdn/shop/") ||
      (image.hostname === "cdn.shopify.com" && image.pathname.startsWith("/s/files/"));
    if (isShopifyImage) {
      const requestedWidth = image.searchParams.get("width");
      const width = Number(requestedWidth);
      if (requestedWidth === null || (Number.isFinite(width) && width > widthLimit)) {
        image.searchParams.set("width", String(widthLimit));
        return image.toString();
      }
    }
    if (image.hostname === "cdn.dam.salomon.com" && isAllowedRemoteImageUrl(image.toString())) {
      const requestedWidth = image.searchParams.get("width");
      const width = Number(requestedWidth);
      if (requestedWidth === null || (Number.isFinite(width) && width > widthLimit)) {
        image.searchParams.set("width", String(widthLimit));
        return image.toString();
      }
    }
    if (image.hostname === "cdn.media.amplience.net" && isAllowedRemoteImageUrl(image.toString())) {
      const requestedWidth = image.searchParams.get("w");
      const width = Number(requestedWidth);
      if (requestedWidth === null || (Number.isFinite(width) && width > widthLimit)) {
        image.searchParams.set("w", String(widthLimit));
        return image.toString();
      }
    }
    if (
      image.hostname === "www.rossignol.com" &&
      image.pathname.startsWith("/dw/image/v2/BJJZ_PRD/on/demandware.static/-/Sites-rossignol-catalog/") &&
      isAllowedRemoteImageUrl(image.toString())
    ) {
      const requestedWidth = image.searchParams.get("sw");
      const width = Number(requestedWidth);
      const targetWidth = Math.min(widthLimit, 480);
      if (requestedWidth !== null && Number.isFinite(width) && width > targetWidth) {
        image.searchParams.set("sw", String(targetWidth));
        return image.toString();
      }
    }
    if (image.hostname === "contents.mediadecathlon.com" && isAllowedRemoteImageUrl(image.toString())) {
      const requestedFormat = image.searchParams.get("f");
      const match = requestedFormat?.match(/^(\d+)x0$/);
      if (match) {
        const width = Number(match[1]);
        if (Number.isFinite(width) && width > widthLimit) {
          image.searchParams.set("f", `${widthLimit}x0`);
          return image.toString();
        }
      }
    }
    if (
      image.hostname === "assets.specialized.com" &&
      image.pathname.endsWith("_HERO-SQUARE") &&
      isAllowedRemoteImageUrl(image.toString())
    ) {
      const requestedWidth = image.searchParams.get("w");
      const requestedHeight = image.searchParams.get("h");
      const width = requestedWidth === null ? undefined : Number(requestedWidth);
      const height = requestedHeight === null ? undefined : Number(requestedHeight);
      if (
        (requestedWidth === null && requestedHeight === null) ||
        (Number.isFinite(width) && Number.isFinite(height) && (width! > widthLimit || height! > widthLimit))
      ) {
        image.searchParams.set("w", String(widthLimit));
        image.searchParams.set("h", String(widthLimit));
        return image.toString();
      }
    }
    const djiSmallImagePath = DJI_SMALL_IMAGE_VARIANTS.get(image.pathname);
    if (
      image.hostname === "se-cdn.djiits.com" &&
      djiSmallImagePath &&
      widthLimit <= 800 &&
      isAllowedRemoteImageUrl(image.toString())
    ) {
      image.pathname = djiSmallImagePath;
      return image.toString();
    }
    if (
      image.hostname === "cdn.amersports.com" &&
      image.searchParams.get("fit") === "bounds" &&
      isAllowedRemoteImageUrl(image.toString())
    ) {
      const requestedWidth = image.searchParams.get("width");
      const requestedHeight = image.searchParams.get("height");
      const width = requestedWidth === null ? undefined : Number(requestedWidth);
      const height = requestedHeight === null ? undefined : Number(requestedHeight);
      if (Number.isFinite(width) && Number.isFinite(height)) {
        const targetWidth = Math.min(width!, widthLimit);
        const targetHeight = Math.min(height!, widthLimit);
        if (targetWidth < width! || targetHeight < height!) {
          image.searchParams.set("width", String(targetWidth));
          image.searchParams.set("height", String(targetHeight));
          return image.toString();
        }
      }
    }
    if (
      image.hostname === "dma.canyon.com" &&
      image.pathname.includes("/image/upload/") &&
      isAllowedRemoteImageUrl(image.toString())
    ) {
      let changed = false;
      const pathname = image.pathname
        .split("/")
        .map((component) =>
          component.replace(/(^|,)w_(\d+)(?=,|$)/g, (match, separator: string, value: string) => {
            const width = Number(value);
            if (width <= widthLimit) return match;
            changed = true;
            return `${separator}w_${widthLimit}`;
          }),
        )
        .join("/");
      if (changed) {
        image.pathname = pathname;
        return image.toString();
      }
    }
    return source;
  } catch {
    return source;
  }
}

/**
 * 远程图片只允许来自明确登记的产品图片路径。
 * 新品类的本地样例图来自品牌官网或公开零售页面，正式上线前仍应迁移到自有 COS。
 */
const REMOTE_IMAGE_RULES = [
  { host: "eu.burton.com", pathPrefix: "/cdn/shop/files/" },
  { host: "www.burton.com", pathPrefix: "/cdn/shop/files/" },
  { host: "www.arbor-collective.ca", pathPrefix: "/cdn/shop/files/" },
  { host: "www.evo.com", pathPrefix: "/cdn/shop/files/product-image-" },
  { host: "static1.squarespace.com", pathPrefix: "/static/5c969a2f7fdcb8b66429acbe/" },
  { host: "snowboards.com", pathPrefix: "/files/store/items/lg/f/w/fw26--doa_150.jpg" },
  { host: "images.blue-tomato.com", pathPrefix: "/is/image/bluetomato/" },
  { host: "www.jonessnowboards.com", pathPrefix: "/cdn/shop/files/" },
  { host: "original.accentuate.io", pathPrefix: "/6939308982453/" },
  { host: "glisshop-glisshop-fr-storage.omn.proximis.com", pathPrefix: "/Imagestorage/imagesSynchro/" },
  { host: "www.nitrosnow.ca", pathPrefix: "/cdn/shop/files/" },
  { host: "www.nitrosnowboards.com", pathPrefix: "/cdn/shop/files/" },
  { host: "salomon.jp", pathPrefix: "/cdn/shop/files/" },
  { host: "cdn.amersports.com", pathPrefix: "/017bc76f-f5cc-42b8-a786-b49f00cdff46/" },
  { host: "cdn.amersports.com", pathPrefix: "/8fd450be-84c9-4bed-b255-b49f00cdfdd0/" },
  { host: "cdn.amersports.com", pathPrefix: "/0acef4a9-61b7-47b0-84f4-b49f00cdfc5f/" },
  { host: "cdn.amersports.com", pathPrefix: "/59174f3d-d998-49a3-ae2a-b49f00cdfb23/" },
  { host: "cdn.amersports.com", pathPrefix: "/47a56e73-6422-4d40-bcf3-b4bf00ada651/" },
  { host: "www.nordica.com", pathPrefix: "/storage/Product/" },
  { host: "cdn-mdb.head.com", pathPrefix: "/CDN3/D/313236.SET_WO/" },
  { host: "cdn-mdb.head.com", pathPrefix: "/CDN3/D/316485/" },
  { host: "cdn-mdb.head.com", pathPrefix: "/CDN3/D/316225/" },
  { host: "cdn-mdb.head.com", pathPrefix: "/CDN3/D/313306.SET_31330602/" },
  { host: "www.rossignol.com", pathPrefix: "/dw/image/v2/BJJZ_PRD/on/demandware.static/-/Sites-rossignol-catalog/" },
  { host: "g.cdn.meoo.host", pathPrefix: "/uvayfd7jql5o/ai-images/" },
  { host: "us.yonex.com", pathPrefix: "/cdn/shop/files/" },
  { host: "shop.au.victorsport.com", pathPrefix: "/cdn/shop/" },
  { host: "bbsports.co.nz", pathPrefix: "/cdn/shop/" },
  { host: "www.smartmarine.co.nz", pathPrefix: "/cdn/images/products/" },
  { host: "www.follows.co.jp", pathPrefix: "/pic-labo/" },
  { host: "contents.mediadecathlon.com", pathPrefix: "/p" },
  { host: "graysnowboards.co.jp", pathPrefix: "/wp2021/wp-content/themes/gray/images/img_" },
  { host: "youpu.tos-cn-beijing.volces.com", pathPrefix: "/review-images/" },
  { host: "cdn.shopify.com", pathPrefix: "/s/files/1/0231/7366/0752/files/" },
  { host: "cdn.shopify.com", pathPrefix: "/s/files/1/0580/2773/7217/files/" },
  { host: "cdn.shopify.com", pathPrefix: "/s/files/1/0804/4062/3361/files/" },
  { host: "cdn.media.amplience.net", pathPrefix: "/i/k2/" },
  { host: "cdn.media.amplience.net", pathPrefix: "/s/k2/" },
  { host: "cdn.shopify.com", pathPrefix: "/s/files/1/0641/4722/6759/files/" },
  { host: "cdn.shopify.com", pathPrefix: "/s/files/1/0694/6291/7272/files/" },
  { host: "cdn.shopify.com", pathPrefix: "/s/files/1/0674/9582/1405/files/" },
  { host: "cdn.shopify.com", pathPrefix: "/s/files/1/0685/4131/7295/files/" },
  { host: "cdn.shopify.com", pathPrefix: "/s/files/1/0370/4055/4115/files/" },
  { host: "cdn.shopify.com", pathPrefix: "/s/files/1/0095/2254/4745/files/" },
  { host: "cdn.shopify.com", pathPrefix: "/s/files/1/0656/0251/9280/files/" },
  { host: "cdn.shopify.com", pathPrefix: "/s/files/1/0676/1031/3014/files/" },
  { host: "www.fluxsnowboarding.com", pathPrefix: "/cdn/shop/files/" },
  { host: "kailasgear.com", pathPrefix: "/cdn/shop/files/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/fb6d3e52-e631-4fe0-9ca7-b36001082c68/L49290100/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/2dd43218-0575-4f37-92d2-b360010835d6/L49289600/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/06801898-0c9a-4476-b079-b31b00b424be/L47939700/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/68e6042c-dc3a-4478-a479-b360010827af/L49289500/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/9daa7dca-1d3d-4022-b448-b360010834ff/L49289300/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/8e5e6b58-7bb3-4636-9c58-b2f4013ba909/L47671400/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/f0c57cc4-3429-4574-a398-b36001082f58/L45450200/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/4e88d690-8431-4ab7-b0f7-b36001082530/L45439300/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/ffcd71ac-1349-455b-8d18-b40c01097548/L49259900/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/a49973b1-d25c-4d92-8003-b3600109189a/L49298000/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/eda3d183-166b-40cf-9bbc-b36001090e5c/L49140500/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/0014fcf7-0671-47c1-8bdd-b40c010d18ef/L49262200/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/3d71cf3c-5e2c-4237-b2c2-b2f4008d48ad/L47773300/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/5b8f5563-c91f-4f49-b794-b36700db5564/L49278500/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/f11bca7a-d437-4723-9233-b3e200a0ffbd/L45448100/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/2f5a59c3-6fa1-4e55-9a3a-b2f800ae89f1/L47242900/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/39e8cd4e-f1cd-44d9-95bd-b2f800ae88fa/L47033600/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/2d8d238e-a3de-42e8-8636-b3600108ff81/L45418900/" },
  { host: "contents.mediadecathlon.com", pathPrefix: "/p2573496/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/af8e2e75-eeed-4307-9ef2-b3b8010090b3/L49291700/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/f142d815-a33c-4a23-ab3a-b31b00bd6bb5/L47824000%2B/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/a71fd066-4d36-4bfa-951d-b45100de98e2/L49189000%2B/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/bc1e0c3d-981e-48e7-bd6a-b2f40157afe3/L47232400%2B/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/f1b63fed-8741-4144-802d-b2f40156d659/L47232300%2B/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/c7f0b14e-8431-4677-ad87-b2f301454446/L47713400%2B/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/d46f845f-a04e-4b4c-8419-b45100de593b/L45457300%2B/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/27ef3c33-710b-4b27-8734-b3b801009110/L49292000/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/e650fee6-2dae-488b-9c35-b3b80100923d/L49292200/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/952a91a1-77dc-4243-9975-b3b801009c2d/L49293700/" },
  { host: "www.ogasaka-snowboard.com", pathPrefix: "/2025-img/" },
  { host: "capitasnowboarding.com", pathPrefix: "/cdn/shop/files/RST04-BOAF-" },
  { host: "neversummer.com", pathPrefix: "/cdn/shop/files/ProtoFR_TOP2.webp" },
  { host: "blauerboardshop.com", pathPrefix: "/cdn/shop/files/" },
  { host: "www.milosport.com", pathPrefix: "/cdn/shop/files/" },
  { host: "point-official.shop", pathPrefix: "/img/goods/" },
  { host: "www.point-official.shop", pathPrefix: "/img/goods/" },
  { host: "anglerscentral.my", pathPrefix: "/cdn/shop/files/" },
  { host: "www.anglerscentral.my", pathPrefix: "/cdn/shop/files/" },
  { host: "se-cdn.djiits.com", pathPrefix: "/tpc/uploads/spu/cover/" },
  { host: "www-cdn.djiits.com", pathPrefix: "/cms/uploads/" },
  { host: "cdn-mdb.head.com", pathPrefix: "/CDN3/D/313365.SET_WO/" },
  { host: "img-cdn.heureka.group", pathPrefix: "/v1/d23ae16d-8f92-56f6-a776-2ace62a9bcb1.jpg" },
  { host: "gopro.com", pathPrefix: "/on/demandware.static/-/Sites-gopro-products/" },
  { host: "wassets.insta360.com", pathPrefix: "/common/" },
  { host: "res.insta360.com", pathPrefix: "/static/" },
  { host: "dma.canyon.com", pathPrefix: "/image/upload/" },
  { host: "www.canyon.com", pathPrefix: "/dw/image/" },
  { host: "assets.specialized.com", pathPrefix: "/i/specialized/" },
  { host: "images2.giant-bicycles.com", pathPrefix: "/b_white" },
  {
    host: "upload.wikimedia.org",
    pathPrefix:
      "/wikipedia/commons/thumb/9/9e/Altay_China_horizon_-_Jiangjunshan_Ski_Resort.jpg/1920px-Altay_China_horizon_-_Jiangjunshan_Ski_Resort.jpg",
  },
  {
    host: "upload.wikimedia.org",
    pathPrefix:
      "/wikipedia/commons/thumb/3/3b/Snow_Scenery_in_Altay_Prefecture%2C_Xinjiang%2C_China%2C_picture3.jpg/1920px-Snow_Scenery_in_Altay_Prefecture%2C_Xinjiang%2C_China%2C_picture3.jpg",
  },
  {
    host: "upload.wikimedia.org",
    pathPrefix:
      "/wikipedia/commons/thumb/8/83/Snow_Scenery_in_Altay_Prefecture%2C_Xinjiang%2C_China%2C_picture10.jpg/1920px-Snow_Scenery_in_Altay_Prefecture%2C_Xinjiang%2C_China%2C_picture10.jpg",
  },
  {
    host: "upload.wikimedia.org",
    pathPrefix:
      "/wikipedia/commons/thumb/7/7f/Snow_Scenery_in_Altay_Prefecture%2C_Xinjiang%2C_China%2C_picture1.jpg/1920px-Snow_Scenery_in_Altay_Prefecture%2C_Xinjiang%2C_China%2C_picture1.jpg",
  },
  {
    host: "390386bd-1bf0-4900-aa10-cac1793c9a23-afd-dqdkdpcqgcc6hahm.z01.azurefd.net",
    pathPrefix: "/-/media/Project/globeride/",
  },
] as const;

export function isAllowedRemoteImageUrl(source: string): boolean {
  try {
    const url = new URL(source);
    return (
      url.protocol === "https:" &&
      url.port === "" &&
      url.username === "" &&
      url.password === "" &&
      REMOTE_IMAGE_RULES.some(
        (rule) =>
          url.hostname === rule.host &&
          url.pathname.startsWith(rule.pathPrefix) &&
          (rule.host !== "contents.mediadecathlon.com" || /^\/p\d+\//.test(url.pathname)),
      )
    );
  } catch {
    return false;
  }
}

export function isAllowedImageUrl(source: string): boolean {
  if (source.startsWith("/") && !source.startsWith("//")) return true;
  return isAllowedRemoteImageUrl(source);
}

export function resolveImageUrl(source: string, useProxy = process.env.NODE_ENV === "development") {
  if (!useProxy || !isAllowedRemoteImageUrl(source)) {
    return source;
  }

  // Commons photos load reliably as native browser images, while the local
  // Node proxy can time out fetching Wikimedia. Keep them out of the proxy.
  if (new URL(source).hostname === "upload.wikimedia.org") {
    return source;
  }

  return `${IMAGE_PROXY_PATH}?url=${encodeURIComponent(source)}`;
}
