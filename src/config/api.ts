export const API_BASE_URL = 'https://cinnamonspare-cghuahbdcqa5g9ek.westus3-01.azurewebsites.net'

let pendingRequests = 0
const activityListeners = new Set<(count: number) => void>()

function updateActivity(change: number) {
  pendingRequests = Math.max(0, pendingRequests + change)
  activityListeners.forEach((listener) => listener(pendingRequests))
}

export function getPendingRequestCount() {
  return pendingRequests
}

export function subscribeToApiActivity(listener: (count: number) => void) {
  activityListeners.add(listener)
  listener(pendingRequests)
  return () => {
    activityListeners.delete(listener)
  }
}

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export async function apiFetch(path: string, init?: RequestInit) {
  updateActivity(1)
  try {
    return await fetch(apiUrl(path), init)
  } finally {
    updateActivity(-1)
  }
}

export function resolveMediaUrl(path: string | null | undefined) {
  if (!path) return ''
  return path.startsWith('/uploads/') ? apiUrl(path) : path
}
