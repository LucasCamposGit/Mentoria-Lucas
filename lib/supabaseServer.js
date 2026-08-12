import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseKey = supabaseServiceRoleKey || supabaseAnonKey

let supabaseServer = null

if (!supabaseUrl || !supabaseKey) {
  if (!supabaseUrl) {
    console.error('Supabase server client not created: SUPABASE_URL is missing.')
  }
  if (!supabaseKey) {
    console.error('Supabase server client not created: SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.')
  }
}

if (supabaseUrl && supabaseKey) {
  // Only create the server-side Supabase client here.
  // Do not expose the service role key to any client-side bundle.
  // detect role encoded in JWT (service_role vs anon) for diagnostics
  let detectedRole = null
  try {
    if (supabaseKey && supabaseKey.split && supabaseKey.split('.').length === 3) {
      const payload = JSON.parse(Buffer.from(supabaseKey.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'))
      detectedRole = payload.role || payload?.role || null
    }
  } catch (e) {
    console.warn('Supabase key decode failed for diagnostics:', e?.message || e)
  }

  if (detectedRole && detectedRole !== 'service_role') {
    console.warn('Supabase key detected with role:', detectedRole, '- server inserts may be denied. Ensure SUPABASE_SERVICE_ROLE_KEY is set to the service_role key.')
  }

  supabaseServer = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
}

export { supabaseServer }
