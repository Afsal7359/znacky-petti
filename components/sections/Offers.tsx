import SectionHead from '@/components/SectionHead'
import { ArrowRight, TagIcon } from '@/components/Icons'
import type { Offer, Section, SiteSettings } from '@/lib/types'
import { waLink } from '@/lib/utils'

export default function Offers({
  section,
  offers,
  settings,
}: {
  section?: Section
  offers: Offer[]
  settings: SiteSettings
}) {
  if (!offers.length) return null

  return (
    <section className="offers" id="offers">
      <div className="container">
        <SectionHead section={section} />
        <div className="offer-grid reveal-stagger">
          {offers.map((offer) => {
            const href =
              offer.cta_link ||
              waLink(
                settings.whatsapp_number,
                `Hi ${settings.brand_name}! I'd like to use the offer *${offer.title}*${
                  offer.code ? ` (code ${offer.code})` : ''
                }.`
              )
            const external = href.startsWith('http')

            return (
              <article className={`offer-card ${offer.accent ?? 'maroon'}`} key={offer.id}>
                {offer.discount_text ? (
                  <div className="offer-discount">{offer.discount_text}</div>
                ) : null}
                <h3>{offer.title}</h3>
                {offer.subtitle ? <div className="offer-sub">{offer.subtitle}</div> : null}
                {offer.description ? <p>{offer.description}</p> : null}
                <div className="offer-foot">
                  {offer.code ? (
                    <span className="offer-code">
                      <TagIcon style={{ width: 13, height: 13, display: 'inline', verticalAlign: -2 }} />{' '}
                      {offer.code}
                    </span>
                  ) : null}
                  <a
                    className="offer-cta"
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener' : undefined}
                  >
                    {offer.cta_label || 'Grab this offer'}
                    <ArrowRight style={{ width: 15, height: 15 }} />
                  </a>
                </div>
                {offer.valid_until ? (
                  <div className="offer-valid">
                    Valid till{' '}
                    {new Date(offer.valid_until).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
