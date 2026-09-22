import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const monsgeekEsportsKeyboardAdapter = {
  name: 'esports-keyboard/monsgeek',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'esports-keyboard' && target.brand === 'monsgeek';
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`找到 MonsGeek 魔极客官方 ${target.model} 产品页的型号、性能和连接事实。`];

    if (/磁轴|magnetic switch|Hall Effect|HE \(Hall Effect\)/i.test(evidence)) normalizedSpecs.keyboardType = 'magnetic';
    if (/Akko AstroAim\s*\/\s*AstroLink/i.test(evidence)) {
      normalizedSpecs.switchType = 'Akko AstroAim / AstroLink';
    }
    if (/Gasket[- ]?mounted/i.test(evidence)) normalizedSpecs.mounting = 'Gasket-mounted';
    if (/Case Material[^.]{0,80}?Aluminum|Aluminum Keyboard/i.test(evidence)) normalizedSpecs.caseMaterial = '铝合金';
    if (/Compact 98[- ]?Key Full[- ]?Size|1800(?:[- ]layout)?/i.test(evidence)) normalizedSpecs.layout = '1800 / 98 键';

    const connections: string[] = [];
    if (/USB-C Wired|Wired USB-C|wired Type-C|有线/i.test(evidence)) connections.push('wired');
    if (/2\.4G(?:hz)?|2\.4G 无线/i.test(evidence)) connections.push('2.4g');
    if (/BT\s*5\.0|Bluetooth/i.test(evidence)) connections.push('bluetooth');
    if (connections.length > 0) normalizedSpecs.connection = [...new Set(connections)];

    const pollingRate = evidence.match(/(?:Universal\s*)?(\d+)K(?:\s*Hz)?\s*(?:Polling Rate|Wired)/i);
    if (pollingRate?.[1]) normalizedSpecs.pollingRate = Number(pollingRate[1]) * 1000;

    const scanRate = evidence.match(/(\d+)K\s*(?:Scanning Rate|扫描率)/i) ?? evidence.match(/(?:Scanning Rate|扫描率)\s*(\d+)K/i);
    if (scanRate?.[1]) normalizedSpecs.scanRate = Number(scanRate[1]) * 1000;

    const rapidTriggerPrecision = evidence.match(/(?:RT\s*)?0\.005\s*mm(?:\s*Precision)?/i);
    if (rapidTriggerPrecision) normalizedSpecs.rapidTriggerPrecision = 0.005;

    const actuationRange = evidence.match(/Adjustable:\s*(0\.100\s*[-–]\s*3\.300\s*mm)/i);
    if (actuationRange?.[1]) normalizedSpecs.actuationRange = actuationRange[1].replace(/\s+/g, '').replace('-', '–');

    const batteryCapacity = evidence.match(/Battery\s*(\d+)mAh/i);
    if (batteryCapacity?.[1]) normalizedSpecs.batteryCapacity = Number(batteryCapacity[1]);

    if (/Addressable RGB|ARGB/i.test(evidence)) normalizedSpecs.backlight = 'ARGB RGB 背光';
    if (/MonsGeek V\d+ Driver|MonsGeek Driver & Web[- ]Based Driver/i.test(evidence)) {
      normalizedSpecs.driver = 'MonsGeek Driver & Web-Based Driver';
    }
    if (/Quick[- ]Release|ball catch/i.test(evidence)) normalizedSpecs.quickRelease = true;

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
      'quickRelease',
      'batteryCapacity',
    ].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前官方页面明确确认，保持缺省：${missing.join('、')}。`);
    }

    sourceNotes.push(
      '页面明确声明该型号不支持机械轴；本条按磁轴键盘保存，不把“机械键盘”搜索分类或其他 M 系列型号参数混入。',
    );
    sourceNotes.push('官方页面以美元展示价格，本批不直接换算人民币，seed 价格保持缺省。');

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
