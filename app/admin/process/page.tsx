'use client'

import AdminPage from '@/components/admin/AdminPage'
import { ICON_KEYS } from '@/components/Icons'

export default function AdminProcess() {
  return (
    <AdminPage
      title="Our process"
      description="The connected timeline of how each batch is made. Steps sit on a gold rail that draws itself as the section scrolls in."
      note="Adding a step image is optional — leave it empty for the clean icon-only look."
      config={{
        table: 'process_steps',
        singular: 'Step',
        titleKey: 'title',
        subtitleKey: 'description',
        imageKey: 'image_url',
        fields: [
          { key: 'step_no', label: 'Step number', type: 'text', placeholder: '01', inTable: true, required: true },
          { key: 'title', label: 'Step title', type: 'text', required: true },
          {
            key: 'icon',
            label: 'Icon',
            type: 'select',
            options: ICON_KEYS.map((k) => ({ value: k, label: k })),
            default: 'sprout',
            inTable: true,
          },
          { key: 'description', label: 'Description', type: 'textarea', span2: true },
          { key: 'image_url', label: 'Step image (optional)', type: 'image', span2: true },
        ],
      }}
    />
  )
}
