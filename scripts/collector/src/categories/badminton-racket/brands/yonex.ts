import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const yonexBadmintonAdapter = {
  name: 'badminton-racket/yonex',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'badminton-racket' && target.brand === 'yonex';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const normalizedSpecs: Record<string, unknown> = {};
    const notes = [`找到 Yonex 页面规格条目 ${snapshot.specifications.length} 条。`];

    const weightClass = weightClassFrom(findSpecification(snapshot, (label) =>
      label.includes('weight') && label.includes('grip'),
    ));
    if (weightClass) normalizedSpecs.weightClass = weightClass;

    const balance = balanceFrom(findSpecification(snapshot, (label) => label === 'balance'));
    if (balance) normalizedSpecs.balance = balance;

    const flex = flexFrom(findSpecification(snapshot, (label) => label.includes('shaft flex')));
    if (flex) normalizedSpecs.flex = flex;

    const maxTension = maxNumberFrom(findSpecification(snapshot, (label) => label.includes('stringing advice')));
    if (maxTension !== undefined) normalizedSpecs.maxTension = maxTension;

    const lengthNote = findSpecification(snapshot, (label) => label === 'length');
    if (lengthNote) normalizedSpecs.lengthNote = lengthNote;

    const stringPattern = findSpecification(snapshot, (label) => label.includes('string pattern'));
    if (stringPattern) normalizedSpecs.stringPattern = stringPattern;

    const frameMaterial = findSpecification(snapshot, (label) => label.includes('frame') && label.includes('material'));
    if (frameMaterial) normalizedSpecs.frameMaterial = frameMaterial;

    const shaftMaterial = findSpecification(snapshot, (label) => label.includes('shaft') && label.includes('material'));
    if (shaftMaterial) normalizedSpecs.shaftMaterial = shaftMaterial;

    if (!frameMaterial && !shaftMaterial && findSpecification(snapshot, (label) => label === 'material')) {
      notes.push('页面只提供合并后的 Material，未将同一材料值复制到 frameMaterial / shaftMaterial。');
    }

    const missing = ['weightClass', 'balance', 'flex', 'maxTension', 'lengthNote', 'stringPattern']
      .filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) notes.push(`以下字段未从页面确认，保持缺省：${missing.join('、')}。`);

    return { normalizedSpecs, sourceNotes: notes };
  },
};

function findSpecification(
  snapshot: PageSnapshot,
  predicate: (label: string) => boolean,
): string | undefined {
  const specification = snapshot.specifications.find(({ label }) => predicate(normalizeLabel(label)));
  return specification?.value;
}

function normalizeLabel(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function weightClassFrom(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const classes = [...value.toUpperCase().matchAll(/\b([2345])U(?:G\d+)?/g)].map((match) => `${match[1]}U`);
  const unique = [...new Set(classes)];
  if (unique.includes('3U') && unique.includes('4U')) return '3U/4U';
  return unique.length === 1 ? unique[0] : undefined;
}

function balanceFrom(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const normalized = value.toLowerCase().replace(/[‐‑–—-]/g, ' ');
  if (normalized.includes('head heavy')) return 'head-heavy';
  if (normalized.includes('head light')) return 'head-light';
  if (normalized.includes('even')) return 'even';
  return undefined;
}

function flexFrom(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const normalized = value.toLowerCase().replace(/[‐‑–—-]/g, ' ');
  if (normalized.includes('extra stiff')) return 'extra-stiff';
  if (normalized.includes('hi flex') || normalized.includes('high flex')) return 'hi-flex';
  if (normalized.includes('stiff')) return 'stiff';
  if (normalized.includes('medium')) return 'medium';
  return undefined;
}

function maxNumberFrom(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const numbers = [...value.matchAll(/\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
  return numbers.length > 0 ? Math.max(...numbers) : undefined;
}
