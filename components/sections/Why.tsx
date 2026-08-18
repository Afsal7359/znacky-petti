import SectionHead from '@/components/SectionHead'
import { CheckIcon, Icon } from '@/components/Icons'
import type { Section, WhyFeature } from '@/lib/types'

export default function Why({
  section,
  features,
}: {
  section?: Section
  features: WhyFeature[]
}) {
  if (!features.length) return null

  return (
    <section className="why" id="why">
      <div className="container">
        <SectionHead section={section} />
        <div className="why-grid reveal-stagger">
          {features.map((f, i) => (
            <article className="why-card" key={f.id}>
              <span className="why-index">{String(i + 1).padStart(2, '0')}</span>
              <span className="ic">
                <Icon name={f.icon} />
              </span>
              <h3>{f.title}</h3>
              {f.description ? <p>{f.description}</p> : null}
              {f.highlight ? (
                <span className="why-chip">
                  <CheckIcon />
                  {f.highlight}
                </span>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
