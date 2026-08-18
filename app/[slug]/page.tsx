import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import ProductDetail from '@/components/ProductDetail'
import SiteShell from '@/components/SiteShell'
import { getProductBySlug, getRelatedProducts, getSiteData } from '@/lib/data'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Not found' }
  return {
    title: `${product.name} — Znacky Petti`,
    description: product.short_desc ?? product.long_desc ?? '',
    openGraph: {
      title: product.name,
      description: product.short_desc ?? '',
      images: product.image_url ? [product.image_url] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const [product, data] = await Promise.all([getProductBySlug(slug), getSiteData()])

  if (!product) notFound()

  const related = await getRelatedProducts(slug, product.type, 4)

  return (
    <SiteShell settings={data.settings} nav={data.nav} sections={data.sections}>
      <ProductDetail product={product} settings={data.settings} />

      {related.length > 0 ? (
        <section className="related">
          <div className="container">
            <div className="section-head center reveal">
              <h2>{product.type === 'combo' ? 'More combo pettis' : 'You may also like'}</h2>
            </div>
            <div className="products-grid reveal-stagger">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} settings={data.settings} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </SiteShell>
  )
}
