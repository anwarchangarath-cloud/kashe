import { createContext, useContext, useMemo } from 'react'
import { useAdmin } from './AdminContext.jsx'

const OrdersContext = createContext(null)

// Orders now live in a single unified store (AdminContext). This wrapper keeps the
// customer-facing useOrders() API stable while both the storefront and admin read/write
// the same list — so a checkout shows up in "My orders" AND the admin Orders table, and
// an admin status change reflects back to the customer.
export function OrdersProvider({ children }) {
  const { orders, addOrder } = useAdmin()
  const value = useMemo(() => ({ orders, addOrder }), [orders, addOrder])
  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}
