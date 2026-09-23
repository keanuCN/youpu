import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const akkoEsportsKeyboardAdapter = {
  name: 'esports-keyboard/akko',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'esports-keyboard' && target.brand === 'akko';
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    if (/5108\s*V5/i.test(`${target.model} ${snapshot.title}`)) {
      if (/mechanical keyboard/i.test(evidence)) normalizedSpecs.keyboardType = 'mechanical';
      if (/100% Layout/i.test(evidence)) normalizedSpecs.layout = '100%';
      if (/Gasket[- ]Mounted|Gasket Mount/i.test(evidence)) normalizedSpecs.mounting = 'Gasket Mount';
      const connections: string[] = [];
      if (/USB Type-C|wired/i.test(evidence)) connections.push('wired');
      if (/2\.4G/i.test(evidence)) connections.push('2.4g');
      if (/Bluetooth/i.test(evidence)) connections.push('bluetooth');
      if (connections.length > 0) normalizedSpecs.connection = [...new Set(connections)];
      if (/ARGB (?:Programmable )?Backlit|ARGB Backlight/i.test(evidence)) normalizedSpecs.backlight = 'ARGB 背光';
      else if (/RGB Backlit|RGB Backlight/i.test(evidence)) normalizedSpecs.backlight = 'RGB 背光';
      if (/Hot[- ]Swappable|Hot Swappable/i.test(evidence)) normalizedSpecs.hotSwap = true;
      if (/Akko Cloud Driver/i.test(evidence)) normalizedSpecs.driver = 'Akko Cloud Driver';
      if (/10,?000\s*mAh/i.test(evidence)) normalizedSpecs.batteryCapacity = 10000;
      if (/PBT(?: Dye[- ]?Sub)? Keycaps/i.test(evidence)) normalizedSpecs.keycapMaterial = 'PBT';
      if (/ABS Case/i.test(evidence)) normalizedSpecs.caseMaterial = 'ABS';
      return {
        normalizedSpecs,
        sourceNotes: [
          '按 Akko 官方 The Legend of Hei 5108 V5 产品页提取该型号共通规格；100% 配列的 108 键数量以对应京东具名 SKU 标题补证。',
          '官方页提供多个可选轴体，不把页面中出现的选项误识别为默认轴体；回报率在有线/2.4G 与蓝牙模式不同，因类目仅支持单一数值而留空。',
          '价格以美元展示，不换算为人民币；未确认图片授权，不写入正式图片列表。',
        ],
      };
    }
    const sourceNotes = [`找到 Akko 艾酷官方 ${target.model} 产品页的产品卖点和连接事实。`];

    if (/磁轴/.test(evidence)) normalizedSpecs.keyboardType = 'magnetic';
    else if (/机械键盘|mechanical keyboard/i.test(evidence)) normalizedSpecs.keyboardType = 'mechanical';
    if (/星引力磁轴/.test(evidence)) normalizedSpecs.switchType = '星引力磁轴';
    else if (/Akko V3 Piano Pro/i.test(evidence)) normalizedSpecs.switchType = 'Akko V3 Piano Pro';
    if (/Gasket结构磁轴|Gasket结构/.test(evidence)) normalizedSpecs.mounting = 'Gasket 结构';
    else if (/Gasket\s*Mount/i.test(evidence)) normalizedSpecs.mounting = 'Gasket Mount';
    if (/CNC铝|铝合金壳体/.test(evidence)) normalizedSpecs.caseMaterial = 'CNC 铝合金';
    else if (/ABS\s*Frame/i.test(evidence)) normalizedSpecs.caseMaterial = 'ABS';

    const connections: string[] = [];
    if (/有线|wired|Type-C/i.test(evidence)) connections.push('wired');
    if (/2\.4G/.test(evidence)) connections.push('2.4g');
    if (/蓝牙|bluetooth/i.test(evidence)) connections.push('bluetooth');
    if (connections.length > 0) normalizedSpecs.connection = [...new Set(connections)];

    const pollingRate = evidence.match(/(?:双\s*)?(\d+)K回报率/);
    if (pollingRate?.[1]) normalizedSpecs.pollingRate = Number(pollingRate[1]) * 1000;

    const rapidTriggerPrecision = evidence.match(/([\d.]+)RT精度/);
    if (rapidTriggerPrecision?.[1]) normalizedSpecs.rapidTriggerPrecision = Number(rapidTriggerPrecision[1]);

    if (/1600万色RGB背光/.test(evidence)) normalizedSpecs.backlight = '1600 万色 RGB 背光';
    else if (/Programmable RGB Backlit|RGB Backlight/i.test(evidence)) normalizedSpecs.backlight = 'RGB 背光';
    if (/网页或软件双驱动/.test(evidence)) normalizedSpecs.driver = '网页或软件双驱动';
    else if (/Akko Cloud Driver/i.test(evidence)) normalizedSpecs.driver = 'Akko Cloud Driver';
    if (/Hot[- ]?swappable|Hotswap[- ]?Socket|Hot\s*swap/i.test(evidence)) normalizedSpecs.hotSwap = true;
    if (/碰珠快拆结构/.test(evidence)) normalizedSpecs.quickRelease = true;
    if (/自定义屏幕/.test(evidence)) normalizedSpecs.customScreen = true;
    if (/Transparent PC Keycaps|PC Keycaps/i.test(evidence)) normalizedSpecs.keycapMaterial = '透明 PC 键帽';

    const missing = [
      'keyboardType',
      'switchType',
      'mounting',
      'caseMaterial',
      'connection',
      'pollingRate',
      'rapidTriggerPrecision',
      'backlight',
      'driver',
      'hotSwap',
      'quickRelease',
      'customScreen',
      'keycapMaterial',
    ].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前官方页面明确确认，保持缺省：${missing.join('、')}。`);
    }

    const officialPrice = evidence.match(/[￥¥]\s*([\d,]+(?:\.\d+)?)/);
    if (officialPrice?.[1]) {
      sourceNotes.push(`页面当前展示官方售价 ${officialPrice[1]} 元；价格不写入规格字段，正式 seed 使用 CNY 价格结构单独记录。`);
    }
    sourceNotes.push(`页面身份按 ${target.model} 处理；只读取该型号页面正文和可见规格，不从详情图片推断未确认参数。`);

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
