import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Order } from '@/lib/types'
import { money } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [products, combos, orders, messages, subscribers, offers, recent, lastPing] =
    await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }).eq('type', 'product'),
      supabase.from('products').select('id', { count: 'exact', head: true }).eq('type', 'combo'),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase
        .from('contact_messages')
        .select('id', { count: 'exact', head: true })
        .eq('is_read', false),
      supabase.from('subscribers').select('id', { count: 'exact', head: true }),
      supabase.from('offers').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(8),
      supabase
        .from('keepalive_log')
        .select('pinged_at')
        .order('pinged_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])

  const recentOrders = (recent.data ?? []) as Order[]
  const ping = lastPing.data as { pinged_at: string } | null

  const cards = [
    { n: products.count ?? 0, l: 'Products', href: '/admin/products' },
    { n: combos.count ?? 0, l: 'Combo pettis', href: '/admin/combos' },
    { n: orders.count ?? 0, l: 'Orders', href: '/admin/orders' },
    { n: messages.count ?? 0, l: 'Unread messages', href: '/admin/messages' },
    { n: subscribers.count ?? 0, l: 'Subscribers', href: '/admin/subscribers' },
    { n: offers.count ?? 0, l: 'Live offers', href: '/admin/offers' },
  ]

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Dashboard</h1>
          <p>
            Everything on the website is managed from here — content, products, offers and section
            visibility. Changes appear on the live site within a minute.
          </p>
        </div>
        <a className="abtn abtn-ghost" href="/" target="_blank" rel="noopener">
          View website ↗
        </a>
      </div>

      <div className="astat-grid">
        {cards.map((c) => (
          <div className="astat" key={c.l}>
            <div className="n">{c.n}</div>
            <div className="l">{c.l}</div>
            <Link href={c.href}>Manage →</Link>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-head">
          <h2>Recent orders</h2>
          <Link className="abtn abtn-ghost abtn-sm" href="/admin/orders">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="admin-empty">
            <h3>No orders yet</h3>
            <p>Checkout orders land here the moment a customer submits the form.</p>
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
                  <th>Status</th>
                  <th>Placed</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="rowtitle">{o.order_number}</td>
                    <td>
                      {o.customer_name}
                      <div className="rowsub">{o.phone}</div>
                    </td>
                    <td>{Array.isArray(o.items) ? o.items.length : 0}</td>
                    <td className="rowtitle">{money(o.total)}</td>
                    <td>
                      <span className={`pill ${o.status === 'new' ? 'pill-new' : 'pill-on'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td>{new Date(o.created_at).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-card">
        <div className="admin-card-head">
          <h2>Database keep-alive</h2>
          <Link className="abtn abtn-ghost abtn-sm" href="/admin/keepalive">
            Details
          </Link>
        </div>
        <div className="admin-card-body">
          <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)' }}>
            {ping
              ? `Last ping: ${new Date(ping.pinged_at).toLocaleString('en-IN')}`
              : 'No ping recorded yet — set up the daily cron so Supabase never pauses this project.'}
          </p>
        </div>
      </div>
    </>
  )
}
