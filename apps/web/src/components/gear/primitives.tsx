import { Star } from "lucide-react";
import type { ReactNode } from "react";
import { sceneLabel } from "@/lib/domain";
import { fmtPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PendingValue } from "./data-state";

/** 综合指数方块：全站唯一的「分数」视觉语言 */
export function ScoreMark({
  value,
  size = "md",
  invert = false,
  className,
}: {
  value: number;
  size?: "sm" | "md" | "lg";
  invert?: boolean;
  className?: string;
}) {
  const sizes = {
    sm: "text-[13px] px-1.5 py-[3px]",
    md: "text-xl px-2 py-1",
    lg: "text-[40px] px-3 py-1.5",
  } as const;
  return (
    <span
      className={cn(
        "mono-data inline-flex items-baseline gap-[3px] leading-none font-medium tnum",
        invert ? "bg-background text-foreground" : "bg-foreground text-background",
        sizes[size],
        className,
      )}
    >
      {Math.round(value)}
      <span className="text-[0.5em] opacity-55">/100</span>
    </span>
  );
}

export function Stars({ value, size = 12, className }: { value: number; size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-[2px]", className)} aria-label={`${value.toFixed(1)} 星`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i + 1));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} strokeWidth={1.2} className="absolute inset-0 text-input" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={size} strokeWidth={1.2} className="fill-primary text-primary" />
            </span>
          </span>
        );
      })}
    </span>
  );
}

/** 硬度条：10 格刻度 */
export function FlexBar({ value, className, animate = false }: { value: number; className?: string; animate?: boolean }) {
  if (value <= 0) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex gap-[2px]" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => <span key={i} className="h-3 w-[5px] bg-border" />)}
        </div>
        <PendingValue label="待补充" />
      </div>
    );
  }
  const filled = Math.round(value);
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex gap-[2px]">
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={cn("h-3 w-[5px]", i < filled ? "bg-foreground" : "bg-border")}
            style={animate && i < filled ? { animationDelay: `${i * 35}ms` } : undefined}
          />
        ))}
      </div>
      <span className="mono-data text-[12px] text-muted-foreground tnum">{value.toFixed(1)}</span>
    </div>
  );
}

export function Chip({
  children,
  active,
  onClick,
  className,
  title,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  title?: string;
}) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      title={title}
      className={cn(
        "mono-label border px-2 py-[5px] transition-colors duration-200",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-transparent text-muted-foreground",
        onClick && !active && "hover:border-foreground hover:text-foreground",
        className,
      )}
    >
      {children}
    </Comp>
  );
}

export function SceneTags({ scenes, className, max }: { scenes: string[]; className?: string; max?: number }) {
  const list = max ? scenes.slice(0, max) : scenes;
  if (list.length === 0) return <PendingValue label="场景待补" className={className} />;
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {list.map((s) => (
        <span key={s} className="mono-label border border-border px-1.5 py-[3px]">
          {sceneLabel(s)}
        </span>
      ))}
      {max && scenes.length > max ? (
        <span className="mono-label px-1 py-[3px]">+{scenes.length - max}</span>
      ) : null}
    </div>
  );
}

export function PriceTag({ value, className }: { value: number; className?: string }) {
  return <span className={cn("mono-data text-[13px] tnum", className)}>{fmtPrice(value)}</span>;
}

/** 数据行：左标签右数值，参数表与详情信息卡共用 */
export function DataRow({
  label,
  value,
  unit,
  highlight,
  className,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 border-b border-border py-[7px]",
        highlight && "bg-accent/60",
        className,
      )}
    >
      <span className="mono-label shrink-0">{label}</span>
      <span className="mono-data text-right text-[13px] tnum">
        {value === null || value === undefined || value === "" ? (
          <span className="text-muted-foreground/50">—</span>
        ) : (
          value
        )}
        {unit && value !== null && value !== undefined && value !== "" ? (
          <span className="ml-[3px] text-[11px] text-muted-foreground">{unit}</span>
        ) : null}
      </span>
    </div>
  );
}
