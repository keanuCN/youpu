-- 002：编辑分项评分独立成列
-- 背景：编辑评分（人工/后续 AI 产出）与社区评分（rating 表聚合 → rating_sub）语义不同，
--       不应混在 specs 里；综合指数由 rating_dimensions 权重实时算出，不落库。
ALTER TABLE product ADD COLUMN editorial_scores jsonb;

COMMENT ON COLUMN product.editorial_scores IS
  '编辑分项评分 {stability:8.5,...}，键与 category.spec_schema.rating_dimensions[].key 对齐；综合指数=Σ(分×权重)/Σ权重×10，实时计算';
