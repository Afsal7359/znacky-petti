import Link from 'next/link'
import type { Page } from '@/lib/types'

/** The banner at the top of every inner page: breadcrumb, eyebrow, title, subtitle. */
export default function PageHeader({ page }: { page: Page }) {
  if (page.show_header === false) return null

  const hasImage = Boolean(page.banner_image)

  return (
    <header className={`page-header${hasImage ? ' has-image' : ''}`}>
      {hasImage ? (
        <div
          className="page-header-bg"
          style={{ backgroundImage: `url(${page.banner_image})` }}
          aria-hidden="true"
        />
      ) : (
        <div className="page-header-art" aria-hidden="true">
          <span className="blob blob-1" />
          <span className="blob blob-2" />
        </div>
      )}

      <div className="container page-header-inner">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{page.nav_label || page.label}</span>
        </nav>

        {page.eyebrow ? <span className="eyebrow">{page.eyebrow}</span> : null}
        <h1>{page.title || page.label}</h1>
        {page.subtitle ? <p>{page.subtitle}</p> : null}
      </div>
    </header>
  )
}
