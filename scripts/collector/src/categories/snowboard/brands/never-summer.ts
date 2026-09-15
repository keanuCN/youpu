import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const neverSummerAdapter = {
  name: 'snowboard/never-summer',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'snowboard' && target.brand === 'never-summer';
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const chartText = snapshot.imageAltTexts.find((value) =>
      normalizeText(value).includes('proto slinger size specifications'),
    );
    const perSize = chartText ? parseChart(chartText) : [];
    if (perSize.length === 0) {
      return {
        normalizedSpecs: {},
        sourceNotes: ['未找到包含 Proto Slinger 尺寸行的官方 chart alt 文本，保留原始页面快照，未猜测参数。'],
      };
    }

    const representativeSize = target.representativeSize;
    const representative = representativeSize
      ? perSize.find((row) => sameSize(row.size, representativeSize))
      : undefined;
    return {
      normalizedSpecs: representative ? representativeSpecs(representative) : {},
      perSize,
      sourceNotes: [
        `从官方图片 alt 文本解析 Never Summer 尺寸表 ${perSize.length} 个尺寸。`,
        'Waist 和 Edge 按官方“in centimeters”转换为 schema 所需 mm。',
        'Sidecut 使用 VARIO 多半径原文，保留在 sourceValues，不压成单一 schema 数值。',
        representative
          ? `已按代表尺寸 ${representativeSize} 生成部分 specs；仍需人工复核季节和型号。`
          : representativeSize
            ? `官方尺寸表未找到代表尺寸 ${representativeSize}，不生成 specs。`
            : '未指定代表尺寸，per-size 全表仅存 raw JSON，不自动选代表值。',
      ],
    };
  },
};

function parseChart(value: string): Array<Record<string, unknown>> {
  const rows: Array<Record<string, unknown>> = [];
  const rowPattern = /(\d{3}[a-z]?)\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)\s*\|\s*([^|]+?)\s*\|\s*([\d.]+)/gi;
  for (const match of value.matchAll(rowPattern)) {
    const size = match[1];
    const waist = match[2];
    const edge = match[3];
    const sidecut = match[4];
    const noseTail = match[5];
    if (!size || !waist || !edge || !sidecut || !noseTail) continue;
    rows.push({
      size,
      length: numberFrom(size),
      waistWidth: centimetersToMillimeters(waist),
      effectiveEdge: centimetersToMillimeters(edge),
      sourceValues: { waist, edge, sidecut, noseTail },
    });
  }
  return rows;
}

function representativeSpecs(row: Record<string, unknown>): Record<string, unknown> {
  const specs: Record<string, unknown> = {};
  for (const key of ['length', 'effectiveEdge', 'waistWidth']) {
    const value = row[key];
    if (typeof value === 'number') specs[key] = value;
  }
  return specs;
}

function centimetersToMillimeters(value: string): number {
  return numberFrom(value) * 10;
}

function numberFrom(value: string): number {
  const match = value.match(/-?\d+(?:[.,]\d+)?/);
  return match?.[0] ? Number(match[0].replace(',', '.')) : Number.NaN;
}

function sameSize(left: unknown, right: string): boolean {
  return String(left).trim().toLowerCase().replace(/\s+/g, '') === right.trim().toLowerCase().replace(/\s+/g, '');
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}
