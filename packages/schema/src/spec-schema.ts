import { z } from 'zod';

/**
 * 类目 spec_schema 契约 —— 全站唯一来源。
 * 术语对齐 PIM：fields ≈ Attribute，options ≈ Attribute Options，本文件即 "Family" 的字段集。
 * 消费方：seed 导入校验 / 后台动态表单 / 前端筛选与对比列渲染 —— 同一份定义，零重复实现。
 */

export const specFieldTypeSchema = z.enum([
  'int',
  'number',
  'enum',
  'enum[]',
  'nested',
  'text',
  'bool',
]);
export type SpecFieldType = z.infer<typeof specFieldTypeSchema>;

/** 枚举项支持简写字符串或 {value,label}；解析时即归一化为 label 形式 */
const optionInputSchema = z
  .union([z.string(), z.object({ value: z.string(), label: z.string() })])
  .transform((o) => (typeof o === 'string' ? { value: o, label: o } : o));
export type SpecOption = { value: string; label: string };

/** nested 行内字段：简写 "number" 或 {type, label}；解析后统一为对象 */
const itemFieldSchema = z
  .union([z.enum(['number', 'text']), z.object({ type: z.enum(['number', 'text']), label: z.string() })])
  .transform((v): SpecItemField => (typeof v === 'string' ? { type: v } : v));
export type SpecItemField = { type: 'number' | 'text'; label?: string };

export const specFieldSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  /** 分组展示（PIM 的 Attribute Group）：值相同者归为一组渲染 */
  group: z.string().default("其他"),
  type: specFieldTypeSchema,
  unit: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  options: z.array(optionInputSchema).optional(),
  /** type=nested 时：行内字段 → 基础类型（或 {type,label} 带列头中文名） */
  itemSchema: z.record(z.string(), itemFieldSchema).optional(),
  /** false=不参与筛选；range=数值区间；multi/single=枚举 */
  filter: z.union([z.literal(false), z.enum(['range', 'multi', 'single'])]).default(false),
  compare: z.boolean().default(true),
  /** 对比表差异标注方向：higher-better 越高越好 / lower-better / neutral 中性差异 / context 需结合场景 */
  compareDirection: z
    .enum(['higher-better', 'lower-better', 'neutral', 'context'])
    .default('neutral'),
  /** 数值型差异判定阈值（相对差），对比页「差异」高亮用；默认 0.05 */
  diffThreshold: z.number().min(0).max(1).optional(),
  required: z.boolean().default(false),
  /** 展示顺序（升序） */
  order: z.number().default(0),
  help: z.string().optional(),
});
export type SpecField = z.infer<typeof specFieldSchema>;

export const ratingDimensionSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  /** 综合指数加权权重（同组内合计 1） */
  weight: z.number().min(0).max(1).optional(),
});

export const insightRuleSchema = z.object({
  id: z.string().min(1),
  /** 触发条件表达式（洞察引擎解释，M3） */
  when: z.string().min(1),
  /** 文案模板，{key} 占位符引用 specs 字段 */
  template: z.string().min(1),
});

export const specSchemaSchema = z.object({
  fields: z.array(specFieldSchema).min(1),
  /** 评分分项维度（rating.sub 的校验来源） */
  rating_dimensions: z.array(ratingDimensionSchema).optional(),
  /** 客观分析洞察规则 */
  insights: z.array(insightRuleSchema).optional(),
});
export type SpecSchema = z.infer<typeof specSchemaSchema>;

/** 传入 DB 里的原始 jsonb，得到补齐默认值、options/itemSchema 归一化后的 schema */
export function parseSpecSchema(raw: unknown): SpecSchema {
  const parsed = specSchemaSchema.parse(raw);
  return {
    ...parsed,
    fields: [...parsed.fields].sort((a, b) => a.order - b.order),
  };
}

export function safeParseSpecSchema(raw: unknown) {
  const result = specSchemaSchema.safeParse(raw);
  if (!result.success) return result;
  return { success: true as const, data: parseSpecSchema(result.data) };
}

export function getFilterableFields(schema: SpecSchema): SpecField[] {
  return schema.fields.filter((f) => f.filter !== false);
}

export function getComparableFields(schema: SpecSchema): SpecField[] {
  return schema.fields.filter((f) => f.compare);
}

export function findField(schema: SpecSchema, key: string): SpecField | undefined {
  return schema.fields.find((f) => f.key === key);
}

export function optionLabel(field: SpecField, value: string): string {
  return field.options?.find((o) => o.value === value)?.label ?? value;
}

/** 单值 → 人类可读展示（详情页参数表、对比表格共用） */
export function formatSpecValue(field: SpecField, value: unknown): string {
  if (value === undefined || value === null || value === '') return '—';
  switch (field.type) {
    case 'int':
    case 'number': {
      if (typeof value !== 'number') return String(value);
      const display = field.type === 'int' ? String(value) : trimNumber(value);
      return field.unit ? `${display}${field.unit}` : display;
    }
    case 'enum':
      return optionLabel(field, String(value));
    case 'enum[]':
      return Array.isArray(value) ? value.map((v) => optionLabel(field, String(v))).join(' · ') : String(value);
    case 'nested': {
      if (!Array.isArray(value)) return String(value);
      return `${value.length} 档`;
    }
    case 'bool':
      return value ? '是' : '否';
    default:
      return String(value);
  }
}

