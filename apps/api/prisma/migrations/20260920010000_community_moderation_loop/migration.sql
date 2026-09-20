ALTER TABLE rating
  ADD COLUMN IF NOT EXISTS moderation_risk text NOT NULL DEFAULT 'clear',
  ADD COLUMN IF NOT EXISTS moderation_reasons jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS moderation_checked_at timestamptz(6);

ALTER TABLE rating_reply
  ADD COLUMN IF NOT EXISTS moderation_risk text NOT NULL DEFAULT 'clear',
  ADD COLUMN IF NOT EXISTS moderation_reasons jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS moderation_checked_at timestamptz(6);

ALTER TABLE report
  ADD COLUMN IF NOT EXISTS handled_at timestamptz(6);

ALTER TABLE notification
  ADD COLUMN IF NOT EXISTS source_event_id bigint;

CREATE UNIQUE INDEX IF NOT EXISTS notification_source_event_id_key
  ON notification (source_event_id)
  WHERE source_event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS rating_product_status_created_at_idx
  ON rating (product_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS rating_reply_rating_status_created_at_idx
  ON rating_reply (rating_id, status, created_at ASC);

CREATE INDEX IF NOT EXISTS report_status_created_at_idx
  ON report (status, created_at DESC);

CREATE INDEX IF NOT EXISTS notification_account_read_created_at_idx
  ON notification (account_id, read_at, created_at DESC);
