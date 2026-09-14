import { useId } from "react";
import { radarAnchor, radarPolygon, radarRing } from "@/lib/domain";
import { cn } from "@/lib/utils";
import type { ScoreDim } from "@/types";

export interface RadarSeries {
  label: string;
  values: number[];
  color: string;
}

const RING_LEVELS = [0.25, 0.5, 0.75, 1];

/**
 * 手绘 SVG 雷达图。单条时填充 + 描边动画；多条时叠放半透明，用于对比页。
 */
export function RadarChart({
  dims,
  series,
  size = 280,
  animate = true,
  showLegend = true,
  className,
}: {
  dims: ScoreDim[];
  series: RadarSeries[];
  size?: number;
  animate?: boolean;
  showLegend?: boolean;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const n = dims.length;
  const pad = size >= 260 ? 52 : 38;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - pad;

  return (
    <figure className={cn("flex flex-col items-center gap-3", className)}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        style={{ maxWidth: size }}
        role="img"
        aria-label="分项评分雷达图"
      >
        <defs>
          {series.map((s, i) => (
            <linearGradient key={i} id={`${uid}-g${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={series.length > 1 ? 0.22 : 0.3} />
              <stop offset="100%" stopColor={s.color} stopOpacity={series.length > 1 ? 0.06 : 0.12} />
            </linearGradient>
          ))}
        </defs>

        {/* 网格环 */}
        {RING_LEVELS.map((lv) => (
          <polygon
            key={lv}
            points={radarRing(lv, n, cx, cy, r)}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={lv === 1 ? 1 : 0.6}
          />
        ))}
        {/* 轴线 */}
        {dims.map((_, i) => {
          const a = radarAnchor(i, n, cx, cy, r);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={a.x}
              y2={a.y}
              stroke="var(--color-border)"
              strokeWidth={0.6}
            />
          );
        })}

        {/* 数据面 */}
        {series.map((s, i) => (
          <g key={i}>
            <polygon points={radarPolygon(s.values, dims, cx, cy, r)} fill={`url(#${uid}-g${i})`} />
            <polygon
              points={radarPolygon(s.values, dims, cx, cy, r)}
              fill="none"
              stroke={s.color}
              strokeWidth={series.length > 1 ? 1.4 : 1.8}
              strokeLinejoin="miter"
              className={animate ? "animate-radar-draw" : undefined}
              style={animate ? { animationDelay: `${i * 160}ms` } : undefined}
            />
            {s.values.map((v, k) => {
              const ratio = Math.max(0, Math.min(10, v)) / 10;
              const a = radarAnchor(k, n, cx, cy, r * ratio);
              return <circle key={k} cx={a.x} cy={a.y} r={2} fill={s.color} />;
            })}
          </g>
        ))}

        {/* 维度标签 */}
        {dims.map((d, i) => {
          const a = radarAnchor(i, n, cx, cy, r + pad * 0.52);
          const cos = Math.cos(a.angle);
          const anchor = cos > 0.35 ? "start" : cos < -0.35 ? "end" : "middle";
          return (
            <text
              key={d.key}
              x={a.x}
              y={a.y}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="mono-label"
              style={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
            >
              {d.label}
            </text>
          );
        })}
      </svg>

      {showLegend && series.length > 0 ? (
        <figcaption className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
          {series.map((s, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="h-[3px] w-4" style={{ background: s.color }} />
              <span className="mono-label" style={{ color: "var(--color-foreground)" }}>
                {s.label}
              </span>
            </span>
          ))}
        </figcaption>
      ) : null}
    </figure>
  );
}

export const RADAR_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];
