-- 有谱 · 首批迁移 —— 对应《有谱-数据库表结构设计》v1.1 §2-§7 + §12 埋点表
-- 手写 SQL（非 prisma migrate dev 生成）：ltree / 分区表 / 部分索引 / 显式 sequence 为 Prisma 表达受限项

CREATE EXTENSION IF NOT EXISTS ltree;

-- 通用 updated_at 触发器
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────── §2 品类与产品域 ───────────────────────────

CREATE TABLE category (
    id               uuid PRIMARY KEY,
    parent_id        uuid REFERENCES category(id),
    slug             text NOT NULL UNIQUE,
    name             text NOT NULL,
    level            smallint NOT NULL,
    path             ltree,
    cover_url        text,
    sort_order       integer NOT NULL DEFAULT 0,
    spec_schema      jsonb,
    recommend_config jsonb,
    status           text NOT NULL DEFAULT 'active',
    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_category_path ON category USING gist(path);
CREATE TRIGGER trg_category_updated_at BEFORE UPDATE ON category
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE brand (
    id           uuid PRIMARY KEY,
    slug         text NOT NULL UNIQUE,
    name         text NOT NULL,
    name_cn      text,
    country      text,
    logo_url     text,
    official_url text,
    description  text,
    status       text NOT NULL DEFAULT 'active',
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_brand_updated_at BEFORE UPDATE ON brand
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE product (
    id             uuid PRIMARY KEY,
    category_id    uuid NOT NULL REFERENCES category(id),
    brand_id       uuid NOT NULL REFERENCES brand(id),
    slug           text NOT NULL UNIQUE,
    model          text NOT NULL,
    year           smallint NOT NULL,
    title          text NOT NULL,
    one_liner      text,
    price_min      numeric(10,2),
    price_max      numeric(10,2),
    price_currency char(3) NOT NULL DEFAULT 'CNY',
    cover_url      text,
    specs          jsonb NOT NULL DEFAULT '{}',
    rating_overall numeric(3,2),
    rating_count   integer NOT NULL DEFAULT 0,
    rating_sub     jsonb,
    favorite_count integer NOT NULL DEFAULT 0,
    status         text NOT NULL DEFAULT 'draft',
    data_source    text,
    published_at   timestamptz,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),
    UNIQUE (brand_id, model, year)
);
CREATE INDEX idx_product_cat_status ON product(category_id, status, year DESC);
CREATE INDEX idx_product_brand      ON product(brand_id);
CREATE INDEX idx_product_rating     ON product(rating_overall DESC NULLS LAST) WHERE status = 'published';
CREATE INDEX idx_product_price      ON product(price_min) WHERE status = 'published';
CREATE INDEX idx_product_specs_gin  ON product USING gin(specs jsonb_path_ops);
CREATE TRIGGER trg_product_updated_at BEFORE UPDATE ON product
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE product_image (
    id         uuid PRIMARY KEY,
    product_id uuid NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    url        text NOT NULL,
    kind       text NOT NULL,
    sort_order smallint NOT NULL DEFAULT 0,
    alt        text,
    source     text,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_image_product ON product_image(product_id, sort_order);

CREATE TABLE product_stat (
    product_id uuid PRIMARY KEY REFERENCES product(id) ON DELETE CASCADE,
    view_total integer NOT NULL DEFAULT 0,
    view_7d    integer NOT NULL DEFAULT 0,
    updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_product_stat_updated_at BEFORE UPDATE ON product_stat
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────── §3 用户与认证域 ───────────────────────────

CREATE TABLE account (
    id            uuid PRIMARY KEY,
    email         text UNIQUE,
    phone         text UNIQUE,
    nickname      text NOT NULL,
    avatar_url    text,
    rider_profile jsonb,
    role          text NOT NULL DEFAULT 'user',
    status        text NOT NULL DEFAULT 'pending',
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_account_updated_at BEFORE UPDATE ON account
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE refresh_token (
    id         uuid PRIMARY KEY,
    account_id uuid NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    token_hash text NOT NULL UNIQUE,
    user_agent text,
    ip         inet,
    expires_at timestamptz NOT NULL,
    revoked_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_rt_account ON refresh_token(account_id) WHERE revoked_at IS NULL;

CREATE TABLE audit_log (
    id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor_id   uuid NOT NULL REFERENCES account(id),
    action     text NOT NULL,
    entity     text NOT NULL,
    entity_id  uuid,
    before     jsonb,
    after      jsonb,
    ip         inet,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_entity ON audit_log(entity, entity_id, created_at DESC);
CREATE INDEX idx_audit_actor  ON audit_log(actor_id, created_at DESC);
CREATE INDEX idx_audit_time   ON audit_log(created_at DESC);

-- ─────────────────────────── §4 评分评论域 ───────────────────────────

CREATE TABLE rating (
    id            uuid PRIMARY KEY,
    product_id    uuid NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    account_id    uuid NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    overall       numeric(2,1) NOT NULL CHECK (overall BETWEEN 1 AND 5),
    sub           jsonb NOT NULL DEFAULT '{}',
    content       text,
    rider_profile jsonb NOT NULL DEFAULT '{}',
    source        text NOT NULL DEFAULT 'user',
    status        text NOT NULL DEFAULT 'published',
    helpful_count integer NOT NULL DEFAULT 0,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now(),
    UNIQUE (product_id, account_id)
);
CREATE INDEX idx_rating_product ON rating(product_id, status, helpful_count DESC, created_at DESC);
CREATE TRIGGER trg_rating_updated_at BEFORE UPDATE ON rating
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE rating_vote (
    rating_id  uuid REFERENCES rating(id) ON DELETE CASCADE,
    account_id uuid REFERENCES account(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (rating_id, account_id)
);

CREATE TABLE rating_reply (
    id         uuid PRIMARY KEY,
    rating_id  uuid NOT NULL REFERENCES rating(id) ON DELETE CASCADE,
    account_id uuid NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    reply_to   uuid REFERENCES account(id),
    content    text NOT NULL,
    status     text NOT NULL DEFAULT 'published',
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_reply_rating ON rating_reply(rating_id, created_at);

CREATE TABLE report (
    id          uuid PRIMARY KEY,
    target_type text NOT NULL,
    target_id   uuid NOT NULL,
    reporter_id uuid NOT NULL REFERENCES account(id),
    reason      text NOT NULL,
    note        text,
    status      text NOT NULL DEFAULT 'open',
    handled_by  uuid REFERENCES account(id),
    created_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (target_type, target_id, reporter_id)
);
CREATE INDEX idx_report_open ON report(status, created_at) WHERE status = 'open';

-- ─────────────────────────── §5 留存域 ───────────────────────────

CREATE TABLE favorite (
    account_id uuid REFERENCES account(id) ON DELETE CASCADE,
    product_id uuid REFERENCES product(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (account_id, product_id)
);
CREATE INDEX idx_fav_product ON favorite(product_id);

CREATE TABLE compare_history (
    id          uuid PRIMARY KEY,
    account_id  uuid NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    category_id uuid REFERENCES category(id),
    product_ids uuid[] NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_cmp_account ON compare_history(account_id, created_at DESC);

CREATE TABLE notification (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id  uuid NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    type        text NOT NULL,
    actor_id    uuid REFERENCES account(id),
    target_type text,
    target_id   uuid,
    payload     jsonb NOT NULL DEFAULT '{}',
    read_at     timestamptz,
    created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_notif_unread ON notification(account_id, created_at DESC) WHERE read_at IS NULL;

-- ─────────────────────────── §6 榜单域 ───────────────────────────

CREATE TABLE ranking (
    id           uuid PRIMARY KEY,
    category_id  uuid NOT NULL REFERENCES category(id),
    slug         text NOT NULL UNIQUE,
    title        text NOT NULL,
    description  text,
    method       text NOT NULL,
    season       text,
    cover_url    text,
    status       text NOT NULL DEFAULT 'draft',
    published_at timestamptz,
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_ranking_updated_at BEFORE UPDATE ON ranking
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE rank_entry (
    ranking_id uuid REFERENCES ranking(id) ON DELETE CASCADE,
    product_id uuid REFERENCES product(id) ON DELETE RESTRICT,
    position   smallint NOT NULL,
    score      numeric(6,2),
    note       text,
    PRIMARY KEY (ranking_id, product_id)
);

CREATE TABLE ranking_vote (
    ranking_id uuid REFERENCES ranking(id) ON DELETE CASCADE,
    account_id uuid REFERENCES account(id) ON DELETE CASCADE,
    product_id uuid REFERENCES product(id) ON DELETE RESTRICT,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (ranking_id, account_id, product_id)
);

-- ─────────────────────────── §7 数据管线域 ───────────────────────────

CREATE TABLE data_source (
    id           uuid PRIMARY KEY,
    brand_id     uuid REFERENCES brand(id),
    origin_url   text NOT NULL,
    kind         text NOT NULL,
    snapshot_url text,
    ingested_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE outbox_event (
    id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    aggregate    text NOT NULL,
    aggregate_id uuid NOT NULL,
    type         text NOT NULL,
    payload      jsonb NOT NULL DEFAULT '{}',
    processed_at timestamptz,
    attempts     smallint NOT NULL DEFAULT 0,
    created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_outbox_pending ON outbox_event(id) WHERE processed_at IS NULL;

CREATE TABLE config_rule (
    id         uuid PRIMARY KEY,
    kind       text NOT NULL,
    key        text NOT NULL,
    payload    jsonb NOT NULL,
    active     boolean NOT NULL DEFAULT true,
    version    integer NOT NULL DEFAULT 1,
    updated_by uuid REFERENCES account(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (kind, key, version)
);
CREATE INDEX idx_config_active ON config_rule(kind, key) WHERE active;
CREATE TRIGGER trg_config_rule_updated_at BEFORE UPDATE ON config_rule
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────── §12 埋点事件（按月分区） ───────────────────────────
-- PG16 分区表不支持 identity 列，使用显式 sequence（应用侧不传 id）

CREATE SEQUENCE event_id_seq;

CREATE TABLE event (
    id         bigint NOT NULL DEFAULT nextval('event_id_seq'),
    anon_id    uuid NOT NULL,
    account_id uuid,
    name       text NOT NULL,
    props      jsonb NOT NULL DEFAULT '{}',
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE INDEX idx_event_name ON event(name, created_at DESC);
CREATE INDEX idx_event_anon ON event(anon_id, created_at DESC);

-- 兜底分区（防漏建月份），正常应由 ensure_event_partition 预建
CREATE TABLE event_default PARTITION OF event DEFAULT;

-- 摄取 worker 启动时调用，保证当月分区存在
CREATE OR REPLACE FUNCTION ensure_event_partition(ts timestamptz) RETURNS void AS $$
DECLARE
    part_name  text;
    range_from date;
    range_to   date;
BEGIN
    range_from := date_trunc('month', ts)::date;
    range_to   := (range_from + interval '1 month')::date;
    part_name  := 'event_' || to_char(range_from, 'YYYYMM');
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = part_name) THEN
        EXECUTE format(
            'CREATE TABLE %I PARTITION OF event FOR VALUES FROM (%L) TO (%L)',
            part_name, range_from, range_to
        );
    END IF;
END;
$$ LANGUAGE plpgsql;
