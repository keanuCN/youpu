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
