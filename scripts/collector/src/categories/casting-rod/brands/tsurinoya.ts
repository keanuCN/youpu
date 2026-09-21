import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const tsurinoyaCastingRodAdapter = {
  name: 'casting-rod/tsurinoya',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'casting-rod' && target.brand === 'tsurinoya';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = ['找到钓之屋官方页面标题和产品详情表证据。'];

    const sections = sectionsFrom(evidence);
    if (sections !== undefined) normalizedSpecs.sections = sections;

    if (/超快调|fast\s+action/i.test(evidence)) normalizedSpecs.action = 'fast';

    const rodType = rodTypeFrom(evidence);
    if (rodType) normalizedSpecs.rodType = rodType;

    const scenes = scenesFrom(evidence);
    if (scenes.length > 0) normalizedSpecs.scenes = scenes;

    const missing = [
      'length',
      'weight',
      'lureWeight',
      'lineWeight',
      'power',
      'rodType',
      'blankMaterial',
      'carbonContent',
    ].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前页面的结构化文字确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push(
      '页面以产品详情图片承载更多规格信息；当前采集器不对图片做 OCR，也不根据图片文件名或搜索摘要补写数字参数。',
    );

    return { normalizedSpecs, sourceNotes };
  },
};

function pageEvidence(snapshot: PageSnapshot): string {
  return [
    snapshot.title,
    snapshot.description,
    ...snapshot.headings,
    ...snapshot.specifications.flatMap(({ label, value }) => [label, value]),
    ...snapshot.tables.flatMap((table) => [
      ...table.headers,
      ...table.rows.flat(),
    ]),
    ...snapshot.jsonLd.map((value) => JSON.stringify(value)),
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sectionsFrom(evidence: string): number | undefined {
  if (/两节|two[- ]piece/i.test(evidence)) return 2;
  const match = evidence.match(/(\d+)\s*节(?:路亚)?竿/i);
  return match?.[1] ? Number(match[1]) : undefined;
}

function rodTypeFrom(evidence: string): string | undefined {
  if (/直柄|spinning/i.test(evidence)) return 'spinning';
  if (/枪柄|casting/i.test(evidence)) return 'casting';
  return undefined;
}

function scenesFrom(evidence: string): string[] {
  const scenes = new Set<string>();
  if (/鲈鱼|海鲈|bass/i.test(evidence)) scenes.add('bass');
  if (/虫竿|finesse/i.test(evidence)) scenes.add('finesse');
  if (/淡水|freshwater/i.test(evidence)) scenes.add('freshwater');
  return [...scenes];
}
