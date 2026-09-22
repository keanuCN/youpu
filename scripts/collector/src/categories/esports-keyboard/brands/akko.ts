import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const akkoEsportsKeyboardAdapter = {
  name: 'esports-keyboard/akko',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'esports-keyboard' && target.brand === 'akko';
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = ['找到 Akko 艾酷官方 MOD007 V5 HE 中文产品页的产品卖点和连接事实。'];

    if (/磁轴/.test(evidence)) normalizedSpecs.keyboardType = 'magnetic';
    if (/星引力磁轴/.test(evidence)) normalizedSpecs.switchType = '星引力磁轴';
    if (/Gasket结构磁轴|Gasket结构/.test(evidence)) normalizedSpecs.mounting = 'Gasket 结构';
    if (/CNC铝|铝合金壳体/.test(evidence)) normalizedSpecs.caseMaterial = 'CNC 铝合金';

    const connections: string[] = [];
    if (/有线/.test(evidence)) connections.push('wired');
    if (/2\.4G/.test(evidence)) connections.push('2.4g');
    if (/蓝牙/.test(evidence)) connections.push('bluetooth');
    if (connections.length > 0) normalizedSpecs.connection = [...new Set(connections)];

    const pollingRate = evidence.match(/(?:双\s*)?(\d+)K回报率/);
    if (pollingRate?.[1]) normalizedSpecs.pollingRate = Number(pollingRate[1]) * 1000;

    const rapidTriggerPrecision = evidence.match(/([\d.]+)RT精度/);
    if (rapidTriggerPrecision?.[1]) normalizedSpecs.rapidTriggerPrecision = Number(rapidTriggerPrecision[1]);

    if (/1600万色RGB背光/.test(evidence)) normalizedSpecs.backlight = '1600 万色 RGB 背光';
    if (/网页或软件双驱动/.test(evidence)) normalizedSpecs.driver = '网页或软件双驱动';
    if (/碰珠快拆结构/.test(evidence)) normalizedSpecs.quickRelease = true;
    if (/自定义屏幕/.test(evidence)) normalizedSpecs.customScreen = true;

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
      'quickRelease',
      'customScreen',
    ].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前官方页面明确确认，保持缺省：${missing.join('、')}。`);
    }

    const officialPrice = evidence.match(/[￥¥]\s*([\d,]+(?:\.\d+)?)/);
    if (officialPrice?.[1]) {
      sourceNotes.push(`页面当前展示官方售价 ${officialPrice[1]} 元；价格不写入规格字段，正式 seed 使用 CNY 价格结构单独记录。`);
    }
    sourceNotes.push(
      `页面身份按 ${target.model} 处理；仅读取 MOD007 V5 HE 的正文卖点，不从详情图片推断尺寸、重量、布局或电池参数。`,
    );

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
