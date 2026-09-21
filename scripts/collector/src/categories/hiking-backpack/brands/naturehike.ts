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

    if (/multiple back length options/i.test(evidence)) {
      normalizedSpecs.torsoFit = 'multiple back length options';
    }

    if (/polyester fiber/i.test(evidence) && /ultra-high molecular polyethylene fiber/i.test(evidence)) {
      normalizedSpecs.material = 'polyester fiber and ultra-high molecular polyethylene fiber';
    }

    const missing = ['packType', 'suspension'].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前页面标题或描述确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push('重量、负载范围、防雨罩和腰带结构未从当前静态快照确认；页面选项中的 45 L/60 L 变体未在正文中完整展开，因此未写入容量档位。');

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
  if (normalized.includes('backpacking')) return 'backpacking';
  if (normalized.includes('trekking') || normalized.includes('hiking')) return 'hiking';
  return undefined;
}

function suspensionFrom(evidence: string): string | undefined {
  const normalized = evidence.toLowerCase();
  if (normalized.includes('frameless')) return 'frameless';
  if (normalized.includes('anti-gravity') || normalized.includes('antigravity')) return 'anti-gravity';
  if (normalized.includes('aluminum frame') || normalized.includes('internal frame')) return 'internal-frame';
  return undefined;
}

function volumeOptionsFrom(evidence: string): Array<{ size: string; volumeLiters: number }> {
  const values = [...evidence.matchAll(/\b(\d+(?:\.\d+)?)L\s+capacity\b/gi)]
    .map((match) => Number(match[1]))
    .filter((value, index, all) => Number.isFinite(value) && all.indexOf(value) === index);
  return values.map((value) => ({ size: `${value}L`, volumeLiters: value }));
}
