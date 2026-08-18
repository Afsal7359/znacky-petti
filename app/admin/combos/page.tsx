'use client'

import AdminPage from '@/components/admin/AdminPage'
import { COMBO_FIELDS } from '@/app/admin/product-fields'

export default function AdminCombos() {
  return (
    <AdminPage
      title="Special combo pettis"
      description="Bundles shown in the Special Combo section. Each combo also gets its own page at /<slug> and can be added to the cart."
      note="Set the ribbon text to whatever you want customers to see — “Save ₹231”, “Best Value”, “Festive box”."
      config={{
        table: 'products',
        singular: 'Combo',
        select: '*, product_variants(*)',
        filter: { type: 'combo' },
        fixed: { type: 'combo', show_in_peek: false },
        titleKey: 'name',
        subtitleKey: 'short_desc',
        imageKey: 'image_url',
        fields: COMBO_FIELDS,
      }}
    />
  )
}
