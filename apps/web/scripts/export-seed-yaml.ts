import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { stringify as toYaml } from 'yaml';
import { GEAR } from '@/data/boards';
import type { GearItem } from '@/types';

/**
 * 一次性迁移工具：把原型内容包（src/data）导出为 data/snowboard/*.yaml（seed 导入格式）。
 * 用法：pnpm --filter @youpu/web export:seed   （在 apps/web 目录下执行）
 * 定位：M2「内容层接 API」的铺路——原型数据先变成可入库的 YAML，之后由 seed 管线进 PG；
 *       内容完全入库后本脚本即可删除。
 *
 * 导出范围（DB 有对应归属的字段）：规格参数、适用场景、编辑分项评分、价格、图集、一句话点评。
 * 不导出（无归属，见 docs/M2-内容层接API准备.md 缺口清单）：
 *   编辑结论文案（M3 客观分析）、whoFor 标签、热度、评分分布、同类价格区间。
 */

const BRAND_SLUG: Record<string, string> = {
  Burton: 'burton',
  Jones: 'jones',
  Capita: 'capita',
  Salomon: 'salomon',
  'Lib Tech': 'lib-tech',
  GNU: 'gnu',
  'Never Summer': 'never-summer',
  'Korua Shapes': 'korua-shapes',
  Bataleon: 'bataleon',
  Ride: 'ride',
  Arbor: 'arbor',
  Nitro: 'nitro',
};

/** 图集 kind 映射：原型的镜头语义 → product_image.kind */
const SHOT_KIND: { match: string; kind: string }[] = [
  { match: '底面', kind: 'base' },
  { match: '板面', kind: 'face' },
  { match: '细节', kind: 'side' },
  { match: '实地', kind: 'field' },
];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function productSlug(g: GearItem): string {
  return `${slugify(g.brand)}-${slugify(g.model)}-${g.year}`;
}

function toSeed(g: GearItem, index: number) {
  const brandSlug = BRAND_SLUG[g.brand];
  if (!brandSlug) throw new Error(`未知品牌：${g.brand}（请先在 data/brands.yaml 建档）`);

  // 原型的 specs 把「官方参考价 / 年款」也当作参数行，本模型中它们是产品列，导出时剔除
  const { price: _price, year: _year, ...specFields } = g.specs;

  const images = g.gallery.map((shot, i) => {
    const kind = SHOT_KIND.find((k) => shot.label.includes(k.match))?.kind ?? 'side';
    return { url: shot.url, kind, alt: `${g.brand} ${g.model} ${shot.label}`, source: '原型素材（AI 生成占位图，上架前替换为实拍/官方图）', sort_order: i };
  });

  return {
    slug: productSlug(g),
    category: 'snowboard',
    brand: brandSlug,
    model: g.model,
    year: g.year,
    title: `${g.brand} ${g.model} ${g.year}`,
    // 原型没有独立的一句话点评字段，用编辑结论（M2 起由后台维护独立文案）
    one_liner: g.analysis.verdict.slice(0, 200),
    price: { min: g.price, max: g.price, currency: 'CNY' },
    specs: {
      ...specFields,
      // GearItem 级字段归入 specs
      scenes: g.scenes,
    },
    // 编辑分项评分独立成列（维度键与 rating_dimensions 对齐）
    editorial_scores: {
      stability: g.scores.stability ?? null,
      response: g.scores.response ?? null,
      float: g.scores.float ?? null,
      park: g.scores.park ?? null,
      forgiveness: g.scores.forgiveness ?? null,
      value: g.scores.value ?? null,
    },
    images,
    status: 'published' as const,
    // 保留来源线索，便于回查原型
    _source_index: index,
  };
}

function main(): void {
  const outDir = resolve(process.cwd(), '../../data/snowboard');
  mkdirSync(outDir, { recursive: true });
  let count = 0;
  for (const [i, gear] of GEAR.entries()) {
    const seed = toSeed(gear, i);
    const { _source_index: _drop, ...payload } = seed;
    const header = [
      `# 由 apps/web/scripts/export-seed-yaml.ts 从原型内容包导出（勿手改，改原型后重跑）`,
      `# 原型 id：${gear.id} · 参数未经官网逐项校对，转入正式发布前需人工核对`,
      '',
    ].join('\n');
    writeFileSync(resolve(outDir, `${payload.slug}.yaml`), header + toYaml(payload, { lineWidth: 120 }), 'utf8');
    count += 1;
  }
  console.log(`已导出 ${count} 个产品 YAML 到 ${outDir}`);
  console.log(`其中品牌：${[...new Set(GEAR.map((g) => BRAND_SLUG[g.brand]))].join(', ')}`);
  console.log('板型族判定（来源：内容包 specs.profileFamily，规则见 data/categories.ts profileFamilyOf；人工过目）：');
  for (const g of GEAR) {
    console.log(`  ${g.id}  ${String(g.specs.profileFamily).padEnd(6)} ← ${String(g.specs.profile ?? '')}`);
  }
}

main();
