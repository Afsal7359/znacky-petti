import { createPublicClient } from '@/lib/supabase/public'
import { DEFAULT_PAGES, DEFAULT_PAGE_SECTIONS } from '@/lib/pages'
import type {
  Faq,
  Page,
  HeroSlide,
  NavLink,
  Offer,
  PeekItem,
  ProcessStep,
  Product,
  Section,
  SiteData,
  SiteSettings,
  Stat,
  StoryContent,
  Testimonial,
  WhyFeature,
} from '@/lib/types'

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  brand_name: 'Znacky Petti',
  tagline: 'Unbox the Taste of Kerala',
  logo_url: '/brand/logo.webp',
  hero_image_url: '/brand/chest.webp',
  favicon_emoji: '🍌',
  meta_title: 'Znacky Petti — Unbox the Taste of Kerala',
  meta_description:
    'Handcrafted Kerala snacks — banana chips, murukku, sharkkara varatti and more. Roasted in coconut oil, packed fresh, delivered pan-India.',
  whatsapp_number: '919745212345',
  phone: '+91 97452 12345',
  email: 'info@znackypetti.com',
  address: 'Znacky Petti, Kerala, India',
  business_hours: 'Mon – Sat, 9:00 AM – 7:00 PM',
  instagram_url: '',
  facebook_url: '',
  youtube_url: '',
  map_embed_url:
    'https://maps.google.com/maps?q=Kerala%2C%20India&t=&z=8&ie=UTF8&iwloc=&output=embed',
  footer_about:
    'Znacky Petti is a Kerala-based brand delivering authentic, crispy and delicious snacks made with love and traditional recipes — packed fresh and shipped pan-India.',
  copyright_text: 'Znacky Petti. All Rights Reserved.',
  currency_symbol: '₹',
  delivery_charge: 0,
  free_delivery_above: 999,
  cart_enabled: true,
  checkout_enabled: true,
  announcement_text: 'Free shipping on orders above ₹999 · Packed fresh every week',
  announcement_enabled: true,
}

/**
 * Sections that used to live on the home page now have their own routes. If the menu in
 * the database still points at the old in-page anchors, send it to the right page so the
 * navigation keeps working before 03_multipage.sql is run.
 */
const LEGACY_NAV: Record<string, string> = {
  '/#products': '/products',
  '/#story': '/our-story',
  '/#stats': '/our-story',
  '/#why': '/our-story',
  '/#combos': '/combos',
  '/#offers': '/combos',
  '/#wholesale': '/wholesale',
  '/#testimonials': '/reviews',
  '/#reviews': '/reviews',
  '/#faq': '/faq',
  '/#contact': '/contact',
}

function normaliseNav(links: NavLink[]): NavLink[] {
  return links.map((l) => ({ ...l, href: LEGACY_NAV[l.href] ?? l.href }))
}

/** True only when real credentials exist — the admin panel needs these. */
export function supabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

/** DEMO_MODE=1 renders the site from bundled sample content, with no database. */
export function demoMode() {
  return process.env.DEMO_MODE === '1'
}

function emptyData(): SiteData {
  return {
    settings: DEFAULT_SETTINGS,
    pages: DEFAULT_PAGES,
    sections: {},
    nav: [],
    slides: [],
    products: [],
    combos: [],
    offers: [],
    stats: [],
    why: [],
    process: [],
    story: null,
    testimonials: [],
    faqs: [],
    peek: [],
  }
}

