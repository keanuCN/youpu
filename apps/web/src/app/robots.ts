import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/** robots 引导合法爬虫走 sitemap，同时挡住个人中心与登录页（§13 防盗爬 + §14.2 noindex 白名单） */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/me", "/auth", "/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
