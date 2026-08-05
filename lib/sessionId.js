function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  const randomHex = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)

  return `${randomHex()}${randomHex()}-${randomHex()}-${randomHex()}-${randomHex()}-${randomHex()}${randomHex()}${randomHex()}`
}

export function getSessionId() {
  if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') {
    return null
  }

  const storageKey = 'session_id'

  try {
    let sessionId = window.sessionStorage.getItem(storageKey)

    if (!sessionId) {
      sessionId = generateUUID()
      window.sessionStorage.setItem(storageKey, sessionId)
    }

    return sessionId
  } catch (error) {
    return null
  }
}
