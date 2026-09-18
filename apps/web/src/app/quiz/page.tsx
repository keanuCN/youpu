import { Suspense } from "react";
import { simpleMetadata } from "@/lib/seo";
import QuizClient from "./quiz-client";

export const metadata = simpleMetadata({
  title: "选装备问卷 · 按品类和使用条件推荐",
  description:
    "按品类、水平、场景和预算选择装备。目前开放单板问卷，其他品类会在对应推荐规则完善后开放。",
  path: "/quiz",
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <QuizClient />
    </Suspense>
  );
}
