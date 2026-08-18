'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useCart } from '@/components/CartProvider'
import { CheckIcon, WhatsAppIcon } from '@/components/Icons'
import { createClient } from '@/lib/supabase/client'
import type { OrderItem, SiteSettings } from '@/lib/types'
import { buildOrderMessage, makeOrderNumber, money, waLink } from '@/lib/utils'

const EMPTY = {
  name: '',
  phone: '',
  email: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  pincode: '',
  landmark: '',
  note: '',
}

export default function CheckoutForm({ settings }: { settings: SiteSettings }) {
  const cart = useCart()
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState<'idle' | 'saving' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const c = settings.currency_symbol || '₹'
  const freeAbove = Number(settings.free_delivery_above) || 0
  const baseDelivery = Number(settings.delivery_charge) || 0
  const delivery =
    cart.subtotal <= 0 || (freeAbove > 0 && cart.subtotal >= freeAbove) ? 0 : baseDelivery
  const total = cart.subtotal + delivery

  const items: OrderItem[] = useMemo(
    () =>
      cart.items.map((i) => ({
        product_id: i.product_id,
        name: i.name,
        slug: i.slug,
        variant: i.variant,
        price: i.price,
        qty: i.qty,
        line_total: i.price * i.qty,
      })),
    [cart.items]
  )

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!cart.items.length) return

    setStatus('saving')
    setErrorMsg('')
    const orderNumber = makeOrderNumber()

    // 1. store the order so it shows up in the admin panel
    try {
      const supabase = createClient()
      const { error } = await supabase.from('orders').insert({
        order_number: orderNumber,
        customer_name: form.name,
        phone: form.phone,
        email: form.email,
        address_line1: form.address1,
        address_line2: form.address2,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        landmark: form.landmark,
        note: form.note,
        items,
        subtotal: cart.subtotal,
        delivery_charge: delivery,
        total,
      })
      if (error) throw error
    } catch (err) {
      // never block the customer — the WhatsApp message still carries everything
      console.error('[znacky] order save failed:', err)
    }

    // 2. hand the full order over to WhatsApp
    const message = buildOrderMessage({
      brand: settings.brand_name,
      orderNumber,
      items,
      subtotal: cart.subtotal,
      delivery,
      total,
      currency: c,
      details: form,
    })

    const url = waLink(settings.whatsapp_number, message)
    const win = window.open(url, '_blank')
    if (!win) {
      window.location.href = url
    }

    setStatus('sent')
    cart.clear()
  }

  if (status === 'sent') {
    return (
      <div className="empty-state">
        <span className="eyebrow">Order placed</span>
        <h2>Your order is on its way to WhatsApp</h2>
        <p>
          If the chat did not open automatically, tap the button below — your full order details are
          already filled in.
        </p>
        <a
          className="btn btn-whatsapp"
          href={waLink(settings.whatsapp_number, `Hi ${settings.brand_name}! I just placed an order.`)}
          target="_blank"
          rel="noopener"
        >
          <WhatsAppIcon />
          Open WhatsApp
        </a>
        <div style={{ marginTop: 18 }}>
          <Link href="/" className="btn btn-outline">
            Continue shopping
          </Link>
        </div>
      </div>
    )
  }

  if (!cart.ready) return null

  if (!cart.items.length) {
    return (
      <div className="empty-state">
        <h2>Your petti is empty</h2>
        <p>Add a few snacks first, then come back to checkout.</p>
        <Link href="/#products" className="btn btn-primary">
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div className="checkout-grid">
      <form className="checkout-card reveal" onSubmit={submit}>
        <h2>Delivery details</h2>
        <p className="sub">
          Fill this in once — we send the whole order to WhatsApp and confirm payment there.
        </p>

        <div className="form-row">
          <div className="field">
            <label htmlFor="name">Full name *</label>
            <input id="name" required value={form.name} onChange={update('name')} placeholder="Your name" />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone / WhatsApp *</label>
            <input
              id="phone"
              required
              type="tel"
              value={form.phone}
              onChange={update('phone')}
              placeholder="+91 00000 00000"
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" />
        </div>

        <div className="field">
          <label htmlFor="address1">Address line 1 *</label>
          <input
            id="address1"
            required
            value={form.address1}
            onChange={update('address1')}
            placeholder="House name / number, street"
          />
        </div>

        <div className="field">
          <label htmlFor="address2">Address line 2</label>
          <input
            id="address2"
            value={form.address2}
            onChange={update('address2')}
            placeholder="Area, locality"
          />
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="city">City / Town *</label>
            <input id="city" required value={form.city} onChange={update('city')} placeholder="Kochi" />
          </div>
          <div className="field">
            <label htmlFor="state">State</label>
            <input id="state" value={form.state} onChange={update('state')} placeholder="Kerala" />
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="pincode">PIN code *</label>
            <input
              id="pincode"
              required
              inputMode="numeric"
              value={form.pincode}
              onChange={update('pincode')}
              placeholder="682001"
            />
          </div>
          <div className="field">
            <label htmlFor="landmark">Landmark</label>
            <input
              id="landmark"
              value={form.landmark}
              onChange={update('landmark')}
              placeholder="Near the temple"
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="note">Order note</label>
          <textarea
            id="note"
            value={form.note}
            onChange={update('note')}
            placeholder="Gift note, delivery timing, spice preference…"
          />
        </div>

        <button type="submit" className="btn btn-whatsapp btn-block" disabled={status === 'saving'}>
          <WhatsAppIcon />
          {status === 'saving' ? 'Preparing your order…' : `Place order on WhatsApp · ${money(total, c)}`}
        </button>
        <p className="form-note">
          Tapping this opens WhatsApp with your items, totals and address already written out.
        </p>
        {status === 'error' ? <div className="form-error">{errorMsg}</div> : null}
      </form>

      <aside className="checkout-card summary reveal-right">
        <h2>Order summary</h2>
        <p className="sub">{cart.count} item(s) in your petti</p>

        {cart.items.map((i) => (
          <div className="summary-row" key={i.key}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={i.image || '/brand/chest.webp'} alt={i.name} />
            <div>
              <div className="sname">{i.name}</div>
              <div className="svar">
                {i.variant} × {i.qty}
              </div>
            </div>
            <div className="sprice">{money(i.price * i.qty, c)}</div>
          </div>
        ))}

        <div className="cart-line" style={{ marginTop: 16 }}>
          <span>Subtotal</span>
          <span>{money(cart.subtotal, c)}</span>
        </div>
        <div className="cart-line">
          <span>Delivery</span>
          <span>{delivery > 0 ? money(delivery, c) : 'FREE'}</span>
        </div>
        <div className="cart-total">
          <span>Total</span>
          <span>{money(total, c)}</span>
        </div>

        <div className="cart-line" style={{ color: 'var(--green)', fontWeight: 700 }}>
          <CheckIcon style={{ width: 16, height: 16 }} />
          <span style={{ marginRight: 'auto', marginLeft: 8 }}>Pay on WhatsApp — UPI or COD</span>
        </div>
      </aside>
    </div>
  )
}
