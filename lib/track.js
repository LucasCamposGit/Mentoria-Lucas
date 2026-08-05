import { getSessionId } from './sessionId'
import { getVisitorId } from './visitorId'
import { getUrlParams } from './urlParams'

function isBrowser() {
  return typeof window !== 'undefined'
}

function createPayload(event, metadata) {
  const persistedParams = getUrlParams()

  return {
    event,
    metadata: metadata || {},
    visitor_id: getVisitorId(),
    session_id: getSessionId(),
    page: typeof window !== 'undefined' ? window.location.pathname : null,
    video: persistedParams.video || null,
    utm_source: persistedParams.utm_source || null,
    utm_medium: persistedParams.utm_medium || null,
    utm_campaign: persistedParams.utm_campaign || null,
  }
}

export async function track(event, metadata) {
  if (!isBrowser() || !event) {
    return
  }

  const payload = createPayload(event, metadata)
  const endpoint = '/api/events'

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const body = new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      })
      navigator.sendBeacon(endpoint, body)
      return
    }

    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      keepalive: true,
      body: JSON.stringify(payload),
    })
  } catch (error) {
    console.error('Track event failed:', error)
  }
}
