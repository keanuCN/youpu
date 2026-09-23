import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const aulaEsportsKeyboardAdapter = {
  name: 'esports-keyboard/aula',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'esports-keyboard' && target.brand === 'aula' && /F(?:75|87\s*PRO\s*V2|99\s*PRO|108\s*PRO|2088)|S75\s*PRO|HERO\s*68\s*(?:HE|XS)|S500/i.test(target.model);
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const isHero68He = /HERO\s*68\s*HE/i.test(`${target.model} ${snapshot.title}`);
    const isHero68Xs = /HERO\s*68\s*XS/i.test(`${target.model} ${snapshot.title}`);
    const isS500 = /S500/i.test(target.model);
    const isS75Pro = /S75\s*PRO/i.test(target.model);
    const isF108Pro = /F108\s*PRO/i.test(target.model);
    const isF2088 = /F2088\s/i.test(target.model);
    const sourceNotes = [
      isHero68He
        ? `找到 AULA 狼蛛官方 ${target.model} 产品页的磁轴、布局和连接规格。`
        : isHero68Xs
          ? `找到 AULA 狼蛛官方 ${target.model} 产品页；详情中的技术说明以图片呈现，文本快照仅确认型号和磁轴类别。`
        : isF108Pro
          ? '找到 AULA 狼蛛官方 F108Pro FAQ；仅将 FAQ 明确说明的设备类型与连接方式归一化。'
          : isS75Pro
            ? '找到 AULA 狼蛛官方 S75Pro 产品页；仅将该页明确提供的共通规格归一化。'
          : `找到 AULA 狼蛛官方 ${target.model} 产品页的机械轴、结构和连接事实。`,
    ];
    if (isS500) {
      if (/Mechanical Keyboard|机械键盘/i.test(evidence)) normalizedSpecs.keyboardType = 'mechanical';
      if (/104\s*(?:full[- ]?size\s*)?keys|100%\s*Layout/i.test(evidence)) normalizedSpecs.layout = '104 键全尺寸';
      if (/Wired/i.test(evidence)) normalizedSpecs.connection = ['wired'];
      if (/Zoned RGB Backlight(?:ing)?/i.test(evidence)) normalizedSpecs.backlight = '分区 RGB 背光';
      if (/Metal Matte Panel/i.test(evidence)) normalizedSpecs.caseMaterial = '金属磨砂面板';
      sourceNotes.push('型号限定为 AULA S500 有线全尺寸共通规格；官方页面未确认轴体材质等细项，保持缺省，不将京东具名 SKU 的青轴泛化为全型号。');
      return { normalizedSpecs, sourceNotes };
    }

    if (isF2088) {
      if (/Mechanical Keyboard/i.test(evidence)) normalizedSpecs.keyboardType = 'mechanical';
      if (/104\s*keys|100%\s*layout/i.test(evidence)) normalizedSpecs.layout = '104 键全尺寸';
      if (/mode:\s*Wired|\bWired\b/i.test(evidence)) normalizedSpecs.connection = ['wired'];
      if (/Mixed Light|Regional light mixing/i.test(evidence)) normalizedSpecs.backlight = '混彩背光';
      sourceNotes.push('型号限定为 AULA F2088 104 键朋克版；F2088 Air、F2088 Pro 及其配列/无线功能不合并。轴体存在多个 SKU，不由单个商品标题推断型号级轴体。');
      return { normalizedSpecs, sourceNotes };
    }

    if (isF108Pro) {
      if (/Mechanical Keyboard/i.test(evidence)) normalizedSpecs.keyboardType = 'mechanical';
      const connections: string[] = [];
      if (/Wired Mode/i.test(evidence)) connections.push('wired');
      if (/2\.4G Mode/i.test(evidence)) connections.push('2.4g');
      if (/Bluetooth/i.test(evidence)) connections.push('bluetooth');
      if (connections.length > 0) normalizedSpecs.connection = [...new Set(connections)];
      sourceNotes.push('官方 FAQ 不确认键数、Gasket、RGB、屏幕、电池容量或热插拔；这些字段不从其他 F108 / 变体推断。');
      return { normalizedSpecs, sourceNotes };
    }

    if (isS75Pro) {
      if (/Mechanical Keyboard/i.test(evidence)) normalizedSpecs.keyboardType = 'mechanical';
      if (/75%\s*layout/i.test(evidence)) normalizedSpecs.layout = '75%';
      if (/Gasket Structure|Gasket[- ]?Mount/i.test(evidence)) normalizedSpecs.mounting = 'Gasket';
      const connections: string[] = [];
      if (/Tri-Mode[^.]{0,80}Wired|\bWired\b/i.test(evidence)) connections.push('wired');
      if (/2\.4G/i.test(evidence)) connections.push('2.4g');
      if (/\bBT\b|Bluetooth/i.test(evidence)) connections.push('bluetooth');
      if (connections.length > 0) normalizedSpecs.connection = [...new Set(connections)];
      if (/Hot-Swappable Full Keys|Hot[- ]?Swappable/i.test(evidence)) normalizedSpecs.hotSwap = true;
      if (/RGB Backlight|RGB Light/i.test(evidence)) normalizedSpecs.backlight = 'RGB 背光';
      sourceNotes.push('该官方产品页不确认精确键数、电池、屏幕、具体轴体与材质；均保持缺省，不从其他 S75Pro 变体或第三方手册补猜。');
      return { normalizedSpecs, sourceNotes };
    }

    if (isHero68He && /Hall Effect Switch|Magnetic Switch Technology/i.test(evidence)) {
      normalizedSpecs.keyboardType = 'magnetic';
    } else if (isHero68Xs && /磁轴键盘/i.test(evidence)) {
      normalizedSpecs.keyboardType = 'magnetic';
    } else if (/AULA\s*(?:F75|F87\s*PRO\s*V2|F99\s*PRO)/i.test(`${target.model} ${snapshot.title}`) && /Mechanical Keyboard/i.test(evidence)) {
      normalizedSpecs.keyboardType = 'mechanical';
    }

    const isF75Max = /F75\s*MAX/i.test(`${target.model} ${snapshot.title}`);
    const isF99Pro = /F99\s*PRO/i.test(`${target.model} ${snapshot.title}`);
    const isF87ProV2 = /F87\s*PRO\s*V2/i.test(`${target.model} ${snapshot.title}`);
    const switchType = isF75Max || isF99Pro || isF87ProV2
      ? undefined
      : evidence.match(/Switch:\s*(LEOBOG Reaper Linear Switch|TTC\s*&\s*AULA Crescent Linear Switch)/i)?.[1];
    if (switchType) normalizedSpecs.switchType = switchType;

    if (isHero68He && /Tray-Mounted/i.test(evidence)) normalizedSpecs.mounting = 'Tray Mount';
    else if (/Gasket Structure|Gasket[- ]?Mount(?:ed)?/i.test(evidence)) normalizedSpecs.mounting = 'Gasket';
    if (isHero68He) {
      if (/68\s*keys/i.test(evidence)) normalizedSpecs.layout = '65%（68键）';
      if (/ABS Plastic/i.test(evidence)) normalizedSpecs.caseMaterial = 'ABS Plastic';
    } else if (isF99Pro) {
      if (/ABS Plastic/i.test(evidence)) normalizedSpecs.caseMaterial = 'ABS Plastic';
      if (/96%\s*(?:with\s+Knob)?|1800 Layout/i.test(evidence)) normalizedSpecs.layout = '96% with Knob';
    } else if (isF87ProV2) {
      if (/TKL Layout|\b87 Keys\b|\b87-key\b/i.test(evidence)) normalizedSpecs.layout = 'TKL (87键)';
    } else if (isF75Max) {
      if (/\b80\s*keys\b|\b80-key\b/i.test(evidence)) normalizedSpecs.layout = '75%（80键）';
    } else if (/75%\s*(?:Compact\s*)?Layout|Layout:\s*ANSI/i.test(evidence)) {
      normalizedSpecs.layout = '75% ANSI';
    }

    const connections: string[] = [];
    if (/Cable Wired|Wired USB|USB-C|wired/i.test(evidence)) connections.push('wired');
    if (/2\.4\s*GHz|2\.4G/i.test(evidence)) connections.push('2.4g');
    if (/Bluetooth/i.test(evidence)) connections.push('bluetooth');
    if (/Three-Way Connectivity|three-way connectivity/i.test(evidence)) {
      for (const connection of ['wired', '2.4g', 'bluetooth']) connections.push(connection);
    }
    if (connections.length > 0) normalizedSpecs.connection = [...new Set(connections)];

    if (/RGB\s*(?:Backlight|Illumination)?/i.test(evidence)) {
      normalizedSpecs.backlight = /South-facing (?:RGB|LEDs)|RGB South-facing|South-facing[^.]{0,30}LEDs/i.test(evidence)
        ? '南向 RGB 背光'
        : 'RGB 背光';
    }
    if (/Hot[- ]?Swap|Hot[- ]?swappable/i.test(evidence)) normalizedSpecs.hotSwap = true;
    if (isF75Max && /ABS Plastic/i.test(evidence)) normalizedSpecs.caseMaterial = 'ABS Plastic';
    if (isHero68He && /8000\s*hz|8K\s*Polling Rate/i.test(evidence)) normalizedSpecs.pollingRate = 8000;
    if (isF75Max && /PBT Plastic/i.test(evidence)) normalizedSpecs.keycapMaterial = 'PBT';
    const batteryCapacity = isF87ProV2 ? undefined : evidence.match(/(\d+)mAh/i);
    if (batteryCapacity?.[1]) normalizedSpecs.batteryCapacity = Number(batteryCapacity[1]);
    if (isHero68He && /AULA HERO 68 HE Online Driver/i.test(evidence)) normalizedSpecs.driver = 'AULA Driver';
    else if (/AULA\s*(?:(?:F75\s*MAX)|F75|F87\s*PRO\s*V2)?\s*Driver/i.test(evidence)) normalizedSpecs.driver = 'AULA Driver';

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
      isHero68He
        ? 'HERO 68 HE 页面列出多款磁轴可选；国内目标是白色侧刻 SKU，不从其他默认轴体按钮推断具体轴体。官方标注 128K 扫描率超过当前类目字段上限 100000 Hz，因此仅保留原始快照。'
        : isHero68Xs
          ? 'HERO68XS 详情页未提供可供文本采集的完整参数；具体配色、轴体及性能字段须由对应商品 SKU 与官方说明书交叉确认，不能由系列页默认选项推断。'
        : isF75Max
        ? 'F75 Max 为独立型号；页面展示多种配色与轴体选项，轴体按 SKU 区分，本批不将默认选项泛化为全系列规格。'
        : isF99Pro
        ? '页面列出多个轴体选项，且国内电商同型号存在不同轴体 SKU；轴体按变体区分，本批不把海外页面默认轴体泛化到国内产品。'
        : isF87ProV2
          ? '国内电商 F87 Pro V2 同型号存在不同轴体和电池配置；轴体、电池容量按 SKU 区分，本批不把海外产品页默认配置泛化到国内商品。'
          : '页面列出多个轴体和配色选项；本批按页面当前默认轴体保存，不把其他选项合并进正式规格。',
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
