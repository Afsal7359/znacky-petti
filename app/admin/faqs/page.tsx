'use client'

import AdminPage from '@/components/admin/AdminPage'

export default function AdminFaqs() {
  return (
    <AdminPage
      title="FAQs"
      description="The accordion near the bottom of the home page. The first question is open by default."
      config={{
        table: 'faqs',
        singular: 'FAQ',
        titleKey: 'question',
        subtitleKey: 'answer',
        fields: [
          { key: 'question', label: 'Question', type: 'text', span2: true, required: true },
          { key: 'answer', label: 'Answer', type: 'textarea', span2: true, required: true },
        ],
      }}
    />
  )
}
