import type { AdapterResult, CrawlTarget, PageSnapshot, PageTable } from '../../../engine/types';

export const capitaAdapter = {
  name: 'snowboard/capita',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'snowboard' && target.brand === 'capita';
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const table = snapshot.tables.find(isCapitaSizeTable);
    if (!table) {
      return {
        normalizedSpecs: {},
        sourceNotes: ['未找到包含 Effective Edge / Waist / Sidecut 的 CAPiTA 尺寸表，保留原始页面快照，未猜测参数。'],
      };
    }

    const rowsByLabel = new Map(
      table.rows.map((row) => [normalizeLabel(row[0] ?? ''), row] as const),
    );
    const perSize = table.headers
      .slice(1)
      .map((size, index) => toSizeRow(size, index + 1, table, rowsByLabel))
      .filter((row): row is Record<string, unknown> => row !== undefined);
    const invalidSidecuts = table.headers
      .slice(1)
      .map((size, index) => {
        const raw = rowsByLabel.get('sidecut')?.[index + 1];
        const parsed = numberFrom(raw);
        return raw && parsed !== undefined && (parsed < 4 || parsed > 15) ? `${size}=${raw}` : undefined;
      })
      .filter((value): value is string => value !== undefined);
    const representativeSize = target.representativeSize;
    const representative = representativeSize
      ? perSize.find((row) => sameSize(row.size, representativeSize))
      : undefined;

    const sourceNotes = [
      `找到 CAPiTA 尺寸表 ${perSize.length} 行。`,
      'Effective Edge 直接使用官方 mm；Waist 由官方 cm 转换为 schema 所需 mm；官方 Suggested Weight 是体重区间，不冒充整板重量。',
      representative
        ? `已按代表尺寸 ${representativeSize} 生成部分 specs；仍需人工复核季节和宽版标记。`
        : '未指定代表尺寸，per-size 全表仅存 raw JSON，不自动选代表值。',
    ];
    if (invalidSidecuts.length > 0) {
    sourceNotes.push(`官方原始 sidecut 存在异常值（${invalidSidecuts.join('、')}），保留原值；若选中该尺寸，schema 校验会阻止草稿生成。`);
    }

    return {
      normalizedSpecs: representative ? representativeSpecs(representative) : {},
      perSize,
      sourceNotes,
    };
  },
};

function isCapitaSizeTable(table: PageTable): boolean {
  const header = normalizeLabel(table.headers[0] ?? '');
  const labels = new Set(table.rows.map((row) => normalizeLabel(row[0] ?? '')));
  return (
    header.includes('board size') &&
    labels.has('effective edge (mm)') &&
    labels.has('waist') &&
    labels.has('sidecut')
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
    effectiveEdge: numberFrom(value('effective edge (mm)')),
    waistWidth: centimetersToMillimeters(value('waist')),
    sidecut: numberFrom(value('sidecut')),
    sourceValues: table.rows.map((row) => ({ label: row[0] ?? '', value: row[columnIndex] ?? '' })),
  };
}

function representativeSpecs(row: Record<string, unknown>): Record<string, unknown> {
  const specs: Record<string, unknown> = {};
  for (const key of ['length', 'effectiveEdge', 'waistWidth', 'sidecut']) {
    const value = row[key];
    if (typeof value === 'number') specs[key] = value;
  }
  return specs;
}

function centimetersToMillimeters(value: string | undefined): number | undefined {
  const centimeters = numberFrom(value);
  return centimeters === undefined ? undefined : centimeters * 10;
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
