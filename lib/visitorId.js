function getCookie(name) {
  if (typeof document === 'undefined') return null

  const cookies = document.cookie.split('; ')
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=')
    if (cookieName === name) {
      return decodeURIComponent(cookieValue || '')
    }
  }

  return null
}

function setCookie(name, value, days) {
  if (typeof document === 'undefined') return

  const expires = new Date()
  expires.setDate(expires.getDate() + days)

  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secure}`
}

function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  const randomHex = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)

  return `${randomHex()}${randomHex()}-${randomHex()}-${randomHex()}-${randomHex()}-${randomHex()}${randomHex()}${randomHex()}`
}

export function getVisitorId() {
  if (typeof document === 'undefined') {
    return null
  }

  const cookieName = 'visitor_id'
  let visitorId = getCookie(cookieName)

  if (!visitorId) {
    visitorId = generateUUID()
    setCookie(cookieName, visitorId, 365)
  }

  return visitorId
}
