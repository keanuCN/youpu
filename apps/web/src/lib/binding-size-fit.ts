import type { GearSizeSpec } from '@/types';

/** EU 为已声明单位；不使用 US 男女码或日常鞋码进行换算。 */
export function bindingEuRange(value: unknown): [number, number] | undefined {
  if (typeof value !== 'string' || !value.trim()) return;
  const text = value.trim().replace(/[–—−]/g, '-');
  const range = /^(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)$/.exec(text);
  if (range && Number(range[1]) <= Number(range[2])) return [Number(range[1]), Number(range[2])];
  const open = /^(\d+(?:\.\d+)?)\s*\+$/.exec(text);
  if (open) return [Number(open[1]), Infinity];
  if (/^\d+(?:\.\d+)?$/.test(text)) return [Number(text), Number(text)];
}

export function matchingBindingSizes(rows: GearSizeSpec[], eu: number) {
  const known = rows.map((row) => ({ row, range: bindingEuRange(row.eu) })).filter((item) => item.range !== undefined);
  return {
    matches: known.filter(({ range }) => eu >= range![0] && eu <= range![1]).map(({ row }) => row),
    known: known.length,
    unknown: rows.length - known.length,
  };
}
