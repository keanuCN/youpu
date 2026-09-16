import { NextRequest } from "next/server";

// 静态导出时该路径只生成兜底响应；生产页面直接使用 CDN 图片，开发环境仍可走代理。
export const dynamic = "force-static";

const CDN_HOST = "g.cdn.meoo.host";
const CDN_IMAGE_PREFIX = "/uvayfd7jql5o/ai-images/";
const ALLOWED_RASTER_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

export async function GET(request: NextRequest) {
  const source = new URL(request.url).searchParams.get("url");
  if (!source) {
    return new Response("Missing image URL", { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(source);
  } catch {
    return new Response("Invalid image URL", { status: 400 });
  }

  if (
    target.protocol !== "https:" ||
    target.hostname !== CDN_HOST ||
    target.port !== "" ||
    target.username !== "" ||
    target.password !== "" ||
    !target.pathname.startsWith(CDN_IMAGE_PREFIX)
  ) {
    return new Response("Image host is not allowed", { status: 403 });
  }

  try {
    // CDN 图片可能超过 Next 数据缓存的 2MB 限制；让浏览器按下方响应头缓存，
    // 服务端请求不写入 Next fetch cache。
    const upstream = await fetch(target, { cache: "no-store", redirect: "error" });
    if (!upstream.ok || !upstream.body) {
      return new Response("Upstream image unavailable", { status: upstream.status || 502 });
    }

    const contentType = upstream.headers.get("content-type") ?? "";
    const mediaType = contentType.split(";", 1)[0]?.trim().toLowerCase();
    if (!mediaType || !ALLOWED_RASTER_TYPES.has(mediaType)) {
      return new Response("Upstream resource is not an image", { status: 415 });
    }

    return new Response(upstream.body, {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "Content-Type": contentType,
      },
    });
  } catch {
    return new Response("Upstream image request failed", { status: 502 });
  }
}
