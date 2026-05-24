import { apiFetch } from './client'

export async function deliverDocument(formData) {
  // We use standard fetch here because apiFetch sets Content-Type to application/json by default,
  // but FormData requires the browser to set the Content-Type automatically (with the boundary).
  const BASE = import.meta.env.VITE_API_BASE ?? '/api'
  const res = await fetch(`${BASE}/documents/deliver`, {
    method: 'POST',
    body: formData
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Upload failed')
  return json.data ?? json
}

export async function fetchInbox(sessionId) {
  return await apiFetch(`/documents/inbox?session_id=${encodeURIComponent(sessionId)}`)
}

export async function downloadDocument(documentId) {
  const BASE = import.meta.env.VITE_API_BASE ?? '/api'
  const res = await fetch(`${BASE}/documents/${encodeURIComponent(documentId)}/download`)
  if (!res.ok) throw new Error('Failed to download document')
  return await res.blob()
}

export async function deleteDocument(documentId) {
  return await apiFetch(`/documents/${encodeURIComponent(documentId)}`, {
    method: 'DELETE'
  })
}
