import { GearGridSkeleton, RankRowsSkeleton, SkeletonBlock } from "@/components/gear/data-state";

/** Next 路由切换期间的全局占位，结构贴近常见的档案页，避免主区域白屏。 */
export default function Loading() {
  return (
    <main aria-busy="true" className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 sm:py-12">
      <div aria-hidden="true" className="space-y-4 border-b border-border pb-6">
        <SkeletonBlock className="h-2.5 w-32" />
        <SkeletonBlock className="h-10 w-64 max-w-full" />
        <SkeletonBlock className="h-4 w-full max-w-xl" />
      </div>
      <section className="mt-10">
        <SkeletonBlock className="mb-4 h-3 w-28" />
        <GearGridSkeleton count={4} />
      </section>
      <section className="mt-12 max-w-2xl">
        <SkeletonBlock className="mb-3 h-3 w-32" />
        <RankRowsSkeleton count={3} />
      </section>
      <span className="sr-only">正在加载页面内容</span>
    </main>
  );
}
