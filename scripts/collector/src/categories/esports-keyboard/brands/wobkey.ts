import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const wobkeyEsportsKeyboardAdapter = {
  name: 'esports-keyboard/wobkey',

  canHandle(target: CrawlTarget): boolean {
    return (
      target.category === 'esports-keyboard' &&
      target.brand === 'wobkey' &&
      /Rainy 75/i.test(target.model)
    );
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`找到 WOBKEY 官方 ${target.model} 产品页的结构、连接和变体事实。`];
    const selectedVariant = extractSelectedVariant(evidence);

    if (/Rainy 75/i.test(`${target.model} ${snapshot.title}`) && /keyboard|switch/i.test(evidence)) {
      normalizedSpecs.keyboardType = 'mechanical';
    }
    if (/gasket\s*mount/i.test(evidence)) normalizedSpecs.mounting = 'Gasket-mounted';
    if (/CNC\s+aluminum|aluminum\s+75/i.test(evidence)) normalizedSpecs.caseMaterial = '铝合金';
    if (/Rainy\s*75|75\s*keyboard/i.test(evidence)) normalizedSpecs.layout = '75%';

    const connections: string[] = [];
    if (/wired|USB-C/i.test(evidence)) connections.push('wired');
    if (/2\.4G/i.test(evidence)) connections.push('2.4g');
    if (/BT\s*5\.0|Bluetooth/i.test(evidence)) connections.push('bluetooth');
    if (/tri[- ]mode(?:\s+wireless)?/i.test(evidence)) {
      for (const connection of ['wired', '2.4g', 'bluetooth']) connections.push(connection);
    }
    if (connections.length > 0) normalizedSpecs.connection = [...new Set(connections)];

    const switchType = selectedVariant.match(/(Violet Switch|WOB Switch|Cocoa Switch)/i)?.[1];
    if (switchType) normalizedSpecs.switchType = switchType.replace(/\bViolet Switch\b/i, 'Violet Switch');

    const batteryCapacity = selectedVariant.match(/(\d+)mAh/i);
    if (batteryCapacity?.[1]) normalizedSpecs.batteryCapacity = Number(batteryCapacity[1]);

    if (/A-?RGB|RGB/i.test(selectedVariant)) normalizedSpecs.backlight = 'RGB 背光';
    if (/Double\s*Shot\s*PBT/i.test(evidence)) normalizedSpecs.keycapMaterial = '双色注塑 PBT 键帽';

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

    if (selectedVariant) {
      sourceNotes.push(`页面当前选中变体：${selectedVariant}；只按该变体保存电池、轴体和灯效，不合并其他 Rainy 75 变体。`);
    } else {
      sourceNotes.push('页面未能从当前正文提取选中变体名称，变体相关字段保持缺省，避免混合不同版本。');
    }
    sourceNotes.push('官方页面以美元展示价格，本批不直接换算人民币，seed 价格保持缺省。');

    return { normalizedSpecs, sourceNotes };
  },
};

function extractSelectedVariant(evidence: string): string {
  const match = evidence.match(/Variants:\s*([^()]{1,90}\([^)]{1,140}\))/i);
  return match?.[1]?.trim() ?? '';
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
