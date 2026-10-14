import type { PageTable } from './types';

export type EquipmentSizeRow = Record<string, string> & { size: string };

const clean = (text: string) => text.toLowerCase().replace(/[’']/g, '').replace(/\s+/g, ' ').trim();
function usable(value?: string): value is string {
  return Boolean(value?.trim() && !/^[-—*]+$/.test(value.trim()));
}

function keyFor(label: string): string | undefined {
  const text = clean(label);
  if (/women/.test(text) && /us|boot/.test(text)) return 'usWomen';
  if (/men|youth/.test(text) && /us|boot/.test(text)) return 'usMen';
  if (/^eu(?:r|ro)?(?:$|\s)/.test(text)) return 'eu';
  if (/^uk/.test(text)) return 'uk';
  if (/mondo|^cm(?: boot)?$|^cm boot|japan/.test(text)) return 'mondo';
  return undefined;
}

export function bindingSizeRows(tables: PageTable[], brand: string, women = false): EquipmentSizeRow[] {
  let table: PageTable | undefined;
  if (brand === 'union') {
    // Union embeds men's, women's, children's and Step On charts on one page.
    table = tables.find((item) => clean(item.headers[0] ?? '') === (women ? 'womens' : 'mens/unisex'));
  } else {
    table = tables.find((item) =>
      /^(binding size|size)$/.test(clean(item.headers[0] ?? '')) &&
      item.rows.some((row) => keyFor(row[0] ?? '')),
    );
  }
  if (table) {
    return table.headers.slice(1).flatMap((size, offset) => {
      if (!usable(size)) return [];
      const row: EquipmentSizeRow = { size };
      for (const cells of table!.rows) {
        const key = keyFor(cells[0] ?? '');
        const value = cells[offset + 1];
        if (key && usable(value)) row[key] = value.trim();
      }
      return Object.keys(row).length > 1 ? [row] : [];
    });
  }
  // Nidecker and Flow use one binding size per row, rather than per column.
  table = tables.find((item) => item.headers.some((header) => /us youth & men/i.test(header)));
  if (!table) return [];
  return table.rows.flatMap((cells) => {
    if (!/^(S|M|L|XL|XS|S\/M|M\/L|L\/XL)$/i.test(cells[0] ?? '')) return [];
    const row: EquipmentSizeRow = { size: cells[0]! };
    table!.headers.forEach((label, index) => {
      const key = keyFor(label);
      const value = cells[index];
      if (key && usable(value)) row[key] = value.trim();
    });
    return Object.keys(row).length > 1 ? [row] : [];
  });
}

export function bootSizeRows(tables: PageTable[], women = false): EquipmentSizeRow[] {
  const transposed = tables.find((item) =>
    (keyFor(item.headers[0] ?? '') === 'usMen' && item.headers.slice(1).every((value) => /^\d+(?:\.\d+)?$/.test(value))) ||
    (item.rows.some((row) => clean(row[0] ?? '') === 'mondopoint') && item.rows.some((row) => keyFor(row[0] ?? '') === 'usMen')),
  );
  if (transposed) {
    const fromHeader = keyFor(transposed.headers[0] ?? '') === 'usMen';
    const columns = fromHeader ? transposed.headers.length : Math.max(...transposed.rows.map((row) => row.length));
    return Array.from({ length: columns - 1 }, (_, offset) => {
      const index = offset + 1;
      const row: EquipmentSizeRow = { size: '' };
      const header = transposed.headers[index];
      if (fromHeader && usable(header)) row.usMen = header;
      for (const cells of transposed.rows) {
        const key = keyFor(cells[0] ?? '');
        const value = cells[index];
        if (key && usable(value)) row[key] = value.trim();
      }
      if (row.mondo && /^\d+$/.test(row.mondo) && Number(row.mondo) >= 100) {
        row.mondo = String(Number(row.mondo) / 10);
        row.notes = '官方 Mondopoint 毫米值转换为厘米；品牌通用换算，不代表型号库存。';
      }
      row.size = women && row.usWomen ? `US 女 ${row.usWomen}` : !women && row.usMen ? `US 男 ${row.usMen}` : '';
      return row;
    }).filter((row) => row.size && row.eu && (!row.mondo || Number(row.mondo) >= (women ? 21 : 23)));
  }
  const table = tables.find((item) => {
    return item.headers.some((label) => ['usMen', 'usWomen'].includes(keyFor(label) ?? '') || /^us(?: size)?$/i.test(label)) &&
      item.headers.some((label) => ['eu', 'mondo'].includes(keyFor(label) ?? '') || /^jp$/i.test(label));
  });
  if (!table) return [];
  return table.rows.flatMap((cells) => {
    const row: EquipmentSizeRow = { size: '' };
    table.headers.forEach((label, index) => {
      const key = keyFor(label) ?? (/^us(?: size)?$/i.test(label) ? (women ? 'usWomen' : 'usMen') : /^(cm|jp)$/i.test(label) ? 'mondo' : undefined);
      const value = cells[index];
      if (key && usable(value)) row[key] = value.trim();
    });
    row.size = row.usMen ? `US 男 ${row.usMen}` : row.usWomen ? `US 女 ${row.usWomen}` : '';
    return row.size && (row.eu || row.mondo) ? [row] : [];
  });
}
