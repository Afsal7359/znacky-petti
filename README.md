# Znacky Petti — Next.js + Supabase

The full site rebuilt in Next.js 15 (App Router, TypeScript) with a Supabase database
behind it. Every word, image, price, section and toggle on the public site is managed
from the admin panel at `/admin` — nothing is hard-coded.

---

## 1. Setup (about 10 minutes)

### a. Install

```bash
npm install
```

### b. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Open **SQL Editor → New query**, paste all of `supabase/01_schema.sql`, press **Run**.
   This creates every table, the security rules, the image storage bucket and the
   keep-alive function.
3. New query again → paste `supabase/02_seed.sql` → **Run**.
   This fills the site with the current content (8 products, 4 combos, offers, FAQs…).

### c. Create your admin login

Supabase → **Authentication → Users → Add user**.
Enter your email + a password and tick *Auto Confirm User*.
That email/password is what you use at `/admin/login`.

### d. Add the environment variables

Copy `.env.example` to `.env.local` and fill in the two required values from
Supabase → **Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### e. Run it

```bash
npm run dev
```

- Website → http://localhost:3000
- Admin panel → http://localhost:3000/admin

> Want to see the design before setting up the database? Run
> `DEMO_MODE=1 npm run dev` — the site renders from bundled sample content.

---

## 2. What you can manage from the admin panel

| Admin page | Controls |
|---|---|
| **Dashboard** | Counts, recent orders, keep-alive status |
| **Orders** | Every checkout, status (new → delivered), CSV export, WhatsApp the customer |
| **Messages** | Contact-form submissions, mark read, reply |
| **Subscribers** | Newsletter emails, copy all |
| **Products** | Name, slug, images, prices, MRP, ribbon, pack sizes, stock, description, ingredients |
| **Combo pettis** | The Special Combo section — same fields plus savings ribbon |
| **Categories** | Product grouping |
| **Offers** | The coloured offer cards, coupon codes, colours, expiry |
| **Sections & visibility** | Show/hide **every** home-page block, reorder them, edit each heading |
| **Hero slider** | The sliding images in the hero — add as many as you want, set the order |
| **Peek strip** | The scrolling round badges under the hero |
| **Our story** | Photo, badge, paragraphs, signature |
| **Stats strip** | The counting numbers |
| **Why Znacky Petti** | Cards, icons, descriptions, chips |
| **Our process** | Timeline steps, icons, numbers, optional images |
| **Testimonials** | Quotes, names, ratings, avatars |
| **FAQs** | Questions and answers |
| **Site settings** | Brand, logo, WhatsApp number, phone, email, address, socials, delivery rules, announcement bar, footer, SEO |
| **Navigation menu** | Header / drawer / footer links |
| **Keep-alive** | Ping history and a manual "Ping now" button |

Every list has a **Visible / Hidden** switch and ↑ ↓ ordering arrows. Hiding something
removes it from the live site without deleting it.

**Images:** any image field can either take a URL or upload a file straight to Supabase
Storage (the public `media` bucket, created by the schema script).

---

## 3. How the shop works

1. **Product cards** show the image full-bleed at the top, the ribbon, the discount, the
   price and MRP, the pack sizes, an **Add to Cart** button and a WhatsApp icon button.
2. **Every product has its own page at the root slug** — `/banana-chips`,
   `/onam-sadya-petti`. The slug is editable per product in the admin panel.
3. **Cart** lives in the header (with a live count) and opens as a side drawer.
   It persists in the browser via `localStorage`.
4. **Checkout** (`/checkout`) collects name, phone, email, full address, PIN code,
   landmark and an order note. On submit it:
   - saves the order to the `orders` table (so it appears in the admin panel), then
   - opens WhatsApp with the complete order written out — every item, quantity,
     line total, subtotal, delivery, grand total and the full delivery address.

   The exact message is previewed live on the checkout page while the customer types.

The cart and checkout can both be switched off in **Site settings** if you ever want to
go back to WhatsApp-only ordering.

---

## 4. Daily keep-alive

Supabase pauses free projects after about a week of inactivity. Three ways to prevent
that are already wired up — you only need one, but two are set up as a safety net.

**a. Vercel Cron** (`vercel.json`) — runs daily at 06:00 UTC once deployed to Vercel:

```json
{ "crons": [{ "path": "/api/keepalive", "schedule": "0 6 * * *" }] }
```

**b. GitHub Action** (`.github/workflows/keepalive.yml`) — also daily, and it pings the
website itself as well. Add these repository secrets:
`SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and optionally
`CRON_SECRET`.

**c. By hand / your own server:**

```bash
npm run keepalive
```

or a plain crontab entry:

```
0 6 * * * cd /path/to/znacky-petti && /usr/bin/node scripts/keepalive.mjs >> keepalive.log 2>&1
```

Each run writes a row to `keepalive_log` (real database activity) and reads back a
count, and the API route also wakes the website. History is visible at
`/admin/keepalive`, with a **Ping now** button to test it.

Set `CRON_SECRET` in your environment to require
`Authorization: Bearer <secret>` (or `?secret=…`) on `/api/keepalive`.

---

## 5. Deploying

1. Push the project to GitHub.
2. Import it on [vercel.com](https://vercel.com).
3. Add the environment variables from `.env.local` in the Vercel project settings
   (plus `SITE_URL` and `CRON_SECRET` if you use one).
4. Deploy. The cron in `vercel.json` starts running automatically.

Content changes made in the admin panel appear on the live site within a minute
(pages revalidate every 60 seconds).

---

## 6. Project layout

```
app/
  page.tsx              home page — renders sections in the admin-defined order
  [slug]/page.tsx       product & combo detail pages
  checkout/page.tsx     checkout form
  api/keepalive/        daily ping endpoint
  admin/                the whole admin panel
components/
  sections/             one component per home-page section
  admin/                reusable CRUD engine used by every admin page
  ProductCard.tsx       the redesigned card
  CartProvider.tsx      cart state + localStorage
lib/
  supabase/             browser / server / middleware clients
  data.ts               all site queries
  utils.ts              money, WhatsApp message builder, slugs
supabase/
  01_schema.sql         tables, security, storage, keep-alive function
  02_seed.sql           the starting content
scripts/keepalive.mjs   standalone daily ping script
legacy/index.html       the original single-file site, kept for reference
```

---

## 7. Notes

- **Font:** Roboto throughout, loaded through `next/font` (self-hosted, no external
  request).
- **Security:** the database uses row level security — visitors can read published
  content and submit orders/messages, but only a signed-in admin can change anything.
  `/admin` is protected by middleware.
- **The original design** is preserved section for section; the product card, the
  *Why Znacky Petti* grid and the *Our Process* timeline were rebuilt as requested,
  the hero got the image slider, and the rotating cart icon in the business section
  is now static.
