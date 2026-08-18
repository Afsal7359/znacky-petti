-- ============================================================
--  ZNACKY PETTI — Database schema
--  Run this FIRST in Supabase → SQL Editor → New query
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. SITE SETTINGS  (single row, id = 1)
-- ------------------------------------------------------------
create table if not exists public.site_settings (
  id                integer primary key default 1,
  brand_name        text    not null default 'Znacky Petti',
  tagline           text    default 'Unbox the Taste of Kerala',
  logo_url          text    default '/brand/logo.webp',
  hero_image_url    text    default '/brand/chest.webp',
  favicon_emoji     text    default '🍌',
  meta_title        text    default 'Znacky Petti — Unbox the Taste of Kerala',
  meta_description  text    default 'Handcrafted Kerala snacks — banana chips, murukku, sharkkara varatti and more. Roasted in coconut oil, packed fresh, delivered pan-India.',
  whatsapp_number   text    not null default '919745212345',
  phone             text    default '+91 97452 12345',
  email             text    default 'info@znackypetti.com',
  address           text    default 'Znacky Petti, Kerala, India',
  business_hours    text    default 'Mon – Sat, 9:00 AM – 7:00 PM',
  instagram_url     text    default '',
  facebook_url      text    default '',
  youtube_url       text    default '',
  map_embed_url     text    default 'https://maps.google.com/maps?q=Kerala%2C%20India&t=&z=8&ie=UTF8&iwloc=&output=embed',
  footer_about      text    default 'Znacky Petti is a Kerala-based brand delivering authentic, crispy and delicious snacks made with love and traditional recipes — packed fresh and shipped pan-India.',
  copyright_text    text    default 'Znacky Petti. All Rights Reserved.',
  currency_symbol   text    not null default '₹',
  delivery_charge   numeric not null default 0,
  free_delivery_above numeric not null default 999,
  cart_enabled      boolean not null default true,
  checkout_enabled  boolean not null default true,
  announcement_text text    default 'Free shipping on orders above ₹999 · Packed fresh every week',
  announcement_enabled boolean not null default true,
  updated_at        timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1)
);

