import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const nisiFilterAdapter = {
  name: 'filter/nisi',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'filter' && target.brand === 'nisi';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = ['找到 NiSi 耐司官方滤镜产品页的明确规格证据。'];

    if (/CPL|偏振/i.test(evidence)) normalizedSpecs.filterType = 'CPL 偏振镜';

    const diameterLine = evidence.match(/(?:现在提供|available\s+in)\s+([^。]{0,120}?\d+(?:\.\d+)?\s*mm)/i);
    if (diameterLine?.[1]) {
      const diameters = [...diameterLine[1].matchAll(/(\d+(?:\.\d+)?)/g)].map((match) => match[1]);
      if (diameters.length > 0) normalizedSpecs.diameterOptions = `${diameters.join(' / ')} mm`;
    }

    if (/True\s+Color\s+偏振材料|偏振材料/i.test(evidence)) {
      normalizedSpecs.material = 'True Color 偏振材料';
    }

    const coating = evidence.match(/(双面低反射纳米镀膜|double[- ]sided[^。]{0,40}nano[- ]coating)/i);
    if (coating?.[1]) normalizedSpecs.coating = coating[1].replace(/\s+/g, ' ').trim();

    if (/基本不改变色温|does\s+not\s+change\s+color\s+temperature/i.test(evidence)) {
      normalizedSpecs.colorNeutral = true;
    }
    if (/双面防水防油|water\s+and\s+oil\s+repellent/i.test(evidence)) {
      normalizedSpecs.waterOilResistance = true;
    }
    if (/边缘涂黑|blackened\s+edges/i.test(evidence)) normalizedSpecs.edgeBlackening = true;

    if (/铜框\s*真彩\s*CPL/i.test(evidence)) normalizedSpecs.frameOptions = '标准框 / 铜框';

    const missing = ['filterType', 'diameterOptions', 'material', 'coating'].filter(
      (key) => normalizedSpecs[key] === undefined,
    );
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前页面明确确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push('仅使用页面标题、正文、规格列表和结构化数据中的明确事实；未根据图片、搜索摘要或其他滤镜系列补写字段。');

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
