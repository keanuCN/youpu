import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const vxeEsportsKeyboardAdapter = {
  name: 'esports-keyboard/vxe',

  canHandle(target: CrawlTarget): boolean {
    return (
      target.category === 'esports-keyboard' &&
      target.brand === 'vxe' &&
      /V75\s*X/i.test(target.model)
    );
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`找到 VXE 官方 ${target.model} 产品页的轴体、结构和连接事实。`];

    if (/Mechanical Gaming Keyboard|Switch Type:\s*Mechanical|机械键盘/i.test(evidence)) {
      normalizedSpecs.keyboardType = 'mechanical';
    }

    const switchType = evidence.match(/Switches:\s*(Obsidian|Anya|Periwinkle|Aurora Ice Cream|Arctic Fox)\b/i)?.[1];
    if (switchType) normalizedSpecs.switchType = switchType;

    if (/Game[- ]Gasket|Gasket Mount/i.test(evidence)) normalizedSpecs.mounting = 'Game-Gasket';
    if (/CNC Aluminum Top Case, ABS Bottom Case|Case Material:\s*Aluminum Top \+ ABS Bottom/i.test(evidence)) {
      normalizedSpecs.caseMaterial = '铝合金上盖 + ABS 底壳';
    }
    if (/Layout\s*\/\s*Size:\s*75%\s*ANSI/i.test(evidence)) normalizedSpecs.layout = '75% ANSI';
    else if (/75% Layout with 80 keys/i.test(evidence)) normalizedSpecs.layout = '75% / 80 键';

    const connections: string[] = [];
    if (/Wired/i.test(evidence)) connections.push('wired');
    if (/Wireless 2\.4G|2\.4G/i.test(evidence)) connections.push('2.4g');
    if (/Bluetooth/i.test(evidence)) connections.push('bluetooth');
    if (connections.length > 0) normalizedSpecs.connection = [...new Set(connections)];

    if (/Backlight:\s*South-Facing ARGB LED/i.test(evidence)) {
      normalizedSpecs.backlight = '南向 ARGB RGB 背光';
    } else if (/South-facing 16\.8 Million RGB Lighting/i.test(evidence)) {
      normalizedSpecs.backlight = '南向 1600 万色 RGB 背光';
    }
    if (/Hot[- ]Swap/i.test(evidence)) normalizedSpecs.hotSwap = true;
    if (/Keycap:\s*PBT Cherry\/KOP Profile/i.test(evidence)) {
      normalizedSpecs.keycapMaterial = 'PBT Cherry/KOP Profile 键帽';
    }
    if (/Software Support:\s*ATK HUB/i.test(evidence)) normalizedSpecs.driver = 'ATK HUB';

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

    sourceNotes.push(
      '页面列出多种可选轴体；本批按页面当前默认的 Obsidian 轴保存，不把其他按钮选项混入当前产品记录。',
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
