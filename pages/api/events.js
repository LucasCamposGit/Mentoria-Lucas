import { supabaseServer } from '../../lib/supabaseServer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.info('/api/events request received', {
    method: req.method,
    host: req.headers.host,
    origin: req.headers.origin,
    referer: req.headers.referer,
    userAgent: req.headers['user-agent'],
    body: req.body,
  })

  const {
    event,
    metadata,
    visitor_id,
    session_id,
    page,
    video,
    utm_source,
    utm_medium,
    utm_campaign,
  } = req.body || {}

  if (!event || typeof event !== 'string') {
    console.warn('Invalid event name in /api/events request:', {
      method: req.method,
      body: req.body,
      headers: req.headers,
    })
    return res.status(400).json({ error: 'Invalid event name' })
  }

  if (metadata !== undefined && (typeof metadata !== 'object' || Array.isArray(metadata))) {
    console.warn('Invalid metadata format in /api/events request:', {
      method: req.method,
      body: req.body,
      headers: req.headers,
    })
    return res.status(400).json({ error: 'Invalid metadata format, expected object' })
  }

  if (!supabaseServer) {
    console.error('Supabase client is not configured. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY.', {
      hasSupabaseUrl: Boolean(process.env.SUPABASE_URL),
      hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      hasAnonKey: Boolean(process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      requestBody: req.body,
      requestHeaders: {
        host: req.headers.host,
        'user-agent': req.headers['user-agent'],
      },
    })
    return res.status(500).json({
      error: 'Supabase client is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.',
    })
  }

  try {
    const { data, error } = await supabaseServer.from('events').insert([
      {
        event,
        metadata: metadata || {},
        visitor_id: visitor_id || null,
        session_id: session_id || null,
        page: page || null,
        video: video || null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
      },
    ])

    if (error) {
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      let detectedRole = null
      const token = serviceRoleKey || anonKey
      try {
        if (token && token.split && token.split('.').length === 3) {
          const payload = JSON.parse(Buffer.from(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'))
          detectedRole = payload.role || payload?.role
        }
      } catch (e) {
        console.warn('Supabase key decode failed while diagnosing insert error:', e?.message || e)
      }

      console.error('Supabase insert error:', {
        error,
        event,
        visitor_id,
        session_id,
        page,
        video,
        utm_source,
        utm_medium,
        utm_campaign,
        requestBody: req.body,
        environment: {
          hasSupabaseUrl: Boolean(process.env.SUPABASE_URL),
          hasServiceRoleKey: Boolean(serviceRoleKey),
          hasAnonKey: Boolean(anonKey),
          detectedRole,
        },
      })

      const extra = (detectedRole && detectedRole !== 'service_role')
        ? 'Configured SUPABASE_SERVICE_ROLE_KEY appears to be an anon key (not service_role). Use the service role key for server inserts.'
        : undefined

      return res.status(500).json({ error: 'Failed to record event', details: error, note: extra })
    }

    return res.status(200).json({ status: 'ok', data })
  } catch (err) {
    console.error('Unexpected error while inserting event into Supabase:', {
      error: err,
      requestBody: req.body,
      requestHeaders: {
        host: req.headers.host,
        'user-agent': req.headers['user-agent'],
      },
    })
    return res.status(500).json({ error: 'Unexpected server error', details: err?.message || err })
  }
}
