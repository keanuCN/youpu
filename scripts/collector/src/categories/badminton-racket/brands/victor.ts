import type { AdapterResult, CrawlTarget, PageSnapshot, PageTable } from '../../../engine/types';
import { maxNumberFrom, normalizeLabel, weightClassFrom } from '../normalize';

export const victorBadmintonAdapter = {
  name: 'badminton-racket/victor',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'badminton-racket' && target.brand === 'victor';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const table = snapshot.tables.find(hasVictorSpecificationPairs);
    if (!table) {
      return {
        normalizedSpecs: {},
        sourceNotes: ['未找到 VICTOR Product Specifications 表，保留原始页面快照，未猜测参数。'],
      };
    }

    const pairs = toPairs(table);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`找到 VICTOR Product Specifications 表 ${pairs.length} 条。`];

    const weightClass = weightClassFrom(findPair(pairs, 'weight / grip size'));
    if (weightClass) normalizedSpecs.weightClass = weightClass;

    const maxTension = maxNumberFrom(findPair(pairs, 'string tension lbs'));
    if (maxTension !== undefined) normalizedSpecs.maxTension = maxTension;

    const frameMaterial = findPair(pairs, 'frame material');
    if (frameMaterial) normalizedSpecs.frameMaterial = frameMaterial;

    const shaftMaterial = findPair(pairs, 'shaft material');
    if (shaftMaterial) normalizedSpecs.shaftMaterial = shaftMaterial;

    const missing = ['weightClass', 'maxTension', 'frameMaterial', 'shaftMaterial']
      .filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) sourceNotes.push(`以下字段未从页面确认，保持缺省：${missing.join('、')}。`);

    return { normalizedSpecs, sourceNotes };
  },
};

function hasVictorSpecificationPairs(table: PageTable): boolean {
  const labels = toPairs(table).map(([label]) => label);
  return labels.includes('shaft material') && labels.includes('frame material');
}

function toPairs(table: PageTable): Array<[string, string]> {
  return [table.headers, ...table.rows]
    .filter((row): row is [string, string] => row.length >= 2 && Boolean(row[0]) && Boolean(row[1]))
    .map(([label, value]) => [normalizeLabel(label), value.trim()]);
}

function findPair(pairs: Array<[string, string]>, label: string): string | undefined {
  return pairs.find(([key]) => key === label)?.[1];
}
