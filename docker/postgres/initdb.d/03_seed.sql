-- ============================================================
-- 03_seed.sql — Sample data for development
-- ============================================================

INSERT INTO public.deals (title, price, currency, ticket, yield_percent, sold_percent, days_left, image_url, description)
VALUES
  ('Marina Torch Tower',   1850000, 'Dhs', 250000, 8.5,  72, 45, '/images/marina-torch.jpg',  'Premium waterfront apartment in Dubai Marina with guaranteed rental yield.'),
  ('HHHR Tower',           2100000, 'Dhs', 300000, 7.8,  58, 60, '/images/hhhr-tower.jpg',    'Luxury residence in the heart of Sheikh Zayed Road.'),
  ('Ocean Peaks Residence', 950000, 'Dhs', 150000, 9.2,  85, 30, '/images/ocean-peaks.jpg',   'Affordable entry into Dubai's booming short-term rental market.'),
  ('Al Yaqoub Tower',      1400000, 'Dhs', 200000, 8.0,  40, 90, '/images/al-yaqoub.jpg',     'Commercial-grade investment with long-term tenant contracts.')
ON CONFLICT DO NOTHING;
