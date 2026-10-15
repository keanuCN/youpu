import type { GearSizeSpec, GearSizeSpecValue } from "@/types";

type Column = {
  key: string;
  label: string;
  aliases?: string[];
  unit?: string;
  unitByKey?: Record<string, string>;
  rangeKeys?: string[];
};

const COLUMNS: Column[] = [
  { key: "effectiveLength", label: "有效长度（原表）", unit: "mm" },
  { key: "overallLength", label: "总长", unit: "mm" },
  { key: "effectiveEdge", label: "有效边刃", aliases: ["effectiveEdgeMm", "effectiveEdgeCm"], unit: "mm", unitByKey: { effectiveEdgeCm: "cm" } },
  { key: "contactLength", label: "接触长度", aliases: ["contactLengthCm"], unit: "mm", unitByKey: { contactLengthCm: "cm" } },
  { key: "runningLength", label: "滑行长度（Running Length）", unit: "mm" },
  { key: "waistWidth", label: "板腰宽", aliases: ["waistWidthMm", "waistWidthCm", "waistCm"], unit: "mm", unitByKey: { waistWidthCm: "cm", waistCm: "cm" } },
  { key: "noseWidth", label: "板头宽", aliases: ["noseWidthMm", "noseWidthCm", "tipWidthCm"], unit: "mm", unitByKey: { noseWidthCm: "cm", tipWidthCm: "cm" } },
  { key: "tailWidth", label: "板尾宽", aliases: ["tailWidthMm", "tailWidthCm"], unit: "mm", unitByKey: { tailWidthCm: "cm" } },
  { key: "noseLength", label: "板头长度", aliases: ["tipLengthCm"], unit: "mm", unitByKey: { tipLengthCm: "cm" } },
  { key: "tailLength", label: "板尾长度", aliases: ["tailLengthCm"], unit: "mm", unitByKey: { tailLengthCm: "cm" } },
  { key: "frontFootWidth", label: "前脚处板宽", aliases: ["underfootWidthFrontCm"], unit: "mm", unitByKey: { underfootWidthFrontCm: "cm" } },
  { key: "backFootWidth", label: "后脚处板宽", aliases: ["underfootWidthBackCm"], unit: "mm", unitByKey: { underfootWidthBackCm: "cm" } },
  { key: "taper", label: "板头尾宽差", aliases: ["taperMm"], unit: "mm" },
  { key: "sidecutRadii", label: "侧切半径", aliases: ["sidecutRadiusM", "sidecutRadius", "sidecutM", "sidecutRadiiMSourceOrder"], unit: "m" },
  { key: "sidecutOffset", label: "侧切偏移", unit: "mm" },
  { key: "noseHeight", label: "板头翘高", unit: "mm" },
  { key: "tailHeight", label: "板尾翘高", unit: "mm" },
  { key: "turnRadius", label: "转弯半径", unit: "m" },
  { key: "weightPerSki", label: "单只重量", unit: "g" },
  { key: "weightPerPair", label: "一对重量", unit: "g" },
  { key: "notes", label: "参数说明" },
  { key: "stanceWidth", label: "参考站距", aliases: ["referenceStanceMm", "recommendedStanceCm", "referenceStanceCm", "referenceStanceIn", "centeredStanceCm", "centeredStanceIn", "stanceWidthIn", "adjustableStanceRangeCm"], unit: "mm", unitByKey: { recommendedStanceCm: "cm", referenceStanceCm: "cm", centeredStanceCm: "cm", referenceStanceIn: "in", centeredStanceIn: "in", stanceWidthIn: "in", adjustableStanceRangeCm: "cm" }, rangeKeys: ["adjustableStanceRangeCm"] },
  { key: "stanceMin", label: "最小站距", aliases: ["stanceMinCm", "stanceMinInches"], unit: "mm", unitByKey: { stanceMinCm: "cm", stanceMinInches: "in" } },
  { key: "stanceMax", label: "最大站距", aliases: ["stanceMaxCm", "stanceMaxInches"], unit: "mm", unitByKey: { stanceMaxCm: "cm", stanceMaxInches: "in" } },
  { key: "setback", label: "站位后移", aliases: ["setbackCm", "setbackInches", "stanceSetbackInches", "stanceSetback"], unit: "mm", unitByKey: { setbackCm: "cm", setbackInches: "in", stanceSetbackInches: "in" } },
  { key: "stanceLocation", label: "站位位置（原值）" },
  { key: "sidecutDepth", label: "侧切深度", unit: "mm" },
  { key: "camber", label: "拱高", unit: "mm" },
  { key: "weight", label: "板重", aliases: ["weightKg", "boardWeightKg"], unit: "g" },
  { key: "base", label: "底面" },
  { key: "topsheet", label: "板面材料" },
  { key: "edge", label: "钢刃" },
  { key: "sidewallAngle", label: "侧墙角度", unit: "°" },
  { key: "insertQty", label: "固定器孔位" },
  { key: "flex", label: "板身分区硬度" },
  { key: "brandFlex", label: "品牌尺码硬度", aliases: ["brandFlexOutOf10"], unit: "/10" },
  { key: "stiffness", label: "硬度说明" },
  { key: "riderWeight", label: "建议骑手体重", aliases: ["recommendedRiderWeightKg", "riderWeightKg", "recommendedRiderWeightRaw", "riderWeightRange", "riderWeightRaw", "recommendedRiderWeightLb", "riderWeightLb", "riderWeightLbRaw", "productPageRiderWeightKg", "sizeGuideRiderWeightKg"], unitByKey: { recommendedRiderWeightKg: "kg", riderWeightKg: "kg", recommendedRiderWeightLb: "lb", riderWeightLb: "lb", riderWeightLbRaw: "lb", productPageRiderWeightKg: "kg", sizeGuideRiderWeightKg: "kg" }, rangeKeys: ["recommendedRiderWeightKg", "riderWeightKg", "recommendedRiderWeightLb", "riderWeightLb", "productPageRiderWeightKg", "sizeGuideRiderWeightKg"] },
  { key: "riderHeight", label: "建议骑手身高" },
  { key: "maxRiderHeightCm", label: "建议身高上限", unit: "cm" },
  { key: "bootEu", label: "雪鞋欧码", rangeKeys: ["bootEu"] },
  { key: "bootUs", label: "雪鞋美码", rangeKeys: ["bootUs"] },
  { key: "maxBootSizeEU", label: "最大适配欧码", unit: "EU" },
  { key: "maxBootSoleLengthCm", label: "最大雪鞋底长", unit: "cm" },
  { key: "bootSize", label: "建议雪鞋尺码" },
  { key: "suggestedBoot", label: "品牌推荐鞋码" },
  { key: "bindingSize", label: "推荐固定器尺码" },
  { key: "selectableOnCapturedProductPage", label: "采集时页面可选" },
  { key: "surfaceArea", label: "板面面积（原表值）" },
  { key: "surfaceAreaDm2", label: "板面面积（dm²）", unit: "dm²" },
  { key: "widthVariant", label: "宽度版本" },
];