function trimNumber(n: number): string {
  if (Number.isInteger(n)) return String(n);
  const decimalPlaces = Math.max(2, Math.min(12, 2 - Math.floor(Math.log10(Math.abs(n)))));
  return String(Number(n.toFixed(decimalPlaces)));
}

export type SpecValidationIssue = { path: string; message: string };

export interface SpecValidationResult {
  ok: boolean;
  issues: SpecValidationIssue[];
}

export interface ValidateSpecsOptions {
  /** true 时：声明 required 的字段才强制存在（部分录入场景） */
  partial?: boolean;
}

/** 产品 specs（jsonb）对类目 spec_schema 的校验 —— 数据质量的最后闸门 */
export function validateSpecs(
  schema: SpecSchema,
  specs: Record<string, unknown>,
  options: ValidateSpecsOptions = {},
): SpecValidationResult {
  const issues: SpecValidationIssue[] = [];

  for (const key of Object.keys(specs)) {
    if (!findField(schema, key)) {
      issues.push({ path: key, message: `spec_schema 未声明字段 "${key}"` });
    }
  }

  for (const field of schema.fields) {
    const value = specs[field.key];
    const missing = value === undefined || value === null || value === '';
    if (missing) {
      if (field.required && !options.partial) {
        issues.push({ path: field.key, message: `必填字段 "${field.label}" 缺失` });
      }
      continue;
    }
    validateField(field, value, issues);
  }

  return { ok: issues.length === 0, issues };
}

function validateField(field: SpecField, value: unknown, issues: SpecValidationIssue[]): void {
  const fail = (message: string): void => {
    issues.push({ path: field.key, message });
  };
  switch (field.type) {
    case 'int': {
      if (typeof value !== 'number' || !Number.isInteger(value)) return fail(`${field.label} 应为整数`);
      checkRange(field, value, fail);
      return;
    }
    case 'number': {
      if (typeof value !== 'number' || !Number.isFinite(value)) return fail(`${field.label} 应为数字`);
      checkRange(field, value, fail);
      return;
    }
    case 'enum': {
      const allowed = field.options?.map((o) => o.value) ?? [];
      if (typeof value !== 'string' || !allowed.includes(value)) {
        return fail(`${field.label} 取值 "${String(value)}" 不在允许列表 [${allowed.join(', ')}] 内`);
      }
      return;
    }
    case 'enum[]': {
      if (!Array.isArray(value)) return fail(`${field.label} 应为数组`);
      const allowed = field.options?.map((o) => o.value) ?? [];
      for (const v of value) {
        if (typeof v !== 'string' || !allowed.includes(v)) {
          fail(`${field.label} 含非法取值 "${String(v)}"`);
        }
      }
      return;
    }
    case 'nested': {
      if (!Array.isArray(value)) return fail(`${field.label} 应为行数组`);
      const itemSchema = field.itemSchema ?? {};
      value.forEach((row, i) => {
        if (typeof row !== 'object' || row === null) {
          return issues.push({ path: `${field.key}[${i}]`, message: `${field.label} 第 ${i + 1} 行应为对象` });
        }
        for (const [rowKey, rowField] of Object.entries(itemSchema)) {
          const cell = (row as Record<string, unknown>)[rowKey];
          if (cell === undefined || cell === null) continue;
          if (rowField.type === 'number' && typeof cell !== 'number') {
            issues.push({ path: `${field.key}[${i}].${rowKey}`, message: `应为数字` });
          }
          if (rowField.type === 'text' && typeof cell !== 'string') {
            issues.push({ path: `${field.key}[${i}].${rowKey}`, message: `应为文本` });
          }
        }
      });
      return;
    }
    case 'bool': {
      if (typeof value !== 'boolean') return fail(`${field.label} 应为布尔值`);
      return;
    }
    default: {
      if (typeof value !== 'string') return fail(`${field.label} 应为文本`);
    }
  }
}

function checkRange(field: SpecField, value: number, fail: (msg: string) => void): void {
  if (field.min !== undefined && value < field.min) fail(`${field.label} 不能小于 ${field.min}`);
  if (field.max !== undefined && value > field.max) fail(`${field.label} 不能大于 ${field.max}`);
}

/**
 * 综合指数（0–100，一位小数）= Σ(编辑分项评分 × 权重) / Σ权重 × 10。
 * 计算值不落库 —— 权重改动后无需回填数据。
 */
export function computeComposite(
  schema: SpecSchema,
  editorialScores: Record<string, unknown> | null | undefined,
): number | null {
  const dims = schema.rating_dimensions ?? [];
  if (!editorialScores || dims.length === 0) return null;
  let sum = 0;
  let weightSum = 0;
  for (const dim of dims) {
    const value = editorialScores[dim.key];
    if (typeof value !== 'number' || !Number.isFinite(value)) continue;
    const weight = dim.weight ?? 1 / dims.length;
    sum += value * weight;
    weightSum += weight;
  }
  if (weightSum === 0) return null;
  return Math.round((sum / weightSum) * 10 * 10) / 10;
}
