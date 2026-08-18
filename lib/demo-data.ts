// TEMPORARY preview data — used only to screenshot the design locally.
import type { SiteData } from '@/lib/types'
import { DEFAULT_SETTINGS } from '@/lib/data'

const s = (key: string, label: string, eyebrow: string, title: string, subtitle: string, order: number) => ({
  id: key, key, label, eyebrow, title, subtitle, is_visible: true, sort_order: order,
})

const variants = (id: string, base: number) => [
  { id: id + 'a', product_id: id, label: '100g', price: Math.round(base * 0.45), mrp: Math.round(base * 0.55), in_stock: true, is_default: false, is_active: true, sort_order: 0 },
  { id: id + 'b', product_id: id, label: '250g', price: base, mrp: Math.round(base * 1.2), in_stock: true, is_default: true, is_active: true, sort_order: 1 },
  { id: id + 'c', product_id: id, label: '500g', price: Math.round(base * 1.85), mrp: Math.round(base * 2.2), in_stock: true, is_default: false, is_active: true, sort_order: 2 },
]

const P = (i: number, name: string, slug: string, local: string, desc: string, img: string, price: number, badge = '', color = 'maroon') => ({
  id: 'p' + i, type: 'product' as const, name, slug, local_name: local, short_desc: desc, long_desc: desc,
  image_url: img, gallery: [], price, mrp: Math.round(price * 1.2), unit_label: '250g', badge, badge_color: color,
  category_id: null, ingredients: 'Coconut oil, salt', shelf_life: '45 days', in_stock: true, is_featured: true,
  is_active: true, show_in_peek: true, rating: 5, sort_order: i, product_variants: variants('p' + i, price),
})

const IMG = {
  banana: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kerala_banana_chips_Upperi_varuthath.jpg?width=800',
  jaggery: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jaggery_coatted_banana_chips_from_Kerala.jpg?width=800',
  tapioca: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tapioca_Chips_2.jpg?width=800',
  mixture: 'https://commons.wikimedia.org/wiki/Special:FilePath/Indian_Snacks_%28Namkeen%29.jpg?width=800',
  murukku: 'https://commons.wikimedia.org/wiki/Special:FilePath/A_Traditional_Tamil_Snack_Murukku.jpg?width=800',
  jack: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chakka-chips.JPG?width=800',
  rose: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rose_cookies_Achu_Murukku.JPG?width=800',
  sadya: 'https://commons.wikimedia.org/wiki/Special:FilePath/Onasadya.jpg?width=900',
}

