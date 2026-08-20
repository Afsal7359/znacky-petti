import SiteShell from '@/components/SiteShell'
import { demoMode, getSiteData, supabaseConfigured } from '@/lib/data'

/**
 * Wraps every public page in the header, footer, cart drawer and floating buttons.
 *
 * Living in a layout rather than in each page means the shell stays mounted while the
 * next page streams in — so navigating shows the skeleton inside a page that still has
 * its header, instead of the whole screen going blank.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // before the database is connected, pages render their own setup notice
  if (!supabaseConfigured() && !demoMode()) return <>{children}</>

  const data = await getSiteData()

  return (
    <SiteShell settings={data.settings} nav={data.nav} sections={data.sections}>
      {children}
    </SiteShell>
  )
}
