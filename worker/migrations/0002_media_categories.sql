-- Multiple images + optional video + separate highlights, plus a categories table.
ALTER TABLE products ADD COLUMN images TEXT;      -- JSON array of image URLs
ALTER TABLE products ADD COLUMN video TEXT;       -- optional video URL
ALTER TABLE products ADD COLUMN highlights TEXT;  -- JSON array of short bullet points

CREATE TABLE IF NOT EXISTS categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT OR IGNORE INTO categories (slug, name) VALUES
 ('kitchen','Kitchen'), ('wellness','Wellness'), ('beauty','Beauty'), ('tech','Tech'),
 ('laundry','Laundry'), ('cookware','Cookware'), ('appliances','Appliances'),
 ('electronics','Electronics'), ('home','Home'), ('sports','Sports'),
 ('home-kitchen','Home & Kitchen'), ('fashion','Fashion'), ('grocery','Grocery'), ('kids-toys','Kids & Toys');
