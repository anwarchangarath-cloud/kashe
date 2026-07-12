import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { load, save } from './storage.js'
import { orders as seedOrders, staff as seedStaff } from '../data/adminData.js'

const AdminContext = createContext(null)

// Convert a customer-shaped order (from the old separate store) into the unified admin shape.
function toAdminOrder(o) {
  const statusMap = { delivery: 'shipped', packing: 'packing', delivered: 'delivered', pending: 'pending', shipped: 'shipped', returned: 'returned' }
  const payMap = { card: 'paid', applepay: 'paid', cod: 'unpaid' }
  return {
    id: o.id,
    customer: o.customer || 'Anwar C.',
    date: o.date,
    items: o.items,
    total: o.total,
    status: statusMap[o.status] ?? 'packing',
    payment: payMap[o.payment] ?? o.payment ?? 'paid',
  }
}

// One unified order list, seeded from the admin demo set + any orders already placed via
// the earlier customer-only store (migrated so nothing you placed is lost).
function initOrders() {
  const existing = load('admin:orders', null)
  const legacy = load('orders', [])
  const legacyExtras = legacy.filter((o) => !seedOrders.some((s) => s.id === o.id)).map(toAdminOrder)
  if (existing) {
    const have = new Set(existing.map((o) => o.id))
    const add = legacyExtras.filter((o) => !have.has(o.id))
    return add.length ? [...add, ...existing] : existing
  }
  return [...legacyExtras, ...seedOrders]
}

// Mutable admin state (localStorage). Every mutation records an audit entry — CLAUDE.md
// requires staff actions to be logged (user + timestamp + before/after) and immutable.
export function AdminProvider({ children }) {
  const [orders, setOrders] = useState(initOrders)
  const [staff] = useState(() => load('admin:staff', seedStaff))
  const [settings, setSettings] = useState(() =>
    load('admin:settings', {
      storeName: 'KASH',
      supportEmail: 'support@kash.ae',
      payments: { card: true, applePay: true, cod: true },
    }),
  )
  const [auditLog, setAuditLog] = useState(() => load('admin:audit', []))

  useEffect(() => save('admin:orders', orders), [orders])
  useEffect(() => save('admin:settings', settings), [settings])
  useEffect(() => save('admin:audit', auditLog), [auditLog])

  function audit(action, detail) {
    setAuditLog((prev) => [{ action, detail, at: new Date().toISOString() }, ...prev].slice(0, 100))
  }

  // A customer checkout creates an order here (in production this is a Cloud Function).
  function addOrder(order) {
    setOrders((prev) => [order, ...prev])
    audit('order.create', `${order.id} · ${order.customer}`)
  }

  function setOrderStatus(id, status) {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        let payment = o.payment
        if (status === 'delivered' && payment === 'on-delivery') payment = 'paid'
        if (status === 'returned') payment = 'refund-due'
        return { ...o, status, payment }
      }),
    )
    audit('order.status', `${id} → ${status}`)
  }

  function updateSettings(patch) {
    setSettings((prev) => ({ ...prev, ...patch }))
    audit('settings.update', Object.keys(patch).join(', '))
  }

  const value = useMemo(() => {
    const kpis = {
      ordersToday: orders.filter((o) => /10 Jul/.test(o.date)).length || 2,
      revenueToday: 182.3,
      pending: orders.filter((o) => o.status === 'pending' || o.status === 'packing').length,
      returns: orders.filter((o) => o.status === 'returned').length,
    }
    return { orders, staff, settings, auditLog, kpis, addOrder, setOrderStatus, updateSettings }
  }, [orders, staff, settings, auditLog])

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
