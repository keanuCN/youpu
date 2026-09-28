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
    host: "image.kkday.com",
    pathPrefix: "/v2/image/get/c_fill%2Cq_55%2Ct_webp%2Cw_960/s1.kkday.com/product_543360/20251105082804_Pb8z8/jpg",
  },
  {
    host: "res.klook.com",
    pathPrefix: "/images/fl_lossy.progressive%2Cq_65/c_fill%2Cw_1295%2Ch_863/w_80%2Cx_15%2Cy_15%2Cg_south_west%2Cl_Klook_water_br_trans_yhcmh3/activities/iz92uiuyz23pb78arumb/High-speedtrainstationpick-upanddrop-offbetweenZhangjiakouStationChongliStationandWanlongSkiResort.jpg",
  },
  { host: "news.cnjiwang.com", pathPrefix: "/jwyc/202312/W020231223357959480031.JPG" },
  { host: "imagepphcloud.thepaper.cn", pathPrefix: "/pph/image/324/885/471.jpg" },
  { host: "www.xinjiangmei.com", pathPrefix: "/wp-content/uploads/2024/06/Untitled-design-1-1536x1024.jpg" },
  { host: "dimg04.c-ctrip.com", pathPrefix: "/images/1lo6z12000blg7cheD1B6_C_900_504_Q90_Mtg_7.jpg" },
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
