import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const naturehikeCampingStoveAdapter = {
  name: 'camping-stove/naturehike',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'camping-stove' && target.brand === 'naturehike';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`找到 Naturehike 页面标题级证据 ${snapshot.headings.length} 条。`];

    if (/(?:butane|gas canister|canister stove)/i.test(evidence)) {
      normalizedSpecs.fuelType = 'canister';
      normalizedSpecs.stoveType = 'canister';
    }

    const power = powerFrom(evidence);
    if (power !== undefined) normalizedSpecs.power = power;

    if (/(?:wind|weather-ready|rain|cold)/i.test(evidence)) {
      normalizedSpecs.windResistance = true;
    }

    const fuelEfficiency = evidence.match(/(?:heat efficiency|efficiency)\s+(?:by\s+)?(?:up to\s+)?(\d+)(?:%|\s+percent)/i)?.[1];
    if (fuelEfficiency) normalizedSpecs.fuelEfficiency = `up to ${fuelEfficiency}%`;

    const missing = ['fuelType', 'stoveType'].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前页面标题或描述确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push('页面未确认精确重量、收纳尺寸、沸腾时间和点火结构，未根据“轻量”“近乎瞬时点火”等描述反推。');

    return { normalizedSpecs, sourceNotes };
  },
};

function pageEvidence(snapshot: PageSnapshot): string {
  return [
    snapshot.title,
    snapshot.description,
    ...snapshot.headings,
    ...snapshot.jsonLd.map((value) => JSON.stringify(value)),
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function powerFrom(evidence: string): number | undefined {
  const digitMatch = evidence.match(/(\d+(?:\.\d+)?)\s*kilowatts?/i);
  if (digitMatch?.[1]) return Number(digitMatch[1]) * 1000;
  const wordMatch = evidence.match(/two\s+kilowatts?/i);
  return wordMatch ? 2000 : undefined;
}
