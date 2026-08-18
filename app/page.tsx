import Link from 'next/link'
import SiteShell from '@/components/SiteShell'
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
import { unstable_noStore as noStore } from 'next/cache'
import { demoMode, getSiteData, supabaseConfigured } from '@/lib/data'

export const revalidate = 60

export default async function HomePage() {
  // Credentials missing at build time? Opt this render out of the static cache so the
  // setup notice can never be baked into a prerendered page — the site then starts
  // working the moment the env vars are in place, with no rebuild needed.
  if (!supabaseConfigured() && !demoMode()) {
    noStore()
    return <SetupNotice />
  }

  const data = await getSiteData()
  const { settings, sections } = data

  const visible = (key: string) => sections[key]?.is_visible !== false

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

  const ordered = Object.values(sections)
    .filter((s) => renderers[s.key])
    .sort((a, b) => a.sort_order - b.sort_order)

  // if the sections table is empty, still render in a sensible default order
  const keys = ordered.length
    ? ordered.map((s) => s.key)
    : ['hero', 'products', 'story', 'combos', 'offers', 'stats', 'why', 'process', 'wholesale', 'testimonials', 'faq', 'contact']

  return (
    <SiteShell settings={settings} nav={data.nav} sections={sections}>
      {keys.map((key) =>
        visible(key) ? <div key={key}>{renderers[key]()}</div> : null
      )}
    </SiteShell>
  )
}

function SetupNotice() {
  return (
    <main className="container" style={{ padding: '80px 0', maxWidth: 760 }}>
      <span className="eyebrow">Setup needed</span>
      <h1 style={{ fontSize: '2.2rem', marginBottom: 16 }}>Connect Supabase to go live</h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 22 }}>
        The site is built and ready — it just needs the database credentials. Create{' '}
        <code>.env.local</code> in the project root with:
      </p>
      <pre
        style={{
          background: 'var(--brown)',
          color: 'var(--gold-pale)',
          padding: 22,
          borderRadius: 16,
          overflowX: 'auto',
          fontSize: '.86rem',
          lineHeight: 1.8,
        }}
      >{`NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...`}</pre>
      <p style={{ color: 'var(--ink-soft)', margin: '22px 0' }}>
        Then run <code>supabase/01_schema.sql</code> and <code>supabase/02_seed.sql</code> in the
        Supabase SQL editor and restart the dev server. Full steps are in <code>README.md</code>.
      </p>
      <Link href="/admin" className="btn btn-primary">
        Go to admin panel
      </Link>
    </main>
  )
}
