import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const vgnEsportsKeyboardAdapter = {
  name: 'esports-keyboard/vgn',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'esports-keyboard' && target.brand === 'vgn' && /V98\s*Pro\s*V4/i.test(target.model);
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`找到 VGN 官方 ${target.model} 产品页的型号和结构规格。`];

    if (/Mechanical Keyboard/i.test(evidence)) normalizedSpecs.keyboardType = 'mechanical';
    if (/98%\s*layout|Layout:\s*98%/i.test(evidence)) normalizedSpecs.layout = '98%';
    if (/Construction:\s*Gasket|Gasket structure/i.test(evidence)) normalizedSpecs.mounting = 'Gasket';

    const connections: string[] = [];
    if (/Wired/i.test(evidence)) connections.push('wired');
    if (/2\.4\s*GHz/i.test(evidence)) connections.push('2.4g');
    if (/Bluetooth/i.test(evidence)) connections.push('bluetooth');
    if (connections.length > 0) normalizedSpecs.connection = [...new Set(connections)];

    if (/Backlighting:\s*RGB|Full-color dynamic RGB/i.test(evidence)) normalizedSpecs.backlight = 'RGB 背光';
    if (/Hot-swappable:\s*YES/i.test(evidence)) normalizedSpecs.hotSwap = true;
    if (/Battery Capacity:\s*(\d+)mAh/i.test(evidence)) {
      normalizedSpecs.batteryCapacity = Number(evidence.match(/Battery Capacity:\s*(\d+)mAh/i)?.[1]);
    }
    if (/V-Display mood screen|V-Display Smart Display/i.test(evidence)) normalizedSpecs.customScreen = true;
    if (/In-house dual-platform VHUB driver|Driver:\s*Windows Software/i.test(evidence)) {
      normalizedSpecs.driver = 'V HUB';
    }

    const missing = [
      'keyboardType',
      'switchType',
      'mounting',
      'caseMaterial',
      'layout',
      'connection',
      'pollingRate',
      'scanRate',
      'rapidTriggerPrecision',
      'actuationRange',
      'backlight',
      'driver',
      'hotSwap',
      'quickRelease',
      'batteryCapacity',
      'keycapMaterial',
    ].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从官方公开页确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push('同型号页面列出多款轴体和不同回报率版本；未锁定具体国内 SKU，因此不把轴体或回报率写入型号级规格。');
    sourceNotes.push('官方海外页面价格为美元，不换算为人民币，seed 价格保持缺省。');

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
