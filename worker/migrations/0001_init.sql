-- KASH schema. Prices/stock live here so the Worker computes totals server-side
-- and decrements stock in a transaction (never trust the client). See CLAUDE.md.

CREATE TABLE IF NOT EXISTS products (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  description   TEXT,
  category      TEXT,
  vendor        TEXT,
  seller        TEXT,
  commission    REAL,
  cost          REAL,
  price         REAL NOT NULL,
  was_price     REAL,
  discount_pct  INTEGER,
  badge         TEXT,
  free_delivery INTEGER DEFAULT 1,
  sku           TEXT,
  stock         INTEGER DEFAULT 0,
  low_at        INTEGER DEFAULT 10,
  published     INTEGER DEFAULT 1,
  rating        REAL DEFAULT 0,
  ratings_count INTEGER DEFAULT 0,
  sold          TEXT,
  image         TEXT,
  created_at    TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id           TEXT PRIMARY KEY,
  uid          TEXT NOT NULL,
  customer     TEXT,
  email        TEXT,
  subtotal     REAL,
  discount     REAL DEFAULT 0,
  delivery_fee REAL DEFAULT 0,
  total        REAL,
  coupon       TEXT,
  payment      TEXT,   -- paid | unpaid | on-delivery | refund-due
  status       TEXT DEFAULT 'packing', -- pending|packing|shipped|delivered|returned
  address_json TEXT,
  created_at   TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  order_id   TEXT NOT NULL,
  product_id TEXT NOT NULL,
  name       TEXT,
  price      REAL,
  qty        INTEGER,
  PRIMARY KEY (order_id, product_id)
);

CREATE TABLE IF NOT EXISTS coupons (
  code         TEXT PRIMARY KEY,
  type         TEXT,   -- percent | freeDelivery
  value        REAL,
  min_subtotal REAL DEFAULT 0,
  label        TEXT,
  active       INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS reviews (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id TEXT NOT NULL,
  uid        TEXT,
  author     TEXT,
  rating     INTEGER,
  text       TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS audit_log (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  actor  TEXT,
  action TEXT,
  detail TEXT,
  at     TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_orders_uid ON orders(uid);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(published);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
