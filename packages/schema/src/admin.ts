import { z } from 'zod';
import { imageKindSchema } from './seed';

const slugSchema = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug 需为 kebab-case');

export const adminRoleSchema = z.enum(['editor', 'admin']);
export type AdminRole = z.infer<typeof adminRoleSchema>;

export const adminAccountRoleSchema = z.enum(['user', 'editor', 'admin']);
export type AdminAccountRole = z.infer<typeof adminAccountRoleSchema>;

export const adminAccountStatusSchema = z.enum(['active', 'pending', 'disabled']);
export type AdminAccountStatus = z.infer<typeof adminAccountStatusSchema>;

export const adminAccountPatchSchema = z
  .object({
    role: adminAccountRoleSchema.optional(),
    status: adminAccountStatusSchema.optional(),
  })
  .strict();
export type AdminAccountPatch = z.infer<typeof adminAccountPatchSchema>;

export const adminProductImageSchema = z
  .object({
    url: z.string().url(),
    kind: imageKindSchema,
    alt: z.string().max(256).nullable().optional(),
    source: z.string().max(256).nullable().optional(),
    sortOrder: z.number().int().default(0),
  })
  .strict();
export type AdminProductImage = z.infer<typeof adminProductImageSchema>;

const adminDataSourceSchema = z
  .object({
    kind: z.enum(['official', 'manual', 'crawl']),
    originUrl: z.string().url().optional(),
    snapshotUrl: z.string().url().optional(),
  })
  .strict();

/** 管理端产品表单契约，使用 camelCase 对齐 API DTO；specs 仍由类目 schema 约束。 */
export const adminProductInputSchema = z
  .object({
    slug: slugSchema,
    categorySlug: z.string().min(1),
    brandSlug: z.string().min(1),
    model: z.string().min(1),
    year: z.number().int().min(2000).max(2100),
    title: z.string().min(1),
    oneLiner: z.string().max(200).nullable().optional(),
    priceMin: z.number().min(0).nullable().optional(),
    priceMax: z.number().min(0).nullable().optional(),
    priceCurrency: z.string().length(3).default('CNY'),
    coverUrl: z.string().url().nullable().optional(),
    specs: z.record(z.string(), z.unknown()).default({}),
    editorialScores: z.record(z.string(), z.number().min(0).max(10)).nullable().optional(),
    images: z.array(adminProductImageSchema).default([]),
    dataSource: adminDataSourceSchema.nullable().optional(),
    status: z.enum(['draft', 'published']).default('draft'),
  })
  .strict();
export type AdminProductInput = z.infer<typeof adminProductInputSchema>;

export const adminProductPatchSchema = adminProductInputSchema.partial().strict();
export type AdminProductPatch = z.infer<typeof adminProductPatchSchema>;

export const adminBrandInputSchema = z
  .object({
    slug: slugSchema,
    name: z.string().min(1),
    nameCn: z.string().nullable().optional(),
    country: z.string().max(8).nullable().optional(),
    logoUrl: z.string().url().nullable().optional(),
    officialUrl: z.string().url().nullable().optional(),
    description: z.string().nullable().optional(),
    status: z.enum(['active', 'inactive']).default('active'),
  })
  .strict();
export type AdminBrandInput = z.infer<typeof adminBrandInputSchema>;

export const adminBrandPatchSchema = adminBrandInputSchema.partial().strict();
export type AdminBrandPatch = z.infer<typeof adminBrandPatchSchema>;

export const adminCategoryInputSchema = z
  .object({
    slug: slugSchema,
    name: z.string().min(1),
    parentId: z.string().uuid().nullable().optional(),
    sortOrder: z.number().int().default(0),
    coverUrl: z.string().url().nullable().optional(),
    specSchema: z.unknown().nullable().optional(),
    recommendConfig: z.unknown().nullable().optional(),
    status: z.enum(['active', 'inactive']).default('active'),
  })
  .strict();
export type AdminCategoryInput = z.infer<typeof adminCategoryInputSchema>;

export const adminCategoryPatchSchema = adminCategoryInputSchema.partial().strict();
export type AdminCategoryPatch = z.infer<typeof adminCategoryPatchSchema>;

export const adminModerationPatchSchema = z
  .object({
    status: z.enum(['open', 'resolved', 'dismissed']).optional(),
  })
  .strict();
export type AdminModerationPatch = z.infer<typeof adminModerationPatchSchema>;

export const adminRatingModerationPatchSchema = z
  .object({
    status: z.enum(['published', 'hidden', 'rejected']).optional(),
  })
  .strict();
export type AdminRatingModerationPatch = z.infer<typeof adminRatingModerationPatchSchema>;
