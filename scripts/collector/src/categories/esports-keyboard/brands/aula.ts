import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const aulaEsportsKeyboardAdapter = {
  name: 'esports-keyboard/aula',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'esports-keyboard' && target.brand === 'aula' && /F75/i.test(target.model);
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`找到 AULA 狼蛛官方 ${target.model} 产品页的机械轴、结构和连接事实。`];

    if (/AULA\s*F75/i.test(`${target.model} ${snapshot.title}`) && /Mechanical Keyboard/i.test(evidence)) {
      normalizedSpecs.keyboardType = 'mechanical';
    }

    const switchType = evidence.match(
      /Switch:\s*(LEOBOG Reaper Linear Switch|TTC\s*&\s*AULA Crescent Linear Switch)/i,
    )?.[1];
    if (switchType) normalizedSpecs.switchType = switchType;

    if (/Gasket Structure|Gasket Mount/i.test(evidence)) normalizedSpecs.mounting = 'Gasket';
    if (/75%\s*(?:Compact\s*)?Layout|Layout:\s*ANSI/i.test(evidence)) normalizedSpecs.layout = '75% ANSI';

    const connections: string[] = [];
    if (/Cable Wired|Wired USB|USB-C|wired/i.test(evidence)) connections.push('wired');
    if (/2\.4\s*GHz|2\.4G/i.test(evidence)) connections.push('2.4g');
    if (/Bluetooth/i.test(evidence)) connections.push('bluetooth');
    if (/Three-Way Connectivity|three-way connectivity/i.test(evidence)) {
      for (const connection of ['wired', '2.4g', 'bluetooth']) connections.push(connection);
    }
    if (connections.length > 0) normalizedSpecs.connection = [...new Set(connections)];

    if (/RGB\s*(?:Backlight|Illumination)?/i.test(evidence)) normalizedSpecs.backlight = 'RGB 背光';
    if (/Hot[- ]?Swap|Hot[- ]?swappable/i.test(evidence)) normalizedSpecs.hotSwap = true;
    const batteryCapacity = evidence.match(/(\d+)mAh/i);
    if (batteryCapacity?.[1]) normalizedSpecs.batteryCapacity = Number(batteryCapacity[1]);
    if (/AULA\s*F75\s*Driver|AULA\s*Driver/i.test(evidence)) normalizedSpecs.driver = 'AULA Driver';

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
      sourceNotes.push(`以下字段未从当前官方页面明确确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push('页面列出多个轴体和配色选项；本批按页面当前默认轴体保存，不把其他选项合并进正式规格。');
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
