\set ON_ERROR_STOP on
BEGIN;
WITH first_image AS (
  SELECT DISTINCT ON (product_id) product_id, url
  FROM product_image
  WHERE url IS NOT NULL AND btrim(url) <> ''
  ORDER BY product_id, sort_order, id
), updated AS (
  UPDATE product AS p
  SET cover_url = i.url, updated_at = now()
  FROM first_image AS i
  WHERE p.id = i.product_id AND p.status = 'published' AND p.cover_url IS NULL
  RETURNING p.id
)
SELECT count(*) AS covers_backfilled FROM updated;
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM product AS p
    WHERE p.status = 'published' AND p.cover_url IS NULL
      AND EXISTS (SELECT 1 FROM product_image AS i
                  WHERE i.product_id = p.id AND i.url IS NOT NULL AND btrim(i.url) <> '')
  ) THEN
    RAISE EXCEPTION '已上架商品存在可用图片但封面为空';
  END IF;
END $$;
COMMIT;
