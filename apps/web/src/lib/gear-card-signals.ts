import { getCategory } from "@/data/categories";

type SpecValue = number | string | null;

const enumLabels: Record<string, Record<string, string>> = {
  garmentType: {
    jacket: "滑雪夹克",
    pants: "滑雪裤",
    "bib-pants": "背带滑雪裤",
  },
  fit: {
    "athletic-y-cut": "Y 型运动剪裁",
    "athletic-h-cut": "H 型运动剪裁",
    loose: "宽松长款",
    relaxed: "宽松",
  },
};

function formatSpecValue(key: string, value: SpecValue, unit?: string): string {
  if (value === null || value === "") return "待补充";
  if (typeof value === "number") return `${value}${unit ?? ""}`;
  return enumLabels[key]?.[value] ?? value;
}

/** 按当前品类的规格模板取卡片摘要，避免把其他品类字段套到商品上。 */
export function categoryCardSignals(
  categorySlug: string,
  specs: Record<string, SpecValue>,
): [string, string][] {
  const fields = getCategory(categorySlug)?.specTemplate.flatMap((group) => group.fields).slice(0, 2) ?? [];
  return fields.map((field) => [field.label, formatSpecValue(field.key, specs[field.key] ?? null, field.unit)]);
}
