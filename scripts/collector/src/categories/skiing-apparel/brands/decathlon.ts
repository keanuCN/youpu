import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const decathlonSkiingApparelAdapter = {
  name: 'skiing-apparel/decathlon',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'skiing-apparel' && target.brand === 'decathlon';
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = [
      snapshot.title,
      snapshot.description,
      snapshot.bodyText,
      ...snapshot.headings,
      ...snapshot.specifications.flatMap(({ label, value }) => [label, value]),
      ...snapshot.tables.flatMap((table) => [...table.headers, ...table.rows.flat()]),
    ]
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    const normalizedSpecs: Record<string, unknown> = {};

    if (/\b(?:snowboard|ski) jacket\b/i.test(`${target.model} ${snapshot.title ?? ''}`)) {
      normalizedSpecs.garmentType = 'jacket';
    }

    const waterproof = evidence.match(/(?:waterproof(?:ness)?|Schmerber)[^\d]{0,30}(\d{1,3}(?:,\d{3})?)\s*mm/i)
      ?? evidence.match(/(\d{1,3}(?:,\d{3})?)\s*mm(?:\s+H2O)?[^.]{0,40}(?:waterproof|Schmerber)/i);
    if (waterproof?.[1]) normalizedSpecs.waterproofMm = Number(waterproof[1].replace(/,/g, ''));

    const construction = evidence.match(/\b([23])\s*[- ]?layer\b/i);
    if (construction?.[1]) normalizedSpecs.construction = `${construction[1]}L`;

    const insulation = evidence.match(/(\d+)\s*g\/sqm\s+wadding\s+on\s+the\s+body\s+\((\d+)\s*g\/sqm\s+on\s+the\s+arms\)/i);
    if (insulation) normalizedSpecs.insulation = `${insulation[1]} g/m² body / ${insulation[2]} g/m² sleeves synthetic wadding`;

    if (/all seams\s*\(100%\)\s+are waterproof/i.test(evidence)) {
      normalizedSpecs.seamTaping = 'fully-taped';
    }

    if (/ventilation strip|underarm ventilation|ventilation under the arms/i.test(evidence)) {
      normalizedSpecs.venting = true;
    }
    if (/snow skirt|powder skirt/i.test(evidence)) normalizedSpecs.powderSkirt = true;

    const fabric = evidence.match(/Main fabric:\s*([^;]{2,80}?)(?=\s*(?:Yoke|Padding|Main lining|Membrane):|$)/i);
    if (fabric?.[1]) normalizedSpecs.fabric = fabric[1].trim();

    return {
      normalizedSpecs,
      sourceNotes: [
        '仅提取 Decathlon 官方 SNB 500 页面明确公布的滑雪服规格；透湿 RET 不换算成 g/m²/24h。',
        '页面未明确标注商品季节，2026 仅作为目录采集快照年份；不把 RET、评论量或材料说明推算成 schema 中其他字段。',
        '页面价格为英镑，不换算为人民币；未确认图片授权，正式 seed 不收录商品图。',
      ],
    };
  },
};
