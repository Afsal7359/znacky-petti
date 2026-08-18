#!/usr/bin/env node
/**
 * Znacky Petti — daily keep-alive script.
 *
 * Pings the live website AND the Supabase database so neither goes idle.
 * Run it from cron, GitHub Actions, or by hand:
 *
 *   node scripts/keepalive.mjs
 *   npm run keepalive
 *
 * Environment variables (a .env.local in the project root is read automatically):
 *   SITE_URL                      https://znackypetti.com
 *   NEXT_PUBLIC_SUPABASE_URL      https://xxxx.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY eyJhbGci...
 *   CRON_SECRET                   optional, matches the API route guard
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// tiny .env.local loader so the script works without extra dependencies
for (const file of ['.env.local', '.env']) {
  const path = resolve(root, file)
  if (!existsSync(path)) continue
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!match) continue
    const [, key, rawValue] = match
    if (process.env[key]) continue
    process.env[key] = rawValue.replace(/^["']|["']$/g, '')
  }
}

const SITE_URL = (process.env.SITE_URL || '').replace(/\/$/, '')
const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const CRON_SECRET = process.env.CRON_SECRET || ''

const stamp = () => new Date().toISOString()
const results = []

async function pingWebsite() {
  if (!SITE_URL) {
    results.push(['website', 'skipped', 'SITE_URL not set'])
    return
  }
  // the keep-alive API route wakes the site and the database in one call
  const url = `${SITE_URL}/api/keepalive${CRON_SECRET ? `?secret=${encodeURIComponent(CRON_SECRET)}` : ''}`
  try {
    const res = await fetch(url, {
      headers: CRON_SECRET ? { Authorization: `Bearer ${CRON_SECRET}` } : {},
    })
    const body = await res.text()
    results.push(['website', res.ok ? 'awake' : `HTTP ${res.status}`, body.slice(0, 200)])
    return res.ok
  } catch (err) {
    results.push(['website', 'failed', err.message])
    return false
  }
}

async function pingDatabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    results.push(['database', 'skipped', 'Supabase env vars not set'])
    return
  }
  try {
    // calls the SQL function created in supabase/01_schema.sql
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/keepalive`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ src: 'script' }),
    })
    const body = await res.text()
    results.push(['database', res.ok ? 'awake' : `HTTP ${res.status}`, body.slice(0, 200)])
    return res.ok
  } catch (err) {
    results.push(['database', 'failed', err.message])
    return false
  }
}

console.log(`[${stamp()}] Znacky Petti keep-alive starting…`)

const [site, db] = await Promise.all([pingWebsite(), pingDatabase()])

for (const [target, status, detail] of results) {
  console.log(`  ${target.padEnd(9)} ${String(status).padEnd(10)} ${detail ?? ''}`)
}

// the run counts as healthy if at least one target was reached
const healthy = site !== false && db !== false
console.log(`[${stamp()}] keep-alive ${healthy ? 'OK' : 'FAILED'}`)
process.exit(healthy ? 0 : 1)
