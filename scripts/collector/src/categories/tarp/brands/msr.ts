import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

const numberWords: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
};

export const msrTarpAdapter = {
  name: 'tarp/msr',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'tarp' && target.brand === 'msr';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`找到 MSR 天幕页面标题与描述证据。`];

    const capacity = capacityFrom(evidence);
    if (capacity !== undefined) normalizedSpecs.capacity = capacity;

    const shelterType = shelterTypeFrom(evidence);
    if (shelterType) normalizedSpecs.shelterType = shelterType;

    const seasons = seasonsFrom(evidence);
    if (seasons !== undefined) normalizedSpecs.seasons = seasons;

    const missing = ['capacity', 'shelterType', 'seasons'].filter(
      (key) => normalizedSpecs[key] === undefined,
    );
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前页面标题或描述确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push('重量、覆盖面积、收纳尺寸和配件等技术规格未从当前静态快照确认，未根据搜索摘要或图片反推。');

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
    .replace(/\s+/g, ' ')
    .trim();
}

function capacityFrom(evidence: string): number | undefined {
  const digitMatch = evidence.match(/\b(\d+)\s*[- ]?person(?:s)?\b/i);
  if (digitMatch) return Number(digitMatch[1]);
  const wordMatch = evidence.match(/\b(one|two|three|four|five|six|seven|eight)[ -]?person(?:s)?\b/i);
  return wordMatch ? numberFromWord(wordMatch[1]) : undefined;
}

function shelterTypeFrom(evidence: string): string | undefined {
  const normalized = evidence.toLowerCase();
  if (normalized.includes('tarp shelter')) return 'tarp-shelter';
  if (normalized.includes('sun shield')) return 'sun-shield';
  if (normalized.includes('wing')) return 'wing';
  return undefined;
}

function seasonsFrom(evidence: string): number | undefined {
  const normalized = evidence.toLowerCase();
  if (normalized.includes('all-season') || normalized.includes('all season')) return 4;
  if (normalized.includes('four-season') || normalized.includes('four season')) return 4;
  const digitMatch = normalized.match(/\b([1-5])\s*[- ]?season\b/);
  if (digitMatch) return Number(digitMatch[1]);
  const wordMatch = normalized.match(/\b(one|two|three|four|five)[ -]?season\b/);
  return wordMatch ? numberFromWord(wordMatch[1]) : undefined;
}

function numberFromWord(value: string | undefined): number | undefined {
  return value ? numberWords[value.toLowerCase()] : undefined;
}
