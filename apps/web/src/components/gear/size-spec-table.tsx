"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { GearItem } from "@/types";

const COLUMNS = [
  ["size", "尺码", ""],
  ["overallLength", "板长", "mm"],
  ["effectiveEdge", "有效刃长", "mm"],
  ["contactLength", "接雪长度", "mm"],
  ["waistWidth", "板腰宽", "mm"],
  ["sidecutRadii", "侧切半径组合", ""],
  ["sidecutOffset", "侧切偏移", "mm"],
  ["noseLength", "板头长度", "mm"],
  ["noseWidth", "板头宽度", "mm"],
  ["noseHeight", "板头高度", "mm"],
  ["tailLength", "板尾长度", "mm"],
  ["tailWidth", "板尾宽度", "mm"],
  ["tailHeight", "板尾高度", "mm"],
  ["camber", "Camber", "mm"],
  ["stanceWidth", "站距（推荐/范围）", ""],
  ["maxStance", "最大站距", "mm"],
  ["bindingSize", "推荐固定器尺码", ""],
  ["weightRange", "建议体重范围", ""],
  ["boardWeight", "板重", ""],
  ["insertQty", "固定器孔位", ""],
  ["setback", "站位后移", "mm"],
  ["edge", "钢刃", ""],
  ["sidewallAngle", "侧墙角度", ""],
  ["sidewallColor", "侧墙颜色", ""],
  ["base", "滑行面", ""],
  ["stiffness", "硬度 N/W/T", ""],
] as const;

type SizeSpec = Record<string, string | number | null>;

function displaySidecut(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  const text = String(value);
  const radii = text.split("/").map(Number);
  if (radii.length > 1 && radii.every((radius) => Number.isFinite(radius) && radius >= 1000)) {
    return `${radii.map((radius) => (radius / 1000).toFixed(1)).join(" / ")} m`;
  }
  return /m$/i.test(text) ? text : `${text} m`;
}

function displayStance(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  const text = String(value);
  return /(?:mm|in)$/i.test(text) ? text : `${text} mm`;
}

function sizeRows(value: string | number | null | undefined): SizeSpec[] {
  if (typeof value !== "string") return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row): row is SizeSpec =>
        !!row && typeof row === "object" && !Array.isArray(row) && typeof row.size === "string",
    );
  } catch {
    return [];
  }
}

export function SizeSpecTable({ gear }: { gear: GearItem }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rows = sizeRows(gear.specs.sizeSpecs);
  if (!rows.length) return null;
  const columns = COLUMNS.filter(([key]) => key === "size" || rows.some((row) => row[key] !== null && row[key] !== undefined && row[key] !== ""));

  return (
    <section className="mb-8 min-w-0 max-w-full border-y border-border py-5">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-[15px] font-medium">尺码参数</h3>
        <span className="mono-label">{rows.length} 个尺码 · {gear.brand} {gear.year}</span>
      </div>
      <div
        ref={scrollRef}
        aria-label="官方尺码参数，可横向滚动查看"
        className="size-spec-scroll w-full max-w-full overflow-x-auto overscroll-x-contain"
        tabIndex={0}
      >
        <table className="w-full min-w-max border-collapse text-left text-[12px]">
          <thead>
            <tr className="border-y border-border bg-muted/35">
              {columns.map(([key, label, unit]) => (
                <th key={key} className="whitespace-nowrap px-3 py-2.5 font-medium text-muted-foreground">
                  {label}{unit ? <span className="ml-1 font-normal">({unit})</span> : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.size} className="border-b border-border/70 last:border-0">
                {columns.map(([key]) => (
                  <td key={key} className={`whitespace-nowrap px-3 py-2.5 tnum ${key === "size" ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                    {key === "sidecutRadii" ? displaySidecut(row[key]) : key === "stanceWidth" ? displayStance(row[key]) : row[key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          aria-label="向左查看更多尺码参数"
          className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
          onClick={() => scrollRef.current?.scrollBy({ left: -Math.max(240, scrollRef.current.clientWidth * 0.75), behavior: "smooth" })}
        >
          <ChevronLeft aria-hidden="true" className="size-5" />
        </button>
        <span className="mono-label text-center">拖动滚动条，或点击箭头查看完整参数</span>
        <button
          type="button"
          aria-label="向右查看更多尺码参数"
          className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
          onClick={() => scrollRef.current?.scrollBy({ left: Math.max(240, scrollRef.current.clientWidth * 0.75), behavior: "smooth" })}
        >
          <ChevronRight aria-hidden="true" className="size-5" />
        </button>
      </div>
      <p className="mono-label mt-3">— 表示官方目录未列出；硬度顺序为板头 / 腰部 / 板尾。</p>
    </section>
  );
}
