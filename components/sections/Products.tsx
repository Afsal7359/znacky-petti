import ProductCard from '@/components/ProductCard'
import SectionHead from '@/components/SectionHead'
import type { Product, Section, SiteSettings } from '@/lib/types'
import { waLink } from '@/lib/utils'

export default function Products({
  section,
  products,
  settings,
}: {
  section?: Section
  products: Product[]
  settings: SiteSettings
}) {
  if (!products.length) return null

  return (
    <section className="products" id="products">
      <div className="container">
        <SectionHead section={section} />
        <div className="products-grid reveal-stagger">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} settings={settings} />
          ))}
        </div>
        <div className="products-more reveal">
          <a
            href={waLink(
              settings.whatsapp_number,
              `Hi ${settings.brand_name}! Could you share your full menu?`
            )}
            className="btn btn-outline"
            target="_blank"
            rel="noopener"
          >
            See Full Menu on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
