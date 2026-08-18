'use client'

import AdminPage from '@/components/admin/AdminPage'

export default function AdminCategories() {
  return (
    <AdminPage
      title="Categories"
      description="Group products so they can be labelled on the product detail page."
      config={{
        table: 'categories',
        singular: 'Category',
        titleKey: 'name',
        fields: [
          { key: 'name', label: 'Category name', type: 'text', required: true },
          { key: 'slug', label: 'Slug', type: 'slug', from: 'name', required: true },
        ],
      }}
    />
  )
}
