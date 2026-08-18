'use client'

import AdminPage from '@/components/admin/AdminPage'

export default function AdminHero() {
  return (
    <AdminPage
      title="Hero slider"
      description="The images that slide in the hero section of the home page. Add as many as you like — they rotate automatically every 4 seconds."
      note="Use the ↑ ↓ arrows to set the order. Transparent PNG/WEBP art floats free; photos get a rounded frame automatically."
      config={{
        table: 'hero_slides',
        singular: 'Slide',
        titleKey: 'alt_text',
        subtitleKey: 'headline',
        imageKey: 'image_url',
        fields: [
          { key: 'image_url', label: 'Slide image', type: 'image', span2: true, required: true },
          { key: 'alt_text', label: 'Image description (alt text)', type: 'text', span2: true },
          { key: 'headline', label: 'Caption headline', type: 'text', help: 'Optional overlay text.' },
          { key: 'subheadline', label: 'Caption subtext', type: 'text' },
          { key: 'cta_label', label: 'Caption button label', type: 'text' },
          { key: 'cta_link', label: 'Caption button link', type: 'text', placeholder: '/banana-chips' },
        ],
      }}
    />
  )
}
