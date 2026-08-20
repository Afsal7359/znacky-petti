-- ============================================================
-- ZNACKY PETTI — 03: multi-page structure
-- Safe to run more than once, and safe on an existing database.
-- Run this in the Supabase SQL editor after 01_schema.sql + 02_seed.sql.
-- ============================================================

-- ---------- every section now belongs to a page ----------
alter table public.sections add column if not exists page text not null default 'home';

-- ---------- the pages themselves ----------
create table if not exists public.pages (
  id                uuid primary key default gen_random_uuid(),
  key               text unique not null,          -- stable id used in code
  slug              text unique not null,           -- '' for the home page
  label             text not null,                  -- name shown in the admin panel
  nav_label         text default '',                -- what the menu shows
  eyebrow           text default '',
  title             text default '',
  subtitle          text default '',
  banner_image      text default '',
  meta_title        text default '',
  meta_description  text default '',
  show_in_nav       boolean not null default true,
  show_header       boolean not null default true,  -- the banner at the top of inner pages
  is_visible        boolean not null default true,  -- off = 404
  sort_order        integer not null default 0,
  updated_at        timestamptz not null default now()
);

alter table public.pages enable row level security;

-- anyone may read a live page; a hidden page is invisible to visitors (404)
drop policy if exists "public read pages" on public.pages;
create policy "public read pages" on public.pages
  for select using (is_visible = true);

-- signed-in admins see and edit everything, hidden pages included
drop policy if exists "admin write pages" on public.pages;
create policy "admin write pages" on public.pages
  for all to authenticated using (true) with check (true);

-- ---------- seed the pages ----------
insert into public.pages
  (key, slug, label, nav_label, eyebrow, title, subtitle, meta_title, meta_description, show_in_nav, show_header, sort_order)
values
  ('home','','Home','Home','','','',
   'Znacky Petti — Unbox the Taste of Kerala',
   'Handcrafted Kerala snacks — banana chips, murukku, sharkkara varatti and more. Roasted in coconut oil, packed fresh, delivered pan-India.',
   true,false,0),

  ('products','products','Products','Products','The Full Petti','All Our Snacks',
   'Every recipe we make, hand-cut and roasted in coconut oil. Pick a pack size and add it to your petti.',
   'All Products — Znacky Petti',
   'Browse every Znacky Petti snack — banana chips, sharkkara varatti, murukku, tapioca chips and more, delivered pan-India.',
   true,true,1),

  ('our-story','our-story','Our Story','Our Story','Our Story','A Petti Full of Home',
   'The people, the kitchens and the standards behind every box we pack.',
   'Our Story — Znacky Petti',
   'How Znacky Petti works with small family kitchens across Kerala to make snacks the traditional way.',
   true,true,2),

  ('combos','combos','Combos & Offers','Combos','Save More','Special Combo Pettis',
   'Hand-picked bundles at a better price — perfect for gifting, festivals and big families.',
   'Combo Pettis & Offers — Znacky Petti',
   'Save more with hand-picked Kerala snack bundles and running seasonal offers.',
   true,true,3),

  ('wholesale','wholesale','Wholesale','Wholesale','For Businesses','Bring Znacky Petti to Your Store',
   'Bulk pricing, custom packaging and reliable supply for cafés, retailers and corporate gifting.',
   'Wholesale & Bulk Orders — Znacky Petti',
   'Bulk Kerala snack supply with custom packaging and branding for cafés, stores and corporate gifting.',
   true,true,4),

  ('reviews','reviews','Reviews','Reviews','Customer Love','From Our Petti to Your Table',
   'A few notes from people who have unboxed one already.',
   'Customer Reviews — Znacky Petti',
   'What customers across India and abroad say about Znacky Petti Kerala snacks.',
   true,true,5),

  ('faq','faq','FAQ','FAQ','Good to Know','Frequently Asked Questions',
   'Everything about freshness, delivery, oil and ordering — answered.',
   'FAQ — Znacky Petti',
   'Answers about shelf life, pan-India delivery, coconut oil, bulk orders and how to order.',
   true,true,6),

  ('contact','contact','Contact','Contact','Get In Touch','Let''s Talk Snacks',
   'Questions, bulk orders, or just craving banana chips? We would love to hear from you.',
   'Contact — Znacky Petti',
   'Reach Znacky Petti on WhatsApp, phone or email for orders, bulk enquiries and support.',
   true,true,7)
on conflict (key) do nothing;

-- ---------- the full-shop section used by the Products page ----------
insert into public.sections (key, label, page, eyebrow, title, subtitle, is_visible, sort_order)
values ('all_products','All products grid','products','The Full Petti','All Our Snacks',
        'Every recipe we make, hand-cut and roasted in coconut oil. Pick a pack size and add it to your petti.',
        true,0)
on conflict (key) do nothing;

-- ---------- put each section on its page ----------
update public.sections set page = 'home'      where key in ('hero','peek','products','process');
update public.sections set page = 'products'  where key = 'all_products';
update public.sections set page = 'our-story' where key in ('story','stats','why');
update public.sections set page = 'combos'    where key in ('combos','offers');
update public.sections set page = 'wholesale' where key = 'wholesale';
update public.sections set page = 'reviews'   where key = 'testimonials';
update public.sections set page = 'faq'       where key = 'faq';
update public.sections set page = 'contact'   where key = 'contact';
-- these render on every page, not just one
update public.sections set page = 'global'    where key in ('announcement','newsletter','float_whatsapp');

-- ---------- ordering within each page ----------
update public.sections set sort_order = 0 where key in ('hero','story','combos','wholesale','testimonials','faq','contact');
update public.sections set sort_order = 1 where key in ('products','stats');
update public.sections set sort_order = 2 where key in ('process','why','offers');

-- ---------- point the menu at the real routes ----------
delete from public.nav_links;
insert into public.nav_links (label, href, is_active, sort_order) values
  ('Home','/',true,0),
  ('Our Story','/our-story',true,1),
  ('Products','/products',true,2),
  ('Combos','/combos',true,3),
  ('Wholesale','/wholesale',true,4),
  ('Reviews','/reviews',true,5),
  ('FAQ','/faq',true,6),
  ('Contact','/contact',true,7);
