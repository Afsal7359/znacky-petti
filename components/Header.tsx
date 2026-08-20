'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from '@/components/CartProvider'
import {
  CartIcon,
  CloseIcon,
  FacebookIcon,
  InstagramIcon,
  SparkIcon,
  WhatsAppIcon,
  YoutubeIcon,
} from '@/components/Icons'
import type { NavLink, SiteSettings } from '@/lib/types'
import { waLink } from '@/lib/utils'

type Props = {
  settings: SiteSettings
  nav: NavLink[]
  showAnnouncement: boolean
}

export default function Header({ settings, nav, showAnnouncement }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const cart = useCart()
  const pathname = usePathname()

  /** Highlight the menu item for the page you are on. '/#products' counts as home. */
  function isActive(href: string) {
    const path = href.split('#')[0] || '/'
    return path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(path + '/')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawer])

  const orderLink = waLink(
    settings.whatsapp_number,
    `Hi ${settings.brand_name}! I'd like to place an order.`
  )

  return (
    <>
      {showAnnouncement && settings.announcement_enabled && settings.announcement_text ? (
        <div className="announce">
          <div className="container">
            <SparkIcon />
            <span>{settings.announcement_text}</span>
          </div>
        </div>
      ) : null}

      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="container">
          <Link href="/" className="brand" aria-label={settings.brand_name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={settings.logo_url || '/brand/logo.webp'} alt={settings.brand_name} />
          </Link>

          <nav className="nav-links">
            {nav.map((l) => (
              <Link
                key={l.id}
                href={l.href}
                className={isActive(l.href) ? 'active' : undefined}
                aria-current={isActive(l.href) ? 'page' : undefined}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="nav-right">
            <a
              href={orderLink}
              className="btn btn-whatsapp btn-sm nav-cta"
              target="_blank"
              rel="noopener"
            >
              <WhatsAppIcon />
              Order on WhatsApp
            </a>

            {settings.cart_enabled ? (
              <button className="cart-btn" onClick={cart.open} aria-label="Open cart">
                <CartIcon />
                {cart.ready && cart.count > 0 ? (
                  <span className="cart-count">{cart.count}</span>
                ) : null}
              </button>
            ) : null}

            <button
              className={`hamburger${drawer ? ' active' : ''}`}
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
            >
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`scrim${drawer ? ' open' : ''}`}
        onClick={() => setDrawer(false)}
        aria-hidden="true"
      />

      <aside className={`mobile-drawer${drawer ? ' open' : ''}`}>
        <div className="mobile-drawer-top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={settings.logo_url || '/brand/logo.webp'} alt={settings.brand_name} />
          <button className="drawer-close" onClick={() => setDrawer(false)} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>
        <nav>
          {nav.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              className={isActive(l.href) ? 'active' : undefined}
              aria-current={isActive(l.href) ? 'page' : undefined}
              onClick={() => setDrawer(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-drawer-foot">
          <a href={orderLink} className="btn btn-whatsapp btn-block" target="_blank" rel="noopener">
            <WhatsAppIcon />
            Order on WhatsApp
          </a>
          <div className="mobile-drawer-social">
            {settings.instagram_url ? (
              <a href={settings.instagram_url} target="_blank" rel="noopener" aria-label="Instagram">
                <InstagramIcon />
              </a>
            ) : null}
            {settings.facebook_url ? (
              <a href={settings.facebook_url} target="_blank" rel="noopener" aria-label="Facebook">
                <FacebookIcon />
              </a>
            ) : null}
            {settings.youtube_url ? (
              <a href={settings.youtube_url} target="_blank" rel="noopener" aria-label="YouTube">
                <YoutubeIcon />
              </a>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  )
}
