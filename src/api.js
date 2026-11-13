/** Same-origin JSON client for the Host half's `/skinx/api` routes. */

const BASE = '/skinx/api'

async function request(path, options = {}) {
  const response = await fetch(BASE + path, {
    credentials: 'same-origin',
    cache: 'no-store',
    ...options,
    headers: {
      accept: 'application/json',
      ...(options.body === undefined ? {} : { 'content-type': 'application/json' }),
      ...options.headers,
    },
  })
  let body = null
  try {
    body = await response.json()
  } catch {
    body = null
  }
  if (!response.ok || body?.ok !== true) {
    const message = body?.error?.message || `HTTP ${response.status}`
    throw new Error(message)
  }
  return body
}

export function fetchState() {
  return request('/state')
}

export function saveSkin(payload) {
  return request('/skin', { method: 'PUT', body: JSON.stringify(payload) })
}

export function deleteSkin(id) {
  return request('/delete', { method: 'POST', body: JSON.stringify({ id }) })
}

export function setActiveSkin(id) {
  return request('/active', { method: 'PUT', body: JSON.stringify({ id }) })
}
