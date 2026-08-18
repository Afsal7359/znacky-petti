'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ContactMessage } from '@/lib/types'

export default function AdminMessages() {
  const [rows, setRows] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (err) setError(err.message)
    setRows((data ?? []) as ContactMessage[])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function toggleRead(row: ContactMessage) {
    const next = !row.is_read
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_read: next } : r)))
    const supabase = createClient()
    await supabase.from('contact_messages').update({ is_read: next }).eq('id', row.id)
  }

  async function remove(row: ContactMessage) {
    if (!confirm('Delete this message?')) return
    const supabase = createClient()
    await supabase.from('contact_messages').delete().eq('id', row.id)
    load()
  }

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Messages</h1>
          <p>Everything submitted through the contact form on the home page.</p>
        </div>
      </div>

      {error ? <div className="admin-error">{error}</div> : null}

      <div className="admin-card">
        {loading ? (
          <div className="admin-empty">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="admin-empty">
            <h3>No messages yet</h3>
          </div>
        ) : (
          <div className="atable-wrap">
            <table className="atable">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Message</th>
                  <th style={{ width: 150 }}>Received</th>
                  <th style={{ width: 220 }} />
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div className="rowtitle">
                        {m.name} {m.is_read ? null : <span className="pill pill-new">new</span>}
                      </div>
                      <div className="rowsub">
                        {m.email} {m.phone ? `· ${m.phone}` : ''}
                      </div>
                    </td>
                    <td style={{ maxWidth: 420, whiteSpace: 'pre-wrap' }}>{m.message}</td>
                    <td className="rowsub">{new Date(m.created_at).toLocaleString('en-IN')}</td>
                    <td>
                      <div className="actions">
                        {m.email ? (
                          <a className="abtn abtn-ghost abtn-sm" href={`mailto:${m.email}`}>
                            Reply
                          </a>
                        ) : null}
                        <button className="abtn abtn-ghost abtn-sm" onClick={() => toggleRead(m)}>
                          {m.is_read ? 'Mark unread' : 'Mark read'}
                        </button>
                        <button className="abtn abtn-danger abtn-sm" onClick={() => remove(m)}>
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
