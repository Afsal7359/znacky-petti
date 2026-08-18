-- ============================================================
--  ZNACKY PETTI — Seed data
--  Run this SECOND (after 01_schema.sql)
--  Safe to re-run: it clears content tables and re-inserts.
-- ============================================================

truncate table public.product_variants cascade;
delete from public.products;
delete from public.categories;
delete from public.hero_slides;
delete from public.offers;
delete from public.stats;
delete from public.why_features;
delete from public.process_steps;
delete from public.testimonials;
delete from public.faqs;
delete from public.peek_items;
delete from public.nav_links;
delete from public.sections;

-- ---------- SITE SETTINGS ----------
insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

-- ---------- SECTIONS ----------
insert into public.sections (key, label, eyebrow, title, subtitle, is_visible, sort_order) values
  ('announcement','Announcement bar','','','',true,0),
  ('hero','Hero + image slider','🌿 Straight From God''s Own Country','Unbox the Taste of Kerala','Small-batch banana chips, murukku, sharkkara varatti and more — hand-cut, roasted in real coconut oil, and packed fresh the same week you order.',true,1),
  ('peek','Peek Inside the Petti strip','','Peek Inside the Petti','Drag to explore →',true,2),
  ('products','Products grid','The Full Petti','Our Products','Eight recipes, one tradition. Pick your favourites, or order the whole box.',true,3),
  ('story','Our Story','Our Story','A Petti Full of Home','',true,4),
  ('combos','Special combos','Save More','Special Combo Pettis','Hand-picked bundles at a better price — perfect for gifting, festivals and big families.',true,5),
  ('offers','Offers','Limited Time','Running Offers','Fresh deals every season. Grab them before the batch runs out.',true,6),
  ('stats','Stats strip','','','',true,7),
  ('why','Why Znacky Petti','Why Znacky Petti','Made the Way Ammachi Would Approve','Five simple standards we don''t compromise on, batch after batch.',true,8),
  ('process','Our Process','Our Process','From Kerala Farms to Your Petti','The same five steps our partner kitchens have followed for generations.',true,9),
  ('wholesale','Business / Wholesale','For Businesses','Bring Znacky Petti to Your Store','From cafés and gift hampers to corporate Onam boxes, we supply bulk orders across our full range — with custom packaging and branding available on request.',true,10),
  ('testimonials','Testimonials','Customer Love','From Our Petti to Your Table','A few notes from people who''ve unboxed one already.',true,11),
  ('faq','FAQ','Good to Know','Frequently Asked Questions','Still curious about something? Message us on WhatsApp any time.',true,12),
  ('contact','Contact','Get In Touch','Let''s Talk Snacks','Questions, bulk orders, or just craving banana chips? We''d love to hear from you.',true,13),
  ('newsletter','Newsletter box','','Stay Connected','Subscribe for updates on new products and festive offers.',true,14),
  ('float_whatsapp','Floating WhatsApp button','','','',true,15);

-- ---------- NAV ----------
insert into public.nav_links (label, href, sort_order) values
  ('Home','/',0),
  ('Our Story','/#story',1),
  ('Products','/#products',2),
  ('Combos','/#combos',3),
  ('Wholesale','/#wholesale',4),
  ('FAQ','/#faq',5),
  ('Contact','/#contact',6);

-- ---------- HERO SLIDES ----------
insert into public.hero_slides (image_url, alt_text, headline, subheadline, cta_label, cta_link, sort_order) values
  ('/brand/chest.webp','Znacky Petti chest overflowing with Kerala snacks','','','','',0),
  ('https://commons.wikimedia.org/wiki/Special:FilePath/Kerala_banana_chips_Upperi_varuthath.jpg?width=1000','Golden Kerala banana chips','','','','',1),
  ('https://commons.wikimedia.org/wiki/Special:FilePath/Jaggery_coatted_banana_chips_from_Kerala.jpg?width=1000','Jaggery glazed sharkkara varatti','','','','',2),
  ('https://commons.wikimedia.org/wiki/Special:FilePath/A_Traditional_Tamil_Snack_Murukku.jpg?width=1000','Hand rolled murukku spirals','','','','',3);

