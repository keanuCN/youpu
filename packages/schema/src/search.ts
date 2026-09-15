import { z } from 'zod';
import { productListItemSchema } from './api';

export const searchSortSchema = z.enum(['relevance', 'new', 'rating']);
export type SearchSort = z.infer<typeof searchSortSchema>;

export const searchFacetSchema = z.object({
  categories: z.array(z.object({
    slug: z.string(),
    name: z.string(),
    count: z.number().int().nonnegative(),
  })),
  brands: z.array(z.object({
    slug: z.string(),
    name: z.string(),
    nameCn: z.string().nullable(),
    count: z.number().int().nonnegative(),
  })),
  years: z.array(z.object({
    value: z.number().int(),
    count: z.number().int().nonnegative(),
  })),
  price: z.object({
    min: z.number().nullable(),
    max: z.number().nullable(),
  }),
});
export type SearchFacet = z.infer<typeof searchFacetSchema>;

export const searchResponseSchema = z.object({
  query: z.string(),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive().max(48),
  sort: searchSortSchema,
  items: z.array(productListItemSchema),
  facets: searchFacetSchema,
});
export type SearchResponse = z.infer<typeof searchResponseSchema>;
