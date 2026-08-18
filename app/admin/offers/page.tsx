'use client'

import AdminPage from '@/components/admin/AdminPage'

export default function AdminOffers() {
  return (
    <AdminPage
      title="Offers"
      description="The coloured offer cards on the home page. Switch one off the moment a deal ends."
      note="Leave the link empty and the card opens WhatsApp with the offer name and code already typed in."
      config={{
        table: 'offers',
        singular: 'Offer',
        titleKey: 'title',
        subtitleKey: 'description',
        fields: [
          { key: 'title', label: 'Offer title', type: 'text', required: true },
          { key: 'subtitle', label: 'Subtitle', type: 'text' },
          { key: 'discount_text', label: 'Big text', type: 'text', placeholder: '15% OFF', inTable: true },
          { key: 'code', label: 'Coupon code', type: 'text', placeholder: 'ONAM15', inTable: true },
          {
            key: 'accent',
            label: 'Card colour',
            type: 'select',
            options: [
              { value: 'maroon', label: 'Maroon' },
              { value: 'green', label: 'Green' },
              { value: 'gold', label: 'Gold' },
            ],
            default: 'maroon',
          },
          { key: 'description', label: 'Description', type: 'textarea', span2: true },
          { key: 'cta_label', label: 'Button label', type: 'text', default: 'Grab this offer' },
          { key: 'cta_link', label: 'Button link', type: 'text', help: 'Leave empty to open WhatsApp.' },
          { key: 'valid_until', label: 'Valid until', type: 'date' },
        ],
      }}
    />
  )
}
