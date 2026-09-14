import { simpleMetadata } from "@/lib/seo";
import AuthClient from "./auth-client";

// 登录注册页不进索引（技术方案 §14.2 noindex 白名单）
export const metadata = simpleMetadata({
  title: "登录 / 注册",
  description: "登录后有谱账号可同步收藏、对比历史、实测评论与榜单投票。",
  path: "/auth",
  index: false,
});

export default function Page() {
  return <AuthClient />;
}
