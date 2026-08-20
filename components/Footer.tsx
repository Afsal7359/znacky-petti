'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppIcon,
  YoutubeIcon,
} from '@/components/Icons'
import type { NavLink, SiteSettings } from '@/lib/types'
import { waLink } from '@/lib/utils'

type Props = {
  settings: SiteSettings
  nav: NavLink[]
  newsletter: { visible: boolean; title: string; subtitle: string }
}

export default function Footer({ settings, nav, newsletter }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')

  async function subscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('saving')
    try {
      const supabase = createClient()
      const { error } = await supabase.from('subscribers').insert({ email: email.trim() })
      // a duplicate email is still a success from the visitor's point of view
      if (error && !error.message.toLowerCase().includes('duplicate')) throw error
      setStatus('done')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <footer>
      <div className="container">
        <div className="footer-grid reveal-stagger">
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={settings.logo_url || '/brand/logo.webp'} alt={settings.brand_name} />
            <p>{settings.footer_about}</p>
            <div className="footer-social">
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
              <a
                href={waLink(settings.whatsapp_number, `Hi ${settings.brand_name}!`)}
                target="_blank"
                rel="noopener"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul className="footer-links">
              {nav.map((l) => (
                <li key={l.id}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Contact Us</h4>
            <ul className="footer-contact">
              {settings.phone ? (
                <li>
                  <PhoneIcon />
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
                </li>
              ) : null}
              {settings.email ? (
                <li>
                  <MailIcon />
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </li>
              ) : null}
              {settings.address ? (
                <li>
                  <PinIcon />
                  {settings.address}
                </li>
              ) : null}
              {settings.business_hours ? (
                <li>
                  <ClockIcon />
                  {settings.business_hours}
                </li>
              ) : null}
            </ul>
          </div>

          {newsletter.visible ? (
            <div className="footer-news">
              <h4>{newsletter.title || 'Stay Connected'}</h4>
              <p>{newsletter.subtitle || 'Subscribe for updates on new products and festive offers.'}</p>
              <form className="news-form" onSubmit={subscribe}>
                <input
                  type="email"
                  placeholder="Your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                />
                <button type="submit" disabled={status === 'saving'}>
                  {status === 'saving' ? 'Adding…' : 'Subscribe'}
                </button>
              </form>
              {status === 'done' ? (
                <p className="news-success">Thanks — you&apos;re on the list! 🎉</p>
              ) : null}
              {status === 'error' ? (
                <p className="news-success" style={{ color: '#ffb4a8' }}>
                  Could not subscribe right now. Please try again.
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {settings.copyright_text}
          </p>
          <div className="footer-bottom-links">
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
