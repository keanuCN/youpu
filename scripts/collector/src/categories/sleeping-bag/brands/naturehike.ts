import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const naturehikeSleepingBagAdapter = {
  name: 'sleeping-bag/naturehike',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'sleeping-bag' && target.brand === 'naturehike';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = ['找到 Naturehike 睡袋页面标题、描述和规格证据。'];

    const temperatureLabel = temperatureLabelFrom(snapshot.title);
    if (temperatureLabel) normalizedSpecs.temperatureLabel = temperatureLabel;

    const insulationType = insulationTypeFrom(evidence);
    if (insulationType) normalizedSpecs.insulationType = insulationType;

    const comfortTemperature = celsiusAfterLabel(evidence, 'Comfort');
    if (comfortTemperature !== undefined) normalizedSpecs.comfortTemperature = comfortTemperature;

    const limitTemperature = celsiusAfterLabel(evidence, 'Limit');
    if (limitTemperature !== undefined) normalizedSpecs.limitTemperature = limitTemperature;

    const extremeTemperature = celsiusAfterLabel(evidence, 'Extreme');
    if (extremeTemperature !== undefined) normalizedSpecs.extremeTemperature = extremeTemperature;

    const weight = kilogramsAfterLabel(evidence, 'Weight');
    if (weight !== undefined) normalizedSpecs.weight = weight;

    const fillWeight = fillWeightFrom(evidence);
    if (fillWeight !== undefined) normalizedSpecs.fillWeight = fillWeight;

    const packedSize = packedSizeFrom(evidence);
    if (packedSize) normalizedSpecs.packedSize = packedSize;

    const shellMaterial = materialAfterLabel(evidence, 'Shell') ?? materialFromDescription(evidence);
    if (shellMaterial) normalizedSpecs.shellMaterial = shellMaterial;

    const liningMaterial = materialAfterLabel(evidence, 'Lining');
    if (liningMaterial) normalizedSpecs.liningMaterial = liningMaterial;

    const shape = shapeFrom(evidence);
    if (shape) normalizedSpecs.shape = shape;

    const missing = ['temperatureLabel', 'insulationType'].filter(
      (key) => normalizedSpecs[key] === undefined,
    );
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前页面确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push('未根据 CW 型号数字推断填充重量；只有页面正文明确出现克数时才写入 fillWeight。');

    return { normalizedSpecs, sourceNotes };
  },
};

function pageEvidence(snapshot: PageSnapshot): string {
  return [
    snapshot.title,
    snapshot.description,
    ...snapshot.headings,
    ...snapshot.specifications.map((item) => `${item.label}: ${item.value}`),
    ...snapshot.jsonLd.map((value) => JSON.stringify(value)),
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function temperatureLabelFrom(title: string | undefined): string | undefined {
  const match = title?.match(/(\d+(?:\.\d+)?\s*°?\s*F\s*\/\s*-?\d+(?:\.\d+)?\s*°?\s*C)/i);
  return match?.[1]?.replace(/\s+/g, ' ').trim();
}

function insulationTypeFrom(evidence: string): string | undefined {
  const normalized = evidence.toLowerCase();
  if (normalized.includes('down')) return 'down';
  if (normalized.includes('synthetic')) return 'synthetic';
  if (normalized.includes('wool')) return 'wool';
  return undefined;
}

function celsiusAfterLabel(evidence: string, label: string): number | undefined {
  const match = evidence.match(
    new RegExp(`\\b${label}\\s*:\\s*.{0,120}?/\\s*(-?\\d+(?:\\.\\d+)?)\\s*°?\\s*C`, 'i'),
  );
  return match?.[1] ? Number(match[1]) : undefined;
}

function kilogramsAfterLabel(evidence: string, label: string): number | undefined {
  const match = evidence.match(
    new RegExp(`\\b${label}\\s*:?\\s*.{0,80}?(\\d+(?:\\.\\d+)?)\\s*kg\\b`, 'i'),
  );
  return match?.[1] ? Number(match[1]) : undefined;
}

function fillWeightFrom(evidence: string): number | undefined {
  const match = evidence.match(/\b(\d+)\s*g\s+(?:of\s+)?(?:\d+%\s+)?(?:white\s+)?duck down\b/i);
  return match?.[1] ? Number(match[1]) : undefined;
}

function packedSizeFrom(evidence: string): string | undefined {
  const match = evidence.match(/\bstorage size\s*:?\s*.{0,80}?((?:\d+(?:\.\d+)?\s*[×x]\s*)+\d+(?:\.\d+)?\s*cm)/i);
  return match?.[1]?.replace(/\s+/g, ' ').trim();
}

function materialAfterLabel(evidence: string, label: string): string | undefined {
  const match = evidence.match(
    new RegExp(`\\b${label}\\s*:?\\s*([^|.]{2,80}?)(?=\\s+(?:Lining|Features|Weight|Sleeping Bag size|Temperature Ratings)\\b|$)`, 'i'),
  );
  return match?.[1]?.replace(/\\s+/g, ' ').trim();
}

function materialFromDescription(evidence: string): string | undefined {
  const match = evidence.match(/\bmade from\s+([^,.]{2,80}?)(?=,\s*providing|\.\s*equipped)/i);
  return match?.[1]?.replace(/\s+/g, ' ').trim();
}

function shapeFrom(evidence: string): string | undefined {
  const normalized = evidence.toLowerCase();
  if (normalized.includes('hybrid shape')) return 'other';
  if (normalized.includes('mummy')) return 'mummy';
  if (normalized.includes('rectangular') || normalized.includes('envelope')) return 'rectangular';
  if (normalized.includes('quilt')) return 'quilt';
  return undefined;
}