-- ---------- CATEGORIES ----------
insert into public.categories (id, name, slug, sort_order) values
  ('11111111-1111-1111-1111-111111111101','Chips','chips',0),
  ('11111111-1111-1111-1111-111111111102','Sweets','sweets',1),
  ('11111111-1111-1111-1111-111111111103','Savouries','savouries',2),
  ('11111111-1111-1111-1111-111111111104','Combos','combo-packs',3);

-- ---------- PRODUCTS ----------
insert into public.products
  (id, type, name, slug, local_name, short_desc, long_desc, image_url, price, mrp, unit_label, badge, badge_color, category_id, ingredients, shelf_life, is_featured, sort_order)
values
  ('22222222-2222-2222-2222-222222222201','product','Banana Chips','banana-chips','Kaya Varuthathu',
   'Thin-sliced Nendran bananas, fried golden in real coconut oil.',
   'Our signature Kerala upperi. Raw Nendran bananas are peeled and hand-sliced straight into a kadai of bubbling coconut oil, then salted while still hot. The result is a wafer-thin chip that snaps cleanly and tastes exactly the way it does on a Thrissur street corner.',
   'https://commons.wikimedia.org/wiki/Special:FilePath/Kerala_banana_chips_Upperi_varuthath.jpg?width=800',
   180, 220, '250g','Bestseller','maroon','11111111-1111-1111-1111-111111111101',
   'Nendran banana, coconut oil, salt','45–60 days sealed', true, 0),

  ('22222222-2222-2222-2222-222222222202','product','Sharkkara Varatti','sharkkara-varatti','Jaggery-Glazed Banana',
   'Ripe banana coated in a rich, spiced jaggery caramel.',
   'Thick banana slices are fried, then tumbled in molten Kerala jaggery spiced with dry ginger and cardamom until every piece wears a glossy dark coat. Sweet, sticky and deeply traditional — the first thing that disappears from every petti.',
   'https://commons.wikimedia.org/wiki/Special:FilePath/Jaggery_coatted_banana_chips_from_Kerala.jpg?width=800',
   210, 250, '250g','','maroon','11111111-1111-1111-1111-111111111102',
   'Nendran banana, jaggery, coconut oil, dry ginger, cardamom','45 days sealed', true, 1),

  ('22222222-2222-2222-2222-222222222203','product','Tapioca Chips','tapioca-chips','Kappa Chips',
   'Crisp tapioca rounds with a mild peppery kick.',
   'Farm-fresh kappa is peeled, sliced into coins and fried until it shatters at the first bite. Finished with rock salt and a whisper of black pepper — the classic Kerala tea-time companion.',
   'https://commons.wikimedia.org/wiki/Special:FilePath/Tapioca_Chips_2.jpg?width=800',
   160, 190, '250g','','maroon','11111111-1111-1111-1111-111111111101',
   'Tapioca, coconut oil, salt, black pepper','45 days sealed', true, 2),

  ('22222222-2222-2222-2222-222222222204','product','Nadan Mixture','nadan-mixture','Kerala Mixture',
   'A crunchy toss of sev, peanuts, curry leaves and spice.',
   'Boondi, sev, fried peanuts, cashew bits and crackling curry leaves tossed with a home-ground masala. Every handful is a different ratio — which is exactly the point.',
   'https://commons.wikimedia.org/wiki/Special:FilePath/Indian_Snacks_%28Namkeen%29.jpg?width=800',
   190, 230, '250g','','maroon','11111111-1111-1111-1111-111111111103',
   'Gram flour, rice flour, peanuts, curry leaves, coconut oil, spices','45 days sealed', true, 3),

  ('22222222-2222-2222-2222-222222222205','product','Murukku','murukku','Chakli',
   'Spiral rice-flour crisps, rolled and fried by hand.',
   'Rice flour and urad dal dough pressed into spirals by hand — never by machine — and fried slow so the centre stays as crisp as the edge. Lightly spiced with cumin and sesame.',
   'https://commons.wikimedia.org/wiki/Special:FilePath/A_Traditional_Tamil_Snack_Murukku.jpg?width=800',
   170, 200, '250g','','maroon','11111111-1111-1111-1111-111111111103',
   'Rice flour, urad dal, sesame, cumin, coconut oil, salt','45 days sealed', true, 4),

  ('22222222-2222-2222-2222-222222222206','product','Jackfruit Chips','jackfruit-chips','Chakka Varuthathu',
   'Sweet-savoury jackfruit, sliced and fried in season.',
   'Made only while the chakka season lasts. Firm raw jackfruit is sliced thin and fried in coconut oil, giving a chip that is nutty, faintly sweet and completely unlike anything else in the box.',
   'https://commons.wikimedia.org/wiki/Special:FilePath/Chakka-chips.JPG?width=800',
   240, 280, '250g','New','green','11111111-1111-1111-1111-111111111101',
   'Raw jackfruit, coconut oil, salt','40 days sealed', true, 5),

  ('22222222-2222-2222-2222-222222222207','product','Achappam','achappam','Rose Cookies',
   'Delicate rice-flour rosettes, stamped the traditional way.',
   'A brass achu mould is dipped in rice-and-coconut-milk batter and lowered into hot oil, releasing a flower that crisps in seconds. Faintly sweet, impossibly light, and a Christmas staple in every Kerala home.',
   'https://commons.wikimedia.org/wiki/Special:FilePath/Rose_cookies_Achu_Murukku.JPG?width=800',
   220, 260, '250g','','maroon','11111111-1111-1111-1111-111111111102',
   'Rice flour, coconut milk, egg, sugar, sesame, coconut oil','40 days sealed', true, 6),

  ('22222222-2222-2222-2222-222222222208','product','Kuzhalappam','kuzhalappam','Rice Rolls',
   'Rolled rice crisps with roasted coconut and cumin.',
   'Spiced rice dough rolled around a wooden stick into little tubes, then fried until golden. Roasted coconut, cumin and shallots go into the dough — a Central Travancore favourite.',
   'https://commons.wikimedia.org/wiki/Special:FilePath/Chakka-chips.JPG?width=800',
   200, 240, '250g','','maroon','11111111-1111-1111-1111-111111111103',
   'Rice flour, coconut, cumin, shallots, coconut oil, salt','45 days sealed', true, 7);

