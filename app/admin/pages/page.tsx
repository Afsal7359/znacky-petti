'use client'

import AdminPage from '@/components/admin/AdminPage'

export default function AdminPages() {
  return (
    <AdminPage
      title="Pages"
      description="Every page on the site. Edit the banner, the menu label and the SEO text, or switch a page off to take it down. Which sections appear on each page is set in Sections & visibility."
      config={{
        table: 'pages',
        singular: 'page',
        titleKey: 'label',
        subtitleKey: 'title',
        imageKey: 'banner_image',
        activeKey: 'is_visible',
        orderKey: 'sort_order',
        fields: [
          { key: 'label', label: 'Page name (admin only)', type: 'text', required: true, inTable: true },
          {
            key: 'slug',
            label: 'URL',
            type: 'text',
            placeholder: 'our-story',
            help: 'The address after your domain. Leave empty for the home page. Changing this changes the live link.',
            inTable: true,
          },
          { key: 'nav_label', label: 'Menu label', type: 'text', help: 'What the header menu shows.' },
          { key: 'show_in_nav', label: 'Show in the menu', type: 'checkbox', default: true },
          {
            key: 'show_header',
            label: 'Show the banner at the top',
            type: 'checkbox',
            default: true,
            help: 'Turn off for the home page, which has the hero instead.',
          },
          { key: 'eyebrow', label: 'Banner eyebrow', type: 'text', placeholder: 'Our Story' },
          { key: 'title', label: 'Banner heading', type: 'text', span2: true },
          { key: 'subtitle', label: 'Banner sub text', type: 'textarea', span2: true },
          {
            key: 'banner_image',
            label: 'Banner background photo',
            type: 'image',
            span2: true,
            help: 'Optional. With a photo the banner turns dark with light text; without one it uses the warm gradient.',
          },
          { key: 'meta_title', label: 'SEO title', type: 'text', span2: true },
          { key: 'meta_description', label: 'SEO description', type: 'textarea', span2: true },
        ],
      }}
    />
  )
}
