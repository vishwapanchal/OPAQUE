export async function analyzeDocument(formData) {
  const BASE = import.meta.env.VITE_API_BASE ?? '/api'
  const res = await fetch(`${BASE}/forensic/analyze`, {
    method: 'POST',
    body: formData
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Analysis failed')
  return json.data ?? json
}
