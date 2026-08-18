'use client'

import AdminPage from '@/components/admin/AdminPage'
import { ICON_KEYS } from '@/components/Icons'

export default function AdminWhy() {
  return (
    <AdminPage
      title="Why Znacky Petti"
      description="The bento grid of promises. The first two cards render wide, the rest render as thirds."
      note="The small green chip under each card is optional — use it for a short proof point like “48 hour rule”."
      config={{
        table: 'why_features',
        singular: 'Reason',
        titleKey: 'title',
        subtitleKey: 'description',
        fields: [
          { key: 'title', label: 'Heading', type: 'text', required: true },
          {
            key: 'icon',
            label: 'Icon',
            type: 'select',
            options: ICON_KEYS.map((k) => ({ value: k, label: k })),
            default: 'leaf',
            inTable: true,
          },
          { key: 'description', label: 'Description', type: 'textarea', span2: true },
          { key: 'highlight', label: 'Chip text', type: 'text', placeholder: 'Grade A produce', inTable: true },
        ],
      }}
    />
  )
}
