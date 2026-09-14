import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** 杂志栏目头：编号 + 中文标题 + 英文副标 + 右侧动作 */
export function SectionHead({
  index,
  title,
  titleEn,
  desc,
  action,
  className,
}: {
  index?: string;
  title: string;
  titleEn?: string;
  desc?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rule-heavy mb-6 flex flex-wrap items-end justify-between gap-3 pb-3", className)}>
      <div className="min-w-0">
        <div className="flex items-baseline gap-3">
          {index ? <span className="mono-label text-primary">{index}</span> : null}
          <h2 className="text-[22px] leading-none font-medium tracking-tight text-balance sm:text-[26px]">
            {title}
          </h2>
          {titleEn ? <span className="serif-display hidden text-lg text-muted-foreground sm:inline">{titleEn}</span> : null}
        </div>
        {desc ? <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">{desc}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/** 页面级大标题（列表页 / 榜单页顶部） */
export function PageHead({
  kicker,
  title,
  titleEn,
  desc,
  aside,
  className,
}: {
  kicker?: string;
  title: string;
  titleEn?: string;
  desc?: string;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("border-b border-foreground pb-6", className)}>
      {kicker ? <p className="mono-label mb-3 text-primary">{kicker}</p> : null}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="min-w-0">
          <h1 className="text-[34px] leading-[1.08] font-medium tracking-tight sm:text-[46px]">
            {title}
            {titleEn ? <span className="serif-display ml-3 text-[0.55em] text-muted-foreground">{titleEn}</span> : null}
          </h1>
          {desc ? <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-muted-foreground">{desc}</p> : null}
        </div>
        {aside ? <div className="shrink-0">{aside}</div> : null}
      </div>
    </header>
  );
}
