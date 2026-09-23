import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const mchoseEsportsKeyboardAdapter = {
  name: 'esports-keyboard/mchose',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'esports-keyboard' && target.brand === 'mchose' && /K99\s*V3/i.test(target.model);
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`找到 MCHOSE 官方 ${target.model} 产品页的型号与规格表。`];

    if (/Mechanical Keyboard/i.test(evidence)) normalizedSpecs.keyboardType = 'mechanical';
    if (/98%\s*Layout/i.test(evidence)) normalizedSpecs.layout = '98%（99键）';
    if (/Icy Creamsicle Switch/i.test(evidence)) normalizedSpecs.switchType = 'Icy Creamsicle Switch';
    if (/Gasket Mount/i.test(evidence)) normalizedSpecs.mounting = 'Gasket';

    const connections: string[] = [];
    if (/USB-C|Wired/i.test(evidence)) connections.push('wired');
    if (/2\.4\s*GHz/i.test(evidence)) connections.push('2.4g');
    if (/BT\s*5\.0|Bluetooth/i.test(evidence)) connections.push('bluetooth');
    if (connections.length > 0) normalizedSpecs.connection = [...new Set(connections)];

    if (/16\.8M\s*colors|per-key RGB/i.test(evidence)) normalizedSpecs.backlight = '16.8M 色 RGB 背光';
    if (/Hot-Swappable/i.test(evidence)) normalizedSpecs.hotSwap = true;
    if (/Dual\s*8K\s*\(Wired\s*\/\s*2\.4GHz\)/i.test(evidence)) normalizedSpecs.pollingRate = 8000;
    if (/Battery\s*[|:]?\s*10,?000\s*mAh/i.test(evidence)) normalizedSpecs.batteryCapacity = 10000;
    if (/MCHOSE\s+M\s+HUB|MCHOSE HUB/i.test(evidence)) normalizedSpecs.driver = 'MCHOSE M HUB';

    const missing = [
      'layout',
      'switchType',
      'mounting',
      'connection',
      'pollingRate',
      'backlight',
      'hotSwap',
      'batteryCapacity',
      'driver',
      'caseMaterial',
      'keycapMaterial',
    ].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从官方产品页确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push('官方规格表列出多个配色、键帽刻字和底板选项；未将这些变体专属字段合并为单一规格。');
    sourceNotes.push('官网价格以美元展示，不换算成人民币，seed 价格保持缺省；图片授权未核实，不写入正式图片列表。');

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
