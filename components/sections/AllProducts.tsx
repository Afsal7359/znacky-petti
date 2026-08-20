'use client'

import { useMemo, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import SectionHead from '@/components/SectionHead'
import type { Product, Section, SiteSettings } from '@/lib/types'

/** The full shop: everything we sell, filterable by category. */
export default function AllProducts({
  section,
  products,
  combos,
  settings,
}: {
  section?: Section
  products: Product[]
  combos: Product[]
  settings: SiteSettings
}) {
  const all = useMemo(() => [...products, ...combos], [products, combos])

  const filters = useMemo(() => {
    const seen = new Map<string, string>()
    for (const p of products) {
      const name = p.categories?.name
      const slug = p.categories?.slug
      if (name && slug && !seen.has(slug)) seen.set(slug, name)
    }
    const list = [{ key: 'all', label: 'Everything' }]
    for (const [slug, name] of seen) list.push({ key: slug, label: name })
    if (combos.length) list.push({ key: '__combos', label: 'Combo pettis' })
    return list
  }, [products, combos])

  const [active, setActive] = useState('all')

  const shown = useMemo(() => {
    if (active === 'all') return all
    if (active === '__combos') return combos
    return products.filter((p) => p.categories?.slug === active)
  }, [active, all, combos, products])

  if (!all.length) return null

  return (
    <section className="products" id="products">
      <div className="container">
        <SectionHead section={section} />

        {filters.length > 2 ? (
          <div className="shop-filters reveal" role="tablist" aria-label="Filter products">
            {filters.map((f) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={active === f.key}
                className={`shop-filter${active === f.key ? ' active' : ''}`}
                onClick={() => setActive(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        ) : null}

        <p className="shop-count">
          Showing {shown.length} {shown.length === 1 ? 'item' : 'items'}
        </p>

        <div className="products-grid reveal-stagger">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} settings={settings} />
          ))}
        </div>
      </div>
    </section>
  )
}
