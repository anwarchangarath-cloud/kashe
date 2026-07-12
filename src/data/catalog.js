// Single source of truth for products. Prices are display-only; production sends
// {productId, qty} and a Cloud Function computes totals (CLAUDE.md · Security).

export const catalog = [
  {
    id: 'olive-oil-sprayer',
    category: 'Kitchen',
    name: 'Glass olive oil sprayer bottle, 320ml',
    price: 7.92,
    wasPrice: 31.99,
    discountPct: 75,
    badge: 'discount',
    freeDelivery: true,
    inStock: true,
    vendor: 'KASH Essentials',
    rating: 4.6,
    ratingsCount: 171052,
    sold: '1M+ sold',
    highlights: [
      'Borosilicate glass, 320ml capacity',
      'Even fine-mist spray, no drips',
      'Dishwasher-safe nozzle',
    ],
  },
  {
    id: 'aroma-diffuser',
    category: 'Wellness',
    name: 'Aromatherapy diffuser with LED mist',
    price: 10.45,
    wasPrice: 46.49,
    discountPct: 71,
    badge: 'discount',
    freeDelivery: true,
    inStock: true,
    vendor: 'KASH Essentials',
    rating: 4.5,
    ratingsCount: 88240,
    sold: '500k+ sold',
    highlights: ['300ml tank, 7 LED colours', 'Auto shut-off when dry', 'Whisper-quiet ultrasonic mist'],
  },
  {
    id: 'rotating-brush',
    category: 'Beauty',
    name: 'Rotating brush organiser, 360°',
    price: 29.0,
    wasPrice: 48.0,
    discountPct: 40,
    badge: 'discount',
    freeDelivery: true,
    inStock: true,
    vendor: 'Vendor A',
    rating: 4.3,
    ratingsCount: 12980,
    sold: '50k+ sold',
    highlights: ['Spins 360° for easy access', 'Holds 20+ brushes', 'Non-slip weighted base'],
  },
  {
    id: 'privacy-screen',
    category: 'Tech',
    name: 'Privacy screen protector, 3-pack',
    price: 19.9,
    wasPrice: null,
    discountPct: null,
    badge: 'new',
    freeDelivery: true,
    inStock: true,
    vendor: 'Vendor B',
    rating: 4.4,
    ratingsCount: 3410,
    sold: '10k+ sold',
    highlights: ['Anti-spy side privacy', 'Tempered glass 9H', 'Case-friendly edges'],
  },
  {
    id: 'air-fryer-liners',
    category: 'Kitchen',
    name: 'Air fryer paper liners, 100 pieces',
    price: 12.5,
    wasPrice: 26.0,
    discountPct: 52,
    badge: 'discount',
    freeDelivery: true,
    inStock: true,
    vendor: 'KASH Essentials',
    rating: 4.7,
    ratingsCount: 45120,
    sold: '250k+ sold',
    highlights: ['Food-grade greaseproof paper', 'Fits 4–6L air fryers', 'No more scrubbing'],
  },
  {
    id: 'shoe-bag',
    category: 'Laundry',
    name: 'Washing machine shoe bag',
    price: 13.68,
    wasPrice: null,
    discountPct: null,
    badge: 'new',
    freeDelivery: true,
    inStock: true,
    vendor: 'Vendor A',
    rating: 4.2,
    ratingsCount: 2140,
    sold: '8k+ sold',
    highlights: ['Protects trainers in the wash', 'Sturdy zip, soft mesh', 'Reusable'],
  },
  {
    id: 'storage-jars',
    category: 'Kitchen',
    name: 'Kitchen storage jars, set of 6',
    price: 34.9,
    wasPrice: 94.0,
    discountPct: 63,
    badge: 'discount',
    freeDelivery: true,
    inStock: true,
    vendor: 'KASH Essentials',
    rating: 4.6,
    ratingsCount: 30210,
    sold: '120k+ sold',
    highlights: ['Airtight bamboo lids', 'Stackable 1.2L jars', 'BPA-free'],
  },
  {
    id: 'frying-pan',
    category: 'Cookware',
    name: 'Non-stick frying pan, 28cm',
    price: 59.0,
    wasPrice: 88.0,
    discountPct: 33,
    badge: 'discount',
    freeDelivery: true,
    inStock: true,
    vendor: 'Vendor B',
    rating: 4.5,
    ratingsCount: 18760,
    sold: '60k+ sold',
    highlights: ['Granite non-stick coating', 'Induction compatible', 'Stay-cool handle'],
  },
  {
    id: 'food-chopper',
    category: 'Appliances',
    name: 'Electric food chopper, 4L',
    price: 89.0,
    wasPrice: null,
    discountPct: null,
    badge: 'new',
    freeDelivery: true,
    inStock: true,
    vendor: 'Vendor A',
    rating: 4.4,
    ratingsCount: 5230,
    sold: '20k+ sold',
    highlights: ['4L capacity, 400W motor', 'Stainless steel blades', 'One-touch pulse'],
  },
  {
    id: 'wireless-earbuds',
    category: 'Electronics',
    name: 'Wireless earbuds with charging case',
    price: 79.0,
    wasPrice: 149.0,
    discountPct: 47,
    badge: 'discount',
    freeDelivery: true,
    inStock: true,
    vendor: 'Vendor B',
    rating: 4.3,
    ratingsCount: 64200,
    sold: '300k+ sold',
    highlights: ['Bluetooth 5.3, 30h battery', 'IPX5 sweat-resistant', 'Touch controls'],
  },
  {
    id: 'desk-lamp',
    category: 'Home',
    name: 'LED desk lamp, dimmable',
    price: 44.5,
    wasPrice: 69.0,
    discountPct: 35,
    badge: 'discount',
    freeDelivery: true,
    inStock: true,
    vendor: 'KASH Essentials',
    rating: 4.6,
    ratingsCount: 9870,
    sold: '40k+ sold',
    highlights: ['3 colour temperatures', 'USB charging port', 'Foldable arm'],
  },
  {
    id: 'water-bottle',
    category: 'Sports',
    name: 'Insulated steel water bottle, 1L',
    price: 32.0,
    wasPrice: 55.0,
    discountPct: 42,
    badge: 'discount',
    freeDelivery: true,
    inStock: true,
    vendor: 'Vendor A',
    rating: 4.7,
    ratingsCount: 22400,
    sold: '90k+ sold',
    highlights: ['Keeps cold 24h / hot 12h', 'Leak-proof lid', '18/8 food-grade steel'],
  },
]

