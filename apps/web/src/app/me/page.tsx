import { simpleMetadata } from "@/lib/seo";
import MeClient from "./me-client";

// 个人中心不进索引（技术方案 §14.2 noindex 白名单）
export const metadata = simpleMetadata({
  title: "个人中心",
  description: "我的收藏、对比记录、实测评论、问卷结果与通知。",
  path: "/me",
  index: false,
});

export default function Page({ searchParams }: { searchParams?: { tab?: string | string[] } }) {
  const initialTab = searchParams?.tab === "profile" ? "profile" : undefined;
  return <MeClient initialTab={initialTab} />;
}
