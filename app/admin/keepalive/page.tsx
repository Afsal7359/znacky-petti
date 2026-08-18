'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Ping = { id: string; source: string; pinged_at: string }

export default function AdminKeepAlive() {
  const [rows, setRows] = useState<Ping[]>([])
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('keepalive_log')
      .select('*')
      .order('pinged_at', { ascending: false })
      .limit(30)
    setRows((data ?? []) as Ping[])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function pingNow() {
    setResult('Pinging…')
    try {
      const res = await fetch('/api/keepalive')
      const json = await res.json()
      setResult(JSON.stringify(json, null, 2))
      load()
    } catch (err) {
      setResult(err instanceof Error ? err.message : 'Ping failed')
    }
  }

  const last = rows[0]
  const hoursSince = last
    ? Math.round((Date.now() - new Date(last.pinged_at).getTime()) / 3_600_000)
    : null

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Keep-alive</h1>
          <p>
            Supabase pauses free projects after a week of inactivity. A daily ping writes one row
            here and wakes the website, so the database and the site always stay live.
          </p>
        </div>
        <button className="abtn abtn-primary" onClick={pingNow}>
          Ping now
        </button>
      </div>

      <div className="astat-grid">
        <div className="astat">
          <div className="n">{rows.length}</div>
          <div className="l">Recent pings</div>
        </div>
        <div className="astat">
          <div className="n">{hoursSince === null ? '—' : `${hoursSince}h`}</div>
          <div className="l">Since last ping</div>
        </div>
        <div className="astat">
          <div className="n" style={{ fontSize: '1.1rem', paddingTop: 10 }}>
            {last ? new Date(last.pinged_at).toLocaleString('en-IN') : 'Never'}
          </div>
          <div className="l">Last ping</div>
        </div>
      </div>

      <div className="admin-note">
        <strong>How the daily run is set up</strong>
        Vercel Cron (<code>vercel.json</code>) hits <code>/api/keepalive</code> every day at 06:00
        UTC. A GitHub Action (<code>.github/workflows/keepalive.yml</code>) does the same as a
        backup and also pings the site itself. You can run it locally any time with{' '}
        <code>npm run keepalive</code>.
      </div>

      {result ? (
        <div className="admin-card">
          <div className="admin-card-head">
            <h2>Last manual ping</h2>
          </div>
          <div className="admin-card-body">
            <pre
              style={{
                background: '#FBFAF8',
                padding: 16,
                borderRadius: 10,
                fontSize: '.8rem',
                overflowX: 'auto',
              }}
            >
              {result}
            </pre>
          </div>
        </div>
      ) : null}

      <div className="admin-card">
        <div className="admin-card-head">
          <h2>Ping history</h2>
        </div>
        {loading ? (
          <div className="admin-empty">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="admin-empty">
            <h3>No pings recorded yet</h3>
            <p>Press “Ping now” to test it, then let the daily cron take over.</p>
          </div>
        ) : (
          <div className="atable-wrap">
            <table className="atable">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="rowtitle">{new Date(r.pinged_at).toLocaleString('en-IN')}</td>
                    <td>
                      <span className="pill pill-info">{r.source}</span>
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
