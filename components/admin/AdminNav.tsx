'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const GROUPS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: 'Overview',
    links: [
      { href: '/admin', label: 'Dashboard' },
      { href: '/admin/orders', label: 'Orders' },
      { href: '/admin/messages', label: 'Messages' },
      { href: '/admin/subscribers', label: 'Subscribers' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { href: '/admin/products', label: 'Products' },
      { href: '/admin/combos', label: 'Combo pettis' },
      { href: '/admin/categories', label: 'Categories' },
      { href: '/admin/offers', label: 'Offers' },
    ],
  },
  {
    title: 'Content',
    links: [
      { href: '/admin/pages', label: 'Pages' },
      { href: '/admin/sections', label: 'Sections & visibility' },
      { href: '/admin/hero', label: 'Hero slider' },
      { href: '/admin/peek', label: 'Peek strip' },
      { href: '/admin/story', label: 'Our story' },
      { href: '/admin/stats', label: 'Stats strip' },
      { href: '/admin/why', label: 'Why Znacky Petti' },
      { href: '/admin/process', label: 'Our process' },
      { href: '/admin/testimonials', label: 'Testimonials' },
      { href: '/admin/faqs', label: 'FAQs' },
    ],
  },
  {
    title: 'Site',
    links: [
      { href: '/admin/settings', label: 'Site settings' },
      { href: '/admin/nav', label: 'Navigation menu' },
      { href: '/admin/keepalive', label: 'Keep-alive' },
    ],
  },
]

export default function AdminNav({ logo, email }: { logo: string; email: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <>
      <button className="admin-toggle-side" onClick={() => setOpen((o) => !o)}>
        ☰ Menu
      </button>
      <aside className={`admin-side${open ? ' open' : ''}`}>
        <div className="admin-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo || '/brand/logo.webp'} alt="" />
          <span>
            Znacky Petti
            <small>Admin panel</small>
          </span>
        </div>

        {GROUPS.map((group) => (
          <div key={group.title}>
            <div className="admin-group">{group.title}</div>
            {group.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`admin-link${pathname === link.href ? ' active' : ''}`}
              >
                <span className="dot" />
                {link.label}
              </Link>
            ))}
          </div>
        ))}

        <div className="admin-side-foot">
          <a className="admin-link" href="/" target="_blank" rel="noopener">
            <span className="dot" />
            View website ↗
          </a>
          <button className="admin-link" onClick={signOut} style={{ width: '100%', textAlign: 'left' }}>
            <span className="dot" />
            Sign out
          </button>
          <div style={{ fontSize: '.72rem', padding: '4px 12px', color: 'rgba(255,251,243,.4)' }}>
            {email}
          </div>
        </div>
      </aside>
    </>
  )
}
