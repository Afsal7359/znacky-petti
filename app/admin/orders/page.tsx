'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Order } from '@/lib/types'
import { money, waLink } from '@/lib/utils'

const STATUSES: Order['status'][] = [
  'new',
  'confirmed',
  'packed',
  'shipped',
  'delivered',
  'cancelled',
]

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState<Order | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (err) setError(err.message)
    setOrders((data ?? []) as Order[])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function setStatus(order: Order, status: Order['status']) {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)))
    const supabase = createClient()
    const { error: err } = await supabase.from('orders').update({ status }).eq('id', order.id)
    if (err) {
      setError(err.message)
      load()
    }
  }

  async function remove(order: Order) {
    if (!confirm(`Delete order ${order.order_number}?`)) return
    const supabase = createClient()
    await supabase.from('orders').delete().eq('id', order.id)
    load()
  }

  function exportCsv() {
    const header = ['Order', 'Date', 'Name', 'Phone', 'Address', 'Items', 'Total', 'Status']
    const rows = orders.map((o) => [
      o.order_number,
      new Date(o.created_at).toLocaleString('en-IN'),
      o.customer_name,
      o.phone,
      `${o.address_line1} ${o.address_line2 ?? ''} ${o.city} ${o.state ?? ''} ${o.pincode}`.trim(),
      (o.items ?? []).map((i) => `${i.name} (${i.variant}) x${i.qty}`).join(' | '),
      o.total,
      o.status,
    ])
    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `znacky-orders-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Orders</h1>
          <p>Every checkout submission, saved before the customer is handed over to WhatsApp.</p>
        </div>
        <button className="abtn abtn-ghost" onClick={exportCsv} disabled={!orders.length}>
          Export CSV
        </button>
      </div>

      {error ? <div className="admin-error">{error}</div> : null}

      <div className="admin-card">
        {loading ? (
          <div className="admin-empty">Loading…</div>
        ) : orders.length === 0 ? (
          <div className="admin-empty">
            <h3>No orders yet</h3>
            <p>They appear the moment someone completes the checkout form.</p>
          </div>
        ) : (
          <div className="atable-wrap">
            <table className="atable">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th style={{ width: 150 }}>Status</th>
                  <th style={{ width: 190 }} />
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <div className="rowtitle">{o.order_number}</div>
                      <div className="rowsub">{new Date(o.created_at).toLocaleString('en-IN')}</div>
                    </td>
                    <td>
                      <div className="rowtitle">{o.customer_name}</div>
                      <div className="rowsub">
                        {o.phone} · {o.city} {o.pincode}
                      </div>
                    </td>
                    <td>{(o.items ?? []).length}</td>
                    <td className="rowtitle">{money(o.total)}</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => setStatus(o, e.target.value as Order['status'])}
                        style={{
                          border: '1.4px solid rgba(36,24,18,.14)',
                          borderRadius: 8,
                          padding: '6px 8px',
                          fontSize: '.8rem',
                          fontWeight: 700,
                        }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="abtn abtn-ghost abtn-sm" onClick={() => setOpen(o)}>
                          View
                        </button>
                        <a
                          className="abtn abtn-green abtn-sm"
                          href={waLink(o.phone, `Hi ${o.customer_name}, about your order ${o.order_number}…`)}
                          target="_blank"
                          rel="noopener"
                        >
                          WhatsApp
                        </a>
                        <button className="abtn abtn-danger abtn-sm" onClick={() => remove(o)}>
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

      {open ? (
        <div className="modal-scrim" onClick={() => setOpen(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Order {open.order_number}</h2>
              <button className="abtn abtn-ghost abtn-sm" onClick={() => setOpen(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <h3 style={{ fontSize: '.95rem', marginBottom: 10 }}>Items</h3>
              <table className="atable" style={{ marginBottom: 22 }}>
                <tbody>
                  {(open.items ?? []).map((i, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="rowtitle">{i.name}</div>
                        <div className="rowsub">
                          {i.variant} × {i.qty}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }} className="rowtitle">
                        {money(i.line_total)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="rowtitle">Subtotal</td>
                    <td style={{ textAlign: 'right' }}>{money(open.subtotal)}</td>
                  </tr>
                  <tr>
                    <td className="rowtitle">Delivery</td>
                    <td style={{ textAlign: 'right' }}>
                      {open.delivery_charge > 0 ? money(open.delivery_charge) : 'FREE'}
                    </td>
                  </tr>
                  <tr>
                    <td className="rowtitle">Total</td>
                    <td style={{ textAlign: 'right' }} className="rowtitle">
                      {money(open.total)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <h3 style={{ fontSize: '.95rem', marginBottom: 10 }}>Delivery address</h3>
              <p style={{ fontSize: '.9rem', lineHeight: 1.8, color: 'var(--ink-soft)' }}>
                <strong style={{ color: 'var(--brown)' }}>{open.customer_name}</strong>
                <br />
                {open.phone}
                {open.email ? ` · ${open.email}` : ''}
                <br />
                {open.address_line1}
                <br />
                {open.address_line2 ? (
                  <>
                    {open.address_line2}
                    <br />
                  </>
                ) : null}
                {open.landmark ? (
                  <>
                    Landmark: {open.landmark}
                    <br />
                  </>
                ) : null}
                {open.city}
                {open.state ? `, ${open.state}` : ''} — {open.pincode}
              </p>
              {open.note ? (
                <>
                  <h3 style={{ fontSize: '.95rem', margin: '18px 0 8px' }}>Note</h3>
                  <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)' }}>{open.note}</p>
                </>
              ) : null}
            </div>
            <div className="modal-foot">
              <a
                className="abtn abtn-green"
                href={waLink(open.phone, `Hi ${open.customer_name}, about your order ${open.order_number}…`)}
                target="_blank"
                rel="noopener"
              >
                Message customer
              </a>
              <button className="abtn abtn-ghost" onClick={() => setOpen(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
