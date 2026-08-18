'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Subscriber } from '@/lib/types'

export default function AdminSubscribers() {
  const [rows, setRows] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false })
    setRows((data ?? []) as Subscriber[])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function remove(row: Subscriber) {
    if (!confirm(`Remove ${row.email}?`)) return
    const supabase = createClient()
    await supabase.from('subscribers').delete().eq('id', row.id)
    load()
  }

  function copyAll() {
    navigator.clipboard.writeText(rows.map((r) => r.email).join(', '))
  }

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Subscribers</h1>
          <p>Emails collected by the footer newsletter box.</p>
        </div>
        <button className="abtn abtn-ghost" onClick={copyAll} disabled={!rows.length}>
          Copy all emails
        </button>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-empty">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="admin-empty">
            <h3>No subscribers yet</h3>
          </div>
        ) : (
          <div className="atable-wrap">
            <table className="atable">
              <thead>
                <tr>
                  <th>Email</th>
                  <th style={{ width: 200 }}>Subscribed</th>
                  <th style={{ width: 110 }} />
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td className="rowtitle">{s.email}</td>
                    <td className="rowsub">{new Date(s.created_at).toLocaleString('en-IN')}</td>
                    <td>
                      <div className="actions">
                        <button className="abtn abtn-danger abtn-sm" onClick={() => remove(s)}>
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
    </>
  )
}
