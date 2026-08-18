import CrudManager from '@/components/admin/CrudManager'
import type { CrudConfig } from '@/components/admin/fields'

export default function AdminPage({
  title,
  description,
  note,
  config,
}: {
  title: string
  description?: string
  note?: string
  config: CrudConfig
}) {
  return (
    <>
      <div className="admin-top">
        <div>
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
        </div>
      </div>
      {note ? (
        <div className="admin-note">
          <strong>Tip</strong>
          {note}
        </div>
      ) : null}
      <CrudManager config={config} />
    </>
  )
}
