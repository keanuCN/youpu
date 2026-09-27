import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHead, SectionHead } from "@/components/layout/section-head";
import { CATEGORY_LEAVES, CATEGORY_TREE } from "@/data/categories";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "全部品类 · 装备参数图鉴",
  description: "按运动、户外、影像、骑行等领域浏览全部装备品类，查看已开档资料或了解正在筹备的品类。",
  alternates: { canonical: absoluteUrl("/categories") },
};

export default function CategoriesPage() {
  const liveCount = CATEGORY_LEAVES.filter((category) => category.status === "live").length;
  const comingSoonCount = CATEGORY_LEAVES.length - liveCount;

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-9 sm:px-8">
      <PageHead
        kicker="装备档案目录"
        title="全部品类"
        titleEn="Categories"
        desc="按装备领域浏览所有品类。已开档的品类可以查看资料，筹备中的品类会在配置完成后开放。"
        aside={
          <Link
            href="/"
            className="mono-label inline-flex items-center gap-2 border border-border px-3 py-2 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowLeft size={14} />
            返回首页
          </Link>
        }
      />

      <div className="mono-label mt-5 flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground">
        <span><strong className="tnum text-foreground">{CATEGORY_LEAVES.length}</strong> 个品类</span>
        <span><strong className="tnum text-foreground">{liveCount}</strong> 个已开档</span>
        <span><strong className="tnum text-foreground">{comingSoonCount}</strong> 个筹备中</span>
      </div>

      <div className="mt-10 space-y-14">
        {CATEGORY_TREE.map((root, rootIndex) => {
          const categories = CATEGORY_LEAVES.filter((category) => category.path[0] === root.name);
          if (categories.length === 0) return null;

          return (
            <section key={root.slug}>
              <SectionHead
                index={String(rootIndex + 1).padStart(2, "0")}
                title={root.name}
                titleEn={root.nameEn}
                desc={`${categories.length} 个品类 · ${categories.filter((category) => category.status === "live").length} 个已开档`}
              />
              <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((category) => {
                  const live = category.status === "live";
                  return (
                    <Link
                      key={category.slug}
                      href={live ? `/browse/${category.slug}` : `/soon/${category.slug}`}
                      className="group relative flex min-h-36 flex-col justify-between bg-background p-5 transition-colors hover:bg-foreground hover:text-background focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
                    >
                      <div>
                        <p className="mono-label group-hover:text-background/60">{category.path.join(" / ")}</p>
                        <p className="mt-2 text-[20px] leading-none font-medium">{category.name}</p>
                        <p className="serif-display mt-1.5 text-[15px] opacity-60">{category.nameEn}</p>
                      </div>
                      <div className="mt-6 flex items-end justify-between">
                        <span className="mono-data text-[12px] opacity-70">{live ? "浏览装备档案" : "即将开放"}</span>
                        <span
                          className={
                            live
                              ? "mono-label bg-primary px-2 py-[3px] text-primary-foreground group-hover:bg-background group-hover:text-foreground"
                              : "mono-label border border-current px-2 py-[3px] opacity-60"
                          }
                        >
                          {live ? "已开档" : "筹备中"}
                        </span>
                      </div>
                      <ArrowRight
                        aria-hidden="true"
                        size={14}
                        className="absolute right-5 top-5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                      />
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
