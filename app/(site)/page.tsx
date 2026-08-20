import Link from 'next/link'
import type { Metadata } from 'next'
import PageSections from '@/components/PageSections'
import { unstable_noStore as noStore } from 'next/cache'
import { demoMode, getPage, getSiteData, sectionsForPage, supabaseConfigured } from '@/lib/data'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  if (!supabaseConfigured() && !demoMode()) return {}
  const data = await getSiteData()
  const home = getPage(data, 'home')
  const title = home?.meta_title || data.settings.meta_title
  const description = home?.meta_description || data.settings.meta_description
  return { title, description }
}

export default async function HomePage() {
  // Credentials missing at build time? Opt this render out of the static cache so the
  // setup notice can never be baked into a prerendered page — the site then starts
  // working the moment the env vars are in place, with no rebuild needed.
  if (!supabaseConfigured() && !demoMode()) {
    noStore()
    return <SetupNotice />
  }

  const data = await getSiteData()
  const keys = sectionsForPage(data, 'home')

  return <PageSections data={data} keys={keys} />
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
