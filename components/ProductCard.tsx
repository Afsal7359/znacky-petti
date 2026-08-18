'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/components/CartProvider'
import { CartPlusIcon, CheckIcon, WhatsAppIcon } from '@/components/Icons'
import type { Product, ProductVariant, SiteSettings } from '@/lib/types'
import { defaultVariant, discountPercent, money, waLink } from '@/lib/utils'

export default function ProductCard({
  product,
  settings,
}: {
  product: Product
  settings: SiteSettings
}) {
  const variants = product.product_variants ?? []
  const [variant, setVariant] = useState<ProductVariant | null>(defaultVariant(product))
  const [added, setAdded] = useState(false)
  const cart = useCart()

  const price = variant?.price ?? product.price
  const mrp = variant?.mrp ?? product.mrp
  const off = discountPercent(price, mrp)
  const c = settings.currency_symbol || '₹'
  const unit = variant?.label ?? product.unit_label ?? ''
  const soldOut = !product.in_stock || (variant ? !variant.in_stock : false)

  function addToCart() {
    if (soldOut) return
    cart.add({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image_url || '',
      variant: unit,
      price,
    })
    setAdded(true)
    cart.open()
    setTimeout(() => setAdded(false), 1600)
  }

  const waMessage = `Hi ${settings.brand_name}! I'd like to order *${product.name}*${
    unit ? ` (${unit})` : ''
  } — ${money(price, c)}.`

  return (
    <article className="pcard">
      <Link href={`/${product.slug}`} className="pcard-media" aria-label={product.name}>
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.name} loading="lazy" />
        ) : (
          <div className="ph">{product.name.slice(0, 1)}</div>
        )}
        <div className="pcard-flags">
          {product.badge ? (
            <span className={`pcard-badge ${product.badge_color ?? 'maroon'}`}>{product.badge}</span>
          ) : (
            <span />
          )}
          {off > 0 ? <span className="pcard-save">{off}% OFF</span> : null}
        </div>
        {soldOut ? <div className="pcard-oos">Sold out</div> : null}
      </Link>

      <div className="pcard-body">
        <h3 className="pcard-title">
          <Link href={`/${product.slug}`}>{product.name}</Link>
        </h3>
        {product.local_name ? <span className="pcard-local">{product.local_name}</span> : null}
        {product.short_desc ? <p className="pcard-desc">{product.short_desc}</p> : null}

        <div className="pcard-price">
          <span className="now">{money(price, c)}</span>
          {mrp && mrp > price ? <span className="was">{money(mrp, c)}</span> : null}
          {unit ? <span className="per">/ {unit}</span> : null}
        </div>

        {variants.length > 1 ? (
          <div className="pcard-variants">
            {variants.map((v) => (
              <button
                key={v.id}
                className={`pcard-variant${variant?.id === v.id ? ' active' : ''}`}
                onClick={() => setVariant(v)}
                type="button"
              >
                {v.label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="pcard-actions">
          {settings.cart_enabled ? (
            <button
              className={`pcard-cart${added ? ' added' : ''}`}
              onClick={addToCart}
              disabled={soldOut}
              type="button"
            >
              {added ? <CheckIcon /> : <CartPlusIcon />}
              {added ? 'Added' : 'Add to Cart'}
            </button>
          ) : (
            <Link href={`/${product.slug}`} className="pcard-cart">
              View details
            </Link>
          )}
          <a
            className="pcard-wa"
            href={waLink(settings.whatsapp_number, waMessage)}
            target="_blank"
            rel="noopener"
            aria-label={`Order ${product.name} on WhatsApp`}
          >
            <WhatsAppIcon />
          </a>
        </div>
      </div>
    </article>
  )
}
