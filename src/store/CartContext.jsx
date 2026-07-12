import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { load, save } from './storage.js'
import { useProducts } from './ProductsContext.jsx'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { getProduct } = useProducts()
  const [items, setItems] = useState(() => load('cart', [])) // [{ id, qty }]

  useEffect(() => save('cart', items), [items])

  function add(id, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id)
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { id, qty }]
    })
  }

  function setQty(id, qty) {
    if (qty <= 0) return remove(id)
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }

  function remove(id) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function clear() {
    setItems([])
  }

  const value = useMemo(() => {
    // Join cart lines with catalog data for rendering + totals.
    const lines = items
      .map((i) => {
        const product = getProduct(i.id)
        if (!product) return null
        return { ...i, product, lineTotal: product.price * i.qty }
      })
      .filter(Boolean)
    const count = items.reduce((n, i) => n + i.qty, 0)
    const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0)
    return { items, lines, count, subtotal, add, setQty, remove, clear }
  }, [items, getProduct])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
