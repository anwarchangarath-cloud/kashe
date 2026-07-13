-- Seed the catalog (mirrors src/data/catalog.js) + coupons. Idempotent.
INSERT OR REPLACE INTO products
  (id, name, description, category, vendor, price, was_price, discount_pct, badge, sku, stock, low_at, published, rating, ratings_count, sold, image)
VALUES
 ('olive-oil-sprayer','Glass olive oil sprayer bottle, 320ml','Borosilicate glass, 320ml capacity · Even fine-mist spray, no drips · Dishwasher-safe nozzle','Kitchen','KASH Essentials',7.92,31.99,75,'discount','KS-OLIVE-OIL-SPRAYER',3,10,1,4.6,171052,'1M+ sold','https://picsum.photos/seed/olive-oil-sprayer/600/600'),
 ('aroma-diffuser','Aromatherapy diffuser with LED mist','300ml tank, 7 LED colours · Auto shut-off when dry · Whisper-quiet ultrasonic mist','Wellness','KASH Essentials',10.45,46.49,71,'discount','KS-AROMA-DIFFUSER',0,10,1,4.5,88240,'500k+ sold','https://picsum.photos/seed/aroma-diffuser/600/600'),
 ('rotating-brush','Rotating brush organiser, 360°','Spins 360° for easy access · Holds 20+ brushes · Non-slip weighted base','Beauty','Vendor A',29.0,48.0,40,'discount','KS-ROTATING-BRUSH',42,10,1,4.3,12980,'50k+ sold','https://picsum.photos/seed/rotating-brush/600/600'),
 ('privacy-screen','Privacy screen protector, 3-pack','Anti-spy side privacy · Tempered glass 9H · Case-friendly edges','Tech','Vendor B',19.9,NULL,NULL,'new','KS-PRIVACY-SCREEN',120,10,1,4.4,3410,'10k+ sold','https://picsum.photos/seed/privacy-screen/600/600'),
 ('air-fryer-liners','Air fryer paper liners, 100 pieces','Food-grade greaseproof paper · Fits 4–6L air fryers · No more scrubbing','Kitchen','KASH Essentials',12.5,26.0,52,'discount','KS-AIR-FRYER-LINERS',8,10,1,4.7,45120,'250k+ sold','https://picsum.photos/seed/air-fryer-liners/600/600'),
 ('shoe-bag','Washing machine shoe bag','Protects trainers in the wash · Sturdy zip, soft mesh · Reusable','Laundry','Vendor A',13.68,NULL,NULL,'new','KS-SHOE-BAG',210,10,1,4.2,2140,'8k+ sold','https://picsum.photos/seed/shoe-bag/600/600'),
 ('storage-jars','Kitchen storage jars, set of 6','Airtight bamboo lids · Stackable 1.2L jars · BPA-free','Kitchen','KASH Essentials',34.9,94.0,63,'discount','KS-STORAGE-JARS',15,10,1,4.6,30210,'120k+ sold','https://picsum.photos/seed/storage-jars/600/600'),
 ('frying-pan','Non-stick frying pan, 28cm','Granite non-stick coating · Induction compatible · Stay-cool handle','Cookware','Vendor B',59.0,88.0,33,'discount','KS-FRYING-PAN',60,10,1,4.5,18760,'60k+ sold','https://picsum.photos/seed/frying-pan/600/600'),
 ('food-chopper','Electric food chopper, 4L','4L capacity, 400W motor · Stainless steel blades · One-touch pulse','Appliances','Vendor A',89.0,NULL,NULL,'new','KS-FOOD-CHOPPER',5,10,1,4.4,5230,'20k+ sold','https://picsum.photos/seed/food-chopper/600/600'),
 ('wireless-earbuds','Wireless earbuds with charging case','Bluetooth 5.3, 30h battery · IPX5 sweat-resistant · Touch controls','Electronics','Vendor B',79.0,149.0,47,'discount','KS-WIRELESS-EARBUDS',88,10,1,4.3,64200,'300k+ sold','https://picsum.photos/seed/wireless-earbuds/600/600'),
 ('desk-lamp','LED desk lamp, dimmable','3 colour temperatures · USB charging port · Foldable arm','Home','KASH Essentials',44.5,69.0,35,'discount','KS-DESK-LAMP',34,10,1,4.6,9870,'40k+ sold','https://picsum.photos/seed/desk-lamp/600/600'),
 ('water-bottle','Insulated steel water bottle, 1L','Keeps cold 24h / hot 12h · Leak-proof lid · 18/8 food-grade steel','Sports','Vendor A',32.0,55.0,42,'discount','KS-WATER-BOTTLE',150,10,1,4.7,22400,'90k+ sold','https://picsum.photos/seed/water-bottle/600/600');

INSERT OR REPLACE INTO coupons (code, type, value, min_subtotal, label, active) VALUES
 ('SAVE20','percent',20,150,'20% off orders over AED 150',1),
 ('WELCOME15','percent',15,0,'15% off your order',1),
 ('FREEDEL','freeDelivery',0,0,'Free delivery',1);
