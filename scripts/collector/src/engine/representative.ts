/**
 * 自动通过时的代表尺寸选择策略：优先使用非 W 宽的标准宽度，按长度排序后取中位尺寸。
 * 这样不会把宽版或极端长/短板作为默认代表值；如果只有宽版，则从宽版中取中位尺寸。
 */
export function chooseAutomaticRepresentativeSize(
  perSize: Array<Record<string, unknown>> | undefined,
): string | undefined {
  if (!perSize || perSize.length === 0) return undefined;

  const candidates = perSize
    .map((row) => ({
      size: row.size,
      length: row.length,
    }))
    .filter(
      (row): row is { size: string | number; length: number } =>
        (typeof row.size === 'string' || typeof row.size === 'number') &&
        typeof row.length === 'number' &&
        Number.isFinite(row.length),
    );
  if (candidates.length === 0) return undefined;

  const standard = candidates.filter((row) => !isWideSize(String(row.size)));
  const pool = standard.length > 0 ? standard : candidates;
  pool.sort((left, right) => left.length - right.length || String(left.size).localeCompare(String(right.size)));
  return String(pool[Math.floor(pool.length / 2)]?.size);
}

function isWideSize(size: string): boolean {
  return /(?:^|\s)w$/i.test(size.trim()) || /w$/i.test(size.trim());
}
