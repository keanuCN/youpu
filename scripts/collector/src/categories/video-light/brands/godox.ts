import type { AdapterResult, CrawlTarget, PageSnapshot, PageTable } from '../../../engine/types';

export const godoxVideoLightAdapter = {
  name: 'video-light/godox',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'video-light' && target.brand === 'godox';
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const modelValues = findModelValues(snapshot.tables, target.model);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = ['找到神牛 Godox 官方 SL60II 系列中文产品页的型号级参数表。'];

    if (!modelValues) {
      sourceNotes.push(`当前页面参数表未找到目标型号 ${target.model} 的独立列，未提取其他型号参数。`);
      return { normalizedSpecs, sourceNotes };
    }

    if (/SL系列摄影灯|COB摄影灯|LED影视灯/i.test(evidence)) normalizedSpecs.lightType = 'COB 摄影灯';

    setNumber(normalizedSpecs, 'power', modelValues, '功率', /([\d.]+)\s*W/i);
    setText(normalizedSpecs, 'colorTemperature', modelValues, '色温');
    setText(normalizedSpecs, 'dimmingRange', modelValues, '调光范围');
    setNumber(normalizedSpecs, 'cri', modelValues, 'CRI', /[≥>]\s*([\d.]+)/i);
    setNumber(normalizedSpecs, 'tlci', modelValues, 'TLCI', /[≥>]\s*([\d.]+)/i);
    setNumber(normalizedSpecs, 'fxEffects', modelValues, 'FX光效种类', /([\d.]+)\s*种/i);
    setText(normalizedSpecs, 'controlMethods', modelValues, '控制方式');
    setNumber(normalizedSpecs, 'transmissionDistance', modelValues, '2.4GHz传输距离', /[≈~]?\s*([\d.]+)\s*m/i);
    setText(normalizedSpecs, 'workingTemperature', modelValues, '工作环境温度');
    setText(normalizedSpecs, 'dimensions', modelValues, '尺寸（展开状态，不含反光罩）');
    setNumber(normalizedSpecs, 'weight', modelValues, '净重', /([\d.]+)\s*kg/i);

    if (/保荣卡口/i.test(evidence)) normalizedSpecs.mount = '保荣卡口';
    if (/低噪风扇/i.test(evidence)) normalizedSpecs.lowNoise = true;

    const illuminance = evidence.match(new RegExp(`${escapeRegex(target.model)}[^。；]{0,80}?(?:最高亮度可达|最高照度(?:可达)?)[^0-9]{0,10}([0-9.]+)\\s*Lux`, 'i'));
    if (illuminance?.[1]) normalizedSpecs.illuminance = Number(illuminance[1]);

    const expectedFields = [
      'lightType',
      'power',
      'colorTemperature',
      'illuminance',
      'dimmingRange',
      'cri',
      'tlci',
      'fxEffects',
      'controlMethods',
      'transmissionDistance',
      'workingTemperature',
      'dimensions',
      'weight',
      'mount',
      'lowNoise',
    ];
    const missing = expectedFields.filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前页面明确确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push(
      '页面同时展示 SL60IID 与 SL60IIBi；参数表按目标型号表头定位列，只使用 SL60IIBi 的值，未把 D 版功率、色温或重量合并进来。',
    );

    return { normalizedSpecs, sourceNotes };
  },
};

function findModelValues(tables: PageTable[], model: string): Map<string, string> | undefined {
  const table = tables.find((candidate) => candidate.headers.some((header) => header.trim() === model));
  if (!table) return undefined;
  const modelIndex = table.headers.findIndex((header) => header.trim() === model);
  if (modelIndex < 0) return undefined;
  const values = new Map<string, string>();
  for (const row of table.rows) {
    const label = row[0]?.trim();
    const value = row[modelIndex]?.trim() ?? (row.length === 2 ? row[1]?.trim() : undefined);
    if (label && value) values.set(label, value);
  }
  return values;
}

function setText(target: Record<string, unknown>, key: string, values: Map<string, string>, label: string): void {
  const value = values.get(label);
  if (value) target[key] = value.replace(/\s+/g, ' ').trim();
}

function setNumber(
  target: Record<string, unknown>,
  key: string,
  values: Map<string, string>,
  label: string,
  pattern: RegExp,
): void {
  const value = values.get(label);
  const match = value?.match(pattern);
  if (match?.[1]) target[key] = Number(match[1]);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
