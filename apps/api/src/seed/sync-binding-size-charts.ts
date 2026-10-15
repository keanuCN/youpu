import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { parse } from 'yaml';
import { categorySeedSchema, productSeedSchema, parseSpecSchema, validateSpecs } from '@youpu/schema';
import { PrismaService } from '../common/prisma.service';
import { toJsonInput } from '../common/json';

/** 仅合并官方尺码表及来源日期，保留线上其他规格、价格、图片、评分和发布状态。 */
async function main() {
  const apply = process.argv.includes('--apply');
  const dataDir = resolve(process.cwd(), process.env.DATA_DIR ?? '../../data');
  const manifest = JSON.parse(readFileSync(join(dataDir, 'raw/binding-size-2026-10-14/verified-size-tables.json'), 'utf8')) as Array<{ slug: string; rows: unknown[]; url: string; checkedAt: string; bindingSizeGuide?: string; expectedBindingSizeGuide?: string; selectionNotes?: string; expectedSelectionNotes?: string }>;
  if (!Array.isArray(manifest) || manifest.length !== 23 || new Set(manifest.map((row) => row.slug)).size !== manifest.length) throw new Error('尺码核查清单必须为已核实的二十三个独立型号');
  const seeds = manifest.map((entry) => {
    if (!/^(nitro-[a-z0-9-]+-2027|salomon-[a-z0-9-]+-2026|burton-cartel-re-flex-2027|flow-fuse(-hybrid)?-binding-2026|jones-(mercury|orion)-binding-2026|decathlon-snb-500-binding-2026)$/.test(entry.slug)) throw new Error('清单型号范围错误');
    const seed = productSeedSchema.parse(parse(readFileSync(join(dataDir, 'snowboard-binding', `${entry.slug}.yaml`), 'utf8')));
    if (seed.category !== 'snowboard-binding' || canonical(seed.specs.sizeChart) !== canonical(entry.rows) || seed.specs.sizeChartSource !== entry.url || seed.specs.sizeChartCheckedAt !== entry.checkedAt) throw new Error(`清单与产品不一致：${entry.slug}`);
    if (entry.bindingSizeGuide !== undefined && seed.specs.bindingSizeGuide !== entry.bindingSizeGuide) throw new Error(`尺码说明与清单不一致：${entry.slug}`);
    if (entry.selectionNotes !== undefined && seed.specs.selectionNotes !== entry.selectionNotes) throw new Error(`选码说明与清单不一致：${entry.slug}`);
    return seed;
  });
  const categorySeed = (parse(readFileSync(join(dataDir, 'categories.yaml'), 'utf8')) as unknown[]).map((value) => categorySeedSchema.parse(value)).find((category) => category.slug === 'snowboard-binding');
  if (!categorySeed?.spec_schema) throw new Error('固定器模板缺失');
  const definitions = parseSpecSchema(categorySeed.spec_schema).fields.filter((field) => ['sizeChartCheckedAt', 'sizeChartSource'].includes(field.key));
  if (definitions.length !== 2) throw new Error('尺码元数据字段缺失');
  const prisma = new PrismaService();
  try {
    await prisma.$transaction(async (tx) => {
      const category = await tx.category.findUniqueOrThrow({ where: { slug: 'snowboard-binding' } });
      const schema = parseSpecSchema(category.specSchema);
      const nextSchema = { ...schema, fields: [...schema.fields] };
      for (const field of definitions) {
        const existing = nextSchema.fields.find((candidate) => candidate.key === field.key);
        if (existing && existing.type !== 'text') throw new Error(`线上字段类型冲突：${field.key}`);
        if (!existing) nextSchema.fields.push(field);
      }
      const changes: Array<{ id: string; slug: string; specs: Record<string, unknown> }> = [];
      for (const seed of seeds) {
        const entry = manifest.find((row) => row.slug === seed.slug);
        if (!entry) throw new Error(`尺码核查清单缺少型号：${seed.slug}`);
        const live = await tx.product.findUniqueOrThrow({ where: { slug: seed.slug }, include: { brand: true } });
        if (live.categoryId !== category.id || live.brand.slug !== seed.brand || live.model !== seed.model || live.year !== seed.year) throw new Error(`线上产品身份不符：${seed.slug}`);
        const current = live.specs as Record<string, unknown>;
        if (Array.isArray(current.sizeChart) && current.sizeChart.length && canonical(current.sizeChart) !== canonical(seed.specs.sizeChart)) throw new Error(`线上已有不同尺码表，请人工核对：${seed.slug}`);
        if (entry.expectedBindingSizeGuide !== undefined && current.bindingSizeGuide !== entry.expectedBindingSizeGuide && current.bindingSizeGuide !== seed.specs.bindingSizeGuide) throw new Error(`线上尺码说明已被修改，请人工核对：${seed.slug}`);
        if (entry.expectedSelectionNotes !== undefined && current.selectionNotes !== entry.expectedSelectionNotes && current.selectionNotes !== seed.specs.selectionNotes) throw new Error(`线上选码说明已被修改，请人工核对：${seed.slug}`);
        const specs: Record<string, unknown> = { ...current, sizeChart: seed.specs.sizeChart, sizeChartSource: seed.specs.sizeChartSource, sizeChartCheckedAt: seed.specs.sizeChartCheckedAt };
        if (entry.bindingSizeGuide !== undefined) specs.bindingSizeGuide = seed.specs.bindingSizeGuide;
        if (entry.selectionNotes !== undefined) specs.selectionNotes = seed.specs.selectionNotes;
        const validation = validateSpecs(nextSchema, specs);
        if (!validation.ok) throw new Error(`${seed.slug}: ${JSON.stringify(validation.issues)}`);
        if (canonical(specs) !== canonical(current)) changes.push({ id: live.id, slug: live.slug, specs });
      }
      console.log(JSON.stringify({ mode: apply ? 'apply' : 'preview', checked: seeds.length, changed: changes.map((change) => change.slug) }));
      if (!apply) return;
      if (canonical(schema) !== canonical(nextSchema)) await tx.category.update({ where: { id: category.id }, data: { specSchema: toJsonInput(nextSchema) } });
      for (const change of changes) {
        await tx.product.update({ where: { id: change.id }, data: { specs: toJsonInput(change.specs) } });
        const fields = ['sizeChart', 'sizeChartSource', 'sizeChartCheckedAt', ...(manifest.find((entry) => entry.slug === change.slug)?.bindingSizeGuide !== undefined ? ['bindingSizeGuide'] : []), ...(manifest.find((entry) => entry.slug === change.slug)?.selectionNotes !== undefined ? ['selectionNotes'] : [])];
        await tx.outboxEvent.create({ data: { aggregate: 'product', aggregateId: change.id, type: 'product.updated', payload: { reason: 'binding.size-chart-sync', fields } } });
      }
    }, { isolationLevel: 'Serializable', timeout: 60000 });
  } finally { await prisma.$disconnect(); }
}

function canonical(value: unknown): string {
  return JSON.stringify(value, (_, item) => item && typeof item === 'object' && !Array.isArray(item)
    ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b))) : item);
}

main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });
