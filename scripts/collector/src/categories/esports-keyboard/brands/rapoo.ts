import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const rapooEsportsKeyboardAdapter = {
  name: 'esports-keyboard/rapoo',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'esports-keyboard' && target.brand === 'rapoo' && /V500\s*PRO|V700DIY\s*[- ]?98|V700RGB/i.test(target.model);
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`找到雷柏官方 ${target.model} 产品页的型号与规格信息。`];

    if (/V700RGB/i.test(target.model)) {
      if (/机械键盘|Mechanical/i.test(evidence)) normalizedSpecs.keyboardType = 'mechanical';
      if (/雷柏(?:自主)?青、黑、茶|雷柏(?:自主)?黑、青、茶轴/i.test(evidence)) {
        normalizedSpecs.switchType = '雷柏自主青轴、黑轴、茶轴可选';
      }
      if (/108\s*键|108\s*keys?/i.test(evidence)) normalizedSpecs.layout = '108 键全尺寸';
      if (/RGB|幻彩/i.test(evidence)) normalizedSpecs.backlight = 'RGB 幻彩背光';
      if (/铝合金上盖|铝合金面板/i.test(evidence)) normalizedSpecs.caseMaterial = '铝合金上盖';
      if (/双色注塑键帽/i.test(evidence)) normalizedSpecs.keycapMaterial = '双色注塑';
      if (/配套软件|驱动软件/i.test(evidence)) normalizedSpecs.driver = 'Rapoo 驱动软件';
      sourceNotes.push('型号限定为 V700RGB 合金版；官网标注青轴、黑轴、茶轴可选，不将京东单个SKU轴体写成全型号固定配置。');
      sourceNotes.push('官网页面未在规格区明示连接方式，保持缺省；京东具名 SKU 标题为有线版。榜单同型号评价量因SKU/商品链接展示不同，采用具名SKU所见的10万+作为热度参考，不作为销量或产品规格。');
      return { normalizedSpecs, sourceNotes };
    }

    if (/V700DIY\s*[- ]?98/i.test(target.model)) {
      if (/机械键盘|Mechanical/i.test(evidence)) normalizedSpecs.keyboardType = 'mechanical';
      if (/凯华定制快银轴/i.test(evidence)) normalizedSpecs.switchType = '凯华定制快银轴/弹白轴可选';
      if (/Gasket/i.test(evidence)) normalizedSpecs.mounting = 'Gasket';
      if (/三模|蓝牙.{0,12}2\.4G.{0,12}有线|Bluetooth.{0,20}2\.4GHz.{0,20}USB/i.test(evidence)) {
        normalizedSpecs.connection = ['wired', '2.4g', 'bluetooth'];
      }
      if (/全键热插拔|Hot[- ]?swappable/i.test(evidence)) normalizedSpecs.hotSwap = true;
      if (/PBT双色注塑键帽|PBT Double-shot Keycaps/i.test(evidence)) normalizedSpecs.keycapMaterial = 'PBT双色注塑';
      if (/RGB背光|Per-key RGB/i.test(evidence)) normalizedSpecs.backlight = 'RGB 背光';
      const batteryCapacity = evidence.match(/(?:内置)?\s*(\d{4,5})\s*mAh/i);
      if (batteryCapacity?.[1]) normalizedSpecs.batteryCapacity = Number(batteryCapacity[1]);
      if (/A\s*Hub/i.test(evidence)) normalizedSpecs.driver = 'Rapoo A Hub';
      sourceNotes.push('型号限定为 V700DIY-98 长续航版；官网标注 10000mAh，其他V700DIY布局和旧款 V500PRO 不合并。官网列出快银轴/弹白轴选项，保留为可选项。');
      sourceNotes.push('官网USB/2.4G回报率可切换125–1000Hz，无法用单一数值表示，因此不填单值 pollingRate；布局键数以具体商品SKU为准，不由型号数字推断。');
      sourceNotes.push('京东 V700DIY-98 具名商品评价量仅作国内热度信号，不作为销量或商品规格。');
      return { normalizedSpecs, sourceNotes };
    }

    if (/机械键盘|机械轴|Mechanical/i.test(evidence)) normalizedSpecs.keyboardType = 'mechanical';
    if (/(?:雷柏自主|自主)?\s*(?:黑.{0,2}青.{0,2}茶.{0,2}红轴|黑轴.{0,6}青轴.{0,6}茶轴.{0,6}红轴)/i.test(evidence)) {
      normalizedSpecs.switchType = '雷柏自主黑轴、青轴、茶轴、红轴可选';
    }
    if (/104\s*(?:键|全尺寸)|104\s*keys?/i.test(evidence)) normalizedSpecs.layout = '104 键全尺寸';
    if (/有线|Wired|USB/i.test(evidence)) normalizedSpecs.connection = ['wired'];
    if (/混彩背光|混彩\s*灯光/i.test(evidence)) normalizedSpecs.backlight = '混彩背光';
    if (/磨砂金属上盖|磨砂金属面板/i.test(evidence)) normalizedSpecs.caseMaterial = '磨砂金属上盖';

    const missing = [
      'switchType',
      'mounting',
      'caseMaterial',
      'layout',
      'connection',
      'backlight',
      'driver',
      'hotSwap',
      'keycapMaterial',
    ].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前官方页面明确确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push('官网该产品页列出黑、青、茶、红轴选项；保留为可选轴体，不将京东榜单标题中的黑轴误写为所有 V500PRO 的唯一轴体。');
    sourceNotes.push('京东榜单商品标题与官网旧版 104 键全尺寸有线型号相符；页面评价量仅作型号热度信号，不写入产品规格或销量。');

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
