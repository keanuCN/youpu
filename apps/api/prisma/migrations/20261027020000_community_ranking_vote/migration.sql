CREATE TABLE community_ranking_vote (
  category_slug text NOT NULL,
  rank_key text NOT NULL,
  season text NOT NULL,
  account_id uuid NOT NULL REFERENCES account(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  changed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (category_slug, rank_key, season, account_id)
);
CREATE INDEX community_ranking_vote_totals_idx ON community_ranking_vote (category_slug, rank_key, season, product_id);
