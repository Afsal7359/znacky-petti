'use client'

import AdminPage from '@/components/admin/AdminPage'

export default function AdminNavLinks() {
  return (
    <AdminPage
      title="Navigation menu"
      description="Links in the header, the mobile drawer and the footer’s Quick Links column."
      note="Use /#products style links to jump to a section on the home page, or /banana-chips to open a product page."
      config={{
        table: 'nav_links',
        singular: 'Link',
        titleKey: 'label',
        fields: [
          { key: 'label', label: 'Menu label', type: 'text', required: true },
          { key: 'href', label: 'Link', type: 'text', required: true, inTable: true, placeholder: '/#products' },
        ],
      }}
    />
  )
}
