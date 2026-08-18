import type { Metadata } from 'next'
import './admin.css'
import AdminNav from '@/components/admin/AdminNav'
import { getSettings, supabaseConfigured } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Admin — Znacky Petti',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!supabaseConfigured()) {
    return (
      <main style={{ padding: 40, maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ marginBottom: 12 }}>Supabase is not connected</h1>
        <p style={{ color: 'var(--ink-soft)' }}>
          Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{' '}
          <code>.env.local</code>, then restart the dev server. See <code>README.md</code>.
        </p>
      </main>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // the login page renders standalone (middleware guards everything else)
  if (!user) return <>{children}</>

  const settings = await getSettings()

  return (
    <div className="admin-shell">
      <AdminNav logo={settings.logo_url ?? ''} email={user.email ?? ''} />
      <div className="admin-main">{children}</div>
    </div>
  )
}
