-- M3 本地闭环：账号密码摘要与问卷推荐结果
ALTER TABLE account ADD COLUMN password_hash text;

CREATE TABLE recommendation_run (
    id           uuid PRIMARY KEY,
    account_id   uuid NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    category_slug text NOT NULL,
    answers      jsonb NOT NULL DEFAULT '{}',
    picks        jsonb NOT NULL DEFAULT '[]',
    created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_recommendation_account ON recommendation_run(account_id, created_at DESC);