-- ---------- COMBOS ----------
insert into public.products
  (id, type, name, slug, local_name, short_desc, long_desc, image_url, price, mrp, unit_label, badge, badge_color, category_id, is_featured, show_in_peek, sort_order)
values
  ('22222222-2222-2222-2222-222222222301','combo','Onam Sadya Petti','onam-sadya-petti','5 Snacks · 1.25kg',
   'Banana chips, sharkkara varatti, murukku, mixture and achappam — the full festive box.',
   'Our most-gifted petti. Five signature snacks at 250g each, layered into one hamper box with a hand-tied banana-fibre ribbon. Add a gift note on WhatsApp and we will slip it inside.',
   'https://commons.wikimedia.org/wiki/Special:FilePath/Onasadya.jpg?width=800',
   849, 1080, '1.25kg','Save ₹231','maroon','11111111-1111-1111-1111-111111111104', true, false, 0),

  ('22222222-2222-2222-2222-222222222302','combo','Chai Time Trio','chai-time-trio','3 Snacks · 750g',
   'Banana chips, tapioca chips and nadan mixture — the everyday evening box.',
   'The petti we send to people who just want something crunchy next to their 5 o''clock chai. Three savoury classics, 250g each.',
   'https://commons.wikimedia.org/wiki/Special:FilePath/Tapioca_Chips_2.jpg?width=800',
   479, 570, '750g','Save ₹91','green','11111111-1111-1111-1111-111111111104', true, false, 1),

  ('22222222-2222-2222-2222-222222222303','combo','Sweet Tooth Petti','sweet-tooth-petti','3 Snacks · 750g',
   'Sharkkara varatti, achappam and jackfruit chips for the sweet side of Kerala.',
   'Jaggery, coconut milk and chakka in one box — for everyone who reaches for the sweet tin first.',
   'https://commons.wikimedia.org/wiki/Special:FilePath/Jaggery_coatted_banana_chips_from_Kerala.jpg?width=800',
   629, 750, '750g','Save ₹121','gold','11111111-1111-1111-1111-111111111104', true, false, 2),

  ('22222222-2222-2222-2222-222222222304','combo','The Whole Petti','the-whole-petti','8 Snacks · 2kg',
   'Every single recipe we make, 250g each, in one big treasure chest.',
   'The complete Znacky Petti experience — all eight recipes at 250g apiece. If you cannot decide, this is the answer.',
   '/brand/chest.webp',
   1349, 1690, '2kg','Best Value','maroon','11111111-1111-1111-1111-111111111104', true, false, 3);

