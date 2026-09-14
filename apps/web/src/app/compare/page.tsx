import { simpleMetadata } from "@/lib/seo";
import CompareClient from "./compare-client";

export const metadata = simpleMetadata({
  title: "装备参数对比 · 差异高亮与胜出方标注",
  description:
    "把 2–4 件装备拉进同一张表：按品类模板判定差异项并高亮，数值项自动标出胜出方，叠放雷达图看性能取向。",
  path: "/compare",
});

export default function Page() {
  return <CompareClient />;
}
