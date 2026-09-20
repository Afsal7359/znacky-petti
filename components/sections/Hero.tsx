'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import {
  BagIcon,
  ChevronLeft,
  ChevronRight,
  LeafIcon,
  ShieldIcon,
  TrophyIcon,
  WhatsAppIcon,
} from '@/components/Icons'
import type { HeroSlide, PeekItem, Section, SiteSettings } from '@/lib/types'
import { waLink } from '@/lib/utils'

type Props = {
  settings: SiteSettings
  section?: Section
  slides: HeroSlide[]
  peek: PeekItem[]
  peekSection?: Section
}

const AUTOPLAY_MS = 4200

export default function Hero({ settings, section, slides, peek, peekSection }: Props) {
  const list = slides.length
    ? slides
    : [
        {
          id: 'fallback',
          image_url: settings.hero_image_url || '/brand/chest.webp',
          alt_text: settings.brand_name,
          headline: '',
          subheadline: '',
          cta_label: '',
          cta_link: '',
          is_active: true,
          sort_order: 0,
        } as HeroSlide,
      ]

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback(
    (next: number) => setIndex(((next % list.length) + list.length) % list.length),
    [list.length]
  )

  useEffect(() => {
    if (paused || list.length < 2) return
    const t = setInterval(() => setIndex((i) => (i + 1) % list.length), AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [paused, list.length])

  const title = section?.title || 'Unbox the Taste of Kerala'
  // last word of the headline gets the maroon + underline treatment
  const words = title.trim().split(' ')
  const lastWord = words.length > 1 ? words.pop()! : ''
  const leadWords = words.join(' ')

  const active = list[index]

  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div className="hero-copy reveal-left">
          {section?.eyebrow ? <span className="eyebrow">{section.eyebrow}</span> : null}
          <h1>
            <span>{leadWords}</span>
            {lastWord ? (
              <span>
                <em>
                  {lastWord}
                  <svg viewBox="0 0 220 14" preserveAspectRatio="none">
                    <path
                      d="M2 9C40 -2 80 14 110 6C140 -2 180 14 218 5"
                      fill="none"
                      stroke="var(--gold)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </em>
              </span>
            ) : null}
          </h1>
          {section?.subtitle ? <p className="lead">{section.subtitle}</p> : null}

          <div className="hero-cta">
            <Link href="/#products" className="btn btn-primary">
              <BagIcon />
              Shop the Petti
            </Link>
            <a
              href={waLink(
                settings.whatsapp_number,
                `Hi ${settings.brand_name}! I'd like to place an order.`
              )}
              className="btn btn-whatsapp"
              target="_blank"
              rel="noopener"
            >
              <WhatsAppIcon />
              Order on WhatsApp
            </a>
          </div>

          <div className="hero-trust">
            <div className="hero-trust-item">
              <span className="dot">
                <LeafIcon />
              </span>
              Authentic Kerala Taste
            </div>
            <div className="hero-trust-item">
              <span className="dot">
                <TrophyIcon />
              </span>
              Premium Quality
            </div>
            <div className="hero-trust-item">
              <span className="dot">
                <ShieldIcon />
              </span>
              Hygienic Packaging
            </div>
          </div>
        </div>

        <div
          className="hero-visual reveal-right"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="hero-visual-glow" />

          <div className="hero-slider">
            {list.map((slide, i) => {
              const framed = !isTransparentAsset(slide.image_url)
              return (
                <div
                  key={slide.id}
                  className={`hero-slide${i === index ? ' active' : ''}${framed ? ' framed' : ''}`}
                  aria-hidden={i !== index}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.image_url}
                    alt={slide.alt_text || settings.brand_name}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                  {slide.headline || slide.subheadline ? (
                    <div className="hero-slide-caption">
                      {slide.headline ? <strong>{slide.headline}</strong> : null}
                      {slide.subheadline ? <span>{slide.subheadline}</span> : null}
                      {slide.cta_label && slide.cta_link ? (
                        <Link
                          href={slide.cta_link}
                          className="btn btn-gold btn-sm"
                          style={{ marginTop: 10 }}
                        >
                          {slide.cta_label}
                        </Link>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )
            })}

            {list.length > 1 ? (
              <>
                <button
                  className="hero-arrow prev"
                  onClick={() => go(index - 1)}
                  aria-label="Previous slide"
                >
                  <ChevronLeft />
                </button>
                <button
                  className="hero-arrow next"
                  onClick={() => go(index + 1)}
                  aria-label="Next slide"
                >
                  <ChevronRight />
                </button>
                <div className="hero-dots">
                  {list.map((s, i) => (
                    <button
                      key={s.id}
                      className={i === index ? 'active' : ''}
                      onClick={() => go(i)}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>

          <span className="sr-only">{active.alt_text}</span>
        </div>
      </div>

      {peekSection?.is_visible !== false && peek.length > 0 ? (
        <div className="container peek reveal">
          <div className="peek-head">
            <h3>{peekSection?.title || 'Peek Inside the Petti'}</h3>
            <span>{peekSection?.subtitle || 'Hover to pause →'}</span>
          </div>
          <div className="peek-track-wrap">
            <div className="peek-track">
              {[...peek, ...peek].map((item, i) => (
                <Link
                  className="peek-card"
                  key={`${item.id}-${i}`}
                  href={item.link || '/#products'}
                  aria-hidden={i >= peek.length}
                  tabIndex={i >= peek.length ? -1 : undefined}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="peek-badge" src={item.image_url || '/brand/chest.webp'} alt={item.title} loading="lazy" />
                  <strong>{item.title}</strong>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

/** Logo/chest PNGs & WEBPs sit on transparency — photos get the rounded frame instead. */
function isTransparentAsset(url: string) {
  return url.startsWith('/brand/') || url.endsWith('.png')
}
