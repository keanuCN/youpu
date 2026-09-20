DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM product
    WHERE price_currency NOT IN ('CNY', 'USD')
  ) THEN
    RAISE EXCEPTION 'product contains unsupported price currency';
  END IF;
END $$;

UPDATE product
SET price_min = CASE WHEN price_min IS NULL THEN NULL ELSE ROUND(price_min * 7.2) END,
    price_max = CASE WHEN price_max IS NULL THEN NULL ELSE ROUND(price_max * 7.2) END,
    price_currency = 'CNY'
WHERE price_currency = 'USD';

ALTER TABLE product
  DROP CONSTRAINT IF EXISTS product_price_currency_cny;

ALTER TABLE product
  ADD CONSTRAINT product_price_currency_cny CHECK (price_currency = 'CNY');