-- ---------- VARIANTS ----------
insert into public.product_variants (product_id, label, price, mrp, is_default, sort_order)
select p.id, v.label,
       round(p.price * v.mult), round(coalesce(p.mrp, p.price * 1.2) * v.mult),
       v.is_default, v.sort_order
from public.products p
cross join (values
  ('100g', 0.45, false, 0),
  ('250g', 1.00, true,  1),
  ('500g', 1.85, false, 2)
) as v(label, mult, is_default, sort_order)
where p.type = 'product';

insert into public.product_variants (product_id, label, price, mrp, is_default, sort_order)
select id, unit_label, price, mrp, true, 0 from public.products where type = 'combo';

-- ---------- OFFERS ----------
insert into public.offers (title, subtitle, description, code, discount_text, accent, cta_label, sort_order) values
  ('Onam Special','Festive box discount','Order any combo petti before Thiruvonam and we knock 15% off the whole cart. Gift notes and custom packing included.','ONAM15','15% OFF','maroon','Order on WhatsApp',0),
  ('Free Delivery','On orders above ₹999','Cross ₹999 in a single order and shipping is on us — anywhere in India, tracked door to door.','','FREE SHIP','green','Start an order',1),
  ('First Petti','New customer welcome','First time ordering? Use this code at checkout and take ₹100 off your very first petti.','FIRST100','₹100 OFF','gold','Claim ₹100 off',2);

-- ---------- STATS ----------
insert into public.stats (value, suffix, label, sort_order) values
  (8,'+','Signature Recipes',0),
  (100,'%','Coconut-Oil Roasted',1),
  (5000,'+','Pettis Delivered',2),
  (0,'','Preservatives Added',3);

-- ---------- WHY ----------
insert into public.why_features (icon, title, description, highlight, sort_order) values
  ('trophy','Premium Quality','Only the best Nendran bananas, farm tapioca and cold-pressed coconut oil make it into the fryer.','Grade A produce',0),
  ('box','Freshly Packed','Every petti is sealed within 48 hours of roasting — never off a warehouse shelf.','48 hour rule',1),
  ('leaf','Authentic Kerala Taste','Recipes passed down from home kitchens, unchanged for generations.','12 family kitchens',2),
  ('shield','Hygienic Packaging','Sealed in food-grade, resealable pouches that lock the crunch in.','Food-grade sealed',3),
  ('truck','Fast Delivery','Dispatched pan-India in 24–48 hours, tracked all the way to your door.','24–48 hr dispatch',4);

-- ---------- PROCESS ----------
insert into public.process_steps (step_no, icon, title, description, sort_order) values
  ('01','sprout','Sourced','Nendran bananas, farm tapioca, jaggery and coconuts, sourced fresh from Kerala growers.',0),
  ('02','knife','Cleaned & Cut','Washed, peeled and hand-sliced the traditional way — no machines rushing the cut.',1),
  ('03','flame','Roasted','Slow-fried in small batches of pure coconut oil for that unmistakable flavour.',2),
  ('04','spice','Seasoned','Finished with authentic spice blends or jaggery glaze, the way home kitchens do it.',3),
  ('05','box','Packed Fresh','Cooled, weighed and sealed the same day, then shipped within 24–48 hours.',4);

