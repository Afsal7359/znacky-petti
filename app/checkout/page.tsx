import type { Metadata } from 'next'
import Link from 'next/link'
import CheckoutForm from '@/components/CheckoutForm'
import SiteShell from '@/components/SiteShell'
import { ChevronRight } from '@/components/Icons'
import { getSiteData } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Checkout — Znacky Petti',
  robots: { index: false },
}

export default async function CheckoutPage() {
  const data = await getSiteData()

  return (
    <SiteShell settings={data.settings} nav={data.nav} sections={data.sections}>
      <section className="checkout">
        <div className="container">
          <nav className="crumbs">
            <Link href="/">Home</Link>
            <ChevronRight />
            <span>Checkout</span>
          </nav>

          {data.settings.checkout_enabled ? (
            <CheckoutForm settings={data.settings} />
          ) : (
            <div className="empty-state">
              <h2>Checkout is temporarily closed</h2>
              <p>We are restocking. Message us on WhatsApp and we will take your order directly.</p>
              <Link href="/" className="btn btn-primary">
                Back to home
              </Link>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  )
}
