import type { AdapterResult, CrawlTarget, PageSnapshot, PageTable } from '../../../engine/types';

export const koruaShapesAdapter = {
  name: 'snowboard/korua-shapes',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'snowboard' && target.brand === 'korua-shapes';
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const table = snapshot.tables.find(isKoruaSizeTable);
    if (!table) {
      return {
        normalizedSpecs: {},
        sourceNotes: ['未找到包含 Effective Edge / Waist Width / Avg. Sidecut Radius 的 KORUA 尺寸表，保留原始页面快照，未猜测参数。'],
      };
    }

    const perSize = table.headers
      .slice(1)
      .map((size, index) => toSizeRow(size, index + 1, table))
      .filter((row): row is Record<string, unknown> => row !== undefined);
    const representativeSize = target.representativeSize;
    const representative = representativeSize
      ? perSize.find((row) => sameSize(row.size, representativeSize))
      : undefined;
    const availableSizes = table.headers.slice(1).join('、');
    const sourceNotes = [
      `找到 KORUA 尺寸表 ${perSize.length} 个尺寸（${availableSizes}）。`,
      'Effective Edge、Waist Width、Setback 直接使用官方 mm；Avg. Sidecut Radius 使用官方 m。',
      'Board Weight 存在 Gloss / Brushed 多种表面版本，不自动选择单一重量，完整原文保留在 sourceValues。',
      representative
        ? `已按代表尺寸 ${representativeSize} 生成部分 specs；仍需人工复核表面版本和季节。`
        : representativeSize
          ? `官方尺寸表未找到代表尺寸 ${representativeSize}，不生成 specs。`
          : '未指定代表尺寸，per-size 全表仅存 raw JSON，不自动选代表值。',
    ];

    return {
      normalizedSpecs: representative ? representativeSpecs(representative) : {},
      perSize,
      sourceNotes,
    };
  },
};

function isKoruaSizeTable(table: PageTable): boolean {
  const header = normalizeLabel(table.headers[0] ?? '');
  const labels = table.rows.map((row) => normalizeLabel(row[0] ?? ''));
  return (
    header.includes('length (cm)') &&
    labels.some((label) => label.includes('effective edge')) &&
    labels.some((label) => label.includes('waist width')) &&
    labels.some((label) => label.includes('avg. sidecut radius'))
  );
}

function toSizeRow(size: string, columnIndex: number, table: PageTable): Record<string, unknown> | undefined {
  const length = numberFrom(size);
  if (length === undefined) return undefined;

  const value = (labelFragment: string): string | undefined => {
    const row = table.rows.find((candidate) => normalizeLabel(candidate[0] ?? '').includes(labelFragment));
    return row?.[columnIndex];
  };
  return {
    size,
    length,
    effectiveEdge: numberFrom(value('effective edge')),
    waistWidth: numberFrom(value('waist width')),
    sidecut: numberFrom(value('avg. sidecut radius')),
    stanceSetback: numberFrom(value('setback')),
    sourceValues: table.rows.map((row) => ({ label: row[0] ?? '', value: row[columnIndex] ?? '' })),
  };
}

function representativeSpecs(row: Record<string, unknown>): Record<string, unknown> {
  const specs: Record<string, unknown> = {};
  for (const key of ['length', 'effectiveEdge', 'waistWidth', 'sidecut', 'stanceSetback']) {
    const value = row[key];
    if (typeof value === 'number') specs[key] = value;
  }
  return specs;
}

function numberFrom(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = value.match(/-?\d+(?:[.,]\d+)?/);
  return match?.[0] ? Number(match[0].replace(',', '.')) : undefined;
}

function sameSize(left: unknown, right: string): boolean {
  return String(left).trim().toLowerCase().replace(/\s+/g, '') === right.trim().toLowerCase().replace(/\s+/g, '');
}

function normalizeLabel(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}
