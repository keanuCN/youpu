import type { AdapterResult, CrawlTarget, PageSnapshot, PageTable } from '../../../engine/types';

export const ospreyHikingBackpackAdapter = {
  name: 'hiking-backpack/osprey',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'hiking-backpack' && target.brand === 'osprey';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = ['找到 Osprey 背包页面标题、描述和规格表证据。'];

    const packType = packTypeFrom(evidence);
    if (packType) normalizedSpecs.packType = packType;

    const suspension = suspensionFrom(evidence);
    if (suspension) normalizedSpecs.suspension = suspension;

    const volumeOptions = volumeOptionsFrom(snapshot.tables);
    if (volumeOptions.length > 0) normalizedSpecs.volumeOptions = volumeOptions;

    const raincoverIncluded = snapshot.headings.some((heading) =>
      heading.toLowerCase().includes('integrated raincover'),
    );
    if (raincoverIncluded) normalizedSpecs.raincoverIncluded = true;

    const missing = ['packType', 'suspension', 'volumeOptions'].filter(
      (key) => normalizedSpecs[key] === undefined,
    );
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前页面确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push('面料、腰带细节和更细的背长适配未从当前规格表完整确认，未根据功能标题扩写。');

    return { normalizedSpecs, sourceNotes };
  },
};

function pageEvidence(snapshot: PageSnapshot): string {
  return [
    snapshot.title,
    snapshot.description,
    ...snapshot.jsonLd.map((value) => JSON.stringify(value)),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function packTypeFrom(evidence: string): string | undefined {
  if (evidence.includes('fastpacking')) return 'fastpacking';
  if (evidence.includes('trekking')) return 'trekking';
  if (evidence.includes('backpacking')) return 'backpacking';
  if (evidence.includes('hiking')) return 'hiking';
  return undefined;
}

function suspensionFrom(evidence: string): string | undefined {
  if (evidence.includes('antigravity')) return 'anti-gravity';
  if (evidence.includes('frameless')) return 'frameless';
  if (evidence.includes('internal frame')) return 'internal-frame';
  return undefined;
}

function volumeOptionsFrom(tables: PageTable[]): Array<Record<string, unknown>> {
  const table = tables.find((candidate) => candidate.headers[0]?.toLowerCase() === 'load range');
  if (!table) return [];

  const loadRange = table.headers
    .map((header) => kilogramRangeFrom(header))
    .find((range): range is { min: number; max: number } => range !== undefined);
  const options: Array<Record<string, unknown>> = [];
  let current: Record<string, unknown> | undefined;

  for (const row of table.rows) {
    const label = row[0]?.trim();
    const value = row.slice(1).join(' ').trim();
    if (!label) continue;
    if (/^(S\/M|M\/L|L\/XL|XS\/S|M\/L)$/i.test(label)) {
      current = { size: label };
      options.push(current);
      if (loadRange) {
        current.loadMinKg = loadRange.min;
        current.loadMaxKg = loadRange.max;
      }
      continue;
    }
    if (!current || !value) continue;

    const normalizedLabel = label.toLowerCase();
    if (normalizedLabel === 'volume') {
      const volumeLiters = litersFrom(value);
      if (volumeLiters !== undefined) current.volumeLiters = volumeLiters;
    }
    if (normalizedLabel === 'dimensions' && value.toLowerCase().includes('cm')) {
      current.dimensions = value;
    }
    if (normalizedLabel === 'weight') {
      const weightKg = kilogramsFrom(value);
      if (weightKg !== undefined) current.weightKg = weightKg;
    }
  }

  return options.filter((option) => option.volumeLiters !== undefined || option.weightKg !== undefined);
}

function litersFrom(value: string): number | undefined {
  const match = value.match(/(\d+(?:\.\d+)?)\s*l\b/i);
  return match?.[1] ? Number(match[1]) : undefined;
}

function kilogramsFrom(value: string): number | undefined {
  const match = value.match(/(\d+(?:\.\d+)?)\s*kg\b/i);
  return match?.[1] ? Number(match[1]) : undefined;
}

function kilogramRangeFrom(value: string): { min: number; max: number } | undefined {
  const match = value.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*kg\b/i);
  if (!match?.[1] || !match[2]) return undefined;
  return { min: Number(match[1]), max: Number(match[2]) };
}
