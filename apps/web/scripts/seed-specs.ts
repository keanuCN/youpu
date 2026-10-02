type SeedSpecValue =
  | number
  | string
  | boolean
  | null
  | SeedSpecValue[]
  | { [key: string]: SeedSpecValue };

type SeedSpecRow = Record<string, SeedSpecValue>;

export function toSeedSpecs(
  specs: Record<string, number | string | null>,
  scenes: string[],
  sizeSpecs?: SeedSpecRow[],
) {
  const { price: _price, year: _year, ...specFields } = specs;
  return {
    ...specFields,
    scenes,
    ...(sizeSpecs?.length ? { sizeSpecs } : {}),
  };
}

export function selectSeedTargets<T extends { slug: string }>(items: T[], slug?: string): T[] {
  if (!slug) return items;
  const matches = items.filter((item) => item.slug === slug);
  if (matches.length === 0) throw new Error(`No seed product matches --slug ${slug}`);
  return matches;
}
