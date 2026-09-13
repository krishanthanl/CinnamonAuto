export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'https://cinnamonspare-cghuahbdcqa5g9ek.westus3-01.azurewebsites.net'
).replace(/\/$/, '')

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function apiFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), init)
}

export function resolveMediaUrl(path: string | null | undefined) {
  if (!path) return ''
  return path.startsWith('/uploads/') ? apiUrl(path) : path
}
