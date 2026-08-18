'use client'

import AdminPage from '@/components/admin/AdminPage'

export default function AdminStats() {
  return (
    <AdminPage
      title="Stats strip"
      description="The green band of counting numbers. Each one animates up when it scrolls into view."
      config={{
        table: 'stats',
        singular: 'Stat',
        titleKey: 'label',
        fields: [
          { key: 'label', label: 'Label', type: 'text', required: true },
          { key: 'value', label: 'Number', type: 'number', inTable: true, required: true },
          { key: 'suffix', label: 'Suffix', type: 'text', placeholder: '+ or %', inTable: true },
        ],
      }}
    />
  )
}
