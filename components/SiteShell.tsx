import CartDrawer from '@/components/CartDrawer'
import FloatingButtons from '@/components/FloatingButtons'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import type { NavLink, Section, SiteSettings } from '@/lib/types'

type Props = {
  settings: SiteSettings
  nav: NavLink[]
  sections: Record<string, Section>
  children: React.ReactNode
}

export default function SiteShell({ settings, nav, sections, children }: Props) {
  const newsletterSection = sections.newsletter
  const announcement = sections.announcement?.is_visible !== false

  return (
    <>
      <Header settings={settings} nav={nav} showAnnouncement={announcement} />
      <main>{children}</main>
      <Footer
        settings={settings}
        nav={nav}
        newsletter={{
          visible: newsletterSection?.is_visible !== false,
          title: newsletterSection?.title ?? 'Stay Connected',
          subtitle:
            newsletterSection?.subtitle ??
            'Subscribe for updates on new products and festive offers.',
        }}
      />
      <CartDrawer settings={settings} />
      <FloatingButtons
        settings={settings}
        showWhatsapp={sections.float_whatsapp?.is_visible !== false}
      />
    </>
  )
}
