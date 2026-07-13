import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { filterByCategory } from '../data/catalog.js'
import { apiGet, apiSend } from '../lib/api.js'
import { useAuth } from './AuthContext.jsx'

const ProductsContext = createContext(null)

// Products now come from the Cloudflare Worker + D1 (the one shared source of truth).
// Storefront reads published products; admins fetch all (incl. drafts). All writes go
// through the Worker, which enforces the admin role from the Firebase token.
export function ProductsProvider({ children }) {
  const { isAdmin, loading: authLoading } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    try {
      const list = isAdmin
        ? await apiGet('/api/admin/products', { withAuth: true })
        : await apiGet('/api/products')
      setProducts(Array.isArray(list) ? list : [])
    } catch (e) {
      console.error('products load failed', e)
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    if (!authLoading) reload()
  }, [authLoading, reload])

  async function addProduct(data) {
    const p = await apiSend('POST', '/api/admin/products', data)
    await reload()
    return p
  }
  async function updateProduct(id, patch) {
    await apiSend('PUT', `/api/admin/products/${id}`, patch)
    await reload()
  }
  async function removeProduct(id) {
    await apiSend('DELETE', `/api/admin/products/${id}`)
    await reload()
  }
  async function restock(id, qty) {
    await apiSend('POST', `/api/admin/products/${id}/restock`, { qty })
    await reload()
  }

  const value = useMemo(() => {
    const byId = Object.fromEntries(products.map((p) => [p.id, p]))
    const live = products.filter((p) => p.published !== false)
    return {
      products,
      live,
      loading,
      getProduct: (id) => byId[id],
      getByCategory: (slug) => filterByCategory(live, slug),
      search: (q) => {
        const term = (q ?? '').trim().toLowerCase()
        if (!term) return []
        return live.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            (p.category || '').toLowerCase().includes(term) ||
            (p.vendor || '').toLowerCase().includes(term),
        )
      },
      addProduct,
      updateProduct,
      removeProduct,
      restock,
      reload,
    }
  }, [products, loading, reload])

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider')
  return ctx
}
