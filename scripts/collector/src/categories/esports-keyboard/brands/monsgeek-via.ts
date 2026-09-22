import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const monsgeekViaEsportsKeyboardAdapter = {
  name: 'esports-keyboard/monsgeek-via',

  canHandle(target: CrawlTarget): boolean {
    return (
      target.category === 'esports-keyboard' &&
      target.brand === 'monsgeek' &&
      /M2 V5 VIA/i.test(target.model)
    );
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`找到 MonsGeek 魔极客官方 ${target.model} 产品页的机械轴、结构和连接事实。`];

    if (/M2 V5 VIA/i.test(`${target.model} ${snapshot.title}`) && /mechanical keyboard/i.test(evidence)) {
      normalizedSpecs.keyboardType = 'mechanical';
    }

    const switchTypes = ['Akko Cilantro', 'Akko Mirror', 'Akko Stellar Rose'].filter((switchName) =>
      new RegExp(switchName.replace(/\s+/g, '\\s+'), 'i').test(evidence),
    );
    if (switchTypes.length > 0) normalizedSpecs.switchType = switchTypes.join(' / ');

    if (/Gasket(?:[- ]mounted| Mount)/i.test(evidence)) normalizedSpecs.mounting = 'Gasket-mounted';
    if (/Case Material[^.]{0,80}?Aluminum|Aluminum Case/i.test(evidence)) normalizedSpecs.caseMaterial = '铝合金';
    if (/ANSI/i.test(evidence)) {
      normalizedSpecs.layout = /1800|Compact/i.test(evidence) ? 'ANSI / 1800 紧凑布局' : 'ANSI';
    }

    const connections: string[] = [];
    if (/USB-C Wired|Wired USB-C|wired Type-C/i.test(evidence)) connections.push('wired');
    if (/2\.4G(?:hz)?|2\.4G Wireless/i.test(evidence)) connections.push('2.4g');
    if (/BT\s*5\.0|Bluetooth/i.test(evidence)) connections.push('bluetooth');
    if (connections.length > 0) normalizedSpecs.connection = [...new Set(connections)];

    if (/RGB Backlit|RGB Backlight/i.test(evidence)) normalizedSpecs.backlight = 'RGB 背光';
    if (/VIA\s+(?:Support|software)|VIA\s*[:：]?\s*Y\b|VIA only/i.test(evidence)) {
      normalizedSpecs.driver = 'VIA';
    }
    if (/Hot[- ]?Swappable|Hot[- ]?swap|Hotswap/i.test(evidence)) normalizedSpecs.hotSwap = true;
    if (/Quick[- ]?Release|Tool[- ]?free Rapid Assembly|Ball[- ]?Catch/i.test(evidence)) {
      normalizedSpecs.quickRelease = true;
    }

    const batteryCapacity = evidence.match(/Battery\s*(\d+)mAh/i);
    if (batteryCapacity?.[1]) normalizedSpecs.batteryCapacity = Number(batteryCapacity[1]);

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
    ].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前官方页面明确确认，保持缺省：${missing.join('、')}。`);
    }

    sourceNotes.push(
      '页面列出 Akko Cilantro、Akko Mirror 和 Akko Stellar Rose 等机械轴选项；本条只记录可选轴体集合，不把某一个选项当成默认轴体。',
    );
    sourceNotes.push('页面明确支持 VIA，且 MonsGeek Driver 标记为不支持；本条不把 HE 磁轴的回报率、扫描率和 RT 参数混入。');
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
