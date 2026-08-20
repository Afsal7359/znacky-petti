import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/CartProvider'
import ScrollReveal from '@/components/Reveal'
import RouteProgress from '@/components/RouteProgress'
import { getSettings } from '@/lib/data'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  const emoji = s.favicon_emoji || '🍌'
  return {
    title: s.meta_title || `${s.brand_name} — ${s.tagline ?? ''}`,
    description: s.meta_description ?? '',
    openGraph: {
      title: s.meta_title || s.brand_name,
      description: s.meta_description ?? '',
      type: 'website',
    },
    icons: {
      icon: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="88">${encodeURIComponent(
        emoji
      )}</text></svg>`,
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <CartProvider>
          <RouteProgress />
          {children}
          <ScrollReveal />
        </CartProvider>
      </body>
    </html>
  )
}
