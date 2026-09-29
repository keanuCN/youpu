import { NextRequest } from "next/server";
import { isAllowedRemoteImageUrl } from "@/lib/image-url";

// 静态导出时该路径只生成兜底响应；生产页面直接使用 CDN 图片，开发环境仍可走代理。
// 本地开发必须使用动态路由，否则 Next 会把 request URL 的查询参数清空，
// 代理无法读取目标图片地址。静态导出仍保持 force-static 以兼容无 Node 运行时的部署。
const isStaticExport = process.env.NEXT_OUTPUT === "export";
export const dynamic = isStaticExport ? "force-static" : "force-dynamic";

const ALLOWED_RASTER_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"]);
const DEFAULT_IMAGE_ACCEPT = "image/avif,image/webp,image/apng,image/*,*/*;q=0.8";

function upstreamHeaders(target: URL, accept: string | null): HeadersInit {
  const headers: Record<string, string> = {
    Accept: accept || DEFAULT_IMAGE_ACCEPT,
    "User-Agent": "YoupuImageProxy/0.1",
  };

  // 部分公开零售图片 CDN 会拒绝没有来源页和浏览器 UA 的服务端请求。
  // Referer 只指向对应的公开商品页，不接受用户传入的任意请求头。
  if (target.hostname === "point-official.shop") {
    headers.Referer = "https://www.point-official.shop/";
  } else if (target.hostname === "anglerscentral.my") {
    headers.Referer = "https://www.anglerscentral.my/";
  } else if (target.hostname === "bbsports.co.nz") {
    headers.Referer = "https://bbsports.co.nz/";
  } else if (target.hostname === "www.smartmarine.co.nz") {
    headers.Referer = "https://www.smartmarine.co.nz/";
  }

  return headers;
}

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

  if (!isAllowedRemoteImageUrl(target.toString())) {
    return new Response("Image host is not allowed", { status: 403 });
  }

  try {
    // 远程图片可能超过 Next 数据缓存的 2MB 限制；让浏览器按下方响应头缓存，
    // 服务端请求不写入 Next fetch cache。
    const upstream = await fetch(target, {
      cache: "no-store",
      redirect: "error",
      headers: upstreamHeaders(target, request.headers.get("accept")),
    });
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
        Vary: "Accept",
        ...(upstream.headers.get("content-length")
          ? { "Content-Length": upstream.headers.get("content-length")! }
          : {}),
      },
    });
  } catch {
    return new Response("Upstream image request failed", { status: 502 });
  }
}
