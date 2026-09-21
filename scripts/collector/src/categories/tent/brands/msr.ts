import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

const seasonWords: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
};

export const msrTentAdapter = {
  name: 'tent/msr',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'tent' && target.brand === 'msr';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`找到 MSR 页面标题级证据 ${snapshot.headings.length} 条。`];

    const capacity = capacityFrom(evidence);
    if (capacity !== undefined) normalizedSpecs.capacity = capacity;

    const tentType = tentTypeFrom(evidence);
    if (tentType) normalizedSpecs.tentType = tentType;

    const seasons = seasonsFrom(evidence);
    if (seasons !== undefined) normalizedSpecs.seasons = seasons;

    const freestanding = freestandingFrom(evidence);
    if (freestanding !== undefined) normalizedSpecs.freestanding = freestanding;

    const missing = ['capacity', 'tentType', 'seasons', 'freestanding'].filter(
      (key) => normalizedSpecs[key] === undefined,
    );
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前页面标题或描述确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push('最低重量、包装重量、面积和材料等技术规格未从当前静态快照确认，未根据搜索摘要或图片反推。');

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

function capacityFrom(evidence: string): number | undefined {
  const digitMatch = evidence.match(/\b(\d+)\s*[- ]?person(?:s)?\b/i);
  if (digitMatch) return Number(digitMatch[1]);

  const wordMatch = evidence.match(/\b(one|two|three|four|five|six|seven|eight)[ -]?person(?:s)?\b/i);
  if (!wordMatch) return undefined;
  return numberFromWord(wordMatch[1]);
}

function tentTypeFrom(evidence: string): string | undefined {
  const normalized = evidence.toLowerCase();
  if (normalized.includes('backpacking')) return 'backpacking';
  if (normalized.includes('bikepacking')) return 'bikepacking';
  if (normalized.includes('four-season') || normalized.includes('four season') || normalized.includes('4-season')) {
    return 'four-season';
  }
  if (normalized.includes('camping')) return 'camping';
  return undefined;
}

function seasonsFrom(evidence: string): number | undefined {
  const normalized = evidence.toLowerCase();
  const digitMatch = normalized.match(/\b([1-5])\s*[- ]?season\b/);
  if (digitMatch) return Number(digitMatch[1]);
  const wordMatch = normalized.match(/\b(one|two|three|four|five)[ -]?season\b/);
  return wordMatch ? numberFromWord(wordMatch[1]) : undefined;
}

function numberFromWord(value: string | undefined): number | undefined {
  return value ? seasonWords[value.toLowerCase()] : undefined;
}

function freestandingFrom(evidence: string): boolean | undefined {
  const normalized = evidence.toLowerCase();
  if (/non[- ]?freestanding/.test(normalized)) return false;
  if (normalized.includes('freestanding')) return true;
  return undefined;
}
