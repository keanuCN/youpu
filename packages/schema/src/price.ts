export const CANONICAL_PRICE_CURRENCY = 'CNY' as const;

export const PRICE_RATES_TO_CNY = {
  CNY: 1,
  // SAFE RMB central parity rates for 2026-10-14, expressed as CNY per unit.
  USD: 6.7249,
  EUR: 7.5165,
  JPY: 0.042412,
  CHF: 8.0613,
  CAD: 4.718,
} as const;

export function convertPriceToCny(value: number, currency: string = CANONICAL_PRICE_CURRENCY): number {
  if (!Number.isFinite(value)) throw new Error('价格必须是有限数字');
  if (value < 0) throw new Error('价格必须是非负数字');

  const code = currency.toUpperCase() as keyof typeof PRICE_RATES_TO_CNY;
  const rate = PRICE_RATES_TO_CNY[code];
  if (rate === undefined) throw new Error(`未配置价格币种换算：${currency}`);
  return Math.round(value * rate);
}

export function normalizePriceRange(input: {
  min?: number | null;
  max?: number | null;
  currency?: string;
}): { min: number | null; max: number | null; currency: typeof CANONICAL_PRICE_CURRENCY } {
  const currency = input.currency ?? CANONICAL_PRICE_CURRENCY;
  const code = currency.toUpperCase() as keyof typeof PRICE_RATES_TO_CNY;
  if (PRICE_RATES_TO_CNY[code] === undefined) throw new Error(`未配置价格币种换算：${currency}`);

  const min = input.min == null ? null : convertPriceToCny(input.min, currency);
  const max = input.max == null ? null : convertPriceToCny(input.max, currency);
  if (min !== null && max !== null && min > max) throw new Error('最小价格不能高于最大价格');
  return { min, max, currency: CANONICAL_PRICE_CURRENCY };
}
