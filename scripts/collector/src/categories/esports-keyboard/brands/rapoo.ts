import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const rapooEsportsKeyboardAdapter = {
  name: 'esports-keyboard/rapoo',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'esports-keyboard' && target.brand === 'rapoo' && /V500\s*PRO/i.test(target.model);
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`找到雷柏官方 ${target.model} 产品页的型号与规格信息。`];

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
