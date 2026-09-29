import { Suspense } from "react";
import { simpleMetadata } from "@/lib/seo";
import QuizClient from "./quiz-client";

export const metadata = simpleMetadata({
  title: "单板选装备问卷 · 按滑行条件匹配",
  description: "根据滑行水平、使用场景、身体条件与预算，为你匹配合适的单板。",
  path: "/quiz",
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <QuizClient />
    </Suspense>
  );
}
