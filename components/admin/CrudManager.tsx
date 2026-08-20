'use client'

import { useCallback, useEffect, useState } from 'react'
import FieldInput, { type VariantDraft } from '@/components/admin/FieldInput'
import { blankRecord, type CrudConfig } from '@/components/admin/fields'
import { createClient } from '@/lib/supabase/client'
import { RESERVED_SLUGS } from '@/lib/pages'

type Row = Record<string, unknown> & { id?: string }

export default function CrudManager({ config }: { config: CrudConfig }) {
  const {
    table,
    singular,
    fields,
    fixed,
    filter,
    titleKey,
    subtitleKey,
    imageKey,
    activeKey = 'is_active',
    orderKey = 'sort_order',
    select = '*',
    optionSources,
  } = config

  const [dynamicOptions, setDynamicOptions] = useState<
    Record<string, { value: string; label: string }[]>
  >({})

  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Row | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      let query = supabase.from(table).select(select)
      if (filter) {
        for (const [k, v] of Object.entries(filter)) query = query.eq(k, v as never)
      }
      const { data, error: err } = await query.order(orderKey, { ascending: true })
      if (err) throw err
      setRows((data ?? []) as unknown as Row[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load records')
    } finally {
      setLoading(false)
    }
  }, [table, select, orderKey, JSON.stringify(filter)]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!optionSources?.length) return
    const supabase = createClient()
    Promise.all(
      optionSources.map(async (src) => {
        const { data } = await supabase.from(src.table).select(`${src.value}, ${src.label}`)
        const opts = ((data ?? []) as unknown as Record<string, unknown>[]).map((r) => ({
          value: String(r[src.value]),
          label: String(r[src.label]),
        }))
        return [src.field, opts] as const
      })
    ).then((entries) => setDynamicOptions(Object.fromEntries(entries)))
  }, [JSON.stringify(optionSources)]) // eslint-disable-line react-hooks/exhaustive-deps

  function startCreate() {
    const draft = blankRecord(fields, fixed)
    draft[orderKey] = rows.length
    setEditing(draft)
  }

  function startEdit(row: Row) {
    const draft: Row = { ...row }
    // normalise related variants for the editor
    const variantField = fields.find((f) => f.type === 'variants')
    if (variantField) {
      const list = (row[variantField.key] as VariantDraft[] | undefined) ?? []
      draft[variantField.key] = [...list].sort((a, b) => a.sort_order - b.sort_order)
    }
    setEditing(draft)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return

    // a product slug must not collide with a real route, or the page would shadow it
    const slugField = fields.find((f) => f.type === 'slug' || f.key === 'slug')
    if (slugField && table !== 'pages') {
      const value = String(editing[slugField.key] ?? '').trim().toLowerCase()
      if (value && RESERVED_SLUGS.includes(value)) {
        setError(
          `"${value}" is a page address on the site, so it cannot be used as a link. Try something like "${value}-petti".`
        )
        return
      }
    }

    setSaving(true)
    setError('')

    try {
      const supabase = createClient()
      const payload: Row = { ...editing, ...(fixed ?? {}) }

      const variantField = fields.find((f) => f.type === 'variants')
      let variants: VariantDraft[] = []
      if (variantField) {
        variants = (payload[variantField.key] as VariantDraft[] | undefined) ?? []
        delete payload[variantField.key]
      }

      // strip joined relations and empty optional keys the table does not own
      for (const key of Object.keys(payload)) {
        const known = fields.some((f) => f.key === key)
        const meta = ['id', orderKey, activeKey, ...Object.keys(fixed ?? {})].includes(key)
        if (!known && !meta) delete payload[key]
        if (payload[key] === '' && key.endsWith('_id')) payload[key] = null
      }

      let recordId = payload.id as string | undefined

      if (recordId) {
        const { error: err } = await supabase.from(table).update(payload).eq('id', recordId)
        if (err) throw err
      } else {
        delete payload.id
        const { data, error: err } = await supabase.from(table).insert(payload).select('id').single()
        if (err) throw err
        recordId = (data as { id: string }).id
      }

      if (variantField && recordId) {
        await syncVariants(recordId, variants)
      }

      setEditing(null)
      setNotice('Saved. The live site updates within a minute.')
      setTimeout(() => setNotice(''), 4000)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  async function syncVariants(productId: string, variants: VariantDraft[]) {
    const supabase = createClient()
    const { data: existing } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', productId)

    const keepIds = variants.map((v) => v.id).filter(Boolean) as string[]
    const toDelete = ((existing ?? []) as { id: string }[])
      .map((r) => r.id)
      .filter((id) => !keepIds.includes(id))

    if (toDelete.length) {
      await supabase.from('product_variants').delete().in('id', toDelete)
    }

    const cleaned = variants
      .filter((v) => v.label.trim())
      .map((v, i) => ({
        ...(v.id ? { id: v.id } : {}),
        product_id: productId,
        label: v.label.trim(),
        price: Number(v.price) || 0,
        mrp: v.mrp === '' || v.mrp === null ? null : Number(v.mrp) || null,
        in_stock: v.in_stock ?? true,
        is_default: v.is_default ?? false,
        is_active: v.is_active ?? true,
        sort_order: i,
      }))

    if (cleaned.length) {
      const { error } = await supabase.from('product_variants').upsert(cleaned)
      if (error) throw error
    }
  }

  async function toggleActive(row: Row) {
    const supabase = createClient()
    const next = !row[activeKey]
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, [activeKey]: next } : r)))
    const { error: err } = await supabase
      .from(table)
      .update({ [activeKey]: next })
      .eq('id', row.id!)
    if (err) {
      setError(err.message)
      load()
    }
  }

  async function move(row: Row, direction: -1 | 1) {
    const index = rows.findIndex((r) => r.id === row.id)
    const swapWith = rows[index + direction]
    if (!swapWith) return
    const supabase = createClient()

    const a = Number(row[orderKey] ?? index)
    const b = Number(swapWith[orderKey] ?? index + direction)
    const orderA = a === b ? index + direction : b
    const orderB = a === b ? index : a

    await Promise.all([
      supabase.from(table).update({ [orderKey]: orderA }).eq('id', row.id!),
      supabase.from(table).update({ [orderKey]: orderB }).eq('id', swapWith.id!),
    ])
    load()
  }

  async function remove(row: Row) {
    if (!confirm(`Delete this ${singular.toLowerCase()}? This cannot be undone.`)) return
    const supabase = createClient()
    const { error: err } = await supabase.from(table).delete().eq('id', row.id!)
    if (err) setError(err.message)
    load()
  }

  const tableFields = fields.filter((f) => f.inTable)

  return (
    <>
      {notice ? <div className="admin-ok">{notice}</div> : null}
      {error ? <div className="admin-error">{error}</div> : null}

      <div className="admin-card">
        <div className="admin-card-head">
          <h2>
            {rows.length} {singular}
            {rows.length === 1 ? '' : 's'}
          </h2>
          <button className="abtn abtn-primary" onClick={startCreate}>
            + Add {singular.toLowerCase()}
          </button>
        </div>

        {loading ? (
          <div className="admin-empty">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="admin-empty">
            <h3>Nothing here yet</h3>
            <p>Add your first {singular.toLowerCase()} to see it on the website.</p>
          </div>
        ) : (
          <div className="atable-wrap">
            <table className="atable">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Order</th>
                  {imageKey ? <th style={{ width: 60 }} /> : null}
                  <th>{singular}</th>
                  {tableFields.map((f) => (
                    <th key={f.key}>{f.label}</th>
                  ))}
                  <th style={{ width: 120 }}>Visible</th>
                  <th style={{ width: 150 }} />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={String(row.id)}>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="abtn abtn-ghost abtn-sm"
                          onClick={() => move(row, -1)}
                          disabled={i === 0}
                          aria-label="Move up"
                        >
                          ↑
                        </button>
                        <button
                          className="abtn abtn-ghost abtn-sm"
                          onClick={() => move(row, 1)}
                          disabled={i === rows.length - 1}
                          aria-label="Move down"
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                    {imageKey ? (
                      <td>
                        {row[imageKey] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img className="thumb" src={String(row[imageKey])} alt="" />
                        ) : (
                          <div className="thumb" />
                        )}
                      </td>
                    ) : null}
                    <td>
                      <div className="rowtitle">{String(row[titleKey] ?? '—')}</div>
                      {subtitleKey && row[subtitleKey] ? (
                        <div className="rowsub">{String(row[subtitleKey]).slice(0, 80)}</div>
                      ) : null}
                    </td>
                    {tableFields.map((f) => (
                      <td key={f.key}>
                        {f.type === 'checkbox'
                          ? row[f.key]
                            ? 'Yes'
                            : 'No'
                          : String(row[f.key] ?? '—').slice(0, 60)}
                      </td>
                    ))}
                    <td>
                      <label className={`toggle${row[activeKey] ? '' : ' off'}`}>
                        <input
                          type="checkbox"
                          checked={Boolean(row[activeKey])}
                          onChange={() => toggleActive(row)}
                        />
                        <span className="track" />
                        <span className="lbl">{row[activeKey] ? 'Live' : 'Hidden'}</span>
                      </label>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="abtn abtn-ghost abtn-sm" onClick={() => startEdit(row)}>
                          Edit
                        </button>
                        <button className="abtn abtn-danger abtn-sm" onClick={() => remove(row)}>
                          Delete
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
              <h2>
                {editing.id ? 'Edit' : 'New'} {singular.toLowerCase()}
              </h2>
              <button
                type="button"
                className="abtn abtn-ghost abtn-sm"
                onClick={() => setEditing(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              {error ? <div className="admin-error">{error}</div> : null}
              <div className="agrid">
                {fields.map((f) => (
                  <FieldInput
                    key={f.key}
                    field={dynamicOptions[f.key] ? { ...f, options: dynamicOptions[f.key] } : f}
                    value={editing[f.key]}
                    record={editing}
                    onChange={(key, value) => setEditing((prev) => ({ ...prev!, [key]: value }))}
                  />
                ))}
              </div>
            </div>
            <div className="modal-foot">
              <button
                type="button"
                className="abtn abtn-ghost"
                onClick={() => setEditing(null)}
                disabled={saving}
              >
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
