import 'dotenv/config';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse } from 'yaml';
import { categorySeedSchema, parseSpecSchema, productSeedSchema } from '@youpu/schema';

type FieldSummary = { count: number; types: Set<string>; samples: Set<string> };

function valueType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  return typeof value;
}

async function main(): Promise<void> {
  const dataDir = resolve(process.cwd(), process.env.DATA_DIR ?? '../../data');
  const categories = (parse(readFileSync(join(dataDir, 'categories.yaml'), 'utf8')) as unknown[])
    .map((value) => categorySeedSchema.parse(value));
  const fieldsByCategory = new Map(categories.map((category) => [
    category.slug,
    new Set(category.spec_schema ? parseSpecSchema(category.spec_schema).fields.map((field) => field.key) : []),
  ]));
  const summary = new Map<string, Map<string, FieldSummary>>();
  let products = 0;

  for (const entry of readdirSync(dataDir)) {
    const directory = join(dataDir, entry);
    if (!statSync(directory).isDirectory() || ['raw', 'tmp'].includes(entry)) continue;
    for (const file of readdirSync(directory)) {
      if (!/\.ya?ml$/i.test(file)) continue;
      const seed = productSeedSchema.parse(parse(readFileSync(join(directory, file), 'utf8')));
      products += 1;
      const declared = fieldsByCategory.get(seed.category);
      if (!declared) continue;
      for (const [key, value] of Object.entries(seed.specs)) {
        if (declared.has(key)) continue;
        const categoryFields = summary.get(seed.category) ?? new Map<string, FieldSummary>();
        summary.set(seed.category, categoryFields);
        const current = categoryFields.get(key) ?? { count: 0, types: new Set<string>(), samples: new Set<string>() };
        current.count += 1;
        current.types.add(valueType(value));
        if (current.samples.size < 3) current.samples.add(`${seed.slug}: ${JSON.stringify(value)}`);
        categoryFields.set(key, current);
      }
    }
  }

  const output = Object.fromEntries([...summary.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([category, fields]) => [
    category,
    Object.fromEntries([...fields.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => [key, {
      count: value.count,
      types: [...value.types].sort(),
      samples: [...value.samples],
    }])),
  ]));
  console.log(JSON.stringify({ products, undeclaredFieldCount: [...summary.values()].reduce((sum, fields) => sum + [...fields.values()].reduce((n, field) => n + field.count, 0), 0), fields: output }, null, 2));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
