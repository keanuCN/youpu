import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const melgeekEsportsKeyboardAdapter = {
  name: 'esports-keyboard/melgeek',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'esports-keyboard' && target.brand === 'melgeek' && /MADE\s*68\s*PRO\s*\+/i.test(target.model);
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`读取 MelGeek 官方 ${target.model} 页面；未采用京东评价数作为销量字段。`];

    if (/MADE\s*68\s*PRO\s*\+/i.test(`${snapshot.title} ${evidence}`) && /Hall Effect|Magnetic Switch/i.test(evidence)) {
      normalizedSpecs.keyboardType = 'magnetic';
    }
    if (/65%/.test(evidence) && /68\s*keys/i.test(evidence)) normalizedSpecs.layout = '65%（68键）';
    if (/TTC RGB Sacred Heart Magnetic Switch/i.test(evidence)) {
      sourceNotes.push('官方页面存在多个轴体与外观变体，轴体及键帽材质不作为全型号共通规格记录。');
    }
    if (/Gasket Mount/i.test(evidence)) normalizedSpecs.mounting = 'Gasket Mount';
    if (/ABS\s*\+\s*PC/i.test(evidence)) normalizedSpecs.caseMaterial = 'ABS + PC';
    if (/wired|USB\s+single-mode/i.test(evidence)) normalizedSpecs.connection = ['wired'];
    if (/8,?000\s*Hz|8kHz/i.test(evidence)) normalizedSpecs.pollingRate = 8000;
    if (/16,?000\s*Hz|16kHz/i.test(evidence)) normalizedSpecs.scanRate = 16000;
    if (/0\.01\s*mm\s*RT/i.test(evidence)) normalizedSpecs.rapidTriggerPrecision = 0.01;
    const actuationRange = evidence.match(/0\.1\s*mm\s*[–-]\s*3\.4\s*mm/i);
    if (actuationRange) normalizedSpecs.actuationRange = '0.1–3.4mm';
    if (/16-million Color RGB|RGB backlight/i.test(evidence)) normalizedSpecs.backlight = '1600 万色 RGB 背光';
    if (/MelGeek HIVE/i.test(evidence)) normalizedSpecs.driver = 'MelGeek HIVE';

    const missing = [
      'layout', 'mounting', 'caseMaterial', 'connection', 'pollingRate', 'scanRate',
      'rapidTriggerPrecision', 'actuationRange', 'backlight', 'driver',
    ].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) sourceNotes.push(`以下字段未能从官方页面确认，保持缺省：${missing.join('、')}。`);
    sourceNotes.push('仅使用页面明确列出的规格；官方美元标价不换算成人民币，seed 价格保持缺省。');

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