/** Loads everything the public site renders, in one round trip batch. */
export async function getSiteData(): Promise<SiteData> {
  if (demoMode()) return (await import('@/lib/demo-data')).DEMO
  if (!supabaseConfigured()) return emptyData()

  try {
    const supabase = createPublicClient()

    const [
      settings,
      pages,
      sections,
      nav,
      slides,
      products,
      offers,
      stats,
      why,
      process,
      story,
      testimonials,
      faqs,
      peek,
    ] = await Promise.all([
      supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
      // `pages` only exists after 03_multipage.sql — fall back until it is run
      supabase.from('pages').select('*').order('sort_order'),
      supabase.from('sections').select('*').order('sort_order'),
      supabase.from('nav_links').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('hero_slides').select('*').eq('is_active', true).order('sort_order'),
      supabase
        .from('products')
        .select('*, product_variants(*), categories(name, slug)')
        .eq('is_active', true)
        .order('sort_order'),
      supabase.from('offers').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('stats').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('why_features').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('process_steps').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('story_content').select('*').eq('id', 1).maybeSingle(),
      supabase.from('testimonials').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('faqs').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('peek_items').select('*').eq('is_active', true).order('sort_order'),
    ])

    const allProducts = (products.data ?? []) as Product[]
    const sectionMap: Record<string, Section> = {}
    for (const s of (sections.data ?? []) as Section[]) sectionMap[s.key] = s

    return {
      settings: { ...DEFAULT_SETTINGS, ...(settings.data ?? {}) } as SiteSettings,
      pages: pages.data?.length ? (pages.data as Page[]) : DEFAULT_PAGES,
      sections: sectionMap,
      nav: normaliseNav((nav.data ?? []) as NavLink[]),
      slides: (slides.data ?? []) as HeroSlide[],
      products: allProducts.filter((p) => p.type === 'product').map(sortVariants),
      combos: allProducts.filter((p) => p.type === 'combo').map(sortVariants),
      offers: (offers.data ?? []) as Offer[],
      stats: (stats.data ?? []) as Stat[],
      why: (why.data ?? []) as WhyFeature[],
      process: (process.data ?? []) as ProcessStep[],
      story: (story.data ?? null) as StoryContent | null,
      testimonials: (testimonials.data ?? []) as Testimonial[],
      faqs: (faqs.data ?? []) as Faq[],
      peek: (peek.data ?? []) as PeekItem[],
    }
  } catch (err) {
    console.error('[znacky] getSiteData failed:', err)
    return emptyData()
  }
}

function sortVariants(p: Product): Product {
  const variants = (p.product_variants ?? [])
    .filter((v) => v.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
  return { ...p, product_variants: variants }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (demoMode()) {
    const demo = (await import('@/lib/demo-data')).DEMO
    return [...demo.products, ...demo.combos].find((p) => p.slug === slug) ?? null
  }
  if (!supabaseConfigured()) return null
  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('products')
      .select('*, product_variants(*), categories(name, slug)')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()
    return data ? sortVariants(data as Product) : null
  } catch {
    return null
  }
}

export async function getRelatedProducts(
  slug: string,
  type: 'product' | 'combo',
  limit = 4
): Promise<Product[]> {
  if (demoMode()) {
    const demo = (await import('@/lib/demo-data')).DEMO
    return (type === 'combo' ? demo.combos : demo.products)
      .filter((p) => p.slug !== slug)
      .slice(0, limit)
  }
  if (!supabaseConfigured()) return []
  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('is_active', true)
      .eq('type', type)
      .neq('slug', slug)
      .order('sort_order')
      .limit(limit)
    return ((data ?? []) as Product[]).map(sortVariants)
  } catch {
    return []
  }
}

export async function getAllProductSlugs(): Promise<string[]> {
  if (!supabaseConfigured()) return []
  try {
    const supabase = createPublicClient()
    const { data } = await supabase.from('products').select('slug').eq('is_active', true)
    return (data ?? []).map((r: { slug: string }) => r.slug)
  } catch {
    return []
  }
}

export async function getSettings(): Promise<SiteSettings> {
  if (!supabaseConfigured()) return DEFAULT_SETTINGS
  try {
    const supabase = createPublicClient()
    const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
    return { ...DEFAULT_SETTINGS, ...(data ?? {}) } as SiteSettings
  } catch {
    return DEFAULT_SETTINGS
  }
}

/**
 * The ordered section keys that render on a page.
 *
 * Uses the `sections.page` column when the migration has been run; otherwise falls back
 * to the built-in layout. Visibility toggles are respected either way.
 */
export function sectionsForPage(data: SiteData, pageKey: string): string[] {
  const all = Object.values(data.sections)
  const migrated = all.some((s) => typeof s.page === 'string' && s.page.length > 0)

  if (migrated) {
    return all
      .filter((s) => s.page === pageKey && s.is_visible !== false)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => s.key)
  }

  return (DEFAULT_PAGE_SECTIONS[pageKey] ?? []).filter(
    (k) => data.sections[k]?.is_visible !== false
  )
}

/** Look up one page's settings, falling back to the built-in definition. */
export function getPage(data: SiteData, key: string): Page | null {
  return (
    data.pages.find((p) => p.key === key) ?? DEFAULT_PAGES.find((p) => p.key === key) ?? null
  )
}

/** Pages that should appear in the header / footer menus. */
export function navPages(data: SiteData): Page[] {
  return data.pages
    .filter((p) => p.is_visible !== false && p.show_in_nav !== false)
    .sort((a, b) => a.sort_order - b.sort_order)
}
