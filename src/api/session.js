import { apiFetch } from './client'

export async function initSession(payload) {
  return await apiFetch('/session/init', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function getDashboardSummary() {
  return await apiFetch('/dashboard/summary')
}

export async function syncSession(sessionId, payload) {
  return await apiFetch(`/session/${encodeURIComponent(sessionId)}/sync`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function checkSessionStatus(sessionId) {
  return await apiFetch(`/session/${encodeURIComponent(sessionId)}/status`)
}