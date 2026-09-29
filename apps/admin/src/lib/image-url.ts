const SMALL_IMAGE_WIDTH = 96;

/** 后台 52px 商品清单缩略图：仅收窄 Shopify 图源，不改详情和未知 CDN。 */
export function preferAdminListThumbnail(source: string): string {
  try {
    const image = new URL(source);
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
