import type { AdapterResult, CrawlTarget, PageSnapshot, PageTable } from '../../../engine/types';

export const burtonAdapter = {
  name: 'snowboard/burton',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'snowboard' && target.brand === 'burton';
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const table = snapshot.tables.find(hasSizingHeaders);
    if (!table) {
      return {
        normalizedSpecs: {},
        sourceNotes: ['未找到包含 Board Size / Waist Width 的规格表，保留原始页面快照，未猜测参数。'],
      };
    }

    const perSize = isTransposedTable(table)
      ? toTransposedSizeRows(table)
      : table.rows
          .map((row) => toSizeRow(row, columnIndexes(table.headers)))
          .filter((row): row is Record<string, unknown> => row !== undefined);
    const representativeSize = target.representativeSize;
    const representative = representativeSize
      ? perSize.find((row) => sameSize(row.size, representativeSize))
      : undefined;

    return {
      normalizedSpecs: representative ? representativeSpecs(representative) : {},
      perSize,
      sourceNotes: [
        `找到 Burton 尺寸表 ${perSize.length} 行。`,
        representative
          ? `已按代表尺寸 ${representativeSize} 生成部分 specs；仍需人工复核。`
          : '未指定代表尺寸，per-size 全表仅存 raw JSON，不自动选代表值。',
      ],
    };
  },
};

function hasSizingHeaders(table: PageTable): boolean {
  const headers = table.headers.map(normalizeHeader);
  return (
    headers.some((header) => header.includes('board size') || header === 'size') &&
    (headers.some((header) => header.includes('waist width')) ||
      table.rows.some((row) => normalizeHeader(row[0] ?? '').includes('waist width')))
  );
}

function isTransposedTable(table: PageTable): boolean {
  return (
    normalizeHeader(table.headers[0] ?? '').includes('board size') &&
    table.rows.some((row) => normalizeHeader(row[0] ?? '').includes('running length'))
  );
}

function toTransposedSizeRows(table: PageTable): Array<Record<string, unknown>> {
  const rowsByLabel = new Map(
    table.rows.map((row) => [normalizeHeader(row[0] ?? ''), row] as const),
  );
  const sizes = table.headers.slice(1);
  const values = (label: string, columnIndex: number): string | undefined =>
    cell(rowsByLabel.get(label), columnIndex);

  return sizes
    .map((size, index) => ({
      size,
      length: numberFrom(size),
      waistWidth: numberFrom(values('waist width', index + 1)),
      effectiveEdge: numberFrom(values('effective edge', index + 1)),
      sidecut: numberFrom(values('sidecut radius', index + 1)),
      runningLength: numberFrom(values('running length', index + 1)),
      stanceLocation: numberFrom(values('stance location', index + 1)),
      sourceValues: table.rows.map((row) => ({ label: row[0] ?? '', value: row[index + 1] ?? '' })),
    }))
    .filter((row) => row.length !== undefined);
}

function columnIndexes(headers: string[]): Record<string, number> {
  const normalized = headers.map(normalizeHeader);
  return {
    size: findColumn(normalized, ['board size', 'size']),
    length: findColumn(normalized, ['running length', 'length']),
    waistWidth: findColumn(normalized, ['waist width']),
    effectiveEdge: findColumn(normalized, ['effective edge']),
    sidecut: findColumn(normalized, ['sidecut radius', 'sidecut']),
    stanceSetback: findColumn(normalized, ['setback', 'stance']),
  };
}

function toSizeRow(row: string[], columns: Record<string, number>): Record<string, unknown> | undefined {
  const rawSize = cell(row, columns.size);
  if (!rawSize) return undefined;
  return {
    size: rawSize,
    length: numberFrom(rawSize),
    waistWidth: numberFrom(cell(row, columns.waistWidth)),
    effectiveEdge: numberFrom(cell(row, columns.effectiveEdge)),
    sidecut: numberFrom(cell(row, columns.sidecut)),
    runningLength: numberFrom(cell(row, columns.length)),
    stanceSetback: numberFrom(cell(row, columns.stanceSetback)),
    sourceRow: row,
  };
}

function representativeSpecs(row: Record<string, unknown>): Record<string, unknown> {
  const specs: Record<string, unknown> = {};
  for (const key of ['length', 'waistWidth', 'effectiveEdge', 'sidecut', 'stanceSetback']) {
    const value = row[key];
    if (typeof value === 'number') specs[key] = value;
  }
  return specs;
}

function findColumn(headers: string[], candidates: string[]): number {
  return headers.findIndex((header) => candidates.some((candidate) => header.includes(candidate)));
}

function cell(row: string[] | undefined, index: number | undefined): string | undefined {
  return row && index !== undefined && index >= 0 ? row[index] : undefined;
}

function numberFrom(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = value.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : undefined;
}

function sameSize(left: unknown, right: string): boolean {
  return String(left).trim().toLowerCase().replace(/\s+/g, '') === right.trim().toLowerCase().replace(/\s+/g, '');
}

function normalizeHeader(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}
