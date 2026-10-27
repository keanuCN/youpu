\set ON_ERROR_STOP on
BEGIN;
DO $$
DECLARE changed integer;
BEGIN
  UPDATE product AS p
  SET year = 2027,
      title = 'Armada ARV 112 2026/27',
      one_liner = '112 mm 腰宽的粉雪自由式板；Freestyle Rocker、Poplar Core、Ash Binding Insert 与 W3DGEWALL，保留摇臂板头板尾和脚下正拱。',
      price_min = 6334.72,
      price_max = 6334.72,
      price_currency = 'CNY',
      specs = p.specs || jsonb_build_object(
        'weightBasis', 'Armada 官网 185 cm 单只 2020 g；该数字为重量，不是产品年份。',
        'geometryNotes', '官方商品页列出各长度均为 135-112-130 mm；逐长度转弯半径见尺寸信息。',
        'seasonEvidence', 'Armada 26/27 产品目录列出 ARV 112 货号 RA0000756+；此前将 185 cm 重量 2020 g 误判为年份，已更正。保留原地址以兼容已有链接。',
        'sourceCheckedAt', '2026-10-27',
        'priceCheckedAt', '2026-10-27',
        'priceMarket', 'Armada 美国官方商城',
        'priceSource', 'https://www.armadasnow.com/en-us/products/arv-112-ra0651-202600',
        'exchangeRateSource', 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html',
        'priceStatus', '美国官网挂牌 USD 950（不含税）；按 ECB 2026-10-26 EUR/USD 1.1188、EUR/CNY 7.4603 换算约 CNY 6334.72，仅为海外挂牌价折算，不是中国售价或成交价，未含税费和运费。'
      ), updated_at = now()
  FROM brand b
  WHERE p.brand_id = b.id AND b.slug = 'armada' AND p.slug = 'armada-arv-112-2020'
    AND p.model = 'ARV 112' AND p.year = 2020;
  GET DIAGNOSTICS changed = ROW_COUNT;
  IF changed <> 1 THEN RAISE EXCEPTION 'Armada 数据校正目标不符合预期（匹配 % 行）', changed; END IF;
  UPDATE product_image SET alt = 'Armada ARV 112 2026/27 雪板商品图'
  WHERE product_id = (SELECT id FROM product WHERE slug = 'armada-arv-112-2020')
    AND alt = 'Armada ARV 112 2019/20 雪板商品图';
END $$;
COMMIT;