export const DEMO: SiteData = {
  settings: DEFAULT_SETTINGS,
  sections: Object.fromEntries(
    [
      s('hero', 'Hero', "🌿 Straight From God's Own Country", 'Unbox the Taste of Kerala', 'Small-batch banana chips, murukku, sharkkara varatti and more — hand-cut, roasted in real coconut oil, and packed fresh the same week you order.', 1),
      s('peek', 'Peek', '', 'Peek Inside the Petti', 'Hover to pause →', 2),
      s('products', 'Products', 'The Full Petti', 'Our Products', 'Eight recipes, one tradition. Pick your favourites, or order the whole box.', 3),
      s('story', 'Story', 'Our Story', 'A Petti Full of Home', '', 4),
      s('combos', 'Combos', 'Save More', 'Special Combo Pettis', 'Hand-picked bundles at a better price — perfect for gifting, festivals and big families.', 5),
      s('offers', 'Offers', 'Limited Time', 'Running Offers', 'Fresh deals every season. Grab them before the batch runs out.', 6),
      s('stats', 'Stats', '', '', '', 7),
      s('why', 'Why', 'Why Znacky Petti', 'Made the Way Ammachi Would Approve', "Five simple standards we don't compromise on, batch after batch.", 8),
      s('process', 'Process', 'Our Process', 'From Kerala Farms to Your Petti', 'The same five steps our partner kitchens have followed for generations.', 9),
      s('wholesale', 'Wholesale', 'For Businesses', 'Bring Znacky Petti to Your Store', 'From cafés and gift hampers to corporate Onam boxes, we supply bulk orders across our full range — with custom packaging and branding available on request.', 10),
      s('testimonials', 'Testimonials', 'Customer Love', 'From Our Petti to Your Table', "A few notes from people who've unboxed one already.", 11),
      s('faq', 'FAQ', 'Good to Know', 'Frequently Asked Questions', 'Still curious about something? Message us on WhatsApp any time.', 12),
      s('contact', 'Contact', 'Get In Touch', "Let's Talk Snacks", 'Questions, bulk orders, or just craving banana chips?', 13),
      s('newsletter', 'Newsletter', '', 'Stay Connected', 'Subscribe for updates on new products and festive offers.', 14),
      s('float_whatsapp', 'Float', '', '', '', 15),
      s('announcement', 'Announcement', '', '', '', 0),
    ].map((x) => [x.key, x])
  ),
  nav: [
    { id: 'n1', label: 'Home', href: '/', is_active: true, sort_order: 0 },
    { id: 'n2', label: 'Our Story', href: '/#story', is_active: true, sort_order: 1 },
    { id: 'n3', label: 'Products', href: '/#products', is_active: true, sort_order: 2 },
    { id: 'n4', label: 'Combos', href: '/#combos', is_active: true, sort_order: 3 },
    { id: 'n5', label: 'Wholesale', href: '/#wholesale', is_active: true, sort_order: 4 },
    { id: 'n6', label: 'FAQ', href: '/#faq', is_active: true, sort_order: 5 },
    { id: 'n7', label: 'Contact', href: '/#contact', is_active: true, sort_order: 6 },
  ],
  slides: [
    { id: 'h1', image_url: '/brand/chest.webp', alt_text: 'Znacky Petti chest', headline: '', subheadline: '', cta_label: '', cta_link: '', is_active: true, sort_order: 0 },
    { id: 'h2', image_url: IMG.banana, alt_text: 'Banana chips', headline: 'Fresh Nendran Chips', subheadline: 'Roasted in coconut oil this week', cta_label: '', cta_link: '', is_active: true, sort_order: 1 },
    { id: 'h3', image_url: IMG.murukku, alt_text: 'Murukku', headline: '', subheadline: '', cta_label: '', cta_link: '', is_active: true, sort_order: 2 },
  ],
  products: [
    P(0, 'Banana Chips', 'banana-chips', 'Kaya Varuthathu', 'Thin-sliced Nendran bananas, fried golden in real coconut oil.', IMG.banana, 180, 'Bestseller'),
    P(1, 'Sharkkara Varatti', 'sharkkara-varatti', 'Jaggery-Glazed Banana', 'Ripe banana coated in a rich, spiced jaggery caramel.', IMG.jaggery, 210),
    P(2, 'Tapioca Chips', 'tapioca-chips', 'Kappa Chips', 'Crisp tapioca rounds with a mild peppery kick.', IMG.tapioca, 160),
    P(3, 'Nadan Mixture', 'nadan-mixture', 'Kerala Mixture', 'A crunchy toss of sev, peanuts, curry leaves and spice.', IMG.mixture, 190),
    P(4, 'Murukku', 'murukku', 'Chakli', 'Spiral rice-flour crisps, rolled and fried by hand.', IMG.murukku, 170),
    P(5, 'Jackfruit Chips', 'jackfruit-chips', 'Chakka Varuthathu', 'Sweet-savoury jackfruit, sliced and fried in season.', IMG.jack, 240, 'New', 'green'),
    P(6, 'Achappam', 'achappam', 'Rose Cookies', 'Delicate rice-flour rosettes, stamped the traditional way.', IMG.rose, 220),
    P(7, 'Kuzhalappam', 'kuzhalappam', 'Rice Rolls', 'Rolled rice crisps with roasted coconut and cumin.', IMG.jack, 200),
  ],
  combos: [
    { ...P(8, 'Onam Sadya Petti', 'onam-sadya-petti', '5 Snacks · 1.25kg', 'Banana chips, sharkkara varatti, murukku, mixture and achappam — the full festive box.', IMG.sadya, 849, 'Save ₹231'), type: 'combo' as const, mrp: 1080, product_variants: [] },
    { ...P(9, 'Chai Time Trio', 'chai-time-trio', '3 Snacks · 750g', 'Banana chips, tapioca chips and nadan mixture — the everyday evening box.', IMG.tapioca, 479, 'Save ₹91', 'green'), type: 'combo' as const, mrp: 570, product_variants: [] },
    { ...P(10, 'Sweet Tooth Petti', 'sweet-tooth-petti', '3 Snacks · 750g', 'Sharkkara varatti, achappam and jackfruit chips for the sweet side of Kerala.', IMG.jaggery, 629, 'Save ₹121', 'gold'), type: 'combo' as const, mrp: 750, product_variants: [] },
    { ...P(11, 'The Whole Petti', 'the-whole-petti', '8 Snacks · 2kg', 'Every single recipe we make, 250g each, in one big treasure chest.', '/brand/chest.webp', 1349, 'Best Value'), type: 'combo' as const, mrp: 1690, product_variants: [] },
  ],
  offers: [
    { id: 'o1', title: 'Onam Special', subtitle: 'Festive box discount', description: 'Order any combo petti before Thiruvonam and we knock 15% off the whole cart.', code: 'ONAM15', discount_text: '15% OFF', image_url: '', accent: 'maroon', cta_label: 'Order on WhatsApp', cta_link: '', valid_until: null, is_active: true, sort_order: 0 },
    { id: 'o2', title: 'Free Delivery', subtitle: 'On orders above ₹999', description: 'Cross ₹999 in a single order and shipping is on us — anywhere in India.', code: '', discount_text: 'FREE SHIP', image_url: '', accent: 'green', cta_label: 'Start an order', cta_link: '', valid_until: null, is_active: true, sort_order: 1 },
    { id: 'o3', title: 'First Petti', subtitle: 'New customer welcome', description: 'First time ordering? Use this code and take ₹100 off your very first petti.', code: 'FIRST100', discount_text: '₹100 OFF', image_url: '', accent: 'gold', cta_label: 'Claim ₹100 off', cta_link: '', valid_until: null, is_active: true, sort_order: 2 },
  ],
  stats: [
    { id: 's1', value: 8, suffix: '+', label: 'Signature Recipes', is_active: true, sort_order: 0 },
    { id: 's2', value: 100, suffix: '%', label: 'Coconut-Oil Roasted', is_active: true, sort_order: 1 },
    { id: 's3', value: 5000, suffix: '+', label: 'Pettis Delivered', is_active: true, sort_order: 2 },
    { id: 's4', value: 0, suffix: '', label: 'Preservatives Added', is_active: true, sort_order: 3 },
  ],
  why: [
    { id: 'w1', icon: 'trophy', title: 'Premium Quality', description: 'Only the best Nendran bananas, farm tapioca and cold-pressed coconut oil make it into the fryer.', highlight: 'Grade A produce', is_active: true, sort_order: 0 },
    { id: 'w2', icon: 'box', title: 'Freshly Packed', description: 'Every petti is sealed within 48 hours of roasting — never off a warehouse shelf.', highlight: '48 hour rule', is_active: true, sort_order: 1 },
    { id: 'w3', icon: 'leaf', title: 'Authentic Kerala Taste', description: 'Recipes passed down from home kitchens, unchanged for generations.', highlight: '12 family kitchens', is_active: true, sort_order: 2 },
    { id: 'w4', icon: 'shield', title: 'Hygienic Packaging', description: 'Sealed in food-grade, resealable pouches that lock the crunch in.', highlight: 'Food-grade sealed', is_active: true, sort_order: 3 },
    { id: 'w5', icon: 'truck', title: 'Fast Delivery', description: 'Dispatched pan-India in 24–48 hours, tracked all the way to your door.', highlight: '24–48 hr dispatch', is_active: true, sort_order: 4 },
  ],
  process: [
    { id: 'pr1', step_no: '01', icon: 'sprout', title: 'Sourced', description: 'Nendran bananas, farm tapioca, jaggery and coconuts, sourced fresh from Kerala growers.', image_url: '', is_active: true, sort_order: 0 },
    { id: 'pr2', step_no: '02', icon: 'knife', title: 'Cleaned & Cut', description: 'Washed, peeled and hand-sliced the traditional way — no machines rushing the cut.', image_url: '', is_active: true, sort_order: 1 },
    { id: 'pr3', step_no: '03', icon: 'flame', title: 'Roasted', description: 'Slow-fried in small batches of pure coconut oil for that unmistakable flavour.', image_url: '', is_active: true, sort_order: 2 },
    { id: 'pr4', step_no: '04', icon: 'spice', title: 'Seasoned', description: 'Finished with authentic spice blends or jaggery glaze, the way home kitchens do it.', image_url: '', is_active: true, sort_order: 3 },
    { id: 'pr5', step_no: '05', icon: 'box', title: 'Packed Fresh', description: 'Cooled, weighed and sealed the same day, then shipped within 24–48 hours.', image_url: '', is_active: true, sort_order: 4 },
  ],
  story: {
    id: 1, image_url: IMG.sadya, badge_number: '12+', badge_text: 'Family kitchens we partner with across Kerala',
    body: [
      'In Malayalam, <em>petti</em> means a box — the kind grandmothers packed before a long journey, layered with banana chips, crunchy murukku and jaggery-glazed sharkkara varatti wrapped in banana leaf.',
      'Znacky Petti brings that same box to your doorstep. We work with small family kitchens across Kerala who still roast in traditional coconut oil, slice banana by hand, and season the old way — no shortcuts, no palm oil, no maida fillers.',
      "Every batch is made fresh to order, sealed while it's still warm, and shipped within days — so what reaches you tastes like it just came off the stove in a Kerala tharavadu.",
    ],
    signature: '— Handcrafted by home cooks across Kerala', cta_label: '', cta_link: '',
  },
  testimonials: [
    { id: 't1', name: 'Ammu R.', location: 'Bengaluru', quote: "Tastes exactly like my grandmother's chips back in Thrissur. My whole flat finished a 500g pack in two days.", rating: 5, initials: 'AR', color: 'maroon', avatar_url: '', is_active: true, sort_order: 0 },
    { id: 't2', name: 'Vishnu K.', location: 'Dubai', quote: 'Ordered a petti for Onam and it arrived in perfect shape. The sharkkara varatti disappeared first — no contest.', rating: 5, initials: 'VK', color: 'green', avatar_url: '', is_active: true, sort_order: 1 },
  ],
  faqs: [
    { id: 'f1', question: 'How long do the snacks stay fresh?', answer: 'Sealed and unopened, most snacks stay crisp for 45–60 days. Once opened, reseal the pouch tightly and finish within 10–14 days for the best crunch.', is_active: true, sort_order: 0 },
    { id: 'f2', question: 'Do you deliver across India?', answer: 'Yes — we ship pan-India in 24–48 hours from dispatch.', is_active: true, sort_order: 1 },
    { id: 'f3', question: 'What oil do you fry in?', answer: '100% coconut oil, always. No palm oil, no reused oil, no shortcuts.', is_active: true, sort_order: 2 },
  ],
  peek: [
    { id: 'k1', title: 'Banana Chips', image_url: IMG.banana, link: '/banana-chips', is_active: true, sort_order: 0 },
    { id: 'k2', title: 'Sharkkara Varatti', image_url: IMG.jaggery, link: '/sharkkara-varatti', is_active: true, sort_order: 1 },
    { id: 'k3', title: 'Tapioca Chips', image_url: IMG.tapioca, link: '/tapioca-chips', is_active: true, sort_order: 2 },
    { id: 'k4', title: 'Nadan Mixture', image_url: IMG.mixture, link: '/nadan-mixture', is_active: true, sort_order: 3 },
    { id: 'k5', title: 'Murukku', image_url: IMG.murukku, link: '/murukku', is_active: true, sort_order: 4 },
    { id: 'k6', title: 'Achappam', image_url: IMG.rose, link: '/achappam', is_active: true, sort_order: 5 },
  ],
}
