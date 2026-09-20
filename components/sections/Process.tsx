import SectionHead from '@/components/SectionHead'
import { Icon } from '@/components/Icons'
import type { ProcessStep, Section } from '@/lib/types'

function getStepIconName(step: ProcessStep): string {
  if (step.icon && step.icon.trim()) return step.icon.trim()
  const title = (step.title || '').toLowerCase()
  if (title.includes('check')) return 'checked'
  if (title.includes('seal')) return 'sealed'
  if (title.includes('select') || title.includes('source')) return 'sprout'
  if (title.includes('pack')) return 'box'
  if (title.includes('deliver') || title.includes('ship')) return 'truck'
  return 'leaf'
}

export default function Process({
  section,
  steps,
}: {
  section?: Section
  steps: ProcessStep[]
}) {
  if (!steps.length) return null

  return (
    <section className="process" id="process">
      <div className="container">
        <SectionHead section={section} eyebrowClass="eyebrow--green" />
        <div className="proc-grid reveal-stagger">
          <span className="proc-rail" aria-hidden="true" />
          {steps.map((step) => (
            <article className="proc-step" key={step.id}>
              <div className="proc-node">
                <Icon name={getStepIconName(step)} />
                <span className="proc-num">{step.step_no}</span>
              </div>
              <div className="proc-body">
                {step.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="proc-step-img" src={step.image_url} alt={step.title} loading="lazy" />
                ) : null}
                <h3>{step.title}</h3>
                {step.description ? <p>{step.description}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
