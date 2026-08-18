'use client'

import SingleRowForm from '@/components/admin/SingleRowForm'
import type { Field } from '@/components/admin/fields'

const FIELDS: Field[] = [
  { key: 'brand_name', label: 'Brand name', type: 'text', required: true },
  { key: 'tagline', label: 'Tagline', type: 'text' },
  { key: 'logo_url', label: 'Logo', type: 'image', span2: true },
  { key: 'hero_image_url', label: 'Fallback hero image', type: 'image', span2: true, help: 'Used only if the hero slider has no slides.' },
  { key: 'favicon_emoji', label: 'Browser tab emoji', type: 'text', placeholder: '🍌' },

  { key: 'meta_title', label: 'Browser / Google title', type: 'text', span2: true },
  { key: 'meta_description', label: 'Google description', type: 'textarea', span2: true },

  { key: 'whatsapp_number', label: 'WhatsApp number', type: 'text', required: true, help: 'Digits only with country code, e.g. 919745212345. Every order button uses this.' },
  { key: 'phone', label: 'Display phone', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'address', label: 'Address', type: 'text', span2: true },
  { key: 'business_hours', label: 'Business hours', type: 'text', span2: true },
  { key: 'map_embed_url', label: 'Google Maps embed URL', type: 'text', span2: true },

  { key: 'instagram_url', label: 'Instagram URL', type: 'text' },
  { key: 'facebook_url', label: 'Facebook URL', type: 'text' },
  { key: 'youtube_url', label: 'YouTube URL', type: 'text' },

  { key: 'currency_symbol', label: 'Currency symbol', type: 'text', default: '₹' },
  { key: 'delivery_charge', label: 'Delivery charge', type: 'number' },
  { key: 'free_delivery_above', label: 'Free delivery above', type: 'number', help: 'Set 0 to always charge delivery.' },
  { key: 'cart_enabled', label: 'Cart enabled', type: 'checkbox', help: 'Off = the site becomes WhatsApp-order only.' },
  { key: 'checkout_enabled', label: 'Checkout enabled', type: 'checkbox' },

  { key: 'announcement_enabled', label: 'Show announcement bar', type: 'checkbox' },
  { key: 'announcement_text', label: 'Announcement text', type: 'text', span2: true },

  { key: 'footer_about', label: 'Footer about text', type: 'textarea', span2: true },
  { key: 'copyright_text', label: 'Copyright line', type: 'text', span2: true },
]

export default function AdminSettings() {
  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Site settings</h1>
          <p>Brand, contact details, WhatsApp number, delivery rules and the announcement bar.</p>
        </div>
      </div>

      <SingleRowForm
        table="site_settings"
        fields={FIELDS}
        groups={[
          { title: 'Brand', keys: ['brand_name', 'tagline', 'logo_url', 'hero_image_url', 'favicon_emoji'] },
          { title: 'Search engines', keys: ['meta_title', 'meta_description'] },
          {
            title: 'Contact',
            keys: ['whatsapp_number', 'phone', 'email', 'address', 'business_hours', 'map_embed_url'],
          },
          { title: 'Social links', keys: ['instagram_url', 'facebook_url', 'youtube_url'] },
          {
            title: 'Shop rules',
            keys: [
              'currency_symbol',
              'delivery_charge',
              'free_delivery_above',
              'cart_enabled',
              'checkout_enabled',
            ],
          },
          { title: 'Announcement bar', keys: ['announcement_enabled', 'announcement_text'] },
          { title: 'Footer', keys: ['footer_about', 'copyright_text'] },
        ]}
      />
    </>
  )
}
