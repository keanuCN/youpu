import { z } from 'zod';
import { riderProfileSchema } from './survey';

export const ratingInputSchema = z
  .object({
    overall: z.number().min(1).max(5),
    sub: z.record(z.string(), z.number().min(0).max(10)).default({}),
    content: z.string().trim().max(2000).nullable().optional(),
    riderProfile: riderProfileSchema.partial().default({}),
  })
  .strict();
export type RatingInput = z.infer<typeof ratingInputSchema>;

export const replyInputSchema = z
  .object({
    content: z.string().trim().min(2).max(2000),
    replyTo: z.string().uuid().nullable().optional(),
  })
  .strict();
export type ReplyInput = z.infer<typeof replyInputSchema>;

export const reportInputSchema = z
  .object({
    targetType: z.enum(['rating', 'reply']),
    targetId: z.string().uuid(),
    reason: z.string().trim().min(2).max(64),
    note: z.string().trim().max(500).nullable().optional(),
  })
  .strict();
export type ReportInput = z.infer<typeof reportInputSchema>;

export const recommendationInputSchema = z
  .object({
    categorySlug: z.string().min(1).default('snowboard'),
    answers: z
      .object({
        level: z.string().optional(),
        scene: z.array(z.string()).optional(),
        weight: z.string().optional(),
        budget: z.string().optional(),
        flex: z.string().optional(),
        priority: z.string().optional(),
      })
      .strict(),
  })
  .strict();
export type RecommendationInput = z.infer<typeof recommendationInputSchema>;

export const notificationReadSchema = z.object({ read: z.boolean().default(true) }).strict();
export type NotificationReadInput = z.infer<typeof notificationReadSchema>;

export const moderationRiskSchema = z.enum(['clear', 'watch']);
export type ModerationRisk = z.infer<typeof moderationRiskSchema>;

export const ratingListQuerySchema = z.object({
  sort: z.enum(['helpful', 'latest', 'similar']).default('helpful'),
  profile: z.enum(['all', 'complete']).default('all'),
  level: riderProfileSchema.shape.level.optional(),
}).strict();
export type RatingListQueryInput = z.infer<typeof ratingListQuerySchema>;
