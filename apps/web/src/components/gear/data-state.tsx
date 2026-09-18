import { RotateCw } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** 内容字段尚未采集或尚未编辑时的统一提示。 */
export function PendingValue({ label = "待补充", className }: { label?: string; className?: string }) {
  return <span className={cn("mono-label text-muted-foreground", className)}>{label}</span>;
}

/** 图片未进入正式素材库时使用的轻量占位，不请求外部图片。 */
export function MediaPlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn("relative flex h-full min-h-24 flex-col justify-between overflow-hidden bg-secondary p-3", className)}
      role="img"
      aria-label={`${label} 图片待补充`}
    >
      <span className="mono-label text-foreground/45">IMAGE / PENDING</span>
      <span className="relative max-w-[85%] text-[14px] leading-snug text-foreground/70">{label}</span>
      <span className="absolute -right-8 -bottom-8 h-28 w-28 rotate-45 border border-foreground/10" aria-hidden="true" />
    </div>
  );
}

export function PendingBlock({
  title,
  detail,
  icon,
  className,
}: {
  title: string;
  detail?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border border-dashed border-border bg-secondary/45 p-5", className)}>
      <div className="flex items-start gap-3">
        {icon ? <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span> : null}
        <div>
          <p className="text-[14px] font-medium">{title}</p>
          {detail ? <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground">{detail}</p> : null}
        </div>
      </div>
    </div>
  );
}

/** 与真实内容保持相同版式的加载占位，避免异步数据返回前页面跳动。 */
export function SkeletonBlock({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("loading-skeleton block", className)} />;
}

export function LoadingStatus({ label = "正在读取内容", className }: { label?: string; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={cn("flex items-center gap-2", className)}>
      <span aria-hidden="true" className="loading-skeleton h-2 w-2 shrink-0" />
      <span className="mono-label">{label}</span>
    </div>
  );
}

export function FallbackNotice({ onRetry, className }: { onRetry: () => void; className?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-wrap items-center justify-between gap-3 border border-dashed border-primary/50 bg-primary/[0.035] px-3.5 py-3", className)}
    >
      <div className="min-w-0">
        <p className="text-[13px] font-medium">内容服务暂时不可用</p>
        <p className="mono-label mt-1 text-muted-foreground">当前显示本地内容包，网络恢复后可以重新读取。</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="mono-label flex shrink-0 items-center gap-1.5 border border-border px-2.5 py-1.5 transition-colors hover:border-foreground"
      >
        <RotateCw size={12} strokeWidth={1.8} />
        重试
      </button>
    </div>
  );
}

export function GearCardSkeleton() {
  return (
    <article aria-hidden="true" className="border border-border bg-card">
      <SkeletonBlock className="aspect-[4/5]" />
      <div className="space-y-3 p-3.5">
        <div className="space-y-1.5">
          <SkeletonBlock className="h-2.5 w-16" />
          <SkeletonBlock className="h-4 w-3/4" />
        </div>
        <div className="flex gap-1.5">
          <SkeletonBlock className="h-4 w-12" />
          <SkeletonBlock className="h-4 w-16" />
        </div>
        <div className="grid grid-cols-2 gap-2 border-y border-border py-2">
          <SkeletonBlock className="h-7" />
          <SkeletonBlock className="h-7" />
        </div>
        <div className="flex items-end justify-between border-t border-border pt-2.5">
          <div className="space-y-1.5">
            <SkeletonBlock className="h-4 w-16" />
            <SkeletonBlock className="h-2.5 w-20" />
          </div>
          <SkeletonBlock className="h-3 w-14" />
        </div>
      </div>
    </article>
  );
}

export function GearGridSkeleton({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div role="status" aria-label="正在加载装备档案" className={cn("grid grid-cols-2 gap-4 lg:grid-cols-4", className)}>
      {Array.from({ length: count }, (_, index) => (
        <GearCardSkeleton key={index} />
      ))}
      <span className="sr-only">正在加载装备档案</span>
    </div>
  );
}

export function RankRowsSkeleton({ count = 5, className }: { count?: number; className?: string }) {
  return (
    <div role="status" aria-label="正在加载榜单" className={cn("space-y-0", className)}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} aria-hidden="true" className="flex items-center gap-3 border-b border-border py-4">
          <SkeletonBlock className="h-5 w-7 shrink-0" />
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonBlock className="h-3 w-1/3" />
            <SkeletonBlock className="h-4 w-2/3" />
          </div>
          <SkeletonBlock className="h-3 w-16 shrink-0" />
        </div>
      ))}
      <span className="sr-only">正在加载榜单</span>
    </div>
  );
}

export function RankingsSkeleton() {
  return (
    <div role="status" aria-label="正在加载榜单内容" className="mt-10 space-y-12">
      <div className="grid gap-px border border-border bg-border md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <article key={index} aria-hidden="true" className="space-y-4 bg-background p-5">
            <div className="flex items-start justify-between">
              <SkeletonBlock className="h-11 w-12" />
              <SkeletonBlock className="h-4 w-14" />
            </div>
            <SkeletonBlock className="aspect-[4/3]" />
            <SkeletonBlock className="h-2.5 w-16" />
            <SkeletonBlock className="h-5 w-3/4" />
            <div className="space-y-2 border-t border-border pt-3">
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-full" />
            </div>
            <SkeletonBlock className="h-8 w-full" />
          </article>
        ))}
      </div>
      <RankRowsSkeleton count={4} />
      <span className="sr-only">正在加载榜单内容</span>
    </div>
  );
}

export function CompareSkeleton() {
  return (
    <div role="status" aria-label="正在加载对比数据" className="mt-10 space-y-8">
      <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
        <div aria-hidden="true" className="border border-border p-5">
          <SkeletonBlock className="mb-4 h-3 w-40" />
          <SkeletonBlock className="aspect-square w-full" />
        </div>
        <div aria-hidden="true" className="space-y-4">
          <SkeletonBlock className="h-3 w-40" />
          <RankRowsSkeleton count={4} />
        </div>
      </div>
      <div aria-hidden="true" className="overflow-hidden border border-foreground">
        <SkeletonBlock className="h-12 w-full" />
        {Array.from({ length: 6 }, (_, index) => (
          <SkeletonBlock key={index} className="h-11 w-full border-t border-border" />
        ))}
      </div>
      <span className="sr-only">正在加载产品参数和对比数据</span>
    </div>
  );
}
