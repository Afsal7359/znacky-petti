'use client'

import { useCallback, useEffect, useState } from 'react'
import FieldInput from '@/components/admin/FieldInput'
import type { Field } from '@/components/admin/fields'
import { createClient } from '@/lib/supabase/client'

type Row = Record<string, unknown>

export default function SingleRowForm({
  table,
  fields,
  groups,
}: {
  table: string
  fields: Field[]
  /** optional section grouping: [{ title, keys }] */
  groups?: { title: string; keys: string[] }[]
}) {
  const [row, setRow] = useState<Row | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data, error: err } = await supabase.from(table).select('*').eq('id', 1).maybeSingle()
      if (err) throw err
      setRow((data as Row) ?? { id: 1 })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load')
      setRow({ id: 1 })
    }
  }, [table])

  useEffect(() => {
    load()
  }, [load])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!row) return
    setSaving(true)
    setError('')
    try {
      const supabase = createClient()
      const payload: Row = { id: 1 }
      for (const f of fields) payload[f.key] = row[f.key] ?? null
      const { error: err } = await supabase.from(table).upsert(payload)
      if (err) throw err
      setNotice('Saved. The live site updates within a minute.')
      setTimeout(() => setNotice(''), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  if (!row) return <div className="admin-card"><div className="admin-empty">Loading…</div></div>

  const change = (key: string, value: unknown) => setRow((prev) => ({ ...prev!, [key]: value }))
  const renderField = (f: Field) => (
    <FieldInput key={f.key} field={f} value={row[f.key]} record={row} onChange={change} />
  )

  return (
    <form onSubmit={save}>
      {notice ? <div className="admin-ok">{notice}</div> : null}
      {error ? <div className="admin-error">{error}</div> : null}

      {groups?.length ? (
        groups.map((g) => (
          <div className="admin-card" key={g.title}>
            <div className="admin-card-head">
              <h2>{g.title}</h2>
            </div>
            <div className="admin-card-body">
              <div className="agrid">
                {g.keys
                  .map((k) => fields.find((f) => f.key === k))
                  .filter((f): f is Field => Boolean(f))
                  .map(renderField)}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="admin-card">
          <div className="admin-card-body">
            <div className="agrid">{fields.map(renderField)}</div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
        <button className="abtn abtn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}
