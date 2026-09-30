const SMALL_IMAGE_WIDTH = 96;
const VERIFIED_HEAD_ADMIN_THUMBNAILS = new Map([
  [
    "/CDN3/D/313365.SET_WO/4/1820x2428/worldcup-rebels-e-slr-without-binding.webp",
    "/CDN3/D/313365.SET_WO/4/224x298/worldcup-rebels-e-slr-without-binding.webp",
  ],
]);

/** 后台 52px 商品清单缩略图：仅处理已验证的 Shopify 与 HEAD 图源，不改详情和未知 CDN。 */
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
