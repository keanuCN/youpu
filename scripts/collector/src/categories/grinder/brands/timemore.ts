import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const timemoreGrinderAdapter = {
  name: 'grinder/timemore',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'grinder' && target.brand === 'timemore';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = ['找到泰摩 TIMEMORE 台湾官方 TEG078S 产品页的中文详情和规格事实。'];

    if (/電動磨豆機|电动磨豆机/i.test(evidence)) normalizedSpecs.grinderType = '电动磨豆机';

    if (/手沖\s*\/\s*義式雙用|手冲\s*\/\s*意式双用/i.test(evidence)) {
      normalizedSpecs.useRange = '手冲 / 意式双用';
    }

    const weight = evidence.match(/【重量】\s*約?\s*([\d.]+)\s*g/i);
    if (weight?.[1]) normalizedSpecs.weight = Number(weight[1]);

    const dimensions = evidence.match(/【尺寸】\s*([^【]+?)(?=\s*【電壓|\s*商品特色)/i);
    if (dimensions?.[1]) normalizedSpecs.dimensions = cleanText(dimensions[1]).replace(/\*/g, ' × ');

    const materials = evidence.match(/【材質】\s*([^【]+)/i);
    if (materials?.[1]) normalizedSpecs.materials = simplifyText(materials[1]);

    const standardHopper = evidence.match(/標準豆倉[\s\S]{0,30}?容量[：:]\s*約?\s*([\d–-]+)\s*g/i);
    const tallHopper = evidence.match(/加高豆倉[\s\S]{0,40}?容量[：:]\s*約?\s*([\d.]+)\s*g/i);
    if (standardHopper?.[1] && tallHopper?.[1]) {
      normalizedSpecs.hopperCapacity = `标准豆仓约 ${standardHopper[1]} g；加高豆仓约 ${tallHopper[1]} g`;
    }

    const catchCup = evidence.match(/078\s*系列[：:]\s*接粉罐容量約?\s*([\d.]+)\s*g/i);
    if (catchCup?.[1]) normalizedSpecs.catchCupCapacity = Number(catchCup[1]);

    const power = evidence.match(/([\d.]+)\s*W\s*\(078S\)/i);
    if (power?.[1]) normalizedSpecs.power = Number(power[1]);

    const voltage = evidence.match(/【電壓\/功率】\s*([\d.]+\s*V)/i);
    if (voltage?.[1]) normalizedSpecs.voltage = voltage[1].replace(/\s+/g, '');

    if (/可調整研磨轉速|可调整研磨转速/i.test(evidence)) normalizedSpecs.speedAdjustment = true;
    if (/震落細粉|震落细粉/i.test(evidence)) normalizedSpecs.fineRetentionReduction = true;

    const missing = [
      'grinderType',
      'useRange',
      'weight',
      'dimensions',
      'materials',
      'hopperCapacity',
      'catchCupCapacity',
      'power',
      'voltage',
      'speedAdjustment',
      'fineRetentionReduction',
    ].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前官方页面明确确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push(
      '页面的功率同时展示 078 与 078S；功率只读取目标型号 078S 的 230 W，电压保留页面写出的 110 V，没有把 078 的 110 W 合并。',
    );
    sourceNotes.push('豆仓容量保留标准豆仓与加高豆仓两种官方区间，不把可选豆仓压成单一容量；未从台湾地区售价换算人民币。');

    return { normalizedSpecs, sourceNotes };
  },
};

function cleanText(value: string): string {
  return simplifyText(value).replace(/[()（）]/g, '').replace(/\s+/g, ' ').trim();
}

function simplifyText(value: string): string {
  return value
    .replace(/電動磨豆機/g, '电动磨豆机')
    .replace(/手沖/g, '手冲')
    .replace(/義式/g, '意式')
    .replace(/雙用/g, '双用')
    .replace(/產品/g, '产品')
    .replace(/材質/g, '材质')
    .replace(/鋁合金/g, '铝合金')
    .replace(/不鏽鋼/g, '不锈钢')
    .replace(/容量/g, '容量')
    .replace(/研磨/g, '研磨')
    .replace(/轉速/g, '转速')
    .replace(/細粉/g, '细粉')
    .replace(/約/g, '约')
    .replace(/\s+/g, ' ')
    .trim();
}

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
