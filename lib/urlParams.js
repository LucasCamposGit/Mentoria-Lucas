const storageKey = 'session_url_params'
const trackedParams = [
  'video',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
]

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
}

function getPersistedUrlParams() {
  if (!isBrowser()) {
    return {}
  }

  try {
    const raw = window.sessionStorage.getItem(storageKey)
    if (!raw) {
      return {}
    }
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch (error) {
    return {}
  }
}

function saveUrlParams(params) {
  if (!isBrowser()) {
    return
  }

  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(params))
  } catch (error) {
    // Ignore storage exceptions
  }
}

function getUrlParamsFromLocation() {
  if (!isBrowser()) {
    return {}
  }

  const query = new URLSearchParams(window.location.search)
  const params = {}

  trackedParams.forEach((key) => {
    const value = query.get(key)
    if (value !== null && value !== '') {
      params[key] = value
    }
  })

  return params
}

export function initializeUrlParams() {
  if (!isBrowser()) {
    return
  }

  const currentParams = getUrlParamsFromLocation()
  const persistedParams = getPersistedUrlParams()

  const mergedParams = {
    ...persistedParams,
    ...currentParams,
  }

  if (Object.keys(mergedParams).length === 0) {
    return
  }

  const hasNewValues = Object.keys(currentParams).some(
    (key) => currentParams[key] !== persistedParams[key],
  )

  if (hasNewValues || Object.keys(persistedParams).length === 0) {
    saveUrlParams(mergedParams)
  }
}

export function getUrlParams() {
  return getPersistedUrlParams()
}

export function getUrlParam(name) {
  const params = getPersistedUrlParams()
  return params[name] ?? null
}
