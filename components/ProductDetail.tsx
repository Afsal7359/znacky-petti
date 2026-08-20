'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/components/CartProvider'
import {
  CartPlusIcon,
  CheckIcon,
  ChevronRight,
  LeafIcon,
  ShieldIcon,
  TruckIcon,
  WhatsAppIcon,
} from '@/components/Icons'
import type { Product, ProductVariant, SiteSettings } from '@/lib/types'
import { defaultVariant, discountPercent, money, waLink } from '@/lib/utils'

export default function ProductDetail({
  product,
  settings,
}: {
  product: Product
  settings: SiteSettings
}) {
  const variants = product.product_variants ?? []
  const [variant, setVariant] = useState<ProductVariant | null>(defaultVariant(product))
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const cart = useCart()

  const images = [product.image_url, ...(product.gallery ?? [])].filter(Boolean) as string[]
  const [activeImg, setActiveImg] = useState(images[0] ?? '')

  const price = variant?.price ?? product.price
  const mrp = variant?.mrp ?? product.mrp
  const off = discountPercent(price, mrp)
  const c = settings.currency_symbol || '₹'
  const unit = variant?.label ?? product.unit_label ?? ''
  const soldOut = !product.in_stock || (variant ? !variant.in_stock : false)

  function addToCart() {
    if (soldOut) return
    cart.add(
      {
        product_id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image_url || '',
        variant: unit,
        price,
      },
      qty
    )
    setAdded(true)
    cart.open()
    setTimeout(() => setAdded(false), 1600)
  }

  const waMessage = `Hi ${settings.brand_name}! I'd like to order *${product.name}*${
    unit ? ` (${unit})` : ''
  } × ${qty} — ${money(price * qty, c)}.`

  return (
    <section className="pdp">
      <div className="container">
        <nav className="crumbs">
          <Link href="/">Home</Link>
          <ChevronRight />
          <Link href={product.type === 'combo' ? '/combos' : '/#products'}>
            {product.type === 'combo' ? 'Combos' : 'Products'}
          </Link>
          <ChevronRight />
          <span>{product.name}</span>
        </nav>

        <div className="pdp-grid">
          <div className="pdp-gallery reveal-left">
            <div className="pdp-main-img">
              {activeImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={activeImg} alt={product.name} />
              ) : null}
              {off > 0 ? (
                <span className="pcard-save" style={{ position: 'absolute', top: 16, right: 16 }}>
                  {off}% OFF
                </span>
              ) : null}
            </div>
            {images.length > 1 ? (
              <div className="pdp-thumbs">
                {images.map((img) => (
                  <button
                    key={img}
                    className={`pdp-thumb${activeImg === img ? ' active' : ''}`}
                    onClick={() => setActiveImg(img)}
                    aria-label="View image"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="pdp-info reveal-right">
            {product.badge ? (
              <span className={`pcard-badge ${product.badge_color ?? 'maroon'}`} style={{ marginBottom: 14, display: 'inline-block' }}>
                {product.badge}
              </span>
            ) : null}
            <h1>{product.name}</h1>
            {product.local_name ? <span className="pdp-local">{product.local_name}</span> : null}

            <div className="pdp-rating">
              <span className="stars">{'★'.repeat(Math.round(product.rating || 5))}</span>
              <span>{Number(product.rating || 5).toFixed(1)} · Loved by our regulars</span>
            </div>

            <div className="pdp-price">
              <span className="now">{money(price, c)}</span>
              {mrp && mrp > price ? <span className="was">{money(mrp, c)}</span> : null}
              {off > 0 ? <span className="off">Save {off}%</span> : null}
            </div>
            <p className="pdp-tax">Inclusive of all taxes · Packed fresh on order</p>

            {product.long_desc || product.short_desc ? (
              <p className="pdp-desc">{product.long_desc || product.short_desc}</p>
            ) : null}

            {variants.length > 0 ? (
              <>
                <div className="pdp-block-label">Choose your pack</div>
                <div className="pdp-variants">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      className={`pdp-variant${variant?.id === v.id ? ' active' : ''}`}
                      onClick={() => setVariant(v)}
                      disabled={!v.in_stock}
                      type="button"
                    >
                      <span>{v.label}</span>
                      <small>{money(v.price, c)}</small>
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            <div className="pdp-buy">
              <div className="pdp-qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  −
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                  +
                </button>
              </div>

              {settings.cart_enabled ? (
                <button className="btn btn-primary" onClick={addToCart} disabled={soldOut}>
                  {added ? <CheckIcon /> : <CartPlusIcon />}
                  {soldOut ? 'Sold out' : added ? 'Added to cart' : 'Add to Cart'}
                </button>
              ) : null}

              <a
                className="btn btn-whatsapp"
                href={waLink(settings.whatsapp_number, waMessage)}
                target="_blank"
                rel="noopener"
              >
                <WhatsAppIcon />
                Order on WhatsApp
              </a>
            </div>

            <div className="pdp-meta">
              {product.ingredients ? (
                <div className="pdp-meta-row">
                  <strong>Ingredients</strong>
                  <span>{product.ingredients}</span>
                </div>
              ) : null}
              {product.shelf_life ? (
                <div className="pdp-meta-row">
                  <strong>Shelf life</strong>
                  <span>{product.shelf_life}</span>
                </div>
              ) : null}
              {product.categories?.name ? (
                <div className="pdp-meta-row">
                  <strong>Category</strong>
                  <span>{product.categories.name}</span>
                </div>
              ) : null}
              <div className="pdp-meta-row">
                <strong>Availability</strong>
                <span style={{ color: soldOut ? 'var(--maroon)' : 'var(--green)', fontWeight: 700 }}>
                  {soldOut ? 'Out of stock' : 'In stock — ships in 24–48 hrs'}
                </span>
              </div>
            </div>

            <div className="pdp-trust">
              <div>
                <LeafIcon />
                100% coconut oil
              </div>
              <div>
                <ShieldIcon />
                No preservatives
              </div>
              <div>
                <TruckIcon />
                Pan-India delivery
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
