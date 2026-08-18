'use client'

import { useState } from 'react'
import SectionHead from '@/components/SectionHead'
import type { Faq as FaqType, Section } from '@/lib/types'

export default function Faq({ section, faqs }: { section?: Section; faqs: FaqType[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null)

  if (!faqs.length) return null

  return (
    <section className="faq" id="faq">
      <div className="container">
        <SectionHead section={section} />
        <div className="faq-list reveal">
          {faqs.map((f) => {
            const isOpen = open === f.id
            return (
              <div className={`faq-item${isOpen ? ' open' : ''}`} key={f.id}>
                <button className="faq-q" onClick={() => setOpen(isOpen ? null : f.id)} aria-expanded={isOpen}>
                  <h3>{f.question}</h3>
                  <span className="plus" />
                </button>
                <div className="faq-a" style={{ maxHeight: isOpen ? 400 : 0 }}>
                  <p>{f.answer}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
