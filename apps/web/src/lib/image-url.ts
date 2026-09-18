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
  { host: "point-official.shop", pathPrefix: "/img/goods/" },
  { host: "www.point-official.shop", pathPrefix: "/img/goods/" },
  { host: "anglerscentral.my", pathPrefix: "/cdn/shop/files/" },
  { host: "www.anglerscentral.my", pathPrefix: "/cdn/shop/files/" },
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
        (rule) => url.hostname === rule.host && url.pathname.startsWith(rule.pathPrefix),
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
