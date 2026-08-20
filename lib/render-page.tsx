import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import PageSections from '@/components/PageSections'
import { getPage, getSiteData, sectionsForPage } from '@/lib/data'

/**
 * Every inner page is the same shape: shell + banner + its sections.
 * Keeping it in one place means a new page is a five-line file.
 */
export async function renderPage(pageKey: string) {
  let data = await getSiteData()
  const page = getPage(data, pageKey)

  // a page switched off in the admin panel stops existing
  if (!page || page.is_visible === false) notFound()

  const keys = sectionsForPage(data, pageKey)

  // The banner already shows the page's heading. If the first section repeats it, drop
  // that section's own heading block so the page does not say the same thing twice.
  const lead = keys.find((k) => data.sections[k])
  const same = (a?: string | null, b?: string | null) =>
    (a ?? '').trim().toLowerCase() === (b ?? '').trim().toLowerCase()

  if (page.show_header !== false && lead) {
    const leadSection = data.sections[lead]
    if (leadSection && same(leadSection.title, page.title)) {
      data = {
        ...data,
        sections: {
          ...data.sections,
          [lead]: { ...leadSection, eyebrow: '', title: '', subtitle: '' },
        },
      }
    }
  }

  return (
    <>
      <PageHeader page={page} />
      {keys.length ? (
        <PageSections data={data} keys={keys} />
      ) : (
        <div className="container" style={{ padding: '80px 0' }}>
          <p style={{ color: 'var(--ink-soft)' }}>No sections are enabled for this page yet.</p>
        </div>
      )}
    </>
  )
}

/** Per-page SEO, editable in the admin panel. */
export async function pageMetadata(pageKey: string): Promise<Metadata> {
  let data = await getSiteData()
  const page = getPage(data, pageKey)
  if (!page) return {}

  const title = page.meta_title || `${page.label} — ${data.settings.brand_name}`
  const description =
    page.meta_description || page.subtitle || data.settings.meta_description || undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: page.banner_image ? [page.banner_image] : undefined,
    },
  }
}
