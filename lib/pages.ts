import type { Page } from '@/lib/types'

/**
 * The site's page structure.
 *
 * The `pages` table in Supabase is the real source of truth — the admin panel edits it.
 * These defaults are what renders if 03_multipage.sql has not been run yet, so the site
 * keeps working during the migration instead of going blank.
 */
export const DEFAULT_PAGES: Page[] = [
  {
    id: 'home',
    key: 'home',
    slug: '',
    label: 'Home',
    nav_label: 'Home',
    eyebrow: '',
    title: '',
    subtitle: '',
    banner_image: '',
    meta_title: '',
    meta_description: '',
    show_in_nav: true,
    show_header: false,
    is_visible: true,
    sort_order: 0,
  },
  {
    id: 'products',
    key: 'products',
    slug: 'products',
    label: 'Products',
    nav_label: 'Products',
    eyebrow: 'The Full Petti',
    title: 'All Our Snacks',
    subtitle:
      'Every recipe we make, hand-cut and roasted in coconut oil. Pick a pack size and add it to your petti.',
    banner_image: '',
    meta_title: 'All Products — Znacky Petti',
    meta_description:
      'Browse every Znacky Petti snack — banana chips, sharkkara varatti, murukku, tapioca chips and more, delivered pan-India.',
    show_in_nav: true,
    show_header: true,
    is_visible: true,
    sort_order: 1,
  },
  {
    id: 'our-story',
    key: 'our-story',
    slug: 'our-story',
    label: 'Our Story',
    nav_label: 'Our Story',
    eyebrow: 'Our Story',
    title: 'A Petti Full of Home',
    subtitle: 'The people, the kitchens and the standards behind every box we pack.',
    banner_image: '',
    meta_title: 'Our Story — Znacky Petti',
    meta_description:
      'How Znacky Petti works with small family kitchens across Kerala to make snacks the traditional way.',
    show_in_nav: true,
    show_header: true,
    is_visible: true,
    sort_order: 2,
  },
  {
    id: 'combos',
    key: 'combos',
    slug: 'combos',
    label: 'Combos & Offers',
    nav_label: 'Combos',
    eyebrow: 'Save More',
    title: 'Special Combo Pettis',
    subtitle:
      'Hand-picked bundles at a better price — perfect for gifting, festivals and big families.',
    banner_image: '',
    meta_title: 'Combo Pettis & Offers — Znacky Petti',
    meta_description:
      'Save more with hand-picked Kerala snack bundles and running seasonal offers.',
    show_in_nav: true,
    show_header: true,
    is_visible: true,
    sort_order: 3,
  },
  {
    id: 'wholesale',
    key: 'wholesale',
    slug: 'wholesale',
    label: 'Wholesale',
    nav_label: 'Wholesale',
    eyebrow: 'For Businesses',
    title: 'Bring Znacky Petti to Your Store',
    subtitle:
      'Bulk pricing, custom packaging and reliable supply for cafés, retailers and corporate gifting.',
    banner_image: '',
    meta_title: 'Wholesale & Bulk Orders — Znacky Petti',
    meta_description:
      'Bulk Kerala snack supply with custom packaging and branding for cafés, stores and corporate gifting.',
    show_in_nav: true,
    show_header: true,
    is_visible: true,
    sort_order: 4,
  },
  {
    id: 'reviews',
    key: 'reviews',
    slug: 'reviews',
    label: 'Reviews',
    nav_label: 'Reviews',
    eyebrow: 'Customer Love',
    title: 'From Our Petti to Your Table',
    subtitle: 'A few notes from people who have unboxed one already.',
    banner_image: '',
    meta_title: 'Customer Reviews — Znacky Petti',
    meta_description:
      'What customers across India and abroad say about Znacky Petti Kerala snacks.',
    show_in_nav: true,
    show_header: true,
    is_visible: true,
    sort_order: 5,
  },
  {
    id: 'faq',
    key: 'faq',
    slug: 'faq',
    label: 'FAQ',
    nav_label: 'FAQ',
    eyebrow: 'Good to Know',
    title: 'Frequently Asked Questions',
    subtitle: 'Everything about freshness, delivery, oil and ordering — answered.',
    banner_image: '',
    meta_title: 'FAQ — Znacky Petti',
    meta_description:
      'Answers about shelf life, pan-India delivery, coconut oil, bulk orders and how to order.',
    show_in_nav: true,
    show_header: true,
    is_visible: true,
    sort_order: 6,
  },
  {
    id: 'contact',
    key: 'contact',
    slug: 'contact',
    label: 'Contact',
    nav_label: 'Contact',
    eyebrow: 'Get In Touch',
    title: "Let's Talk Snacks",
    subtitle: 'Questions, bulk orders, or just craving banana chips? We would love to hear from you.',
    banner_image: '',
    meta_title: 'Contact — Znacky Petti',
    meta_description:
      'Reach Znacky Petti on WhatsApp, phone or email for orders, bulk enquiries and support.',
    show_in_nav: true,
    show_header: true,
    is_visible: true,
    sort_order: 7,
  },
]

/** Which sections belong to which page, before the database says otherwise. */
export const DEFAULT_PAGE_SECTIONS: Record<string, string[]> = {
  home: ['hero', 'products', 'process'],
  products: ['all_products'],
  'our-story': ['story', 'stats', 'why'],
  combos: ['combos', 'offers'],
  wholesale: ['wholesale'],
  reviews: ['testimonials'],
  faq: ['faq'],
  contact: ['contact'],
}

/** Sections that render on every page rather than belonging to one. */
export const GLOBAL_SECTIONS = ['announcement', 'newsletter', 'float_whatsapp']

/** Route slugs the product [slug] page must never be allowed to shadow. */
export const RESERVED_SLUGS = [
  ...DEFAULT_PAGES.map((p) => p.slug).filter(Boolean),
  'admin',
  'api',
  'checkout',
  'cart',
  'products',
  '_next',
]
