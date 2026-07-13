import { auth } from '../firebase.js'

// Thin client for the Cloudflare Worker API. Attaches the Firebase ID token so the
// Worker can verify the user and enforce roles server-side.
const BASE = import.meta.env.VITE_API_BASE || ''

async function authHeaders() {
  const u = auth.currentUser
  if (!u) return {}
  const token = await u.getIdToken()
  return { Authorization: `Bearer ${token}` }
}

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function apiGet(path, { withAuth = false } = {}) {
  const headers = withAuth ? await authHeaders() : {}
  return handle(await fetch(BASE + path, { headers }))
}

export async function apiSend(method, path, body, { withAuth = true } = {}) {
  const headers = { 'Content-Type': 'application/json', ...(withAuth ? await authHeaders() : {}) }
  return handle(await fetch(BASE + path, { method, headers, body: body != null ? JSON.stringify(body) : undefined }))
}

// Upload raw media (image or video) to R2 via the Worker; returns { url }.
export async function apiUpload(file) {
  const headers = { 'Content-Type': file.type || 'application/octet-stream', ...(await authHeaders()) }
  return handle(await fetch(BASE + '/api/admin/images', { method: 'POST', headers, body: file }))
}
export const apiUploadImage = apiUpload // backwards-compatible alias

export const apiBase = BASE
