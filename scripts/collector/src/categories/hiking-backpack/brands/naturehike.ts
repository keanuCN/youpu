import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const naturehikeHikingBackpackAdapter = {
  name: 'hiking-backpack/naturehike',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'hiking-backpack' && target.brand === 'naturehike';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`找到 Naturehike 页面标题级证据 ${snapshot.headings.length} 条。`];

    const packType = packTypeFrom(evidence);
    if (packType) normalizedSpecs.packType = packType;

    const suspension = suspensionFrom(evidence);
    if (suspension) normalizedSpecs.suspension = suspension;

    const volumeOptions = volumeOptionsFrom(evidence);
    if (volumeOptions.length > 0) normalizedSpecs.volumeOptions = volumeOptions;

    if (/multiple back length options|adjustable fit|back length/i.test(evidence)) {
      normalizedSpecs.torsoFit = 'multiple back length options';
    }

    if (/polyester fiber/i.test(evidence) && /ultra-high molecular polyethylene fiber/i.test(evidence)) {
      normalizedSpecs.material = 'polyester fiber and ultra-high molecular polyethylene fiber';
    } else {
      const mainFabric = evidence.match(/main fabric comprising\s+([^,.]{2,80})/i);
      if (mainFabric?.[1]) normalizedSpecs.material = mainFabric[1].trim();
    }

    if (/included rain cover|rain cover[^.]{0,40}included/i.test(evidence)) {
      normalizedSpecs.raincoverIncluded = true;
    }

    if (/x-shaped hipbelt/i.test(evidence)) {
      normalizedSpecs.hipbelt = 'X-shaped hipbelt';
    }

    const missing = ['packType', 'suspension'].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前页面标题或描述确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push('未明确的重量、负载范围和变体级背负参数保持缺省；不根据价格或图片推断容量和重量。');

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

function packTypeFrom(evidence: string): string | undefined {
  const normalized = evidence.toLowerCase();
  if (normalized.includes('fastpacking')) return 'fastpacking';
  if (/multi-day\s+(?:trekking|hiking)|trekking\s+pack/.test(normalized)) return 'trekking';
  if (normalized.includes('trekking')) return 'trekking';
  if (normalized.includes('backpacking')) return 'backpacking';
  if (normalized.includes('hiking')) return 'hiking';
  return undefined;
}

function suspensionFrom(evidence: string): string | undefined {
  const normalized = evidence.toLowerCase();
  if (normalized.includes('frameless')) return 'frameless';
  if (normalized.includes('anti-gravity') || normalized.includes('antigravity')) return 'anti-gravity';
  if (normalized.includes('aluminum frame') || normalized.includes('internal frame')) return 'internal-frame';
  if (normalized.includes('air float')) return 'other';
  return undefined;
}

function volumeOptionsFrom(evidence: string): Array<{ size: string; volumeLiters: number }> {
  const values = [
    ...evidence.matchAll(/\b(\d+(?:\.\d+)?)L\s+capacity\b/gi),
    ...evidence.matchAll(/\b(\d+(?:\.\d+)?)L\s+(?:model|backpack)\b/gi),
  ]
    .map((match) => Number(match[1]))
    .filter((value, index, all) => Number.isFinite(value) && all.indexOf(value) === index);
  return values.map((value) => ({ size: `${value}L`, volumeLiters: value }));
}