-- ------------------------------------------------------------
-- 2. SECTIONS  (visibility + editable headings for every block)
-- ------------------------------------------------------------
create table if not exists public.sections (
  id          uuid primary key default gen_random_uuid(),
  key         text unique not null,
  label       text not null,
  eyebrow     text default '',
  title       text default '',
  subtitle    text default '',
  is_visible  boolean not null default true,
  sort_order  integer not null default 0,
  updated_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3. NAV LINKS
-- ------------------------------------------------------------
create table if not exists public.nav_links (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  href       text not null,
  is_active  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 4. HERO SLIDES  (sliding images in the hero section)
-- ------------------------------------------------------------
create table if not exists public.hero_slides (
  id          uuid primary key default gen_random_uuid(),
  image_url   text not null,
  alt_text    text default '',
  headline    text default '',
  subheadline text default '',
  cta_label   text default '',
  cta_link    text default '',
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 5. CATEGORIES
-- ------------------------------------------------------------
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text unique not null,
  is_active  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 6. PRODUCTS   (type = 'product' | 'combo')
-- ------------------------------------------------------------
create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  type           text not null default 'product' check (type in ('product','combo')),
  name           text not null,
  slug           text unique not null,
  local_name     text default '',
  short_desc     text default '',
  long_desc      text default '',
  image_url      text default '',
  gallery        jsonb not null default '[]'::jsonb,
  price          numeric not null default 0,
  mrp            numeric,
  unit_label     text default '250g',
  badge          text default '',
  badge_color    text default 'maroon',
  category_id    uuid references public.categories(id) on delete set null,
  ingredients    text default '',
  shelf_life     text default '',
  in_stock       boolean not null default true,
  is_featured    boolean not null default false,
  is_active      boolean not null default true,
  show_in_peek   boolean not null default true,
  rating         numeric not null default 5,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists products_type_idx on public.products(type);
create index if not exists products_slug_idx on public.products(slug);

-- ------------------------------------------------------------
-- 7. PRODUCT VARIANTS  (100g / 250g / 500g ...)
-- ------------------------------------------------------------
create table if not exists public.product_variants (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label      text not null,
  price      numeric not null default 0,
  mrp        numeric,
  in_stock   boolean not null default true,
  is_default boolean not null default false,
  is_active  boolean not null default true,
  sort_order integer not null default 0
);
create index if not exists product_variants_product_idx on public.product_variants(product_id);

-- ------------------------------------------------------------
-- 8. OFFERS
-- ------------------------------------------------------------
create table if not exists public.offers (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  subtitle     text default '',
  description  text default '',
  code         text default '',
  discount_text text default '',
  image_url    text default '',
  accent       text default 'gold',
  cta_label    text default 'Grab this offer',
  cta_link     text default '',
  valid_until  date,
  is_active    boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 9. STATS STRIP
-- ------------------------------------------------------------
create table if not exists public.stats (
  id         uuid primary key default gen_random_uuid(),
  value      integer not null default 0,
  suffix     text default '',
  label      text not null,
  is_active  boolean not null default true,
  sort_order integer not null default 0
);

-- ------------------------------------------------------------
-- 10. WHY ZNACKY PETTI
-- ------------------------------------------------------------
create table if not exists public.why_features (
  id          uuid primary key default gen_random_uuid(),
  icon        text not null default 'leaf',
  title       text not null,
  description text default '',
  highlight   text default '',
  is_active   boolean not null default true,
  sort_order  integer not null default 0
);

-- ------------------------------------------------------------
-- 11. OUR PROCESS
-- ------------------------------------------------------------
create table if not exists public.process_steps (
  id          uuid primary key default gen_random_uuid(),
  step_no     text not null default '01',
  icon        text not null default 'sprout',
  title       text not null,
  description text default '',
  image_url   text default '',
  is_active   boolean not null default true,
  sort_order  integer not null default 0
);

-- ------------------------------------------------------------
-- 12. STORY  (single row, id = 1)
-- ------------------------------------------------------------
create table if not exists public.story_content (
  id           integer primary key default 1,
  image_url    text default '',
  badge_number text default '12+',
  badge_text   text default 'Family kitchens we partner with across Kerala',
  body         jsonb not null default '[]'::jsonb,
  signature    text default '— Handcrafted by home cooks across Kerala',
  cta_label    text default '',
  cta_link     text default '',
  updated_at   timestamptz not null default now(),
  constraint story_single_row check (id = 1)
);

-- ------------------------------------------------------------
-- 13. TESTIMONIALS
-- ------------------------------------------------------------
create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  location   text default '',
  quote      text not null,
  rating     integer not null default 5,
  initials   text default '',
  color      text default 'maroon',
  avatar_url text default '',
  is_active  boolean not null default true,
  sort_order integer not null default 0
);

-- ------------------------------------------------------------
-- 14. FAQ
-- ------------------------------------------------------------
create table if not exists public.faqs (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  answer     text not null,
  is_active  boolean not null default true,
  sort_order integer not null default 0
);

-- ------------------------------------------------------------
-- 15. PEEK ITEMS  (marquee strip under the hero)
-- ------------------------------------------------------------
create table if not exists public.peek_items (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  image_url  text default '',
  link       text default '',
  is_active  boolean not null default true,
  sort_order integer not null default 0
);

-- ------------------------------------------------------------
-- 16. ORDERS
-- ------------------------------------------------------------
create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  order_number   text unique not null,
  customer_name  text not null,
  phone          text not null,
  email          text default '',
  address_line1  text not null,
  address_line2  text default '',
  city           text not null,
  state          text default '',
  pincode        text not null,
  landmark       text default '',
  note           text default '',
  items          jsonb not null default '[]'::jsonb,
  subtotal       numeric not null default 0,
  delivery_charge numeric not null default 0,
  total          numeric not null default 0,
  payment_method text not null default 'whatsapp',
  status         text not null default 'new' check (status in ('new','confirmed','packed','shipped','delivered','cancelled')),
  created_at     timestamptz not null default now()
);
create index if not exists orders_created_idx on public.orders(created_at desc);

-- ------------------------------------------------------------
-- 17. CONTACT MESSAGES
-- ------------------------------------------------------------
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text default '',
  phone      text default '',
  message    text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 18. NEWSLETTER SUBSCRIBERS
-- ------------------------------------------------------------
create table if not exists public.subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 19. KEEP-ALIVE LOG  (written daily so the project never idles)
-- ------------------------------------------------------------
create table if not exists public.keepalive_log (
  id         uuid primary key default gen_random_uuid(),
  source     text not null default 'cron',
  pinged_at  timestamptz not null default now()
);
create index if not exists keepalive_pinged_idx on public.keepalive_log(pinged_at desc);

-- ============================================================
--  ROW LEVEL SECURITY
--  · anyone (anon) can READ active content
--  · anyone can INSERT an order / message / subscriber
--  · only a logged-in admin (authenticated) can write content
-- ============================================================

do $$
declare
  t text;
  public_read text[] := array[
    'site_settings','sections','nav_links','hero_slides','categories','products',
    'product_variants','offers','stats','why_features','process_steps',
    'story_content','testimonials','faqs','peek_items'
  ];
  public_insert text[] := array['orders','contact_messages','subscribers','keepalive_log'];
begin
  -- content tables: public read, admin write
  foreach t in array public_read loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public read %1$s" on public.%1$I', t);
    execute format('create policy "public read %1$s" on public.%1$I for select using (true)', t);
    execute format('drop policy if exists "admin write %1$s" on public.%1$I', t);
    execute format('create policy "admin write %1$s" on public.%1$I for all to authenticated using (true) with check (true)', t);
  end loop;

  -- submission tables: public insert, admin read/update/delete
  foreach t in array public_insert loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public insert %1$s" on public.%1$I', t);
    execute format('create policy "public insert %1$s" on public.%1$I for insert with check (true)', t);
    execute format('drop policy if exists "admin all %1$s" on public.%1$I', t);
    execute format('create policy "admin all %1$s" on public.%1$I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- keepalive log is also readable by anyone (harmless, keeps the ping cheap)
drop policy if exists "public read keepalive_log" on public.keepalive_log;
create policy "public read keepalive_log" on public.keepalive_log for select using (true);

-- ============================================================
--  STORAGE  — public "media" bucket for admin image uploads
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update to authenticated using (bucket_id = 'media');

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media');

-- ============================================================
--  ORDER NUMBER GENERATOR
-- ============================================================
create or replace function public.next_order_number()
returns text
language plpgsql
as $$
declare
  seq_val bigint;
begin
  select count(*) + 1 into seq_val from public.orders;
  return 'ZP' || to_char(now(), 'YYMMDD') || lpad(seq_val::text, 4, '0');
end;
$$;

-- ============================================================
--  KEEP-ALIVE RPC — call this daily from anywhere
-- ============================================================
create or replace function public.keepalive(src text default 'cron')
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  product_count integer;
begin
  insert into public.keepalive_log (source) values (coalesce(src, 'cron'));
  delete from public.keepalive_log
   where pinged_at < now() - interval '90 days';
  select count(*) into product_count from public.products;
  return json_build_object(
    'ok', true,
    'pinged_at', now(),
    'source', coalesce(src, 'cron'),
    'products', product_count
  );
end;
$$;

grant execute on function public.keepalive(text) to anon, authenticated;
