'use client'

import ImageField from '@/components/admin/ImageField'
import type { Field } from '@/components/admin/fields'
import { slugify } from '@/lib/utils'

export type VariantDraft = {
  id?: string
  label: string
  price: number | string
  mrp: number | string
  in_stock: boolean
  is_default: boolean
  is_active: boolean
  sort_order: number
}

type Props = {
  field: Field
  value: unknown
  record: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
}

export default function FieldInput({ field, value, record, onChange }: Props) {
  const set = (v: unknown) => onChange(field.key, v)

  if (field.type === 'image') {
    return (
      <div className={field.span2 ? 'span2' : undefined}>
        <ImageField
          label={field.label}
          help={field.help}
          value={String(value ?? '')}
          onChange={set}
        />
      </div>
    )
  }

  if (field.type === 'checkbox') {
    const checked = Boolean(value)
    return (
      <div className={`afield${field.span2 ? ' span2' : ''}`}>
        <label className={`toggle${checked ? '' : ' off'}`}>
          <input type="checkbox" checked={checked} onChange={(e) => set(e.target.checked)} />
          <span className="track" />
          <span className="lbl">{field.label}</span>
        </label>
        {field.help ? <div className="help">{field.help}</div> : null}
      </div>
    )
  }

  if (field.type === 'variants') {
    return (
      <div className="afield span2">
        <label>{field.label}</label>
        <VariantsEditor
          value={(Array.isArray(value) ? value : []) as VariantDraft[]}
          onChange={set}
        />
        {field.help ? <div className="help">{field.help}</div> : null}
      </div>
    )
  }

  if (field.type === 'list') {
    const list = Array.isArray(value) ? (value as string[]) : []
    return (
      <div className="afield span2">
        <label>{field.label}</label>
        {list.map((item, i) => (
          <div className="list-row" key={i}>
            <textarea
              value={item}
              onChange={(e) => {
                const next = [...list]
                next[i] = e.target.value
                set(next)
              }}
            />
            <button
              type="button"
              className="abtn abtn-danger abtn-sm"
              onClick={() => set(list.filter((_, idx) => idx !== i))}
            >
              ✕
            </button>
          </div>
        ))}
        <button type="button" className="abtn abtn-ghost abtn-sm" onClick={() => set([...list, ''])}>
          + Add
        </button>
        {field.help ? <div className="help">{field.help}</div> : null}
      </div>
    )
  }

  if (field.type === 'select') {
    return (
      <div className={`afield${field.span2 ? ' span2' : ''}`}>
        <label>{field.label}</label>
        <select value={String(value ?? '')} onChange={(e) => set(e.target.value)}>
          <option value="">— none —</option>
          {(field.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {field.help ? <div className="help">{field.help}</div> : null}
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <div className={`afield${field.span2 ? ' span2' : ''}`}>
        <label>{field.label}</label>
        <textarea
          value={String(value ?? '')}
          onChange={(e) => set(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
        />
        {field.help ? <div className="help">{field.help}</div> : null}
      </div>
    )
  }

  if (field.type === 'slug') {
    return (
      <div className={`afield${field.span2 ? ' span2' : ''}`}>
        <label>{field.label}</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={String(value ?? '')}
            onChange={(e) => set(slugify(e.target.value))}
            placeholder={field.placeholder}
            required={field.required}
          />
          {field.from ? (
            <button
              type="button"
              className="abtn abtn-ghost abtn-sm"
              onClick={() => set(slugify(String(record[field.from!] ?? '')))}
            >
              Auto
            </button>
          ) : null}
        </div>
        <div className="help">{field.help ?? `Page URL: /${String(value ?? '')}`}</div>
      </div>
    )
  }

  return (
    <div className={`afield${field.span2 ? ' span2' : ''}`}>
      <label>{field.label}</label>
      <input
        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
        value={value === null || value === undefined ? '' : String(value)}
        onChange={(e) => set(field.type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={field.placeholder}
        required={field.required}
        step={field.type === 'number' ? 'any' : undefined}
      />
      {field.help ? <div className="help">{field.help}</div> : null}
    </div>
  )
}

function VariantsEditor({
  value,
  onChange,
}: {
  value: VariantDraft[]
  onChange: (v: VariantDraft[]) => void
}) {
  function update(i: number, patch: Partial<VariantDraft>) {
    onChange(value.map((v, idx) => (idx === i ? { ...v, ...patch } : v)))
  }

  return (
    <div>
      <div className="variant-head">
        <span>Pack label</span>
        <span>Price</span>
        <span>MRP</span>
        <span>Default</span>
        <span />
      </div>
      {value.map((v, i) => (
        <div className="variant-row" key={v.id ?? `new-${i}`}>
          <input
            value={v.label}
            onChange={(e) => update(i, { label: e.target.value })}
            placeholder="250g"
          />
          <input
            type="number"
            value={v.price}
            onChange={(e) => update(i, { price: e.target.value })}
            placeholder="180"
          />
          <input
            type="number"
            value={v.mrp}
            onChange={(e) => update(i, { mrp: e.target.value })}
            placeholder="220"
          />
          <label className="toggle" title="Default pack">
            <input
              type="radio"
              name="variant-default"
              checked={v.is_default}
              onChange={() =>
                onChange(value.map((x, idx) => ({ ...x, is_default: idx === i })))
              }
            />
            <span className="track" />
          </label>
          <button
            type="button"
            className="abtn abtn-danger abtn-sm"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        className="abtn abtn-ghost abtn-sm"
        onClick={() =>
          onChange([
            ...value,
            {
              label: '',
              price: 0,
              mrp: 0,
              in_stock: true,
              is_default: value.length === 0,
              is_active: true,
              sort_order: value.length,
            },
          ])
        }
      >
        + Add pack size
      </button>
    </div>
  )
}
