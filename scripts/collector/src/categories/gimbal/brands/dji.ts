import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const djiGimbalAdapter = {
  name: 'gimbal/dji',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'gimbal' && target.brand === 'dji';
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const modelSegment = extractModelSegment(evidence, target.model);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = ['找到 DJI 大疆官方 Osmo Mobile 7 系列技术参数页的明确规格证据。'];

    if (!modelSegment) {
      sourceNotes.push(`当前页面未找到目标型号 ${target.model} 的独立规格块，未提取其他型号参数。`);
      return { normalizedSpecs, sourceNotes };
    }

    if (/手机稳定器|phone\s+gimbal/i.test(evidence)) normalizedSpecs.gimbalType = '手机稳定器';
    if (/三轴云台|3-axis\s+gimbal/i.test(evidence)) normalizedSpecs.stabilization = '三轴云台增稳';
    if (/智能跟随\s*7\.0|ActiveTrack\s*7\.0/i.test(evidence)) normalizedSpecs.tracking = '智能跟随 7.0';

    if (
      new RegExp(
        `多功能追踪模块适配性[\\s:：]*${escapeRegex(target.model)}[\\s:：]*支持(?:（标配）|\\(标配\\))`,
        'i',
      ).test(evidence)
    ) {
      normalizedSpecs.trackingModule = '多功能追踪模块（标配）';
    }

    setNumber(normalizedSpecs, 'weight', modelSegment, /(?:重量|云台[^：:]{0,40})[^\d]{0,20}(\d+(?:\.\d+)?)\s*克/i);
    setNumber(normalizedSpecs, 'batteryCapacity', evidence, /容量\s*(\d+(?:\.\d+)?)\s*(?:毫安时|mAh)/i);
    setNumber(normalizedSpecs, 'workingTime', modelSegment, /(?:工作时间[^\d]{0,30})?约\s*(\d+(?:\.\d+)?)\s*小时/i);
    setNumber(normalizedSpecs, 'chargingTime', evidence, /充电时间[^\d]{0,20}(\d+(?:\.\d+)?)\s*小时/i);

    const chargingPort = evidence.match(/云台充电接口\s*(USB[- ]?C)/i);
    if (chargingPort?.[1]) normalizedSpecs.chargingPort = chargingPort[1].replace(/\s+/g, '');

    const phoneWeightRange = evidence.match(/适用手机重量\s*([\d.]+\s*克\s*至\s*[\d.]+\s*克)/i);
    if (phoneWeightRange?.[1]) normalizedSpecs.phoneWeightRange = normalizeRange(phoneWeightRange[1]);
    const phoneThicknessRange = evidence.match(/适用手机厚度\s*([\d.]+\s*毫米\s*至\s*[\d.]+\s*毫米)/i);
    if (phoneThicknessRange?.[1]) normalizedSpecs.phoneThicknessRange = normalizeRange(phoneThicknessRange[1]);
    const phoneWidthRange = evidence.match(/适用手机宽度\s*([\d.]+\s*毫米\s*至\s*[\d.]+\s*毫米)/i);
    if (phoneWidthRange?.[1]) normalizedSpecs.phoneWidthRange = normalizeRange(phoneWidthRange[1]);

    setNumber(normalizedSpecs, 'extensionRodLength', modelSegment, /最大拉伸长度\s*[:：]?\s*(\d+(?:\.\d+)?)\s*毫米/i);
    if (/内置三脚架/i.test(evidence)) normalizedSpecs.builtInTripod = true;
    setNumber(normalizedSpecs, 'controlSpeed', evidence, /最大控制转速\s*(\d+(?:\.\d+)?)\s*°\s*\/\s*s/i);
    setNumber(normalizedSpecs, 'fillLightIlluminance', evidence, /补光灯照度\s*(\d+(?:\.\d+)?)\s*lux/i);

    const colorTemperature = evidence.match(/补光灯色温\s*([\d.]+\s*K\s*至\s*[\d.]+\s*K)/i);
    if (colorTemperature?.[1]) normalizedSpecs.fillLightColorTemperature = normalizeRange(colorTemperature[1]);

    const expectedFields = [
      'gimbalType',
      'stabilization',
      'tracking',
      'trackingModule',
      'weight',
      'batteryCapacity',
      'workingTime',
      'chargingTime',
      'chargingPort',
      'phoneWeightRange',
      'phoneThicknessRange',
      'phoneWidthRange',
      'extensionRodLength',
      'builtInTripod',
      'controlSpeed',
      'fillLightIlluminance',
      'fillLightColorTemperature',
    ];
    const missing = expectedFields.filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前页面明确确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push(
      '官方参数页同时展示 Osmo Mobile 7P 与 Osmo Mobile 7；型号级字段只使用目标型号对应文本，共用字段只保存页面明确的系列事实，未把 7 的重量或结构参数合并进来。',
    );

    return { normalizedSpecs, sourceNotes };
  },
};

function extractModelSegment(evidence: string, model: string): string | undefined {
  const escapedModel = escapeRegex(model);
  const nextModel = model.toLowerCase().includes('7p') ? 'Osmo\\s+Mobile\\s+7(?!P)' : 'Osmo\\s+Mobile\\s+7P';
  const matches = [...evidence.matchAll(new RegExp(`${escapedModel}([\\s\\S]*?)(?=${nextModel}|$)`, 'gi'))];
  if (matches.length === 0) return undefined;
  return matches.map((match) => match[0]).join(' ');
}

function setNumber(target: Record<string, unknown>, key: string, value: string, pattern: RegExp): void {
  const match = value.match(pattern);
  if (match?.[1]) target[key] = Number(match[1]);
}

function normalizeRange(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
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
