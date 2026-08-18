'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ImageField({
  value,
  onChange,
  label,
  help,
}: {
  value: string
  onChange: (url: string) => void
  label: string
  help?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function upload(file: File) {
    setBusy(true)
    setError('')
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const { error: upErr } = await supabase.storage.from('media').upload(path, file, {
        cacheControl: '31536000',
        upsert: false,
      })
      if (upErr) throw upErr
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      onChange(data.publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="afield">
      <label>{label}</label>
      <div className="image-field">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="image-preview" src={value} alt="" />
        ) : (
          <div className="image-preview empty">No image</div>
        )}
        <div className="grow">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://… or upload a file"
          />
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) upload(file)
              e.target.value = ''
            }}
          />
          <button
            type="button"
            className="upload-btn"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            {busy ? 'Uploading…' : '⬆ Upload image'}
          </button>
          {value ? (
            <button
              type="button"
              className="upload-btn"
              style={{ marginLeft: 8, color: 'var(--maroon)', borderColor: 'rgba(138,42,31,.35)' }}
              onClick={() => onChange('')}
            >
              Clear
            </button>
          ) : null}
          {error ? <div className="help" style={{ color: 'var(--maroon)' }}>{error}</div> : null}
          {help ? <div className="help">{help}</div> : null}
        </div>
      </div>
    </div>
  )
}
