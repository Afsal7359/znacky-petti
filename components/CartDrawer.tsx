'use client'

import Link from 'next/link'
import { useCart } from '@/components/CartProvider'
import { CartIcon, CloseIcon } from '@/components/Icons'
import type { SiteSettings } from '@/lib/types'
import { money } from '@/lib/utils'

export default function CartDrawer({ settings }: { settings: SiteSettings }) {
  const cart = useCart()
  const c = settings.currency_symbol || '₹'

  const freeAbove = Number(settings.free_delivery_above) || 0
  const baseDelivery = Number(settings.delivery_charge) || 0
  const delivery =
    cart.subtotal <= 0 || (freeAbove > 0 && cart.subtotal >= freeAbove) ? 0 : baseDelivery
  const total = cart.subtotal + delivery

  if (!settings.cart_enabled) return null

  return (
    <>
      <div
        className={`scrim${cart.isOpen ? ' open' : ''}`}
        onClick={cart.close}
        aria-hidden="true"
      />
      <aside className={`cart-drawer${cart.isOpen ? ' open' : ''}`} aria-label="Shopping cart">
        <div className="cart-top">
          <h3>Your Petti ({cart.count})</h3>
          <button className="drawer-close" onClick={cart.close} aria-label="Close cart">
            <CloseIcon />
          </button>
        </div>

        <div className="cart-items">
          {cart.items.length === 0 ? (
            <div className="cart-empty">
              <CartIcon />
              <p>Your petti is empty.</p>
              <p style={{ fontSize: '.86rem', marginTop: 6 }}>
                Add a snack or two and they will show up here.
              </p>
            </div>
          ) : (
            cart.items.map((item) => (
              <div className="cart-row" key={item.key}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image || '/brand/chest.webp'} alt={item.name} />
                <div>
                  <Link href={`/${item.slug}`} onClick={cart.close} className="ci-name">
                    {item.name}
                  </Link>
                  <div className="ci-var">{item.variant}</div>
                  <div className="qty">
                    <button onClick={() => cart.setQty(item.key, item.qty - 1)} aria-label="Decrease">
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button onClick={() => cart.setQty(item.key, item.qty + 1)} aria-label="Increase">
                      +
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="ci-price">{money(item.price * item.qty, c)}</div>
                  <button className="ci-remove" onClick={() => cart.remove(item.key)}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.items.length > 0 ? (
          <div className="cart-foot">
            <div className="cart-line">
              <span>Subtotal</span>
              <span>{money(cart.subtotal, c)}</span>
            </div>
            <div className="cart-line">
              <span>Delivery</span>
              <span>{delivery > 0 ? money(delivery, c) : 'FREE'}</span>
            </div>
            {freeAbove > 0 && cart.subtotal < freeAbove ? (
              <div className="cart-line" style={{ color: 'var(--maroon)', fontWeight: 700 }}>
                <span>Add {money(freeAbove - cart.subtotal, c)} more</span>
                <span>for free delivery</span>
              </div>
            ) : null}
            <div className="cart-total">
              <span>Total</span>
              <span>{money(total, c)}</span>
            </div>
            {settings.checkout_enabled ? (
              <Link href="/checkout" className="btn btn-primary btn-block" onClick={cart.close}>
                Checkout
              </Link>
            ) : (
              <button className="btn btn-primary btn-block" disabled>
                Checkout unavailable
              </button>
            )}
            <p className="cart-note">Your order is confirmed over WhatsApp — no online payment.</p>
          </div>
        ) : null}
      </aside>
    </>
  )
}
