import AllProducts from '@/components/sections/AllProducts'
import Combos from '@/components/sections/Combos'
import Contact from '@/components/sections/Contact'
import Faq from '@/components/sections/Faq'
import Hero from '@/components/sections/Hero'
import Offers from '@/components/sections/Offers'
import Process from '@/components/sections/Process'
import Products from '@/components/sections/Products'
import Stats from '@/components/sections/Stats'
import Story from '@/components/sections/Story'
import Testimonials from '@/components/sections/Testimonials'
import Wholesale from '@/components/sections/Wholesale'
import Why from '@/components/sections/Why'
import type { SiteData } from '@/lib/types'

/**
 * Renders the sections assigned to a page, in the admin-defined order.
 * One map for the whole site, so a section behaves identically wherever it is placed.
 */
export default function PageSections({ data, keys }: { data: SiteData; keys: string[] }) {
  const { settings, sections } = data

  const renderers: Record<string, () => React.ReactNode> = {
    hero: () => (
      <Hero
        settings={settings}
        section={sections.hero}
        slides={data.slides}
        peek={data.peek}
        peekSection={sections.peek}
      />
    ),
    products: () => (
      <Products section={sections.products} products={data.products} settings={settings} />
    ),
    all_products: () => (
      <AllProducts
        section={sections.all_products}
        products={data.products}
        combos={data.combos}
        settings={settings}
      />
    ),
    story: () => <Story section={sections.story} story={data.story} />,
    combos: () => <Combos section={sections.combos} combos={data.combos} settings={settings} />,
    offers: () => <Offers section={sections.offers} offers={data.offers} settings={settings} />,
    stats: () => <Stats stats={data.stats} />,
    why: () => <Why section={sections.why} features={data.why} />,
    process: () => <Process section={sections.process} steps={data.process} />,
    wholesale: () => <Wholesale section={sections.wholesale} settings={settings} />,
    testimonials: () => <Testimonials section={sections.testimonials} items={data.testimonials} />,
    faq: () => <Faq section={sections.faq} faqs={data.faqs} />,
    contact: () => <Contact section={sections.contact} settings={settings} />,
  }

  return (
    <>
      {keys
        // `peek` has no renderer of its own — the hero draws it
        .filter((key) => renderers[key])
        .map((key) => (
          <div key={key}>{renderers[key]()}</div>
        ))}
    </>
  )
}
