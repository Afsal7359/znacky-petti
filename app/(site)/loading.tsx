import { SkeletonProductGrid } from '@/components/Skeletons'

/** First paint of the home page while the hero and product data arrive. */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <section style={{ padding: 'calc(var(--header-h) + 46px) 0 60px' }}>
        <div className="container">
          <div className="hero-grid">
            <div>
              <span className="sk sk-line" style={{ width: 250, height: 34, borderRadius: 999, marginBottom: 22 }} />
              <span className="sk sk-line" style={{ width: '94%', height: 52, marginBottom: 14 }} />
              <span className="sk sk-line" style={{ width: '66%', height: 52, marginBottom: 26 }} />
              <span className="sk sk-line" style={{ width: '86%', height: 13, marginBottom: 9 }} />
              <span className="sk sk-line" style={{ width: '74%', height: 13, marginBottom: 34 }} />
              <div style={{ display: 'flex', gap: 14 }}>
                <span className="sk sk-line" style={{ width: 176, height: 52, borderRadius: 999 }} />
                <span className="sk sk-line" style={{ width: 196, height: 52, borderRadius: 999 }} />
              </div>
            </div>
            <div className="sk" style={{ width: '100%', aspectRatio: '1/1', borderRadius: 'var(--radius-lg)' }} />
          </div>
        </div>
      </section>
      <section style={{ padding: '40px 0 90px' }}>
        <div className="container">
          <span className="sk sk-line" style={{ width: 220, height: 30, margin: '0 auto 36px' }} />
          <SkeletonProductGrid />
        </div>
      </section>
    </div>
  )
}
