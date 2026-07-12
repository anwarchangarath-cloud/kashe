import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/AuthContext.jsx'

// Gate /admin. Not signed in → login; signed in but not staff → back to storefront.
// Waits for Firebase to restore the session first.
export default function RequireAdmin({ children }) {
  const { isAuthed, isAdmin, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
  if (!isAuthed) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}
