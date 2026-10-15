import { convertPriceToCny } from "@youpu/schema";

const CURRENCY_SYMBOLS: Record<string, string> = {
  CNY: "¥",
};

export function fmtPrice(n: number, currency = "CNY"): string {
  const amount = convertPriceToCny(n, currency);
  return `${CURRENCY_SYMBOLS.CNY}${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

/** 将来源页面的单币种官方标价换算为人民币展示，保留区间。 */
export function officialPriceRangeCny(value: string): { min: number; max: number } | null {
  const match = value.trim().match(/^(CNY|USD|EUR|JPY|CHF|CAD)\s+([\d,.]+)(?:\s*[–—-]\s*([\d,.]+))?$/i);
  if (!match) return null;

  const currency = match[1]!.toUpperCase();
  const parseAmount = (raw: string) => Number(raw.replaceAll(",", ""));
  const min = parseAmount(match[2]!);
  const max = match[3] ? parseAmount(match[3]!) : min;
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;

  return {
    min: convertPriceToCny(min, currency),
    max: convertPriceToCny(max, currency),
  };
}

export function fmtOfficialPriceCny(value: string): string | null {
  const range = officialPriceRangeCny(value);
  if (!range) return null;
  const formattedMin = fmtPrice(range.min);
  return range.min === range.max ? formattedMin : `${formattedMin}–${fmtPrice(range.max)}`;
}

/** 价格只在专用人民币字段展示，避免简介里残留海外标价或旧汇率估值。 */
export function removeInlinePriceClaims(value: string): string {
  const parts = value.split(/(?<=[。！？!?；;])/);
  const priceMention = /(?:\b(?:USD|EUR|JPY|CHF|CAD|GBP|CNY)\s*[\d,.]+|[$€£¥]\s*[\d,.]+|\b\d[\d,.]*\s*CNY\b|(?:人民币|汇率).{0,18}(?:折算|换算))/i;
  return parts.filter((part) => !priceMention.test(part)).join("").trim();
}

export function fmtNum(n: number, digits = 1): string {
  return n.toFixed(digits);
}

export function fmtCompact(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}w`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const min = 60_000;
  const hour = 60 * min;
  const day = 24 * hour;
  if (diff < min) return "刚刚";
  if (diff < hour) return `${Math.floor(diff / min)} 分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`;
  if (diff < 30 * day) return `${Math.floor(diff / day)} 天前`;
  const d = new Date(then);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** 原型模拟凭据摘要，非真实安全存储 */
export function mockSecret(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  return `m${h.toString(36)}`;
}

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function pct(part: number, total: number): number {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}
