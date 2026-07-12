import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut,
} from 'firebase/auth'
import { auth } from '../firebase.js'

const AuthContext = createContext(null)

// TEMPORARY role source: emails listed here get admin access. Real roles will move to
// Firebase custom claims / the Cloudflare Worker once the backend is wired.
const ADMIN_EMAILS = ['admin@kash.ae', 'owner@kash.ae']
const ADMIN_ROLES = ['ops', 'manager', 'owner']

function mapUser(fbUser) {
  if (!fbUser) return null
  const email = fbUser.email ?? ''
  const displayName = fbUser.displayName || email.split('@')[0] || 'there'
  return {
    uid: fbUser.uid,
    email,
    name: displayName.split(' ')[0],
    fullName: displayName,
    phone: fbUser.phoneNumber || email,
    role: ADMIN_EMAILS.includes(email.toLowerCase()) ? 'owner' : 'customer',
  }
}

function friendlyError(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'auth.wrongCreds'
    case 'auth/email-already-in-use':
      return 'auth.emailInUse'
    case 'auth/weak-password':
      return 'auth.weakPassword'
    case 'auth/invalid-email':
      return 'auth.invalidEmail'
    case 'auth/operation-not-allowed':
      return 'auth.notEnabled'
    case 'auth/network-request-failed':
      return 'auth.network'
    case 'auth/too-many-requests':
      return 'auth.tooMany'
    default:
      return 'auth.generic'
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // auth state resolving on load

  useEffect(() => {
    return onAuthStateChanged(auth, (fbUser) => {
      setUser(mapUser(fbUser))
      setLoading(false)
    })
  }, [])

  async function signInWithEmail(email, password) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password)
      return { ok: true, account: mapUser(cred.user) }
    } catch (e) {
      return { ok: false, errorKey: friendlyError(e.code) }
    }
  }

  async function signUp({ name, email, password }) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
      if (name?.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() })
        // onAuthStateChanged already fired without the name — refresh the mapped user.
        setUser(mapUser(auth.currentUser))
      }
      return { ok: true, account: mapUser(auth.currentUser) }
    } catch (e) {
      return { ok: false, errorKey: friendlyError(e.code) }
    }
  }

  function signOut() {
    return fbSignOut(auth)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthed: !!user,
      isAdmin: !!user && ADMIN_ROLES.includes(user.role),
      signInWithEmail,
      signUp,
      signOut,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
