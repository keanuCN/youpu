import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const dareuEsportsKeyboardAdapter = {
  name: 'esports-keyboard/dareu',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'esports-keyboard' && target.brand === 'dareu' && /COOL\s*68/i.test(target.model);
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`找到 DAREU 官方 ${target.model} 产品页并提取明确标注的共同规格。`];

    if (/Hall Effect|Magnetic Switch|magnetic gaming keyboard/i.test(evidence)) normalizedSpecs.keyboardType = 'magnetic';
    if (/65% layout/i.test(evidence)) normalizedSpecs.layout = '65%（68键）';
    if (/Connection Type:\s*Wired Type-C|Connectivity:\s*Wired/i.test(evidence)) {
      normalizedSpecs.connection = ['wired'];
    }
    if (/Gasket Structure|Gasket structure/i.test(evidence)) normalizedSpecs.mounting = 'Gasket';
    if (/8,?000\s*Hz|8K polling rate/i.test(evidence)) normalizedSpecs.pollingRate = 8000;
    if (/0\.01\s*mm\s*RT Precision|0\.01mm RT/i.test(evidence)) normalizedSpecs.rapidTriggerPrecision = 0.01;
    if (/Keycap:\s*PBT\s*\+\s*PC transparent/i.test(evidence)) normalizedSpecs.keycapMaterial = 'PBT + PC 透明键帽';
    if (/RGB\s*[-–]\s*20 lighting modes|RGB adjustable/i.test(evidence)) normalizedSpecs.backlight = 'RGB 背光 / 3D Light Wing 灯箱';
    if (/Hot[- ]swappable design/i.test(evidence)) normalizedSpecs.hotSwap = true;
    if (/DAREU Web Driver|Web Driver Support/i.test(evidence)) normalizedSpecs.driver = 'DAREU 网页驱动';

    const missing = [
      'switchType',
      'caseMaterial',
      'scanRate',
      'actuationRange',
      'batteryCapacity',
    ].filter((key) => normalizedSpecs[key] === undefined);
    sourceNotes.push(`多轴体与多配色页面不推断国内具体 SKU 的轴体和外壳材质；以下未确认字段保持缺省：${missing.join('、')}。`);
    sourceNotes.push('官方海外页面价格为美元，不换算成人民币；未核实授权的图片不收录。');

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
