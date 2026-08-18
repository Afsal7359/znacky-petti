export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'checkbox'
  | 'image'
  | 'select'
  | 'date'
  | 'list'
  | 'variants'
  | 'slug'

export type Field = {
  key: string
  label: string
  type: FieldType
  options?: { value: string; label: string }[]
  placeholder?: string
  help?: string
  required?: boolean
  span2?: boolean
  /** show this column in the list table */
  inTable?: boolean
  /** source field for slug auto-generation */
  from?: string
  default?: unknown
}

export type CrudConfig = {
  table: string
  singular: string
  fields: Field[]
  /** values forced on every insert, e.g. { type: 'combo' } */
  fixed?: Record<string, unknown>
  /** query filter, e.g. { type: 'combo' } */
  filter?: Record<string, unknown>
  titleKey: string
  subtitleKey?: string
  imageKey?: string
  activeKey?: string
  orderKey?: string
  /** extra select for related rows */
  select?: string
  /** dropdowns whose options come from another table */
  optionSources?: { field: string; table: string; value: string; label: string }[]
}

export function blankRecord(fields: Field[], fixed?: Record<string, unknown>) {
  const row: Record<string, unknown> = { ...(fixed ?? {}) }
  for (const f of fields) {
    if (f.default !== undefined) row[f.key] = f.default
    else if (f.type === 'checkbox') row[f.key] = true
    else if (f.type === 'number') row[f.key] = 0
    else if (f.type === 'list' || f.type === 'variants') row[f.key] = []
    else row[f.key] = ''
  }
  return row
}
