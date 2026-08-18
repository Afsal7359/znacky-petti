import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Cookie-free client for public, read-only site content.
 *
 * The auth-aware server client reads cookies, which forces every page that uses it to
 * be dynamically rendered on each request. Public content needs no session, so this
 * client lets the home page and product pages stay statically cached (ISR).
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
