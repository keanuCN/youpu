import type { GearSizeSpec, GearSizeSpecValue } from "@/types";

type Column = {
  key: string;
  label: string;
  aliases?: string[];
  unit?: string;
};

const COLUMNS: Column[] = [
  { key: "effectiveEdge", label: "有效边刃", unit: "mm" },
  { key: "contactLength", label: "接触长度", unit: "mm" },
  { key: "waistWidth", label: "板腰宽", aliases: ["waistWidthMm"], unit: "mm" },
  { key: "noseWidth", label: "板头宽", aliases: ["noseWidthMm"], unit: "mm" },
  { key: "tailWidth", label: "板尾宽", aliases: ["tailWidthMm"], unit: "mm" },
  { key: "sidecutRadii", label: "侧切半径", aliases: ["sidecutRadiusM"], unit: "m" },
  { key: "stanceWidth", label: "参考站距", unit: "mm" },
  { key: "setback", label: "站位后移", unit: "mm" },
  { key: "camber", label: "拱高", unit: "mm" },
  { key: "weight", label: "板重", aliases: ["boardWeightKg", "weightKg"], unit: "g" },
  { key: "base", label: "底面" },
  { key: "edge", label: "钢刃" },
  { key: "insertQty", label: "固定器孔位" },
  { key: "stiffness", label: "硬度说明" },
];

function findCell(row: GearSizeSpec, column: Column): { value: GearSizeSpecValue; unit?: string } | undefined {
  const keys = [column.key, ...(column.aliases ?? [])];
  for (const key of keys) {
    const value = row[key];
    if (value === null || value === undefined || value === "") continue;
    let unit = column.unit;
    if (key === "sidecutRadiusM") unit = "m";
    if (key === "boardWeightKg" || key === "weightKg") unit = "kg";
    if (key === "weight" && typeof value === "number" && value < 100) unit = "kg";
    return { value, unit };
  }
  return undefined;
}

function displayValue(value: GearSizeSpecValue, unit?: string): string {
  if (typeof value === "string") return unit && !value.includes(unit) ? `${value} ${unit}` : value;
  if (typeof value === "number") return unit ? `${value} ${unit}` : String(value);
  if (typeof value === "boolean") return value ? "是" : "否";
  if (value === null) return "—";
  if (Array.isArray(value)) return value.map((part) => displayValue(part)).join(" / ");
  return JSON.stringify(value);
}

/** 折叠式逐尺码参数卡片：避免在窄屏上依赖难操作的超宽表格。 */
export function SizeSpecTable({ specs }: { specs?: GearSizeSpec[] }) {
  if (!specs?.length) return null;

  return (
    <details className="mb-6 border border-border bg-secondary/20">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 marker:hidden hover:text-primary sm:px-5">
        <span>
          <span className="mono-label text-primary">SIZE / GEOMETRY</span>
          <span className="ml-3 text-[14px] font-medium">逐尺码参数</span>
        </span>
        <span className="mono-label shrink-0 text-muted-foreground">{specs.length} 个尺码</span>
      </summary>
      <div className="grid gap-3 border-t border-border p-3 sm:grid-cols-2 sm:p-4">
        {specs.map((row, index) => {
          const size = row.size === null || row.size === undefined ? `尺码 ${index + 1}` : displayValue(row.size);
          const entries = COLUMNS.flatMap((column) => {
            const cell = findCell(row, column);
            return cell ? [{ column, value: displayValue(cell.value, cell.unit) }] : [];
          });
          if (!entries.length) return null;

          return (
            <section key={`${size}-${index}`} className="border border-border/70 bg-background/70 px-3 py-3">
              <h3 className="mb-2 border-b border-border/70 pb-2 text-[14px] font-medium">{size}</h3>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2">
                {entries.map(({ column, value }) => (
                  <div key={column.key} className="min-w-0">
                    <dt className="mono-label text-[10px] text-muted-foreground">{column.label}</dt>
                    <dd className="mt-0.5 break-words text-[12px] leading-snug">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        })}
      </div>
    </details>
  );
}
