'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Section } from '@/lib/types'

export default function AdminSections() {
  const [rows, setRows] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Section | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error: err } = await supabase.from('sections').select('*').order('sort_order')
    if (err) setError(err.message)
    setRows((data ?? []) as Section[])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function toggle(row: Section) {
    const next = !row.is_visible
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_visible: next } : r)))
    const supabase = createClient()
    const { error: err } = await supabase
      .from('sections')
      .update({ is_visible: next })
      .eq('id', row.id)
    if (err) {
      setError(err.message)
      load()
    }
  }

  async function move(row: Section, direction: -1 | 1) {
    const index = rows.findIndex((r) => r.id === row.id)
    const other = rows[index + direction]
    if (!other) return
    const supabase = createClient()
    await Promise.all([
      supabase.from('sections').update({ sort_order: other.sort_order }).eq('id', row.id),
      supabase.from('sections').update({ sort_order: row.sort_order }).eq('id', other.id),
    ])
    load()
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    const supabase = createClient()
    const { error: err } = await supabase
      .from('sections')
      .update({
        eyebrow: editing.eyebrow,
        title: editing.title,
        subtitle: editing.subtitle,
      })
      .eq('id', editing.id)
    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    setEditing(null)
    setNotice('Saved. The live site updates within a minute.')
    setTimeout(() => setNotice(''), 4000)
    load()
  }

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Sections &amp; visibility</h1>
          <p>
            Every block on the home page. Switch one off to hide it completely, reorder them with the
            arrows, and edit the heading text that sits above each block.
          </p>
        </div>
      </div>

      {notice ? <div className="admin-ok">{notice}</div> : null}
      {error ? <div className="admin-error">{error}</div> : null}

      <div className="admin-note">
        <strong>How the order works</strong>
        The list below is the exact top-to-bottom order of the live home page.
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-empty">Loading…</div>
        ) : (
          <div className="atable-wrap">
            <table className="atable">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Order</th>
                  <th>Section</th>
                  <th>Heading shown on site</th>
                  <th style={{ width: 130 }}>Visible</th>
                  <th style={{ width: 90 }} />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id}>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="abtn abtn-ghost abtn-sm"
                          onClick={() => move(row, -1)}
                          disabled={i === 0}
                        >
                          ↑
                        </button>
                        <button
                          className="abtn abtn-ghost abtn-sm"
                          onClick={() => move(row, 1)}
                          disabled={i === rows.length - 1}
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="rowtitle">{row.label}</div>
                      <div className="rowsub">key: {row.key}</div>
                    </td>
                    <td>
                      {row.title ? <div className="rowtitle">{row.title}</div> : <span>—</span>}
                      {row.eyebrow ? <div className="rowsub">{row.eyebrow}</div> : null}
                    </td>
                    <td>
                      <label className={`toggle${row.is_visible ? '' : ' off'}`}>
                        <input type="checkbox" checked={row.is_visible} onChange={() => toggle(row)} />
                        <span className="track" />
                        <span className="lbl">{row.is_visible ? 'Visible' : 'Hidden'}</span>
                      </label>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="abtn abtn-ghost abtn-sm" onClick={() => setEditing(row)}>
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing ? (
        <div className="modal-scrim" onClick={() => !saving && setEditing(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <div className="modal-head">
              <h2>{editing.label}</h2>
              <button type="button" className="abtn abtn-ghost abtn-sm" onClick={() => setEditing(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="afield">
                <label>Eyebrow (small pill above the heading)</label>
                <input
                  type="text"
                  value={editing.eyebrow ?? ''}
                  onChange={(e) => setEditing({ ...editing, eyebrow: e.target.value })}
                />
              </div>
              <div className="afield">
                <label>Heading</label>
                <input
                  type="text"
                  value={editing.title ?? ''}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>
              <div className="afield">
                <label>Sub text</label>
                <textarea
                  value={editing.subtitle ?? ''}
                  onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-foot">
              <button type="button" className="abtn abtn-ghost" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button type="submit" className="abtn abtn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  )
}
