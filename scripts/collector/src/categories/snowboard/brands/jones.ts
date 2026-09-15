import type { AdapterResult, CrawlTarget, PageSnapshot, PageTable } from '../../../engine/types';

export const jonesAdapter = {
  name: 'snowboard/jones',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'snowboard' && target.brand === 'jones';
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const table = snapshot.tables.find(isBoardSpecTable);
    if (!table) {
      return {
        normalizedSpecs: {},
        sourceNotes: ['未找到包含 Board weight / Effective edge length 的 Jones 尺寸表，保留原始页面快照，未猜测参数。'],
      };
    }

    const rowsByLabel = new Map(
      table.rows.map((row) => [normalizeLabel(row[0] ?? ''), row] as const),
    );
    const perSize = table.headers
      .slice(1)
      .map((size, index) => toSizeRow(size, index + 1, table, rowsByLabel))
      .filter((row): row is Record<string, unknown> => row !== undefined);
    const representativeSize = target.representativeSize;
    const representative = representativeSize
      ? perSize.find((row) => sameSize(row.size, representativeSize))
      : undefined;

    return {
      normalizedSpecs: representative ? representativeSpecs(representative) : {},
      perSize,
      sourceNotes: [
        `找到 Jones 尺寸表 ${perSize.length} 行。`,
        '板腰、有效边刃和站位后移由官方 cm 值转换为 schema 所需 mm；整板重量由 kg 转换为 g。',
        representative
          ? `已按代表尺寸 ${representativeSize} 生成部分 specs；仍需人工复核季节和宽版标记。`
          : '未指定代表尺寸，per-size 全表仅存 raw JSON，不自动选代表值。',
      ],
    };
  },
};

function isBoardSpecTable(table: PageTable): boolean {
  const header = normalizeLabel(table.headers[0] ?? '');
  const labels = new Set(table.rows.map((row) => normalizeLabel(row[0] ?? '')));
  return (
    header.includes('board size') &&
    labels.has('board weight') &&
    labels.has('effective edge length (cm)')
  );
}

function toSizeRow(
  size: string,
  columnIndex: number,
  table: PageTable,
  rowsByLabel: Map<string, string[]>,
): Record<string, unknown> | undefined {
  const length = numberFrom(size);
  if (length === undefined) return undefined;

  const value = (label: string): string | undefined => rowsByLabel.get(label)?.[columnIndex];
  return {
    size,
    length,
    weight: kilogramsToGrams(value('board weight')),
    effectiveEdge: centimetersToMillimeters(value('effective edge length (cm)')),
    waistWidth: centimetersToMillimeters(value('waist width (cm)')),
    sidecut: numberFrom(value('sidecut radius (m)')),
    stanceSetback: centimetersToMillimeters(value('stance setback (cm)')),
    sourceValues: table.rows.map((row) => ({ label: row[0] ?? '', value: row[columnIndex] ?? '' })),
  };
}

function representativeSpecs(row: Record<string, unknown>): Record<string, unknown> {
  const specs: Record<string, unknown> = {};
  for (const key of ['length', 'weight', 'effectiveEdge', 'waistWidth', 'sidecut', 'stanceSetback']) {
    const value = row[key];
    if (typeof value === 'number') specs[key] = value;
  }
  return specs;
}

function centimetersToMillimeters(value: string | undefined): number | undefined {
  const centimeters = numberFrom(value);
  return centimeters === undefined ? undefined : centimeters * 10;
}

function kilogramsToGrams(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const kilograms = value.match(/(-?\d+(?:[.,]\d+)?)\s*kg\b/i);
  if (kilograms?.[1]) return decimalNumber(kilograms[1]) * 1000;
  const grams = value.match(/(-?\d+(?:[.,]\d+)?)\s*g\b/i);
  return grams?.[1] ? decimalNumber(grams[1]) : undefined;
}

function numberFrom(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = value.match(/-?\d+(?:[.,]\d+)?/);
  return match?.[0] ? decimalNumber(match[0]) : undefined;
}

function decimalNumber(value: string): number {
  return Number(value.replace(',', '.'));
}

function sameSize(left: unknown, right: string): boolean {
  return String(left).trim().toLowerCase().replace(/\s+/g, '') === right.trim().toLowerCase().replace(/\s+/g, '');
}

function normalizeLabel(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}