-- ---------- STORY ----------
insert into public.story_content (id, image_url, badge_number, badge_text, body, signature)
values (1,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Onasadya.jpg?width=900',
  '12+',
  'Family kitchens we partner with across Kerala',
  '["In Malayalam, <em>petti</em> means a box — the kind grandmothers packed before a long journey, layered with banana chips, crunchy murukku and jaggery-glazed sharkkara varatti wrapped in banana leaf.","Znacky Petti brings that same box to your doorstep. We work with small family kitchens across Kerala who still roast in traditional coconut oil, slice banana by hand, and season the old way — no shortcuts, no palm oil, no maida fillers.","Every batch is made fresh to order, sealed while it''s still warm, and shipped within days — so what reaches you tastes like it just came off the stove in a Kerala tharavadu."]'::jsonb,
  '— Handcrafted by home cooks across Kerala')
on conflict (id) do update set
  image_url = excluded.image_url,
  badge_number = excluded.badge_number,
  badge_text = excluded.badge_text,
  body = excluded.body,
  signature = excluded.signature;

-- ---------- TESTIMONIALS ----------
insert into public.testimonials (name, location, quote, rating, initials, color, sort_order) values
  ('Ammu R.','Bengaluru','Tastes exactly like my grandmother''s chips back in Thrissur. My whole flat finished a 500g pack in two days.',5,'AR','maroon',0),
  ('Vishnu K.','Dubai','Ordered a petti for Onam and it arrived in perfect shape. The sharkkara varatti disappeared first — no contest.',5,'VK','green',1),
  ('Meera S.','Chennai','Finally a banana chips brand that doesn''t taste like it was fried in palm oil. Properly crunchy, properly Kerala.',5,'MS','gold',2),
  ('Arjun P.','Kochi','Ordered in bulk for our office Vishu celebration — smooth WhatsApp ordering and everything arrived a day early.',5,'AP','maroon',3);

-- ---------- FAQ ----------
insert into public.faqs (question, answer, sort_order) values
  ('How long do the snacks stay fresh?','Sealed and unopened, most snacks stay crisp for 45–60 days. Once opened, we recommend resealing the pouch tightly and finishing within 10–14 days for the best crunch.',0),
  ('Do you deliver across India?','Yes — we ship pan-India in 24–48 hours from dispatch. For select international cities, message us on WhatsApp and we''ll confirm availability and shipping cost.',1),
  ('What oil do you fry in?','100% coconut oil, always. No palm oil, no reused oil, no shortcuts — it''s a big part of why our chips taste the way they do.',2),
  ('Can I order in bulk for events or gifting?','Absolutely. Check our Wholesale section or message us directly — we do custom quantities, mixed pettis and branded packaging for corporate gifting.',3),
  ('How do I place an order?','Add what you like to the cart, fill in your delivery details at checkout, and tap the button — your complete order opens in WhatsApp and we confirm payment right there in the chat.',4),
  ('Do you use preservatives?','None. Freshness comes from small-batch roasting and quick dispatch — not additives or artificial preservatives.',5);

-- ---------- PEEK ITEMS ----------
insert into public.peek_items (title, image_url, link, sort_order) values
  ('Banana Chips','https://commons.wikimedia.org/wiki/Special:FilePath/Kerala_banana_chips_Upperi_varuthath.jpg?width=300','/banana-chips',0),
  ('Sharkkara Varatti','https://commons.wikimedia.org/wiki/Special:FilePath/Jaggery_coatted_banana_chips_from_Kerala.jpg?width=300','/sharkkara-varatti',1),
  ('Tapioca Chips','https://commons.wikimedia.org/wiki/Special:FilePath/Tapioca_Chips_2.jpg?width=300','/tapioca-chips',2),
  ('Nadan Mixture','https://commons.wikimedia.org/wiki/Special:FilePath/Indian_Snacks_%28Namkeen%29.jpg?width=300','/nadan-mixture',3),
  ('Murukku','https://commons.wikimedia.org/wiki/Special:FilePath/A_Traditional_Tamil_Snack_Murukku.jpg?width=300','/murukku',4),
  ('Jackfruit Chips','https://commons.wikimedia.org/wiki/Special:FilePath/Chakka-chips.JPG?width=300','/jackfruit-chips',5),
  ('Achappam','https://commons.wikimedia.org/wiki/Special:FilePath/Rose_cookies_Achu_Murukku.JPG?width=300','/achappam',6),
  ('Kuzhalappam','https://commons.wikimedia.org/wiki/Special:FilePath/Chakka-chips.JPG?width=300','/kuzhalappam',7);