function findCell(row: GearSizeSpec, column: Column): { key: string; value: GearSizeSpecValue; unit?: string } | undefined {
  const keys = [column.key, ...(column.aliases ?? [])];
  for (const key of keys) {
    const value = row[key];
    if (value === null || value === undefined || value === "") continue;
    let unit = column.unitByKey?.[key] ?? column.unit;
    if (key === "sidecutRadiusM") unit = "m";
    if (key === "boardWeightKg" || key === "weightKg") unit = "kg";
    if (key === "weight" && typeof value === "number" && value < 100) unit = "kg";
    return { key, value, unit };
  }
  return undefined;
}

function displayValue(value: GearSizeSpecValue, unit?: string, range = false): string {
  if (typeof value === "string") {
    // Preserve a unit already present in the source string.
    const hasUnit = /(?:\d\s*|\b)(?:mm|cm|m|kg|lb|g|in(?:ches)?)\b/i.test(value);
    return unit && !hasUnit && !value.includes(unit) ? `${value} ${unit}` : value;
  }
  if (typeof value === "number") return unit ? `${value} ${unit}` : String(value);
  if (typeof value === "boolean") return value ? "是" : "否";
  if (value === null) return "—";
  if (Array.isArray(value)) {
    const values = value.map((part) => displayValue(part));
    const formatted = range && values.length === 2 ? values.join("–") : values.join(" / ");
    return unit ? `${formatted} ${unit}` : formatted;
  }
  return Object.entries(value).filter(([, part]) => part !== null).map(([key, part]) => {
    const label = ({ gloss: "亮面", brushed: "哑光", productPage: "商品页", sizeGuide: "尺码表" } as Record<string, string>)[key] ?? key;
    return `${label} ${displayValue(part, unit)}`;
  }).join(" / ");
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
            return cell ? [{ column, value: displayValue(cell.value, cell.unit, column.rangeKeys?.includes(cell.key)) }] : [];
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
