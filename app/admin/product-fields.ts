import type { Field } from '@/components/admin/fields'

const BADGE_COLORS = [
  { value: 'maroon', label: 'Maroon' },
  { value: 'green', label: 'Green' },
  { value: 'gold', label: 'Gold' },
]

export const PRODUCT_FIELDS: Field[] = [
  { key: 'name', label: 'Product name', type: 'text', required: true },
  { key: 'slug', label: 'Page URL (slug)', type: 'slug', from: 'name', required: true },
  { key: 'local_name', label: 'Malayalam / sub name', type: 'text', placeholder: 'Kaya Varuthathu' },
  { key: 'unit_label', label: 'Default pack label', type: 'text', placeholder: '250g' },
  { key: 'image_url', label: 'Main image', type: 'image', span2: true },
  { key: 'short_desc', label: 'Card description', type: 'textarea', span2: true, help: 'One line shown on the product card.' },
  { key: 'long_desc', label: 'Full description', type: 'textarea', span2: true, help: 'Shown on the product detail page.' },
  { key: 'price', label: 'Price (₹)', type: 'number', inTable: true, required: true },
  { key: 'mrp', label: 'MRP / struck-out price (₹)', type: 'number' },
  { key: 'badge', label: 'Ribbon text', type: 'text', placeholder: 'Bestseller', inTable: true },
  { key: 'badge_color', label: 'Ribbon colour', type: 'select', options: BADGE_COLORS, default: 'maroon' },
  { key: 'category_id', label: 'Category', type: 'select' },
  { key: 'ingredients', label: 'Ingredients', type: 'text', span2: true },
  { key: 'shelf_life', label: 'Shelf life', type: 'text' },
  { key: 'rating', label: 'Rating (1–5)', type: 'number', default: 5 },
  {
    key: 'product_variants',
    label: 'Pack sizes & prices',
    type: 'variants',
    help: 'Customers pick these on the card and the product page. The default pack decides the price shown first.',
  },
  { key: 'in_stock', label: 'In stock', type: 'checkbox', default: true },
  { key: 'is_featured', label: 'Show on home page', type: 'checkbox', default: true },
  { key: 'show_in_peek', label: 'Allowed in peek strip', type: 'checkbox', default: true },
]

export const COMBO_FIELDS: Field[] = [
  { key: 'name', label: 'Combo name', type: 'text', required: true },
  { key: 'slug', label: 'Page URL (slug)', type: 'slug', from: 'name', required: true },
  { key: 'local_name', label: 'Contents line', type: 'text', placeholder: '5 Snacks · 1.25kg' },
  { key: 'unit_label', label: 'Total weight', type: 'text', placeholder: '1.25kg' },
  { key: 'image_url', label: 'Combo image', type: 'image', span2: true },
  { key: 'short_desc', label: 'Card description', type: 'textarea', span2: true },
  { key: 'long_desc', label: 'Full description', type: 'textarea', span2: true },
  { key: 'price', label: 'Combo price (₹)', type: 'number', inTable: true, required: true },
  { key: 'mrp', label: 'Value if bought separately (₹)', type: 'number' },
  { key: 'badge', label: 'Savings ribbon', type: 'text', placeholder: 'Save ₹231', inTable: true },
  { key: 'badge_color', label: 'Ribbon colour', type: 'select', options: BADGE_COLORS, default: 'maroon' },
  { key: 'in_stock', label: 'In stock', type: 'checkbox', default: true },
]
