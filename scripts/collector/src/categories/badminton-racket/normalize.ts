export function normalizeLabel(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

export function weightClassFrom(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const classes = [...value.toUpperCase().matchAll(/([2345])U(?:G\d+)?/g)].map((match) => `${match[1]}U`);
  const unique = [...new Set(classes)];
  if (unique.includes('3U') && unique.includes('4U')) return '3U/4U';
  return unique.length === 1 ? unique[0] : undefined;
}

export function maxNumberFrom(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const numbers = [...value.matchAll(/\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
  return numbers.length > 0 ? Math.max(...numbers) : undefined;
}
