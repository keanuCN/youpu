import type { AdapterResult, CrawlTarget, PageSnapshot, PageTable } from '../../../engine/types';

export const rideAdapter = {
  name: 'snowboard/ride',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'snowboard' && target.brand === 'ride';
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const table = snapshot.tables.find(isRideSizeTable);
    if (!table) {
      return {
        normalizedSpecs: {},
        sourceNotes: ['未找到包含 Eff-Edge / Waist width / 三段 Sidecut 的 RIDE 尺寸表，保留原始页面快照，未猜测参数。'],
      };
    }

    const setbackColumn = findColumnWithUnit(table, 'insert set back', 'mm');
    const perSize = table.rows
      .slice(1)
      .map((row) => toSizeRow(row, table, setbackColumn))
      .filter((row): row is Record<string, unknown> => row !== undefined);
    const representativeSize = target.representativeSize;
    const representative = representativeSize
      ? perSize.find((row) => sameSize(row.size, representativeSize))
      : undefined;

    return {
      normalizedSpecs: representative ? representativeSpecs(representative) : {},
      perSize,
      sourceNotes: [
        `找到 RIDE 尺寸表 ${perSize.length} 个尺寸。`,
        'Eff-Edge、Waist width、Insert Set Back 使用官方 mm；首行单位说明已保留在 sourceValues。',
        '官方 Sidecut 为 entry / focus / exit 三段半径，完整原文保留，不压成单一 schema 数值。',
        representative
          ? `已按代表尺寸 ${representativeSize} 生成部分 specs；仍需人工复核当前页面季节和 W 宽版。`
          : representativeSize
            ? `官方尺寸表未找到代表尺寸 ${representativeSize}，不生成 specs。`
            : '未指定代表尺寸，per-size 全表仅存 raw JSON，不自动选代表值。',
      ],
    };
  },
};

function isRideSizeTable(table: PageTable): boolean {
  const header = normalizeLabel(table.headers[0] ?? '');
  const labels = table.headers.map(normalizeLabel);
  return (
    header === 'size' &&
    labels.includes('eff-edge') &&
    labels.includes('waist width') &&
    labels.filter((label) => label === 'insert set back').length >= 2 &&
    labels.some((label) => label.includes('sidecut entry radius'))
  );
}

function toSizeRow(row: string[], table: PageTable, setbackColumn: number): Record<string, unknown> | undefined {
  const length = numberFrom(row[0]);
  if (length === undefined) return undefined;

  const effectiveEdgeColumn = findColumn(table.headers, 'eff-edge');
  const waistWidthColumn = findColumn(table.headers, 'waist width');
  return {
    size: row[0],
    length,
    effectiveEdge: numberFrom(cell(row, effectiveEdgeColumn)),
    waistWidth: numberFrom(cell(row, waistWidthColumn)),
    stanceSetback: numberFrom(cell(row, setbackColumn)),
    sourceValues: table.headers.map((header, index) => ({ label: header, value: row[index] ?? '' })),
  };
}

function representativeSpecs(row: Record<string, unknown>): Record<string, unknown> {
  const specs: Record<string, unknown> = {};
  for (const key of ['length', 'effectiveEdge', 'waistWidth', 'stanceSetback']) {
    const value = row[key];
    if (typeof value === 'number') specs[key] = value;
  }
  return specs;
}

function findColumnWithUnit(table: PageTable, header: string, unit: string): number {
  const unitRow = table.rows[0] ?? [];
  return table.headers.findIndex(
    (value, index) => normalizeLabel(value) === header && normalizeLabel(unitRow[index] ?? '').includes(unit),
  );
}

function findColumn(headers: string[], value: string): number {
  return headers.findIndex((header) => normalizeLabel(header) === value);
}

function cell(row: string[], index: number): string | undefined {
  return index >= 0 ? row[index] : undefined;
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
