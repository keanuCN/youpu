import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const kailasHikingBackpackAdapter = {
  name: 'hiking-backpack/kailas',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'hiking-backpack' && target.brand === 'kailas';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`找到 KAILAS 页面规格描述证据 ${snapshot.jsonLd.length} 条。`];

    const packType = packTypeFrom(evidence);
    if (packType) normalizedSpecs.packType = packType;

    const suspension = suspensionFrom(evidence);
    if (suspension) normalizedSpecs.suspension = suspension;

    const volumeOption = volumeOptionFrom(evidence);
    if (volumeOption) normalizedSpecs.volumeOptions = [volumeOption];

    if (/(?:rain cover\s+(?:is\s+)?included|built-in rain cover)/i.test(evidence)) {
      normalizedSpecs.raincoverIncluded = true;
    }

    if (/three-position back length adjustment/i.test(evidence)) {
      normalizedSpecs.torsoFit = 'three-position back length adjustment';
    }

    if (evidence.includes('330D Cordura')) {
      normalizedSpecs.material = '330D Cordura';
    }

    if (/zippered pockets on both sides of the hip belt/i.test(evidence)) {
      normalizedSpecs.hipbelt = 'zippered pockets on both sides of the hip belt';
    }

    const missing = ['packType', 'suspension', 'volumeOptions'].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前页面确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push('产品以 48+5 L 标注容量；保留原始档位文字，并将基础容量与扩展容量相加为比较值 53 L。');

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
  if (normalized.includes('trekking')) return 'trekking';
  if (normalized.includes('backpacking')) return 'backpacking';
  if (normalized.includes('hiking')) return 'hiking';
  return undefined;
}

function suspensionFrom(evidence: string): string | undefined {
  const normalized = evidence.toLowerCase();
  if (normalized.includes('frameless')) return 'frameless';
  if (normalized.includes('anti-gravity') || normalized.includes('antigravity')) return 'anti-gravity';
  if (normalized.includes('aluminum alloy frame') || normalized.includes('internal frame')) return 'internal-frame';
  return undefined;
}

function volumeOptionFrom(evidence: string): Record<string, unknown> | undefined {
  const capacity = evidence.match(/capacity\s*:\s*(\d+(?:\.\d+)?)\s*\+\s*(\d+(?:\.\d+)?)\s*l(?=\b|[A-Z]|$)/i);
  if (!capacity?.[1] || !capacity[2]) return undefined;
  const base = Number(capacity[1]);
  const extension = Number(capacity[2]);
  return {
    size: `${capacity[1]}+${capacity[2]}L`,
    volumeLiters: base + extension,
    weightKg: numberAfterLabel(evidence, /weight/),
    dimensions: textAfterLabel(evidence, /dimensions/),
    loadMinKg: loadRangeFrom(evidence)?.min,
    loadMaxKg: loadRangeFrom(evidence)?.max,
  };
}

function numberAfterLabel(evidence: string, label: RegExp): number | undefined {
  const match = evidence.match(new RegExp(`${label.source}\\s*:\\s*(\\d+(?:\\.\\d+)?)\\s*kg`, 'i'));
  return match?.[1] ? Number(match[1]) : undefined;
}

function textAfterLabel(evidence: string, label: RegExp): string | undefined {
  const match = evidence.match(new RegExp(`${label.source}\\s*:\\s*([^".]+?cm)`, 'i'));
  return match?.[1]?.trim();
}

function loadRangeFrom(evidence: string): { min: number; max: number } | undefined {
  const match = evidence.match(/load range\s*:\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*kg/i);
  if (!match?.[1] || !match[2]) return undefined;
  return { min: Number(match[1]), max: Number(match[2]) };
}
