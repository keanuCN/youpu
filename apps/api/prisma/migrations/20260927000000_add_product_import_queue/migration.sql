CREATE TABLE IF NOT EXISTS product_import (
  id uuid PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('new', 'update')),
  slug text NOT NULL,
  product jsonb NOT NULL,
  changes jsonb NOT NULL DEFAULT '[]'::jsonb,
  ignored_changes jsonb NOT NULL DEFAULT '[]'::jsonb,
  origin_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_by uuid REFERENCES account(id) ON DELETE SET NULL,
  reviewed_by uuid REFERENCES account(id) ON DELETE SET NULL,
  review_note text,
  created_at timestamptz(6) NOT NULL DEFAULT now(),
  reviewed_at timestamptz(6)
);

CREATE INDEX IF NOT EXISTS product_import_status_created_at_idx
  ON product_import (status, created_at DESC);

CREATE INDEX IF NOT EXISTS product_import_slug_status_idx
  ON product_import (slug, status);

CREATE UNIQUE INDEX IF NOT EXISTS product_import_one_pending_slug_idx
  ON product_import (slug)
  WHERE status = 'pending';
