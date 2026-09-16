import { z } from 'zod';

/** 推荐问卷（技术方案 §6：问卷模式与 AI 对话模式最终都规约成这份 JSON） */

export const ridingLevelSchema = z.enum(['beginner', 'intermediate', 'advanced', 'expert']);
export type RidingLevel = z.infer<typeof ridingLevelSchema>;

export const terrainSchema = z.enum(['all-mountain', 'park', 'carving', 'powder', 'beginner']);
export type Terrain = z.infer<typeof terrainSchema>;

export const surveySchema = z.object({
  height: z.number().int().min(100).max(230).describe('身高 cm'),
  weight: z.number().int().min(20).max(200).describe('体重 kg'),
  level: ridingLevelSchema,
  terrain: z.array(terrainSchema).min(1).max(5),
  budget: z
    .object({ min: z.number().min(0).optional(), max: z.number().min(0).optional() })
    .optional(),
  boot_size: z.number().min(30).max(55).optional().describe('鞋码 EU'),
  home_resort: z.string().max(64).optional().describe('常去雪场'),
});
export type Survey = z.infer<typeof surveySchema>;

/** rider_profile（user.rider_profile / rating.rider_profile 快照） */
export const riderProfileSchema = z.object({
  years: z.number().int().min(0).max(80).optional().describe('雪龄 年'),
  height: z.number().int().min(100).max(230).optional(),
  weight: z.number().int().min(20).max(200).optional(),
  level: ridingLevelSchema.optional(),
  boot_size: z.number().min(30).max(55).optional(),
  home_resort: z.string().max(64).optional(),
});
export type RiderProfile = z.infer<typeof riderProfileSchema>;
