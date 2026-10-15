import Link from "next/link";
import { simpleMetadata } from "@/lib/seo";

export const metadata = simpleMetadata({
  title: "科普 · 装备知识与使用指南",
  description: "按运动品类整理装备知识、使用方法与选购指南。",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <main className="mx-auto min-h-[60vh] max-w-[1080px] px-5 py-10 md:px-8 md:py-14">
      <p className="mono-label text-muted-foreground">FIELD NOTES · KNOWLEDGE</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">科普</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
        按运动品类整理装备知识、调节方法与选购指南。选择一个类别开始浏览。
      </p>

      <section className="mt-9 border-t border-foreground pt-5" aria-labelledby="snow-sports-heading">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 id="snow-sports-heading" className="mono-label">滑雪 · SNOW SPORTS</h2>
          <span className="mono-label text-muted-foreground">01 CATEGORY</span>
        </div>
        <Link
          href="/guides/snowboard-setup"
          className="group flex flex-col gap-4 border border-border p-5 transition-colors hover:border-foreground sm:flex-row sm:items-center sm:justify-between sm:p-6"
        >
          <div>
            <p className="mono-label text-primary">单板 · SNOWBOARD</p>
            <h3 className="mt-2 text-xl font-medium tracking-tight">单板科普与三件套指南</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              固定器站姿与角度、尺码查询，以及雪板、固定器、雪鞋的搭配思路。
            </p>
          </div>
          <span className="mono-label shrink-0 text-foreground group-hover:text-primary">浏览单板科普 →</span>
        </Link>
      </section>
    </main>
  );
}
