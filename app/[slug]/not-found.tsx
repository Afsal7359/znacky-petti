import Link from 'next/link'

export default function ProductNotFound() {
  return (
    <section className="container">
      <div className="empty-state" style={{ paddingTop: 110, paddingBottom: 110 }}>
        <span className="eyebrow">404</span>
        <h2>We could not find that snack</h2>
        <p>It may have been renamed or is no longer available.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/products" className="btn btn-primary">Browse all snacks</Link>
          <Link href="/" className="btn btn-outline">Back to home</Link>
        </div>
      </div>
    </section>
  )
}
