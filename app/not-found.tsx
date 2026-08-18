import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="container">
      <div className="empty-state" style={{ paddingTop: 120, paddingBottom: 120 }}>
        <span className="eyebrow">404</span>
        <h2>This petti is empty</h2>
        <p>The page you are looking for has been moved, renamed, or never existed.</p>
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    </main>
  )
}
