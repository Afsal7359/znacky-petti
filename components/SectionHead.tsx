import type { Section } from '@/lib/types'

export default function SectionHead({
  section,
  center = true,
  eyebrowClass = '',
}: {
  section?: Section
  center?: boolean
  eyebrowClass?: string
}) {
  if (!section) return null
  if (!section.eyebrow && !section.title && !section.subtitle) return null

  return (
    <div className={`section-head${center ? ' center' : ''} reveal`}>
      {section.eyebrow ? (
        <span className={`eyebrow ${eyebrowClass}`.trim()}>{section.eyebrow}</span>
      ) : null}
      {section.title ? <h2>{section.title}</h2> : null}
      {section.subtitle ? <p>{section.subtitle}</p> : null}
    </div>
  )
}
