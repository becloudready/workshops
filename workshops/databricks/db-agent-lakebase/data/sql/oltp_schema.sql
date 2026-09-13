-- Olist OLTP schema for Lakebase (Postgres) — 11-table star schema.
-- Drop & recreate is intentional: this is a lab; production would migrate.
--
-- Facts:       orders, order_items, reviews
-- Dimensions:  customers, products, dim_category, sellers, geolocation,
--              dim_date, dim_marketing_channel
-- Bridge:      order_channel (order -> acquisition channel)
--
-- Run:
--   psql "$LAKEBASE_URL" -f data/sql/oltp_schema.sql

DROP TABLE IF EXISTS
    order_channel, reviews, payments, order_items, orders,
    products, dim_category, sellers, geolocation, customers,
    dim_marketing_channel, dim_date
    CASCADE;

-- ── Dimensions ──────────────────────────────────────────────────────────

CREATE TABLE dim_date (
    date_key        INTEGER PRIMARY KEY,       -- YYYYMMDD
    full_date       DATE NOT NULL,
    year            INTEGER NOT NULL,
    quarter         INTEGER NOT NULL,
    month           INTEGER NOT NULL,
    month_name      TEXT NOT NULL,
    day             INTEGER NOT NULL,
    day_of_week     INTEGER NOT NULL,           -- 1=Mon .. 7=Sun
    day_name        TEXT NOT NULL,
    week_of_year    INTEGER NOT NULL,
    is_weekend      BOOLEAN NOT NULL
);

CREATE TABLE dim_marketing_channel (
    channel_id      INTEGER PRIMARY KEY,
    channel_name    TEXT NOT NULL,
    channel_type    TEXT NOT NULL
);

-- category_id is assigned in Python (load_oltp.py), not by Postgres — the
-- loader needs the id available before loading products.category_id, and
-- everything else in this schema (dim_date, dim_marketing_channel) follows
-- the same explicit-id, no-SERIAL pattern for the same reason.
CREATE TABLE dim_category (
    category_id             INTEGER PRIMARY KEY,
    category_name           TEXT NOT NULL UNIQUE,
    category_name_english   TEXT
);

CREATE TABLE customers (
    customer_id          TEXT PRIMARY KEY,
    customer_unique_id   TEXT NOT NULL,
    city                 TEXT,
    state                CHAR(2)
);

CREATE TABLE sellers (
    seller_id       TEXT PRIMARY KEY,
    city            TEXT,
    state           CHAR(2)
);

CREATE TABLE geolocation (
    zip_code_prefix TEXT PRIMARY KEY,
    city            TEXT,
    state           CHAR(2),
    lat             NUMERIC,
    lng             NUMERIC
);

CREATE TABLE products (
    product_id           TEXT PRIMARY KEY,
    category_id          INTEGER REFERENCES dim_category(category_id),
    product_weight        NUMERIC,
    product_length        NUMERIC,
    product_height        NUMERIC,
    product_width         NUMERIC
);

-- ── Facts ───────────────────────────────────────────────────────────────

CREATE TABLE orders (
    order_id                     TEXT PRIMARY KEY,
    customer_id                  TEXT NOT NULL REFERENCES customers(customer_id),
    order_status                 TEXT NOT NULL,
    order_purchase_timestamp     TIMESTAMP NOT NULL,
    order_delivered_timestamp    TIMESTAMP,
    order_date_key                INTEGER REFERENCES dim_date(date_key)
);
CREATE INDEX ix_orders_customer ON orders(customer_id);
CREATE INDEX ix_orders_purchase ON orders(order_purchase_timestamp);
CREATE INDEX ix_orders_date_key ON orders(order_date_key);

CREATE TABLE order_items (
    order_id        TEXT NOT NULL REFERENCES orders(order_id),
    product_id      TEXT NOT NULL REFERENCES products(product_id),
    seller_id       TEXT REFERENCES sellers(seller_id),
    price           NUMERIC NOT NULL,
    freight_value   NUMERIC NOT NULL
);
CREATE INDEX ix_order_items_order   ON order_items(order_id);
CREATE INDEX ix_order_items_product ON order_items(product_id);
CREATE INDEX ix_order_items_seller  ON order_items(seller_id);

CREATE TABLE payments (
    order_id                TEXT NOT NULL REFERENCES orders(order_id),
    payment_type            TEXT NOT NULL,
    payment_value           NUMERIC NOT NULL,
    payment_installments    INTEGER NOT NULL
);
CREATE INDEX ix_payments_order ON payments(order_id);

CREATE TABLE reviews (
    review_id               TEXT PRIMARY KEY,
    order_id                TEXT NOT NULL REFERENCES orders(order_id),
    review_score            SMALLINT NOT NULL,
    review_comment_title    TEXT,
    review_comment_message  TEXT,
    review_creation_date    TIMESTAMP
);
CREATE INDEX ix_reviews_order ON reviews(order_id);

-- ── Bridge ──────────────────────────────────────────────────────────────

CREATE TABLE order_channel (
    order_id     TEXT PRIMARY KEY REFERENCES orders(order_id),
    channel_id   INTEGER NOT NULL REFERENCES dim_marketing_channel(channel_id)
);