// Attach a product photo to each item. Picsum is a fast, reliable CDN that handles many
// concurrent requests (keyword services like LoremFlickr stall under a full catalog load).
// Seeded by id so each product's photo is deterministic. Components fall back to a neutral
// placeholder if a photo can't load. To use REAL product images, set `image` per product
// to your hosted URL (or a local /public path) — that always wins over this default.
// Seed stock so inventory / out-of-stock is real across the storefront AND admin.
const SEED_STOCK = {
  'olive-oil-sprayer': 3, 'aroma-diffuser': 0, 'rotating-brush': 42, 'privacy-screen': 120,
  'air-fryer-liners': 8, 'shoe-bag': 210, 'storage-jars': 15, 'frying-pan': 60,
  'food-chopper': 5, 'wireless-earbuds': 88, 'desk-lamp': 34, 'water-bottle': 150,
}

export function levelFor(stock, lowAt = 10) {
  return stock === 0 ? 'out' : stock <= lowAt ? 'low' : 'ok'
}

for (const p of catalog) {
  if (!p.image) p.image = `https://picsum.photos/seed/${p.id}/600/600`
  p.stock = SEED_STOCK[p.id] ?? 25
  p.lowAt = 10
  p.inStock = p.stock > 0
  p.level = levelFor(p.stock, p.lowAt)
  p.published = true
}

// Category slugs → display titles. Products are shared across categories in this
// local demo, so every category renders a populated grid.
export const categoryTitles = {
  home: 'Home & Kitchen',
  'home-kitchen': 'Home & Kitchen',
  electronics: 'Electronics',
  mobiles: 'Mobiles',
  fashion: 'Fashion',
  beauty: 'Beauty',
  grocery: 'Grocery',
  sports: 'Sports',
  kids: 'Kids & Toys',
  'kids-toys': 'Kids & Toys',
  deals: "Today's deals",
}

export function categoryTitle(slug) {
  return categoryTitles[slug] ?? 'All products'
}

// Which product categories belong under each top-level category slug. Slugs not listed
// (or that match nothing) fall back to the whole catalog so no page is ever empty.
export const CATEGORY_MAP = {
  home: ['Kitchen', 'Cookware', 'Appliances', 'Home', 'Laundry', 'Wellness'],
  'home-kitchen': ['Kitchen', 'Cookware', 'Appliances', 'Home', 'Laundry', 'Wellness'],
  electronics: ['Electronics', 'Tech'],
  mobiles: ['Tech', 'Electronics'],
  beauty: ['Beauty', 'Wellness'],
  sports: ['Sports'],
}

export function filterByCategory(list, slug) {
  const cats = CATEGORY_MAP[slug]
  if (!cats) return list
  const filtered = list.filter((p) => cats.includes(p.category))
  return filtered.length ? filtered : list
}

// Product lookups (getProduct / getByCategory / search) now live in ProductsContext so
// they reflect live admin changes. catalog here is just the seed. SORTS stays pure.
export const SORTS = {
  relevance: (a, b) => 0,
  priceLow: (a, b) => a.price - b.price,
  priceHigh: (a, b) => b.price - a.price,
  discount: (a, b) => (b.discountPct ?? 0) - (a.discountPct ?? 0),
  rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
}
