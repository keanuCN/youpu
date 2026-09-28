import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const kailasSkiingApparelAdapter = {
  name: 'skiing-apparel/kailas',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'skiing-apparel' && target.brand === 'kailas';
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
    const searchable = `${target.model} ${snapshot.title ?? ''} ${snapshot.headings.join(' ')}`;
    const normalizedSpecs: Record<string, unknown> = {};

    if (/\b(?:ski\s+)?jacket\b/i.test(searchable)) normalizedSpecs.garmentType = 'jacket';
    else if (/\b(?:ski\s+)?pants\b/i.test(searchable)) normalizedSpecs.garmentType = 'pants';

    const construction = evidence.match(/\b([23])\s*L\s+GORE-TEX\b/i);
    if (construction?.[1]) normalizedSpecs.construction = `${construction[1]}L`;

    const insulation = evidence.match(/Insulation:\s*(\d+)g\s+(\d+)FP\s+Down/i);
    if (insulation) normalizedSpecs.insulation = `${insulation[1]}g ${insulation[2]}FP down`;

    const fabric = evidence.match(/(?:Material:\s*)?((?:\d{2,3}D\s+)?[23]L\s+GORE-TEX(?:\s+Pro)?)/i);
    if (fabric?.[1]) normalizedSpecs.fabric = fabric[1].trim();

    if (/Underarm Ventilation Zipper/i.test(evidence)) normalizedSpecs.venting = true;
    if (normalizedSpecs.garmentType === 'jacket' && /Powder Skirt/i.test(evidence)) {
      normalizedSpecs.powderSkirt = true;
    }

    const missing = ['garmentType', 'construction', 'fabric'].filter((key) => normalizedSpecs[key] === undefined);
    const sourceNotes = [
      '仅从 KAILAS 官方国际站商品页提取明确标注的款式和规格；当前页面未公布的防水/透湿数值、压胶方式和重量保持缺省。',
      '同系列不同 SKU 的填充量或版型不合并；来源页未明确标注季节，年份按当前目录分组记录，不从 SKU 编码反推季节。',
      '官方站使用美元；未换算或录入人民币价格。',
    ];
    if (missing.length > 0) sourceNotes.push(`页面未确认以下字段：${missing.join('、')}。`);

    return { normalizedSpecs, sourceNotes };
  },
};
