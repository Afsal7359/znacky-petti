'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/components/CartProvider'
import { CartPlusIcon, CheckIcon, WhatsAppIcon } from '@/components/Icons'
import SectionHead from '@/components/SectionHead'
import type { Product, Section, SiteSettings } from '@/lib/types'
import { defaultVariant, money, waLink } from '@/lib/utils'

export default function Combos({
  section,
  combos,
  settings,
}: {
  section?: Section
  combos: Product[]
  settings: SiteSettings
}) {
  if (!combos.length) return null

  return (
    <section className="combos" id="combos">
      <div className="container">
        <SectionHead section={section} eyebrowClass="eyebrow--green" />
        <div className="combo-grid reveal-stagger">
          {combos.map((combo) => (
            <ComboCard key={combo.id} combo={combo} settings={settings} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ComboCard({ combo, settings }: { combo: Product; settings: SiteSettings }) {
  const cart = useCart()
  const [added, setAdded] = useState(false)
  const variant = defaultVariant(combo)
  const price = variant?.price ?? combo.price
  const mrp = variant?.mrp ?? combo.mrp
  const unit = variant?.label ?? combo.unit_label ?? ''
  const c = settings.currency_symbol || '₹'
  const soldOut = !combo.in_stock

  function add() {
    if (soldOut) return
    cart.add({
      product_id: combo.id,
      name: combo.name,
      slug: combo.slug,
      image: combo.image_url || '',
      variant: unit,
      price,
    })
    setAdded(true)
    cart.open()
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <article className="combo-card">
      <Link href={`/${combo.slug}`} className="combo-media" aria-label={combo.name}>
        {combo.badge ? <span className="combo-save">{combo.badge}</span> : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={combo.image_url || '/brand/chest.webp'} alt={combo.name} loading="lazy" />
        {combo.local_name ? <span className="combo-count">{combo.local_name}</span> : null}
      </Link>
      <div className="combo-body">
        <h3>
          <Link href={`/${combo.slug}`}>{combo.name}</Link>
        </h3>
        <p>{combo.short_desc}</p>
        <div className="combo-price">
          <span className="now">{money(price, c)}</span>
          {mrp && mrp > price ? <span className="was">{money(mrp, c)}</span> : null}
        </div>
        <div className="combo-actions">
          {settings.cart_enabled ? (
            <button
              className={`pcard-cart${added ? ' added' : ''}`}
              onClick={add}
              disabled={soldOut}
              type="button"
            >
              {added ? <CheckIcon /> : <CartPlusIcon />}
              {added ? 'Added' : soldOut ? 'Sold out' : 'Add to Cart'}
            </button>
          ) : (
            <Link href={`/${combo.slug}`} className="pcard-cart">
              View combo
            </Link>
          )}
          <a
            className="pcard-wa"
            href={waLink(
              settings.whatsapp_number,
              `Hi ${settings.brand_name}! I'd like to order the *${combo.name}* combo — ${money(price, c)}.`
            )}
            target="_blank"
            rel="noopener"
            aria-label={`Order ${combo.name} on WhatsApp`}
          >
            <WhatsAppIcon />
          </a>
        </div>
      </div>
    </article>
  )
}
