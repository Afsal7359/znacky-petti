'use client'

import SingleRowForm from '@/components/admin/SingleRowForm'

export default function AdminStory() {
  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Our story</h1>
          <p>
            The photo, the floating badge and the paragraphs in the story section. The heading above
            it lives in Sections &amp; visibility.
          </p>
        </div>
      </div>

      <div className="admin-note">
        <strong>Formatting</strong>
        Each paragraph is its own box. Basic HTML works — use{' '}
        <code>&lt;em&gt;petti&lt;/em&gt;</code> to italicise a word in maroon.
      </div>

      <SingleRowForm
        table="story_content"
        fields={[
          { key: 'image_url', label: 'Story photo', type: 'image', span2: true },
          { key: 'badge_number', label: 'Badge number', type: 'text', placeholder: '12+' },
          { key: 'badge_text', label: 'Badge text', type: 'text' },
          { key: 'body', label: 'Paragraphs', type: 'list', span2: true },
          { key: 'signature', label: 'Signature line', type: 'text', span2: true },
          { key: 'cta_label', label: 'Button label (optional)', type: 'text' },
          { key: 'cta_link', label: 'Button link', type: 'text' },
        ]}
      />
    </>
  )
}
