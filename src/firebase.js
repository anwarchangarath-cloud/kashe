import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Firebase is used for AUTHENTICATION only (and Hosting). Data + images live on
// Cloudflare (D1 + R2), so we deliberately do NOT use Firestore or Firebase Storage.
// The web config is public by design — real security is enforced by Auth settings and
// the Cloudflare Worker (which verifies the Firebase ID token). Values come from env.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Analytics: only in a real browser where it's supported (avoids localhost/dev errors).
export let analytics = null
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  import('firebase/analytics')
    .then(({ getAnalytics, isSupported }) =>
      isSupported().then((ok) => {
        if (ok) analytics = getAnalytics(app)
      }),
    )
    .catch(() => {})
}
