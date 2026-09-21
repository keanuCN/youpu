import type { AdapterResult, CrawlTarget, PageSnapshot, PageTable } from '../../../engine/types';

export const bioliteCampingLightAdapter = {
  name: 'camping-light/biolite',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'camping-light' && target.brand === 'biolite';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const pairs = toPairs(snapshot.tables);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`找到 BioLite 技术表字段 ${pairs.length} 条。`];

    const lumens = lumensFrom(findPair(pairs, 'lumens'));
    if (lumens?.max !== undefined) normalizedSpecs.maxLumens = lumens.max;
    if (lumens?.min !== undefined) normalizedSpecs.minLumens = lumens.min;

    const modeCount = modeCountFrom(snapshot.description, findPair(pairs, 'lighting modes'));
    if (modeCount !== undefined) normalizedSpecs.modeCount = modeCount;

    const rechargeable = rechargeableFrom(snapshot.title, snapshot.description, pairs);
    if (rechargeable !== undefined) normalizedSpecs.rechargeable = rechargeable;

    const battery = findPair(pairs, 'battery');
    const batteryCapacity = numberWithUnitFrom(battery, 'mAh');
    if (batteryCapacity !== undefined) normalizedSpecs.batteryCapacity = batteryCapacity;
    const batteryType = battery?.match(/\b(?:Li-Ion|Lithium(?:-ion)?|NiMH|Alkaline)\b/i)?.[0];
    if (batteryType) normalizedSpecs.batteryType = batteryType;

    const chargeTime = hoursFrom(findPair(pairs, 'charge time'));
    if (chargeTime !== undefined) normalizedSpecs.chargeTime = chargeTime;

    const runtime = runtimeFrom(findPair(pairs, 'burn time'));
    if (runtime?.high !== undefined) normalizedSpecs.runtimeHigh = runtime.high;
    if (runtime?.low !== undefined) normalizedSpecs.runtimeLow = runtime.low;

    const waterResistance = findPair(pairs, 'water resistance')?.match(/ipx\d/i)?.[0].toLowerCase();
    if (waterResistance) normalizedSpecs.waterResistance = waterResistance;

    const weight = numberWithUnitFrom(findPair(pairs, 'weight'), 'g');
    if (weight !== undefined) normalizedSpecs.weight = weight;

    const dimensions = findPair(pairs, 'dimensions');
    if (dimensions) normalizedSpecs.dimensions = dimensions;

    const input = findPair(pairs, 'inputs');
    if (input) normalizedSpecs.input = input;

    const output = findPair(pairs, 'outputs');
    if (output) normalizedSpecs.output = output;

    const missing = ['maxLumens', 'rechargeable'].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前页面确认，保持缺省：${missing.join('、')}。`);
    }

    return { normalizedSpecs, sourceNotes };
  },
};

function toPairs(tables: PageTable[]): Array<[string, string]> {
  return tables.flatMap((table) => [table.headers, ...table.rows])
    .filter((row): row is [string, string] => row.length >= 2 && Boolean(row[0]) && Boolean(row[1]))
    .map(([label, value]) => [label.toLowerCase().replace(/\s+/g, ' ').trim(), value.trim()]);
}

function findPair(pairs: Array<[string, string]>, label: string): string | undefined {
  return pairs.find(([key]) => key === label)?.[1];
}

function lumensFrom(value: string | undefined): { max?: number; min?: number } | undefined {
  if (!value) return undefined;
  const high = value.match(/(\d+(?:\.\d+)?)\s*lm[^\d]*(?:high|maximum)/i)?.[1];
  const low = value.match(/(\d+(?:\.\d+)?)\s*lm[^\d]*(?:low|minimum)/i)?.[1];
  const numbers = [...value.matchAll(/(\d+(?:\.\d+)?)\s*lm/gi)].map((match) => Number(match[1]));
  return {
    max: high ? Number(high) : numbers[0],
    min: low ? Number(low) : numbers.length > 1 ? numbers[numbers.length - 1] : undefined,
  };
}

function modeCountFrom(description: string | undefined, modes: string | undefined): number | undefined {
  const match = description?.match(/(\d+)\s+lighting modes?/i);
  if (match) return Number(match[1]);
  return modes ? modes.split(/(?=[A-Z])/).filter(Boolean).length : undefined;
}

function rechargeableFrom(
  title: string | undefined,
  description: string | undefined,
  pairs: Array<[string, string]>,
): boolean | undefined {
  const evidence = [title, description, findPair(pairs, 'inputs')].filter(Boolean).join(' ').toLowerCase();
  if (evidence.includes('rechargeable') || evidence.includes('charge')) return true;
  return undefined;
}

function numberWithUnitFrom(value: string | undefined, unit: string): number | undefined {
  const match = value?.match(new RegExp(`(\\d+(?:\\.\\d+)?)\\s*${unit}`, 'i'));
  return match?.[1] ? Number(match[1]) : undefined;
}

function hoursFrom(value: string | undefined): number | undefined {
  const match = value?.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)/i);
  return match?.[1] ? Number(match[1]) : undefined;
}

function runtimeFrom(value: string | undefined): { high?: number; low?: number } | undefined {
  if (!value) return undefined;
  const high = value.match(/(\d+(?:\.\d+)?)\s*hours?\s*high/i)?.[1];
  const low = value.match(/(?:up to\s*)?(\d+(?:\.\d+)?)\s*hours?\s*low/i)?.[1];
  return { high: high ? Number(high) : undefined, low: low ? Number(low) : undefined };
}
