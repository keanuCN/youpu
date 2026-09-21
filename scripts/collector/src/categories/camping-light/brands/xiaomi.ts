import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const xiaomiCampingLightAdapter = {
  name: 'camping-light/xiaomi',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'camping-light' && target.brand === 'xiaomi';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`找到 Xiaomi 页面规格证据 ${snapshot.jsonLd.length} 条。`];

    const lumens = lumensFrom(evidence);
    if (lumens?.max !== undefined) normalizedSpecs.maxLumens = lumens.max;
    if (lumens?.min !== undefined) normalizedSpecs.minLumens = lumens.min;

    const rechargeable = rechargeableFrom(evidence);
    if (rechargeable !== undefined) normalizedSpecs.rechargeable = rechargeable;

    const batteryCapacity = numberWithUnitFrom(evidence, /(?:電池容量|电池容量)/, 'mAh');
    if (batteryCapacity !== undefined) normalizedSpecs.batteryCapacity = batteryCapacity;

    const batteryType = textAfterLabel(evidence, /(?:電池類型|电池类型)/, /(?:IP\s*等級|IP\s*等级|主燈規格|主灯规格)/);
    if (batteryType) normalizedSpecs.batteryType = batteryType;

    const chargeTime = minutesToHoursFrom(evidence);
    if (chargeTime !== undefined) normalizedSpecs.chargeTime = chargeTime;

    const waterResistance = waterResistanceFrom(evidence);
    if (waterResistance) normalizedSpecs.waterResistance = waterResistance;

    const weight = numberWithUnitFrom(evidence, /(?:淨重|净重)/, 'g');
    if (weight !== undefined) normalizedSpecs.weight = weight;

    const dimensions = dimensionsFrom(evidence);
    if (dimensions) normalizedSpecs.dimensions = dimensions;

    const missing = ['maxLumens', 'rechargeable'].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前页面确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push('页面未明确列出灯光模式数量和高低亮续航，未根据“冷光/暖光/RGB”反推模式或续航。');

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

function lumensFrom(evidence: string): { max?: number; min?: number } | undefined {
  const match = evidence.match(/亮度(?:調整|调整)\s*(\d+(?:\.\d+)?)\s*lm\s*[-–~至]\s*(\d+(?:\.\d+)?)\s*lm/i);
  if (!match?.[1] || !match[2]) return undefined;
  return { min: Number(match[1]), max: Number(match[2]) };
}

function rechargeableFrom(evidence: string): boolean | undefined {
  if (/(?:充電|充电)時間|(?:充電|充电)/i.test(evidence)) return true;
  return undefined;
}

function numberWithUnitFrom(evidence: string, label: RegExp, unit: string): number | undefined {
  const match = evidence.match(new RegExp(`${label.source}\\s*(?:約|约)?\\s*(\\d+(?:\\.\\d+)?)\\s*${unit}`, 'i'));
  return match?.[1] ? Number(match[1]) : undefined;
}

function textAfterLabel(evidence: string, label: RegExp, nextLabel: RegExp): string | undefined {
  const match = evidence.match(new RegExp(`${label.source}\\s*(.+?)(?=\\s*${nextLabel.source}|$)`, 'i'));
  return match?.[1]?.replace(/[\s,，。;；]+$/g, '').trim() || undefined;
}

function minutesToHoursFrom(evidence: string): number | undefined {
  const match = evidence.match(/(?:充電時間|充电时间)\s*(?:約|约)?\s*(\d+(?:\.\d+)?)\s*(?:分鐘|分钟)/i);
  return match?.[1] ? Number((Number(match[1]) / 60).toFixed(2)) : undefined;
}

function waterResistanceFrom(evidence: string): string | undefined {
  const match = evidence.match(/IP\s*(?:等級|等级)\s*(IP\s*\d{2}|IPX\s*\d)/i);
  return match?.[1]?.replace(/\s+/g, '').toLowerCase();
}

function dimensionsFrom(evidence: string): string | undefined {
  const match = evidence.match(/(?:產品尺寸|产品尺寸)\s*([\d.]+\s*[x×]\s*[\d.]+\s*[x×]\s*[\d.]+\s*mm)/i);
  return match?.[1]?.replace(/\s+/g, ' ').trim();
}
