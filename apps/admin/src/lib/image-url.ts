const SMALL_IMAGE_WIDTH = 96;
const VERIFIED_HEAD_ADMIN_THUMBNAILS = new Map([
  [
    "/CDN3/D/316485/1/1820x2428/easy-joy-r.webp",
    "/CDN3/D/316485/1/224x298/easy-joy-r.webp",
  ],
  [
    "/CDN3/D/316225/1/1820x2428/shape-v2-r.webp",
    "/CDN3/D/316225/1/224x298/shape-v2-r.webp",
  ],
  [
    "/CDN3/D/313236.SET_WO/5/1820x2428/worldcup-rebels-e-sl-pro-without-binding.webp",
    "/CDN3/D/313236.SET_WO/5/224x298/worldcup-rebels-e-sl-pro-without-binding.webp",
  ],
  [
    "/CDN3/D/313306.SET_31330602/5/1820x2428/supershape-e-magnum-with-binding-protector-evo-pr-11-gw.webp",
    "/CDN3/D/313306.SET_31330602/5/224x298/supershape-e-magnum-with-binding-protector-evo-pr-11-gw.webp",
  ],
  [
    "/CDN3/D/313365.SET_WO/4/1820x2428/worldcup-rebels-e-slr-without-binding.webp",
    "/CDN3/D/313365.SET_WO/4/224x298/worldcup-rebels-e-slr-without-binding.webp",
  ],
]);
const VERIFIED_SALOMON_ADMIN_THUMBNAIL_PATH =
  "/5b8f5563-c91f-4f49-b794-b36700db5564/L49278500/PNG-2000px-max-72dpi.png";
const SALOMON_ADMIN_THUMBNAIL_WIDTH = 120;

/** 后台 52px 商品清单缩略图：仅处理已验证的 Shopify、HEAD 与 Salomon 图源。 */
export function preferAdminListThumbnail(source: string): string {
  try {
    const image = new URL(source);
    if (image.hostname === "cdn-mdb.head.com") {
      const verifiedThumbnail = VERIFIED_HEAD_ADMIN_THUMBNAILS.get(image.pathname);
      if (verifiedThumbnail) {
        image.pathname = verifiedThumbnail;
        return image.toString();
      }
      return source;
    }
    if (
      image.hostname === "cdn.dam.salomon.com" &&
      image.pathname === VERIFIED_SALOMON_ADMIN_THUMBNAIL_PATH
    ) {
      const requestedWidth = image.searchParams.get("width");
      const currentWidth = requestedWidth === null ? undefined : Number(requestedWidth);
      if (
        requestedWidth === null ||
        (currentWidth !== undefined && Number.isFinite(currentWidth) && currentWidth > SALOMON_ADMIN_THUMBNAIL_WIDTH)
      ) {
        image.searchParams.set("width", String(SALOMON_ADMIN_THUMBNAIL_WIDTH));
        return image.toString();
      }
      return source;
    }

    const isShopifyImage =
      image.pathname.includes("/cdn/shop/") ||
      (image.hostname === "cdn.shopify.com" && image.pathname.startsWith("/s/files/"));
    if (!isShopifyImage) return source;

    const requestedWidth = image.searchParams.get("width");
    const currentWidth = requestedWidth === null ? undefined : Number(requestedWidth);
    if (
      requestedWidth === null ||
      (currentWidth !== undefined && Number.isFinite(currentWidth) && currentWidth > SMALL_IMAGE_WIDTH)
    ) {
      image.searchParams.set("width", String(SMALL_IMAGE_WIDTH));
      return image.toString();
    }
    return source;
  } catch {
    return source;
  }
}
