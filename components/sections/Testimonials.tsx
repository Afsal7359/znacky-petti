'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from '@/components/Icons'
import SectionHead from '@/components/SectionHead'
import type { Section, Testimonial } from '@/lib/types'

const COLORS: Record<string, string> = {
  maroon: 'var(--maroon)',
  green: 'var(--green)',
  gold: 'var(--gold)',
  brown: 'var(--brown)',
}

export default function Testimonials({
  section,
  items,
}: {
  section?: Section
  items: Testimonial[]
}) {
  const [index, setIndex] = useState(0)
  const touchStart = useRef<number | null>(null)

  const go = useCallback(
    (next: number) => setIndex(((next % items.length) + items.length) % items.length),
    [items.length]
  )

  useEffect(() => {
    if (items.length < 2) return
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 5500)
    return () => clearInterval(t)
  }, [items.length, index])

  if (!items.length) return null

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <SectionHead section={section} eyebrowClass="eyebrow--light" />

        <div
          className="t-carousel reveal"
          onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStart.current === null) return
            const dx = e.changedTouches[0].clientX - touchStart.current
            if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
            touchStart.current = null
          }}
        >
          <div className="t-track-wrap">
            <div className="t-track" style={{ transform: `translateX(-${index * 100}%)` }}>
              {items.map((t) => (
                <div className="t-slide" key={t.id}>
                  <div className="t-card">
                    <div className="t-stars">{'★'.repeat(Math.max(1, Math.min(5, t.rating)))}</div>
                    <p className="t-quote">&ldquo;{t.quote}&rdquo;</p>
                    <div className="t-person">
                      <span
                        className="t-avatar"
                        style={{ background: COLORS[t.color ?? 'maroon'] ?? 'var(--maroon)' }}
                      >
                        {t.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.avatar_url} alt={t.name} />
                        ) : (
                          t.initials || t.name.slice(0, 2).toUpperCase()
                        )}
                      </span>
                      <span className="who">
                        <strong>{t.name}</strong>
                        <span>{t.location}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {items.length > 1 ? (
            <div className="t-nav">
              <button className="t-arrow" onClick={() => go(index - 1)} aria-label="Previous testimonial">
                <ChevronLeft />
              </button>
              <div className="t-dots">
                {items.map((t, i) => (
                  <button
                    key={t.id}
                    className={`t-dot${i === index ? ' active' : ''}`}
                    onClick={() => go(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button className="t-arrow" onClick={() => go(index + 1)} aria-label="Next testimonial">
                <ChevronRight />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
