import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const siruiTripodAdapter = {
  name: 'tripod/sirui',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'tripod' && target.brand === 'sirui';
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const modelBlock = extractModelBlock(evidence, target.model);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [
      '找到 SIRUI 思锐官方 T-S 系列三脚架页面的型号级规格证据。',
    ];

    if (!modelBlock) {
      sourceNotes.push(`当前页面未找到目标型号 ${target.model} 的独立规格块，未提取其他型号参数。`);
      return { normalizedSpecs, sourceNotes };
    }

    const material = matchText(
      modelBlock,
      /(?:Material|材\s*质)\s*[:：]?\s*([A-Za-z\u4e00-\u9fff ]+?)(?=Compatible|适配\s*云台|Sections|节\s*数)/i,
    );
    if (material) normalizedSpecs.material = material;

    const compatibleBallHead = matchText(
      modelBlock,
      /(?:Compatible\s+Ball\s+Head|适配\s*云台)\s*[:：]?\s*([A-Za-z0-9/ -]+?)(?=Sections\s*[:：]?|节\s*数\s*[:：]?)/i,
    );
    if (compatibleBallHead) normalizedSpecs.compatibleBallHead = compatibleBallHead;

    setNumber(normalizedSpecs, 'sections', modelBlock, /(?:Sections|节\s*数)\s*[:：]?\s*(\d+)/i);
    setNumber(normalizedSpecs, 'tubeMaxDiameter', modelBlock, /(?:Tube\s+Max\s+Dia|最大\s*管\s*径)\s*[:：]?\s*([\d.]+)\s*(?:mm|毫米)?/i);
    setNumber(normalizedSpecs, 'tubeMinDiameter', modelBlock, /(?:Tube\s+Min\s+Dia|最小\s*管\s*径)\s*[:：]?\s*([\d.]+)\s*(?:mm|毫米)?/i);
    setNumber(normalizedSpecs, 'minHeight', modelBlock, /(?:Min\s+Hgt|最小\s*高度)\s*[:：]?\s*([\d.]+)\s*(?:mm|毫米)?/i);
    setNumber(normalizedSpecs, 'maxHeight', modelBlock, /(?:Max\s+Hgt|不升\s*中轴\s*高)\s*[:：]?\s*([\d.]+)\s*(?:mm|毫米)?/i);
    setNumber(normalizedSpecs, 'maxHeightExtended', modelBlock, /(?:Max\s+Hgt\s+Ext\.?|最大\s*高度)\s*[:：]?\s*([\d.]+)\s*(?:mm|毫米)?/i);
    setNumber(normalizedSpecs, 'retractedHeight', modelBlock, /(?:Retracted\s+Height|收缩\s*高度)\s*[:：]?\s*([\d.]+)\s*(?:mm|毫米)?/i);
    setNumber(normalizedSpecs, 'foldedHeight', modelBlock, /(?:Folded\s+Height|折叠\s*高度)\s*[:：]?\s*([\d.]+)\s*(?:mm|毫米)?/i);
    setNumber(normalizedSpecs, 'monopodMaxHeight', modelBlock, /(?:Monopod\s+Max\s+Height|独脚架\s*最大\s*高度)\s*[:：]?\s*([\d.]+)\s*(?:mm|毫米)?/i);
    setNumber(normalizedSpecs, 'monopodMinHeight', modelBlock, /(?:Monopod\s+Min\s+Height|独脚架\s*最小\s*高度)\s*[:：]?\s*([\d.]+)\s*(?:mm|毫米)?/i);
    setNumber(normalizedSpecs, 'weight', modelBlock, /(?:Weight|自身\s*重量)\s*[:：]?\s*([\d.]+)\s*(?:kg|千克)?/i);
    setNumber(normalizedSpecs, 'loadCapacity', modelBlock, /(?:Load|最大\s*负重)\s*[:：]?\s*([\d.]+)\s*(?:kg|千克)?/i);

    const expectedFields = [
      'material',
      'compatibleBallHead',
      'sections',
      'tubeMaxDiameter',
      'tubeMinDiameter',
      'minHeight',
      'maxHeight',
      'maxHeightExtended',
      'retractedHeight',
      'foldedHeight',
      'monopodMaxHeight',
      'monopodMinHeight',
      'weight',
      'loadCapacity',
    ];
    const missing = expectedFields.filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从目标型号规格块明确确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push(
      '页面同时展示多个 T-S 系列型号；只使用目标型号对应的规格块，未把其他型号参数合并进来，也未根据图片或搜索摘要补写字段。',
    );

    return { normalizedSpecs, sourceNotes };
  },
};

function extractModelBlock(evidence: string, model: string): string | undefined {
  const escapedModel = escapeRegex(model);
  const match = evidence.match(
    new RegExp(`(?:Model|型\\s*号)\\s*[:：]\\s*${escapedModel}([\\s\\S]*?)(?=(?:Model|型\\s*号)\\s*[:：]|$)`, 'i'),
  );
  return match?.[0];
}

function matchText(value: string, pattern: RegExp): string | undefined {
  const match = value.match(pattern);
  return match?.[1]?.replace(/\s+/g, ' ').trim();
}

function setNumber(target: Record<string, unknown>, key: string, value: string, pattern: RegExp): void {
  const match = value.match(pattern);
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
