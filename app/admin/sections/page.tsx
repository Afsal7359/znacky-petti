'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_PAGES } from '@/lib/pages'
import type { Page, Section } from '@/lib/types'

const GLOBAL = 'global'

export default function AdminSections() {
  const [rows, setRows] = useState<Section[]>([])
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Section | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  // true once 03_multipage.sql has been run
  const migrated = rows.some((r) => typeof r.page === 'string' && r.page.length > 0)

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const [sectionsRes, pagesRes] = await Promise.all([
      supabase.from('sections').select('*').order('sort_order'),
      supabase.from('pages').select('*').order('sort_order'),
    ])
    if (sectionsRes.error) setError(sectionsRes.error.message)
    setRows((sectionsRes.data ?? []) as Section[])
    setPages(((pagesRes.data ?? []) as Page[]).length ? (pagesRes.data as Page[]) : DEFAULT_PAGES)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function flash(msg: string) {
    setNotice(msg)
    setTimeout(() => setNotice(''), 4000)
  }

  async function toggle(row: Section) {
    const next = !row.is_visible
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_visible: next } : r)))
    const supabase = createClient()
    const { error: err } = await supabase.from('sections').update({ is_visible: next }).eq('id', row.id)
    if (err) {
      setError(err.message)
      load()
    }
  }

  /** Swap with the neighbour inside the same page group. */
  async function move(row: Section, direction: -1 | 1) {
    const group = groupOf(row)
    const index = group.findIndex((r) => r.id === row.id)
    const other = group[index + direction]
    if (!other) return
    const supabase = createClient()
    await Promise.all([
      supabase.from('sections').update({ sort_order: other.sort_order }).eq('id', row.id),
      supabase.from('sections').update({ sort_order: row.sort_order }).eq('id', other.id),
    ])
    load()
  }

  function groupOf(row: Section) {
    return rows
      .filter((r) => (r.page ?? GLOBAL) === (row.page ?? GLOBAL))
      .sort((a, b) => a.sort_order - b.sort_order)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    const patch: Record<string, unknown> = {
      eyebrow: editing.eyebrow,
      title: editing.title,
      subtitle: editing.subtitle,
    }
    // only write the page column once the migration has created it
    if (migrated) patch.page = editing.page
    const supabase = createClient()
    const { error: err } = await supabase.from('sections').update(patch).eq('id', editing.id)
    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    setEditing(null)
    flash('Saved. The live site updates within a minute.')
    load()
  }

  const groups: { key: string; label: string; items: Section[] }[] = [
    ...pages.map((p) => ({
      key: p.key,
      label: p.label,
      items: rows.filter((r) => (r.page ?? '') === p.key).sort((a, b) => a.sort_order - b.sort_order),
    })),
    {
      key: GLOBAL,
      label: 'Shown on every page',
      items: rows
        .filter((r) => (r.page ?? GLOBAL) === GLOBAL)
        .sort((a, b) => a.sort_order - b.sort_order),
    },
  ].filter((g) => g.items.length)

  const unassigned = rows.filter(
    (r) => r.page && r.page !== GLOBAL && !pages.some((p) => p.key === r.page)
  )
  if (unassigned.length) {
    groups.push({ key: '__orphan', label: 'Not on any page', items: unassigned })
  }

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Sections &amp; visibility</h1>
          <p>
            Every block on the site, grouped by the page it appears on. Switch one off to hide it,
            reorder with the arrows, edit its heading, or move it to a different page.
          </p>
        </div>
      </div>

      {notice ? <div className="admin-ok">{notice}</div> : null}
      {error ? <div className="admin-error">{error}</div> : null}

      {!loading && !migrated ? (
        <div className="admin-note">
          <strong>Run the page migration to unlock this</strong>
          Open the Supabase SQL editor and run <code>supabase/03_multipage.sql</code>. Until then the
          site uses the built-in page layout and sections cannot be moved between pages.
        </div>
      ) : (
        <div className="admin-note">
          <strong>How the order works</strong>
          Within each page, the list below is the exact top-to-bottom order on the live site.
        </div>
      )}

      {loading ? (
        <div className="admin-card">
          <div className="admin-empty">Loading…</div>
        </div>
      ) : (
        groups.map((group) => (
          <div className="admin-card" key={group.key} style={{ marginBottom: 18 }}>
            <div className="admin-card-head">
              <h2>{group.label}</h2>
              <span className="rowsub">
                {group.items.length} section{group.items.length === 1 ? '' : 's'}
              </span>
            </div>
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
                  {group.items.map((row, i) => (
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
                            disabled={i === group.items.length - 1}
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
                          <input
                            type="checkbox"
                            checked={row.is_visible}
                            onChange={() => toggle(row)}
                          />
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
          </div>
        ))
      )}

      {editing ? (
        <div className="modal-scrim" onClick={() => !saving && setEditing(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <div className="modal-head">
              <h2>{editing.label}</h2>
              <button
                type="button"
                className="abtn abtn-ghost abtn-sm"
                onClick={() => setEditing(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              {migrated ? (
                <div className="afield">
                  <label>Show this section on</label>
                  <select
                    value={editing.page ?? GLOBAL}
                    onChange={(e) => setEditing({ ...editing, page: e.target.value })}
                  >
                    {pages.map((p) => (
                      <option key={p.key} value={p.key}>
                        {p.label}
                      </option>
                    ))}
                    <option value={GLOBAL}>Every page</option>
                  </select>
                  <small>Moving a section puts it at its current position on the new page.</small>
                </div>
              ) : null}
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
