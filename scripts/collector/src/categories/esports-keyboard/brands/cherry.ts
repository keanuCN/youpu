import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const cherryEsportsKeyboardAdapter = {
  name: 'esports-keyboard/cherry',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'esports-keyboard' && target.brand === 'cherry' && /MX\s*3\.0S\s*RGB/i.test(target.model);
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`找到 CHERRY 官方 ${target.model} 产品页。`];

    if (/机械/i.test(evidence)) normalizedSpecs.keyboardType = 'mechanical';
    if (/全尺寸|100%/i.test(evidence)) normalizedSpecs.layout = '108 键全尺寸';
    if (/有线|Wired/i.test(evidence)) normalizedSpecs.connection = ['wired'];
    if (/铝合金外壳|铝合金机身|连铸式铝合金/i.test(evidence)) normalizedSpecs.caseMaterial = '铝合金外壳';
    if (/1600万色|RGB/i.test(evidence)) normalizedSpecs.backlight = 'RGB 背光';
    if (/无钢软弹/i.test(evidence)) normalizedSpecs.mounting = '无钢软弹结构';

    const missing = ['switchType', 'layout', 'connection', 'caseMaterial', 'backlight']
      .filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) sourceNotes.push(`以下字段未从本型号官方页面确认，保持缺省：${missing.join('、')}。`);
    sourceNotes.push('本次限定 MX3.0S RGB 有线版本；未混入 MX3.0S NBL、TKL、无线版或其他联名 SKU。不同轴体和键帽刻字选项不作为统一规格。');
    sourceNotes.push('京东多个 MX3.0S RGB 108 键商品显示 10 万+评论；评价量不是销量，且列表可能合并商品变体，不写入规格或销量。');

    return { normalizedSpecs, sourceNotes };
  },
};

function pageEvidence(snapshot: PageSnapshot): string {
  return [
    snapshot.title,
    snapshot.description,
    snapshot.bodyText,
    ...snapshot.headings,
    ...snapshot.specifications.flatMap(({ label, value }) => [label, value]),
    ...snapshot.tables.flatMap((table) => [...table.headers, ...table.rows.flat()]),
    ...snapshot.imageAltTexts,
    ...snapshot.jsonLd.map((value) => JSON.stringify(value)),
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
