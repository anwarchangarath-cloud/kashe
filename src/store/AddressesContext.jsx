import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { load, save } from './storage.js'
import { seedAddresses } from '../data/account.js'

const AddressesContext = createContext(null)

// Saved delivery addresses, shared by the account page AND checkout (localStorage).
export function AddressesProvider({ children }) {
  const [addresses, setAddresses] = useState(() => load('addresses', seedAddresses))

  useEffect(() => save('addresses', addresses), [addresses])

  function addAddress(a) {
    setAddresses((prev) => [...prev, { ...a, id: `a${Date.now()}`, isDefault: prev.length === 0 }])
  }
  function removeAddress(id) {
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id)
      if (next.length && !next.some((a) => a.isDefault)) next[0].isDefault = true
      return [...next]
    })
  }
  function setDefault(id) {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))
  }

  const value = useMemo(
    () => ({ addresses, addAddress, removeAddress, setDefault, defaultAddress: addresses.find((a) => a.isDefault) ?? addresses[0] }),
    [addresses],
  )
  return <AddressesContext.Provider value={value}>{children}</AddressesContext.Provider>
}

export function useAddresses() {
  const ctx = useContext(AddressesContext)
  if (!ctx) throw new Error('useAddresses must be used within AddressesProvider')
  return ctx
}
