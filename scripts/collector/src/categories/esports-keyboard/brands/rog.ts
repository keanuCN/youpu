import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const rogEsportsKeyboardAdapter = {
  name: 'esports-keyboard/rog',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'esports-keyboard' && target.brand === 'rog' &&
      /夜魔.*20周年版|Azoth Extreme Edition 20/i.test(target.model);
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};

    if (/ROG NX Mechanical Switch|NX 机械轴/i.test(evidence)) normalizedSpecs.keyboardType = 'mechanical';
    if (/75%\s*(?:配列|layout)/i.test(evidence)) normalizedSpecs.layout = '75%';
    if (/Gasket\s*结构|Gasket[- ]mount(?:ed)?/i.test(evidence)) normalizedSpecs.mounting = '可调式 Gasket';
    if (/铝合金底壳/.test(evidence)) normalizedSpecs.caseMaterial = '铝合金底壳 + 金属边框';

    const connections: string[] = [];
    if (/USB 2\.0\s*\(TypeC 转 TypeA\)|USB Type-A to Type-C|有线 USB/i.test(evidence)) connections.push('wired');
    if (/无线\s*2\.4\s*GHz|2\.4\s*GHz RF|2\.4GHz/i.test(evidence)) connections.push('2.4g');
    if (/蓝牙|Bluetooth/i.test(evidence)) connections.push('bluetooth');
    if (connections.length > 0) normalizedSpecs.connection = [...new Set(connections)];

    if (/RGB\s*Per keys|RGB.*每键|per-key RGB/i.test(evidence)) normalizedSpecs.backlight = 'RGB 每键背光';
    if (/热插拔轴体|Hot[- ]swappable/i.test(evidence)) normalizedSpecs.hotSwap = true;
    if (/全彩\s*OLED\s*触摸屏|OLED touch(?:screen)?/i.test(evidence)) normalizedSpecs.customScreen = true;
    if (/Armoury Crate|奥创软件/i.test(evidence)) normalizedSpecs.driver = 'Armoury Crate';
    else if (/奥创极速网页版/.test(evidence)) normalizedSpecs.driver = '奥创极速网页版';

    return {
      normalizedSpecs,
      sourceNotes: [
        '仅提取 ROG 中国官网该 20 周年版型号页面的共通规格，不与夜魔 Extreme 标准版或特别版合并。',
        '官网 8,000Hz 规格要求 ROG 回报率加速器，且仅明确 USB 与 2.4GHz 模式；数据模型只有单一回报率字段，故不录单值。',
        '官网续航说明没有披露电池容量；不把 1,600 小时续航换算成 mAh。未确认键帽材质及图片使用授权，不写入。',
      ],
    };
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
