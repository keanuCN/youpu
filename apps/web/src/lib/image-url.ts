const IMAGE_PROXY_PATH = "/api/image-proxy";

/**
 * 远程图片只允许来自明确登记的产品图片路径。
 * 新品类的本地演示图来自品牌官网或公开零售页面，正式上线前仍应迁移到自有 COS。
 */
const REMOTE_IMAGE_RULES = [
  { host: "g.cdn.meoo.host", pathPrefix: "/uvayfd7jql5o/ai-images/" },
  { host: "us.yonex.com", pathPrefix: "/cdn/shop/files/" },
  { host: "shop.au.victorsport.com", pathPrefix: "/cdn/shop/" },
  { host: "bbsports.co.nz", pathPrefix: "/cdn/shop/" },
  { host: "www.smartmarine.co.nz", pathPrefix: "/cdn/images/products/" },
  { host: "www.follows.co.jp", pathPrefix: "/pic-labo/" },
  { host: "contents.mediadecathlon.com", pathPrefix: "/p" },
  { host: "graysnowboards.co.jp", pathPrefix: "/wp2021/wp-content/themes/gray/images/img_" },
  { host: "cdn.shopify.com", pathPrefix: "/s/files/1/0231/7366/0752/files/" },
  { host: "cdn.shopify.com", pathPrefix: "/s/files/1/0580/2773/7217/files/" },
  { host: "cdn.shopify.com", pathPrefix: "/s/files/1/0804/4062/3361/files/" },
  { host: "cdn.shopify.com", pathPrefix: "/s/files/1/0641/4722/6759/files/" },
  { host: "cdn.shopify.com", pathPrefix: "/s/files/1/0694/6291/7272/files/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/af8e2e75-eeed-4307-9ef2-b3b8010090b3/L49291700/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/27ef3c33-710b-4b27-8734-b3b801009110/L49292000/" },
  { host: "cdn.dam.salomon.com", pathPrefix: "/e650fee6-2dae-488b-9c35-b3b80100923d/L49292200/" },
  { host: "www.ogasaka-snowboard.com", pathPrefix: "/2025-img/" },
  { host: "blauerboardshop.com", pathPrefix: "/cdn/shop/files/" },
  { host: "www.milosport.com", pathPrefix: "/cdn/shop/files/" },
  { host: "point-official.shop", pathPrefix: "/img/goods/" },
  { host: "www.point-official.shop", pathPrefix: "/img/goods/" },
  { host: "anglerscentral.my", pathPrefix: "/cdn/shop/files/" },
  { host: "www.anglerscentral.my", pathPrefix: "/cdn/shop/files/" },
  { host: "se-cdn.djiits.com", pathPrefix: "/tpc/uploads/spu/cover/" },
  { host: "www-cdn.djiits.com", pathPrefix: "/cms/uploads/" },
  { host: "cdn-mdb.head.com", pathPrefix: "/CDN3/D/313365.SET_WO/" },
  { host: "gopro.com", pathPrefix: "/on/demandware.static/-/Sites-gopro-products/" },
  { host: "wassets.insta360.com", pathPrefix: "/common/" },
  { host: "res.insta360.com", pathPrefix: "/static/" },
  { host: "dma.canyon.com", pathPrefix: "/image/upload/" },
  { host: "www.canyon.com", pathPrefix: "/dw/image/" },
  { host: "assets.specialized.com", pathPrefix: "/i/specialized/" },
  { host: "images2.giant-bicycles.com", pathPrefix: "/b_white" },
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

  return `${IMAGE_PROXY_PATH}?url=${encodeURIComponent(source)}`;
}
