const IMAGE_PROXY_PATH = "/api/image-proxy";
const CDN_HOST = "g.cdn.meoo.host";
const CDN_IMAGE_PREFIX = "/uvayfd7jql5o/ai-images/";

export function isAllowedImageUrl(source: string): boolean {
  if (source.startsWith("/") && !source.startsWith("//")) return true;
  if (!source.startsWith("https://")) return false;

  try {
    const url = new URL(source);
    return (
      url.protocol === "https:" &&
      url.hostname === CDN_HOST &&
      url.port === "" &&
      url.username === "" &&
      url.password === "" &&
      url.pathname.startsWith(CDN_IMAGE_PREFIX)
    );
  } catch {
    return false;
  }
}

export function resolveImageUrl(source: string, useProxy = process.env.NODE_ENV === "development") {
  if (!useProxy || !isAllowedImageUrl(source) || !source.startsWith("https://")) {
    return source;
  }

  try {
    const url = new URL(source);
    if (url.protocol !== "https:" || url.hostname !== CDN_HOST) {
      return source;
    }

    return `${IMAGE_PROXY_PATH}?url=${encodeURIComponent(url.toString())}`;
  } catch {
    return source;
  }
}
