import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const vxeEsportsKeyboardAdapter = {
  name: 'esports-keyboard/vxe',

  canHandle(target: CrawlTarget): boolean {
    return (
      target.category === 'esports-keyboard' &&
      target.brand === 'vxe' &&
      /V75\s*X|RS6\s*Ultra/i.test(target.model)
    );
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const isRs6Ultra = /RS6\s*Ultra/i.test(`${target.model} ${snapshot.title}`);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [
      isRs6Ultra
        ? `找到 ATK 官方 ${target.model} 产品页的磁轴、布局和连接等规格。`
        : `找到 VXE 官方 ${target.model} 产品页的轴体、结构和连接事实。`,
    ];

    if (isRs6Ultra && /Hall Effect|Magnetic Switch/i.test(evidence)) {
      normalizedSpecs.keyboardType = 'magnetic';
    } else if (/Mechanical Gaming Keyboard|Switch Type:\s*Mechanical|机械键盘/i.test(evidence)) {
      normalizedSpecs.keyboardType = 'mechanical';
    }

    const switchType = isRs6Ultra
      ? undefined
      : evidence.match(/Switches:\s*(Obsidian|Anya|Periwinkle|Aurora Ice Cream|Arctic Fox)\b/i)?.[1];
    if (switchType) normalizedSpecs.switchType = switchType;

    if (/Game[- ]Gasket|Gasket Mount/i.test(evidence)) normalizedSpecs.mounting = 'Game-Gasket';
    if (/CNC Aluminum Top Case, ABS Bottom Case|Case Material:\s*Aluminum Top \+ ABS Bottom/i.test(evidence)) {
      normalizedSpecs.caseMaterial = '铝合金上盖 + ABS 底壳';
    }
    if (/Layout\s*\/\s*Size:\s*75%\s*ANSI/i.test(evidence)) normalizedSpecs.layout = '75% ANSI';
    else if (/75% Layout with 80 keys/i.test(evidence)) normalizedSpecs.layout = '75% / 80 键';
    else if (isRs6Ultra && /Layout\s*\/\s*Size:\s*65%\s*ANSI/i.test(evidence)) normalizedSpecs.layout = '65% ANSI（68键）';

    const connections: string[] = [];
    if (/Wired/i.test(evidence)) connections.push('wired');
    if (/Wireless 2\.4G|2\.4G/i.test(evidence)) connections.push('2.4g');
    if (/Bluetooth/i.test(evidence)) connections.push('bluetooth');
    if (connections.length > 0) normalizedSpecs.connection = [...new Set(connections)];

    if (/Backlight:\s*South-Facing ARGB LED/i.test(evidence)) {
      normalizedSpecs.backlight = '南向 ARGB RGB 背光';
    } else if (/Backlight:\s*South-Facing RGB LED/i.test(evidence)) {
      normalizedSpecs.backlight = '南向 RGB 背光';
    } else if (/South-facing 16\.8 Million RGB Lighting/i.test(evidence)) {
      normalizedSpecs.backlight = '南向 1600 万色 RGB 背光';
    }
    if (/Hot[- ]Swap/i.test(evidence)) normalizedSpecs.hotSwap = true;
    if (isRs6Ultra && /Case Material:\s*Aluminum/i.test(evidence)) normalizedSpecs.caseMaterial = '铝合金';
    if (isRs6Ultra && /Keycap:\s*PBT(?: Dye-Sub)? Cherry Profile/i.test(evidence)) {
      normalizedSpecs.keycapMaterial = /Keycap:\s*PBT Dye-Sub Cherry Profile/i.test(evidence)
        ? 'PBT 五面热升华键帽'
        : 'PBT Cherry Profile 键帽';
    }
    if (/Keycap:\s*PBT Cherry\/KOP Profile/i.test(evidence)) {
      normalizedSpecs.keycapMaterial = 'PBT Cherry/KOP Profile 键帽';
    }
    if (/Software Support:\s*ATK HUB/i.test(evidence)) normalizedSpecs.driver = 'ATK HUB';
    if (isRs6Ultra) {
      const pollingRate = evidence.match(/Polling Rate[:：]\s*(\d+)\s*Hz/i);
      if (pollingRate?.[1]) normalizedSpecs.pollingRate = Number(pollingRate[1]);
      const rt = evidence.match(/RT Precision[:：]\s*([\d.]+)\s*mm\s+in\s+([\d.]+)[–-]([\d.]+)\s*mm/i);
      if (rt) {
        normalizedSpecs.rapidTriggerPrecision = Number(rt[1]);
        normalizedSpecs.actuationRange = `${rt[2]}–${rt[3]}mm`;
      }
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
      sourceNotes.push(`以下字段未从当前官方页面明确确认，保持缺省：${missing.join('、')}。`);
    }

    sourceNotes.push(
      isRs6Ultra
        ? 'RS6 Ultra 官方页面提供多个轴体与配色选项；本批国内目标由京东具体 SKU 限定为白影战士 / 冰刃轴，采集器不从海外页面默认选择推断轴体。官方标注的 256K 极限扫描率高于类目字段上限 100000 Hz，只保留原始快照。'
        : '页面列出多种可选轴体；本批按页面当前默认的 Obsidian 轴保存，不把其他按钮选项混入当前产品记录。',
    );
    sourceNotes.push(isRs6Ultra ? '官方页面以美元展示价格；seed 价格由国内平台人民币信息核验，否则保持缺省。' : '官方页面以美元展示价格，本批不直接换算人民币，seed 价格保持缺省。');

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
