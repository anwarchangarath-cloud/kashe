import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { load, save } from './storage.js'
import { staff as seedStaff } from '../data/adminData.js'

const AdminContext = createContext(null)

// Store settings + staff. (Orders and products now come from the Worker/D1; audit is
// recorded server-side.) Settings/staff stay local until they get their own API.
export function AdminProvider({ children }) {
  const [staff] = useState(() => load('admin:staff', seedStaff))
  const [settings, setSettings] = useState(() =>
    load('admin:settings', {
      storeName: 'KASH',
      supportEmail: 'support@kash.ae',
      payments: { card: true, applePay: true, cod: true },
    }),
  )

  useEffect(() => save('admin:settings', settings), [settings])

  function updateSettings(patch) {
    setSettings((prev) => ({ ...prev, ...patch }))
  }

  const value = useMemo(() => ({ staff, settings, updateSettings }), [staff, settings])
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
