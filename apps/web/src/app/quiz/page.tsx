import { simpleMetadata } from "@/lib/seo";
import QuizClient from "./quiz-client";

export const metadata = simpleMetadata({
  title: "60 秒选装备问卷 · 按水平、场景、体重、预算推荐",
  description:
    "6 个问题给出带计分理由的三件装备：读取你的水平、使用场景、身体条件与偏好，在档案库里做加权匹配，并逐条说明推荐理由。",
  path: "/quiz",
});

export default function Page() {
  return <QuizClient />;
}
