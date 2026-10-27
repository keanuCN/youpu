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
COMMIT;
