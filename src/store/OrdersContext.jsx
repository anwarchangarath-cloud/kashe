import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiGet, apiSend } from '../lib/api.js'
import { useAuth } from './AuthContext.jsx'

const OrdersContext = createContext(null)

// Orders live in D1 via the Worker. The customer sees their own (GET /api/orders);
// admins see all (GET /api/admin/orders). Order creation is server-authoritative:
// the Worker recomputes totals from DB prices and decrements stock in a transaction.
export function OrdersProvider({ children }) {
  const { isAuthed, isAdmin, loading: authLoading } = useAuth()
  const [myOrders, setMyOrders] = useState([])
  const [allOrders, setAllOrders] = useState([])

  const reloadMine = useCallback(async () => {
    if (!isAuthed) return setMyOrders([])
    try {
      setMyOrders(await apiGet('/api/orders', { withAuth: true }))
    } catch (e) {
      console.error('my orders load failed', e)
    }
  }, [isAuthed])

  const reloadAll = useCallback(async () => {
    if (!isAdmin) return
    try {
      setAllOrders(await apiGet('/api/admin/orders', { withAuth: true }))
    } catch (e) {
      console.error('all orders load failed', e)
    }
  }, [isAdmin])

  useEffect(() => {
    if (authLoading) return
    reloadMine()
    reloadAll()
  }, [authLoading, reloadMine, reloadAll])

  // payload: { items:[{id,qty}], coupon, payment, address, customer }
  async function placeOrder(payload) {
    const order = await apiSend('POST', '/api/orders', payload)
    await reloadMine()
    if (isAdmin) reloadAll()
    return order
  }

  async function setOrderStatus(id, status) {
    await apiSend('PATCH', `/api/admin/orders/${id}`, { status })
    await reloadAll()
  }

  const value = useMemo(
    () => ({ myOrders, allOrders, placeOrder, setOrderStatus, reloadMine, reloadAll }),
    [myOrders, allOrders],
  )
  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}
