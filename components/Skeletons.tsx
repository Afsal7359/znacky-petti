/** Shimmer placeholders shown while a page's data is still on the way. */

export function SkeletonPageHeader() {
  return (
    <div className="page-header sk-header">
      <div className="container page-header-inner">
        <span className="sk sk-line" style={{ width: 130, height: 12, margin: '0 auto 20px' }} />
        <span className="sk sk-line" style={{ width: 180, height: 34, margin: '0 auto 18px', borderRadius: 999 }} />
        <span className="sk sk-line" style={{ width: 'min(420px, 80%)', height: 40, margin: '0 auto 16px' }} />
        <span className="sk sk-line" style={{ width: 'min(320px, 70%)', height: 14, margin: '0 auto' }} />
      </div>
    </div>
  )
}

export function SkeletonProductGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="products-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="pcard sk-card" key={i}>
          <div className="sk sk-media" />
          <div className="pcard-body">
            <span className="sk sk-line" style={{ width: '72%', height: 16, marginBottom: 10 }} />
            <span className="sk sk-line" style={{ width: '46%', height: 11, marginBottom: 16 }} />
            <span className="sk sk-line" style={{ width: '54%', height: 20, marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              <span className="sk sk-line" style={{ width: 52, height: 28, borderRadius: 999 }} />
              <span className="sk sk-line" style={{ width: 52, height: 28, borderRadius: 999 }} />
              <span className="sk sk-line" style={{ width: 52, height: 28, borderRadius: 999 }} />
            </div>
            <span className="sk sk-line" style={{ width: '100%', height: 40, borderRadius: 999 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <span
          key={i}
          className="sk sk-line"
          style={{ height: 13, width: i === lines - 1 ? '62%' : '100%' }}
        />
      ))}
    </div>
  )
}

/** Whole-page fallback used by the route-level loading files. */
export function SkeletonPage({ grid = false }: { grid?: boolean }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <SkeletonPageHeader />
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          {grid ? (
            <SkeletonProductGrid />
          ) : (
            <div style={{ display: 'grid', gap: 26, maxWidth: 760, margin: '0 auto' }}>
              <SkeletonText lines={4} />
              <SkeletonText lines={3} />
              <SkeletonText lines={5} />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
