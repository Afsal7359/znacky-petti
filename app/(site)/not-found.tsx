import Link from 'next/link'

/**
 * 404 for public pages. Lives inside the (site) group so it renders with the header,
 * footer and cart still in place instead of on a bare screen.
 */
export default function SiteNotFound() {
  return (
    <section className="container">
      <div className="empty-state" style={{ paddingTop: 120, paddingBottom: 120 }}>
        <span className="eyebrow">404</span>
        <h2>This petti is empty</h2>
        <p>The page you are looking for has been moved, renamed, or never existed.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/" className="btn btn-primary">
            Back to home
          </Link>
          <Link href="/products" className="btn btn-outline">
            Browse all snacks
          </Link>
        </div>
      </div>
    </section>
  )
}
