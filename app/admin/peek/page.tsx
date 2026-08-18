'use client'

import AdminPage from '@/components/admin/AdminPage'

export default function AdminPeek() {
  return (
    <AdminPage
      title="Peek Inside the Petti"
      description="The scrolling strip of round snack badges under the hero."
      config={{
        table: 'peek_items',
        singular: 'Peek item',
        titleKey: 'title',
        imageKey: 'image_url',
        fields: [
          { key: 'title', label: 'Snack name', type: 'text', required: true },
          { key: 'image_url', label: 'Round image', type: 'image', span2: true },
          { key: 'link', label: 'Links to', type: 'text', placeholder: '/banana-chips', inTable: true },
        ],
      }}
    />
  )
}
