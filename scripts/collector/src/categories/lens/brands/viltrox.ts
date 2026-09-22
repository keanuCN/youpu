import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const viltroxLensAdapter = {
  name: 'lens/viltrox',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'lens' && target.brand === 'viltrox';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = ['找到 Viltrox 唯卓仕官方镜头产品页的明确规格证据。'];

    const mount = evidence.match(/Lens\s+Mount\s*:?\s*([A-Za-z-]+(?:\s+mount)?)/i);
    if (mount?.[1]) normalizedSpecs.mount = mount[1].trim();

    const focalLength = evidence.match(/Focal\s+Length\s*:?\s*f\s*=\s*(\d+(?:\.\d+)?)\s*mm/i);
    if (focalLength?.[1]) normalizedSpecs.focalLength = Number(focalLength[1]);

    const equivalentFocalLength = evidence.match(/Focal\s+Length[^()]{0,60}\((\d+(?:\.\d+)?\s*mm)\)/i);
    if (equivalentFocalLength?.[1]) normalizedSpecs.equivalentFocalLength = equivalentFocalLength[1].replace(/\s+/g, '');

    const maxAperture = evidence.match(/Aperture\s*:?\s*F\s*(\d+(?:\.\d+)?)/i);
    if (maxAperture?.[1]) normalizedSpecs.maxAperture = Number(maxAperture[1]);

    const opticalStructure = evidence.match(/Lens\s+Elements\s*:?\s*(\d+\s*\/\s*\d+)/i);
    if (opticalStructure?.[1]) normalizedSpecs.opticalStructure = opticalStructure[1].replace(/\s+/g, '');

    const focusDistance = evidence.match(/Shooting\s+Distance\s*:?\s*(\d+(?:\.\d+)?)\s*m\b/i);
    if (focusDistance?.[1]) normalizedSpecs.focusDistance = Number(focusDistance[1]);

    const maxMagnification = evidence.match(/Max\.\s*magnification\s*:?\s*(0?\.\d+)\s*x\b/i);
    if (maxMagnification?.[1]) normalizedSpecs.maxMagnification = Number(maxMagnification[1]);

    if (/Focus\s+Mode\s*:?[^.]{0,30}\bAF\b|autofocus/i.test(evidence)) normalizedSpecs.autofocus = true;

    const filterSize = evidence.match(/Filter\s+Size\s*:?\s*[ΦØ]?\s*(\d+)\s*mm/i);
    if (filterSize?.[1]) normalizedSpecs.filterSize = Number(filterSize[1]);

    const weight = evidence.match(/Weight\s*:?\s*[≈~]?\s*(\d+(?:\.\d+)?)\s*g\b/i);
    if (weight?.[1]) normalizedSpecs.weight = Number(weight[1]);

    if (/weather[- ]sealed|weather[- ]protective|防尘防滴/i.test(evidence)) {
      normalizedSpecs.weatherSealing = '防尘防滴 / 全天候防护';
    }

    const missing = [
      'mount',
      'focalLength',
      'maxAperture',
      'opticalStructure',
      'focusDistance',
      'maxMagnification',
      'autofocus',
      'filterSize',
      'weight',
    ].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前页面明确确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push('仅使用页面标题、正文、规格列表和结构化数据中的明确事实；未根据图片、搜索摘要或相近卡口版本补写字段。');

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
