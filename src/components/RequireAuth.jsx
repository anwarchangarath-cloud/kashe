import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/AuthContext.jsx'

// Redirect to /login (remembering where we came from) when not signed in.
// Waits for Firebase to restore the session before deciding (avoids a flash to /login).
export default function RequireAuth({ children }) {
  const { isAuthed, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}
