'use client'

import { useEffect, useState } from 'react'
import { ChevronUp, WhatsAppIcon } from '@/components/Icons'
import type { SiteSettings } from '@/lib/types'
import { waLink } from '@/lib/utils'

export default function FloatingButtons({
  settings,
  showWhatsapp,
}: {
  settings: SiteSettings
  showWhatsapp: boolean
}) {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="float-stack">
      {showWhatsapp ? (
        <a
          href={waLink(
            settings.whatsapp_number,
            `Hi ${settings.brand_name}! I'd like to place an order.`
          )}
          className="fab fab-wa"
          target="_blank"
          rel="noopener"
          aria-label="Order on WhatsApp"
        >
          <WhatsAppIcon />
        </a>
      ) : null}
      <button
        className={`fab fab-top${showTop ? ' show' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <ChevronUp />
      </button>
    </div>
  )
}
