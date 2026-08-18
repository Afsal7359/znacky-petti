import { NextResponse, type NextRequest } from 'next/server'
import { createClient as createSupabase } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Daily keep-alive.
 *
 * Hitting this route:
 *   1. wakes the website itself (the request renders a server route), and
 *   2. writes + reads a row in Supabase so the free-tier project never
 *      goes idle and gets paused.
 *
 * Protect it by setting CRON_SECRET; then call it with
 *   Authorization: Bearer <CRON_SECRET>   (or ?secret=<CRON_SECRET>)
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const header = request.headers.get('authorization')
    const query = request.nextUrl.searchParams.get('secret')
    const ok = header === `Bearer ${secret}` || query === secret
    if (!ok) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return NextResponse.json(
      { ok: false, error: 'Supabase environment variables are not set' },
      { status: 500 }
    )
  }

  const startedAt = Date.now()

  try {
    const supabase = createSupabase(url, key, { auth: { persistSession: false } })

    // write — this is what actually counts as database activity
    const { error: insertError } = await supabase
      .from('keepalive_log')
      .insert({ source: 'api' })
    if (insertError) throw insertError

    // read — proves the project is serving queries
    const [{ count: products }, { data: latest }] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase
        .from('keepalive_log')
        .select('pinged_at')
        .order('pinged_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])

    return NextResponse.json({
      ok: true,
      website: 'awake',
      database: 'awake',
      products: products ?? 0,
      last_ping: latest?.pinged_at ?? null,
      took_ms: Date.now() - startedAt,
      at: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : 'Keep-alive failed',
        took_ms: Date.now() - startedAt,
      },
      { status: 500 }
    )
  }
}

export const POST = GET
