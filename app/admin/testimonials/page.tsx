'use client'

import AdminPage from '@/components/admin/AdminPage'

export default function AdminTestimonials() {
  return (
    <AdminPage
      title="Testimonials"
      description="Customer quotes in the green carousel. They rotate every 5.5 seconds and can be swiped on mobile."
      config={{
        table: 'testimonials',
        singular: 'Testimonial',
        titleKey: 'name',
        subtitleKey: 'quote',
        imageKey: 'avatar_url',
        fields: [
          { key: 'name', label: 'Customer name', type: 'text', required: true },
          { key: 'location', label: 'Location', type: 'text', inTable: true },
          { key: 'quote', label: 'Quote', type: 'textarea', span2: true, required: true },
          { key: 'rating', label: 'Stars (1–5)', type: 'number', default: 5, inTable: true },
          { key: 'initials', label: 'Avatar initials', type: 'text', placeholder: 'AR' },
          {
            key: 'color',
            label: 'Avatar colour',
            type: 'select',
            options: [
              { value: 'maroon', label: 'Maroon' },
              { value: 'green', label: 'Green' },
              { value: 'gold', label: 'Gold' },
              { value: 'brown', label: 'Brown' },
            ],
            default: 'maroon',
          },
          { key: 'avatar_url', label: 'Avatar photo (optional)', type: 'image', span2: true },
        ],
      }}
    />
  )
}
