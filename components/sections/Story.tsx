import Link from 'next/link'
import type { Section, StoryContent } from '@/lib/types'

export default function Story({
  section,
  story,
}: {
  section?: Section
  story: StoryContent | null
}) {
  if (!story) return null
  const paragraphs = Array.isArray(story.body) ? story.body : []

  return (
    <section className="story" id="story">
      <div className="container">
        <div className="story-visual reveal-left">
          <div className="story-frame">
            {story.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={story.image_url} alt={section?.title ?? 'Our story'} loading="lazy" />
            ) : null}
          </div>
          {story.badge_number || story.badge_text ? (
            <div className="story-badge">
              <span className="n">{story.badge_number}</span>
              <span className="t">{story.badge_text}</span>
            </div>
          ) : null}
        </div>

        <div className="story-copy reveal-right">
          {section?.eyebrow ? <span className="eyebrow eyebrow--green">{section.eyebrow}</span> : null}
          {section?.title ? <h2>{section.title}</h2> : null}
          {section?.subtitle ? <p>{section.subtitle}</p> : null}
          {paragraphs.map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
          ))}
          {story.signature ? <span className="story-sign">{story.signature}</span> : null}
          {story.cta_label && story.cta_link ? (
            <Link href={story.cta_link} className="btn btn-outline">
              {story.cta_label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}
