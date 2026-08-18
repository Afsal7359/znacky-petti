export type SiteSettings = {
  id: number
  brand_name: string
  tagline: string | null
  logo_url: string | null
  hero_image_url: string | null
  favicon_emoji: string | null
  meta_title: string | null
  meta_description: string | null
  whatsapp_number: string
  phone: string | null
  email: string | null
  address: string | null
  business_hours: string | null
  instagram_url: string | null
  facebook_url: string | null
  youtube_url: string | null
  map_embed_url: string | null
  footer_about: string | null
  copyright_text: string | null
  currency_symbol: string
  delivery_charge: number
  free_delivery_above: number
  cart_enabled: boolean
  checkout_enabled: boolean
  announcement_text: string | null
  announcement_enabled: boolean
  updated_at?: string
}

export type Section = {
  id: string
  key: string
  label: string
  eyebrow: string | null
  title: string | null
  subtitle: string | null
  is_visible: boolean
  sort_order: number
}

export type NavLink = {
  id: string
  label: string
  href: string
  is_active: boolean
  sort_order: number
}

export type HeroSlide = {
  id: string
  image_url: string
  alt_text: string | null
  headline: string | null
  subheadline: string | null
  cta_label: string | null
  cta_link: string | null
  is_active: boolean
  sort_order: number
}

export type Category = {
  id: string
  name: string
  slug: string
  is_active: boolean
  sort_order: number
}

export type ProductVariant = {
  id: string
  product_id: string
  label: string
  price: number
  mrp: number | null
  in_stock: boolean
  is_default: boolean
  is_active: boolean
  sort_order: number
}

export type Product = {
  id: string
  type: 'product' | 'combo'
  name: string
  slug: string
  local_name: string | null
  short_desc: string | null
  long_desc: string | null
  image_url: string | null
  gallery: string[]
  price: number
  mrp: number | null
  unit_label: string | null
  badge: string | null
  badge_color: string | null
  category_id: string | null
  ingredients: string | null
  shelf_life: string | null
  in_stock: boolean
  is_featured: boolean
  is_active: boolean
  show_in_peek: boolean
  rating: number
  sort_order: number
  created_at?: string
  product_variants?: ProductVariant[]
  categories?: Pick<Category, 'name' | 'slug'> | null
}

export type Offer = {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  code: string | null
  discount_text: string | null
  image_url: string | null
  accent: string | null
  cta_label: string | null
  cta_link: string | null
  valid_until: string | null
  is_active: boolean
  sort_order: number
}

export type Stat = {
  id: string
  value: number
  suffix: string | null
  label: string
  is_active: boolean
  sort_order: number
}

export type WhyFeature = {
  id: string
  icon: string
  title: string
  description: string | null
  highlight: string | null
  is_active: boolean
  sort_order: number
}

export type ProcessStep = {
  id: string
  step_no: string
  icon: string
  title: string
  description: string | null
  image_url: string | null
  is_active: boolean
  sort_order: number
}

export type StoryContent = {
  id: number
  image_url: string | null
  badge_number: string | null
  badge_text: string | null
  body: string[]
  signature: string | null
  cta_label: string | null
  cta_link: string | null
}

export type Testimonial = {
  id: string
  name: string
  location: string | null
  quote: string
  rating: number
  initials: string | null
  color: string | null
  avatar_url: string | null
  is_active: boolean
  sort_order: number
}

export type Faq = {
  id: string
  question: string
  answer: string
  is_active: boolean
  sort_order: number
}

export type PeekItem = {
  id: string
  title: string
  image_url: string | null
  link: string | null
  is_active: boolean
  sort_order: number
}

export type OrderItem = {
  product_id: string
  name: string
  slug: string
  variant: string
  price: number
  qty: number
  line_total: number
}

export type Order = {
  id: string
  order_number: string
  customer_name: string
  phone: string
  email: string | null
  address_line1: string
  address_line2: string | null
  city: string
  state: string | null
  pincode: string
  landmark: string | null
  note: string | null
  items: OrderItem[]
  subtotal: number
  delivery_charge: number
  total: number
  payment_method: string
  status: 'new' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
}

export type ContactMessage = {
  id: string
  name: string
  email: string | null
  phone: string | null
  message: string
  is_read: boolean
  created_at: string
}

export type Subscriber = {
  id: string
  email: string
  created_at: string
}

export type SiteData = {
  settings: SiteSettings
  sections: Record<string, Section>
  nav: NavLink[]
  slides: HeroSlide[]
  products: Product[]
  combos: Product[]
  offers: Offer[]
  stats: Stat[]
  why: WhyFeature[]
  process: ProcessStep[]
  story: StoryContent | null
  testimonials: Testimonial[]
  faqs: Faq[]
  peek: PeekItem[]
}
