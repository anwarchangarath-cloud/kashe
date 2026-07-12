import { catalog } from './catalog.js'

// Mock operational data for the admin panel. In production these come from Firestore
// (orders created only by Cloud Function; every staff action writes to auditLog).

// Fulfilment status: pending | packing | shipped | delivered | returned
// Payment state (COD-aware): paid | unpaid | on-delivery | refund-due
export const orders = [
  { id: 'SQ-10493', customer: 'Anwar C.', date: '10 Jul 2026', items: 3, total: 54.3, status: 'shipped', payment: 'on-delivery' },
  { id: 'SQ-10482', customer: 'Layla M.', date: '9 Jul 2026', items: 3, total: 128.0, status: 'packing', payment: 'paid' },
  { id: 'SQ-10477', customer: 'Omar H.', date: '9 Jul 2026', items: 1, total: 19.9, status: 'pending', payment: 'unpaid' },
  { id: 'SQ-10461', customer: 'Sara K.', date: '2 Jul 2026', items: 1, total: 37.9, status: 'delivered', payment: 'paid' },
  { id: 'SQ-10455', customer: 'Yousef A.', date: '1 Jul 2026', items: 2, total: 71.0, status: 'returned', payment: 'refund-due' },
  { id: 'SQ-10440', customer: 'Mariam T.', date: '25 Jun 2026', items: 5, total: 212.0, status: 'delivered', payment: 'paid' },
  { id: 'SQ-10432', customer: 'Hassan R.', date: '24 Jun 2026', items: 2, total: 44.5, status: 'delivered', payment: 'paid' },
  { id: 'SQ-10421', customer: 'Noura S.', date: '22 Jun 2026', items: 4, total: 96.4, status: 'shipped', payment: 'on-delivery' },
]

// Deterministic pseudo stock per product so Inventory has realistic low/out flags.
const STOCKS = [3, 0, 42, 120, 8, 210, 15, 60, 5, 88, 34, 150]
export const inventory = catalog.map((p, i) => {
  const stock = STOCKS[i % STOCKS.length]
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    vendor: p.vendor,
    price: p.price,
    stock,
    level: stock === 0 ? 'out' : stock <= 10 ? 'low' : 'ok',
  }
})

export const products = inventory // same source; products list reuses it

export const staff = [
  { name: 'Store owner', email: 'admin@kash.ae', role: 'owner' },
  { name: 'Fatima N.', email: 'fatima@kash.ae', role: 'manager' },
  { name: 'Bilal K.', email: 'bilal@kash.ae', role: 'ops' },
]

// KPI helpers
export const kpis = {
  ordersToday: orders.filter((o) => o.date.startsWith('10 Jul')).length || 2,
  revenueToday: 182.3,
  pending: orders.filter((o) => o.status === 'pending' || o.status === 'packing').length,
  returns: orders.filter((o) => o.status === 'returned').length,
  lowStock: inventory.filter((p) => p.level !== 'ok').length,
}
