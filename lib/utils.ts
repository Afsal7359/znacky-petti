import type { OrderItem, Product, ProductVariant } from '@/lib/types'

export function money(amount: number, symbol = '₹') {
  const rounded = Math.round(Number(amount) || 0)
  return `${symbol}${rounded.toLocaleString('en-IN')}`
}

export function discountPercent(price: number, mrp?: number | null) {
  if (!mrp || mrp <= price) return 0
  return Math.round(((mrp - price) / mrp) * 100)
}

export function defaultVariant(product: Product): ProductVariant | null {
  const variants = product.product_variants ?? []
  if (!variants.length) return null
  return variants.find((v) => v.is_default) ?? variants[0]
}

export function waLink(number: string, message: string) {
  const digits = (number || '').replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export type CheckoutDetails = {
  name: string
  phone: string
  email?: string
  address1: string
  address2?: string
  city: string
  state?: string
  pincode: string
  landmark?: string
  note?: string
}

/** Builds the full WhatsApp order message: items, totals and delivery address. */
export function buildOrderMessage(opts: {
  brand: string
  orderNumber: string
  items: OrderItem[]
  subtotal: number
  delivery: number
  total: number
  details: CheckoutDetails
  currency?: string
}) {
  const c = opts.currency ?? '₹'
  const lines: string[] = []

  lines.push(`*NEW ORDER — ${opts.brand}*`)
  lines.push(`Order No: *${opts.orderNumber}*`)
  lines.push('')
  lines.push('*🧺 ITEMS*')
  opts.items.forEach((it, i) => {
    lines.push(
      `${i + 1}. ${it.name} (${it.variant}) × ${it.qty} — ${money(it.line_total, c)}`
    )
  })
  lines.push('')
  lines.push(`Subtotal: ${money(opts.subtotal, c)}`)
  lines.push(
    `Delivery: ${opts.delivery > 0 ? money(opts.delivery, c) : 'FREE'}`
  )
  lines.push(`*TOTAL: ${money(opts.total, c)}*`)
  lines.push('')
  lines.push('*🚚 DELIVERY ADDRESS*')
  lines.push(`Name: ${opts.details.name}`)
  lines.push(`Phone: ${opts.details.phone}`)
  if (opts.details.email) lines.push(`Email: ${opts.details.email}`)
  lines.push(`Address: ${opts.details.address1}`)
  if (opts.details.address2) lines.push(opts.details.address2)
  if (opts.details.landmark) lines.push(`Landmark: ${opts.details.landmark}`)
  lines.push(
    `${opts.details.city}${opts.details.state ? ', ' + opts.details.state : ''} — ${opts.details.pincode}`
  )
  if (opts.details.note) {
    lines.push('')
    lines.push(`*📝 NOTE*: ${opts.details.note}`)
  }
  lines.push('')
  lines.push('Please confirm my order. Thank you!')

  return lines.join('\n')
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function makeOrderNumber() {
  const d = new Date()
  const stamp =
    String(d.getFullYear()).slice(2) +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `ZP${stamp}${rand}`
}
