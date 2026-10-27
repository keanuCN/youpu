ALTER TABLE event ADD COLUMN region text NOT NULL DEFAULT '未知';
CREATE INDEX idx_event_region_created_at ON event(region, created_at DESC);
