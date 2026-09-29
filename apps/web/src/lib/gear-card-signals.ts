import { getCategory } from "@/data/categories";

type SpecValue = number | string | null;

/** 商品热度达到 7000 时，卡片标记为热门。 */
export const HOT_PRODUCT_HEAT_THRESHOLD = 7000;

/** 人工精选的热门商品；单独控制标签，不改变热度分值与排序。 */
export const FEATURED_HOT_PRODUCT_IDS = new Set([
  "gray-sonicalmach-lt-2027",
  "gray-tycoon-type-s-iz-2027",
  "ogasaka-fc-s-2026",
  "salomon-huck-knife-2027",
  "jones-flagship-2027",
]);

export function isHotProduct(heat: number, productId?: string): boolean {
  return (
    (productId !== undefined && FEATURED_HOT_PRODUCT_IDS.has(productId)) ||
    (Number.isFinite(heat) && heat >= HOT_PRODUCT_HEAT_THRESHOLD)
  );
}

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
