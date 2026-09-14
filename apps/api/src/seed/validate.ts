import 'dotenv/config';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import {
  brandSeedSchema,
  categorySeedSchema,
  parseSpecSchema,
  productSeedSchema,
  validateSpecs,
  type SpecSchema,
} from '@youpu/schema';

/**
 * 数据校验器（不连数据库）：pnpm --filter @youpu/api validate:data
 * 与 seed 导入同一套 zod 契约 —— 校验不过的数据不可能进库。
 */
function main(): number {
  const dataDir = resolve(process.cwd(), process.env.DATA_DIR ?? '../../data');
  const errors: string[] = [];
  let categoryCount = 0;
  let brandCount = 0;
  let productCount = 0;

  const categoriesRaw = parseYaml(readFileSync(join(dataDir, 'categories.yaml'), 'utf8')) as unknown[];
  const schemaByCategory = new Map<string, SpecSchema>();
  for (const [i, item] of categoriesRaw.entries()) {
    const parsed = categorySeedSchema.safeParse(item);
    if (!parsed.success) {
      errors.push(`categories.yaml[${i}]：${parsed.error.issues.map((x) => x.message).join('; ')}`);
      continue;
    }
    categoryCount += 1;
    if (parsed.data.spec_schema !== undefined) {
      const result = parseSpecSchemaSafe(parsed.data.spec_schema);
      if (typeof result === 'string') errors.push(`categories.yaml[${i}] spec_schema：${result}`);
      else schemaByCategory.set(parsed.data.slug, result);
    }
  }

  const brandsRaw = parseYaml(readFileSync(join(dataDir, 'brands.yaml'), 'utf8')) as unknown[];
  for (const [i, item] of brandsRaw.entries()) {
    const parsed = brandSeedSchema.safeParse(item);
    if (!parsed.success) {
      errors.push(`brands.yaml[${i}]：${parsed.error.issues.map((x) => x.message).join('; ')}`);
      continue;
    }
    brandCount += 1;
  }

  for (const entry of readdirSync(dataDir)) {
    const dir = join(dataDir, entry);
    if (!statSync(dir).isDirectory()) continue;
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.yaml') && !file.endsWith('.yml')) continue;
      const fullPath = join(dir, file);
      const parsed = productSeedSchema.safeParse(parseYaml(readFileSync(fullPath, 'utf8')));
      if (!parsed.success) {
        errors.push(`${fullPath}：${parsed.error.issues.map((x) => `${x.path.join('.')} ${x.message}`).join('; ')}`);
        continue;
      }
      const seed = parsed.data;
      const schema = schemaByCategory.get(seed.category);
      if (!schema) {
        errors.push(`${fullPath}：类目 ${seed.category} 未声明 spec_schema`);
        continue;
      }
      const validation = validateSpecs(schema, seed.specs);
      if (!validation.ok) {
        for (const issue of validation.issues) {
          errors.push(`${fullPath} → specs.${issue.path}: ${issue.message}`);
        }
        continue;
      }
      if (seed.editorial_scores) {
        const dims = new Set((schema.rating_dimensions ?? []).map((d) => d.key));
        const unknownDims = Object.keys(seed.editorial_scores).filter((k) => !dims.has(k));
        if (unknownDims.length > 0) {
          errors.push(`${fullPath} → editorial_scores 含未声明的评分维度：${unknownDims.join(', ')}`);
          continue;
        }
      }
      productCount += 1;
    }
  }

  console.log(`类目 ${categoryCount} / 品牌 ${brandCount} / 产品 ${productCount} 通过校验`);
  if (errors.length > 0) {
    for (const err of errors) console.error(`✗ ${err}`);
    console.error(`共 ${errors.length} 处错误`);
    return 1;
  }
  console.log('全部通过');
  return 0;
}

function parseSpecSchemaSafe(raw: unknown): SpecSchema | string {
  try {
    return parseSpecSchema(raw);
  } catch (err) {
    return (err as Error).message;
  }
}

process.exitCode = main();
