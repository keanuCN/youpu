import type { AdapterResult, CrawlTarget, PageSnapshot, PageTable } from '../../../engine/types';

export const nitroAdapter = {
  name: 'snowboard/nitro',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'snowboard' && target.brand === 'nitro';
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const table = snapshot.tables.find(isNitroSizeTable);
    if (!table) {
      return {
        normalizedSpecs: {},
        sourceNotes: ['未找到包含 Waist Width / Running Length / Sidecut 的 Nitro 尺寸表，保留原始页面快照，未猜测参数。'],
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

    return {
      normalizedSpecs: representative ? representativeSpecs(representative) : {},
      perSize,
      sourceNotes: [
        `找到 Nitro 尺寸表 ${perSize.length} 个尺寸。`,
        'Waist Width、Running Length 直接使用官方 mm；Setback 直接使用官方 mm。',
        '官方 Sidecut 为三段半径，完整原文保留在 sourceValues，不压成一个 schema 数值。',
        representative
          ? `已按代表尺寸 ${representativeSize} 生成部分 specs；仍需人工复核当前页面季节。`
          : representativeSize
            ? `官方尺寸表未找到代表尺寸 ${representativeSize}，不生成 specs。`
            : '未指定代表尺寸，per-size 全表仅存 raw JSON，不自动选代表值。',
      ],
    };
  },
};

function isNitroSizeTable(table: PageTable): boolean {
  const header = normalizeLabel(table.headers[0] ?? '');
  const labels = table.rows.map((row) => normalizeLabel(row[0] ?? ''));
  return (
    header === 'size' &&
    labels.some((label) => label === 'waist width') &&
    labels.some((label) => label === 'running length') &&
    labels.some((label) => label === 'sidecut (m)')
  );
}

function toSizeRow(size: string, columnIndex: number, table: PageTable): Record<string, unknown> | undefined {
  const length = numberFrom(size);
  if (length === undefined) return undefined;

  const value = (label: string): string | undefined => {
    const row = table.rows.find((candidate) => normalizeLabel(candidate[0] ?? '') === label);
    return row?.[columnIndex];
  };
  return {
    size,
    length,
    waistWidth: numberFrom(value('waist width')),
    runningLength: numberFrom(value('running length')),
    stanceSetback: numberFrom(value('setback (mm)')),
    sourceValues: table.rows.map((row) => ({ label: row[0] ?? '', value: row[columnIndex] ?? '' })),
  };
}

function representativeSpecs(row: Record<string, unknown>): Record<string, unknown> {
  const specs: Record<string, unknown> = {};
  for (const key of ['length', 'waistWidth', 'stanceSetback']) {
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
