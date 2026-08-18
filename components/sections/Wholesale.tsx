import { CartIcon, MailIcon, WhatsAppIcon } from '@/components/Icons'
import type { Section, SiteSettings } from '@/lib/types'
import { waLink } from '@/lib/utils'

export default function Wholesale({
  section,
  settings,
}: {
  section?: Section
  settings: SiteSettings
}) {
  if (!section) return null

  return (
    <section className="wholesale" id="wholesale">
      <div className="container">
        <div className="wholesale-inner reveal-zoom">
          <div className="wholesale-copy">
            {section.eyebrow ? <span className="eyebrow eyebrow--light">{section.eyebrow}</span> : null}
            {section.title ? <h2>{section.title}</h2> : null}
            {section.subtitle ? <p>{section.subtitle}</p> : null}
            <div className="wholesale-cta">
              <a
                href={waLink(
                  settings.whatsapp_number,
                  `Hi ${settings.brand_name}, I'd like to enquire about wholesale/bulk orders.`
                )}
                className="btn btn-whatsapp"
                target="_blank"
                rel="noopener"
              >
                <WhatsAppIcon />
                Talk to Us on WhatsApp
              </a>
              {settings.email ? (
                <a
                  href={`mailto:${settings.email}?subject=Wholesale%20Enquiry`}
                  className="btn btn-ghost-light"
                >
                  <MailIcon />
                  Email Wholesale Team
                </a>
              ) : null}
            </div>
          </div>
          <div className="wholesale-visual">
            <div className="ring">
              <div className="ring2">
                <CartIcon strokeWidth={1.6} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
