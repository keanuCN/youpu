import type { GearItem } from "@/types";

const COLUMNS = [
  ["size", "尺码", ""],
  ["overallLength", "板长", "mm"],
  ["effectiveEdge", "有效刃长", "mm"],
  ["contactLength", "接雪长度", "mm"],
  ["waistWidth", "板腰宽", "mm"],
  ["sidecutRadii", "侧切半径组合", "mm"],
  ["sidecutOffset", "侧切偏移", "mm"],
  ["noseLength", "板头长度", "mm"],
  ["noseWidth", "板头宽度", "mm"],
  ["noseHeight", "板头高度", "mm"],
  ["tailLength", "板尾长度", "mm"],
  ["tailWidth", "板尾宽度", "mm"],
  ["tailHeight", "板尾高度", "mm"],
  ["camber", "Camber", "mm"],
  ["stanceWidth", "站距范围", "mm"],
  ["insertQty", "固定器孔位", ""],
  ["setback", "站位后移", "mm"],
  ["edge", "钢刃", ""],
  ["sidewallAngle", "侧墙角度", ""],
  ["sidewallColor", "侧墙颜色", ""],
  ["base", "滑行面", ""],
  ["stiffness", "硬度 N/W/T", ""],
] as const;

type SizeSpec = Record<string, string | number | null>;

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
  const rows = sizeRows(gear.specs.sizeSpecs);
  if (!rows.length) return null;
  const columns = COLUMNS.filter(([key]) => key === "size" || rows.some((row) => row[key] !== null && row[key] !== undefined && row[key] !== ""));

  return (
    <section className="mb-8 border-y border-border py-5">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-[15px] font-medium">官方尺码参数</h3>
        <span className="mono-label">{rows.length} 个尺码 · 数据源：GRAY 26–27 官方目录</span>
      </div>
      <div className="overflow-x-auto">
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
                    {row[key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mono-label mt-3">— 表示官方目录未列出；硬度顺序为板头 / 腰部 / 板尾。</p>
    </section>
  );
}
