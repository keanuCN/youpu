import type { FitGuide } from "@/types";

const COLUMNS = [
  ["height", "适合身高"],
  ["stack", "Stack"],
  ["reach", "Reach"],
  ["wheelbase", "轴距"],
  ["headAngle", "头管角"],
  ["seatAngle", "坐管角"],
  ["wheelSize", "轮径"],
] as const;

function cellValue(key: (typeof COLUMNS)[number][0], row: FitGuide["rows"][number]): string {
  const value = row[key];
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "number") return `${value} mm`;
  return value;
}

/** 尺码/几何表：保留官方单位与备注，不替用户做最终尺寸判断。 */
export function FitGuideTable({ guide }: { guide?: FitGuide }) {
  if (!guide?.rows.length) return null;

  const visibleColumns = COLUMNS.filter(([key]) => guide.rows.some((row) => row[key] !== undefined && row[key] !== ""));

  return (
    <div className="mb-8 border border-border bg-secondary/20 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-3">
        <div>
          <p className="mono-label text-primary">FIT / GEOMETRY</p>
          <h3 className="mt-1 text-[18px] font-medium">尺码 / 几何</h3>
        </div>
        <p className="mono-label text-muted-foreground">官方数据 · 单位 mm</p>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
        这是初步筛选用的官方尺码表。最终尺寸还要结合身高、内长、躯干比例和骑行姿势确认。
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-left">
          <thead>
            <tr className="border-y border-border">
              <th className="whitespace-nowrap py-2 pr-4 mono-label">尺码</th>
              {visibleColumns.map(([key, label]) => (
                <th key={key} className="whitespace-nowrap px-3 py-2 mono-label last:pr-0">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {guide.rows.map((row) => (
              <tr key={row.size} className="border-b border-border/70 last:border-b-0">
                <th className="whitespace-nowrap py-2.5 pr-4 text-[13px] font-medium">{row.size}</th>
                {visibleColumns.map(([key]) => (
                  <td key={key} className="whitespace-nowrap px-3 py-2.5 mono-data text-[12px] tnum last:pr-0">
                    {cellValue(key, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {guide.note ? <p className="mt-3 border-t border-border pt-3 text-[12px] leading-relaxed text-muted-foreground">备注：{guide.note}</p> : null}
    </div>
  );
}
