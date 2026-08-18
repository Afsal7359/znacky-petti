'use client'

import AdminPage from '@/components/admin/AdminPage'
import { PRODUCT_FIELDS } from '@/app/admin/product-fields'

export default function AdminProducts() {
  return (
    <AdminPage
      title="Products"
      description="Every snack shown in the Products grid. Each product gets its own page at znackypetti.com/<slug>."
      note="Turn a product off with the Visible switch to hide it everywhere without deleting it. Pack sizes and prices are edited inside each product."
      config={{
        table: 'products',
        singular: 'Product',
        select: '*, product_variants(*)',
        filter: { type: 'product' },
        fixed: { type: 'product' },
        titleKey: 'name',
        subtitleKey: 'short_desc',
        imageKey: 'image_url',
        fields: PRODUCT_FIELDS,
        optionSources: [
          { field: 'category_id', table: 'categories', value: 'id', label: 'name' },
        ],
      }}
    />
  )
}
