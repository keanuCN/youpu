import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const msrCampingStoveAdapter = {
  name: 'camping-stove/msr',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'camping-stove' && target.brand === 'msr';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = ['找到 MSR 炉头页面标题、描述和图片替代文本证据。'];

    const fuelType = fuelTypeFrom(evidence);
    if (fuelType) normalizedSpecs.fuelType = fuelType;

    const stoveType = stoveTypeFrom(evidence);
    if (stoveType) normalizedSpecs.stoveType = stoveType;

    const ignition = ignitionFrom(evidence);
    if (ignition) normalizedSpecs.ignition = ignition;

    if (evidence.includes('wind resistance')) normalizedSpecs.windResistance = true;

    const missing = ['fuelType', 'stoveType', 'ignition', 'windResistance'].filter(
      (key) => normalizedSpecs[key] === undefined,
    );
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前页面确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push('重量、功率、沸腾时间和燃料效率等字段未从当前静态快照确认，未根据评论或搜索摘要反推。');

    return { normalizedSpecs, sourceNotes };
  },
};

function pageEvidence(snapshot: PageSnapshot): string {
  return [
    snapshot.title,
    snapshot.description,
    ...snapshot.jsonLd.map((value) => JSON.stringify(value)),
    ...snapshot.imageAltTexts,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function fuelTypeFrom(evidence: string): string | undefined {
  if (evidence.includes('canister fuel') || evidence.includes('canister stove')) return 'canister';
  if (evidence.includes('liquid-fuel') || evidence.includes('liquid fuel')) return 'liquid-fuel';
  if (evidence.includes('alcohol')) return 'alcohol';
  return undefined;
}

function stoveTypeFrom(evidence: string): string | undefined {
  if (evidence.includes('integrated stove') || evidence.includes('stove system')) return 'integrated';
  if (evidence.includes('remote-canister') || evidence.includes('remote canister')) return 'remote-canister';
  if (evidence.includes('canister fuel') || evidence.includes('canister stove')) return 'canister';
  if (evidence.includes('liquid-fuel') || evidence.includes('liquid fuel')) return 'liquid-fuel';
  if (evidence.includes('alcohol')) return 'alcohol';
  return undefined;
}

function ignitionFrom(evidence: string): string | undefined {
  if (evidence.includes('piezo') || evidence.includes('push-start ignition')) return 'piezo';
  if (evidence.includes('manual ignition') || evidence.includes('manual light')) return 'manual';
  return undefined;
}
