// Verify a Firebase ID token inside a Cloudflare Worker — no Admin SDK / service account.
// We fetch Google's public JWKs (JWK format, so WebCrypto can import them directly),
// verify the RS256 signature, and check the standard claims (aud = your projectId).

const JWK_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'

let jwkCache = { keys: null, exp: 0 }

function b64urlToBytes(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  const bin = atob(s)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}
function b64urlToJson(s) {
  return JSON.parse(new TextDecoder().decode(b64urlToBytes(s)))
}

async function getKeys() {
  const now = Date.now()
  if (jwkCache.keys && now < jwkCache.exp) return jwkCache.keys
  const res = await fetch(JWK_URL)
  const data = await res.json()
  const maxAge = /max-age=(\d+)/.exec(res.headers.get('cache-control') || '')
  jwkCache = { keys: data.keys, exp: now + (maxAge ? +maxAge[1] * 1000 : 3600_000) }
  return data.keys
}

// Returns the decoded payload ({ sub, email, name, ... }) or throws.
export async function verifyIdToken(token, projectId) {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('malformed token')
  const header = b64urlToJson(parts[0])
  const payload = b64urlToJson(parts[1])

  if (header.alg !== 'RS256') throw new Error('bad alg')
  const keys = await getKeys()
  const jwk = keys.find((k) => k.kid === header.kid)
  if (!jwk) throw new Error('unknown key')

  const key = await crypto.subtle.importKey(
    'jwk',
    { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  )
  const signed = new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToBytes(parts[2]), signed)
  if (!ok) throw new Error('bad signature')

  const now = Math.floor(Date.now() / 1000)
  if (payload.aud !== projectId) throw new Error('bad audience')
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) throw new Error('bad issuer')
  if (payload.exp < now) throw new Error('expired')
  if (!payload.sub) throw new Error('no subject')

  return payload
}
