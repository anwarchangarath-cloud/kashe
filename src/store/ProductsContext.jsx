import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { load, save } from './storage.js'
import { catalog as seed, levelFor, filterByCategory } from '../data/catalog.js'

const ProductsContext = createContext(null)

// One shared product store for the whole app. The storefront (catalog, category, product,
// search, cart) AND the admin (products, inventory) read/write this same list — so a
// product added or restocked in admin shows up on the storefront, and stock/out-of-stock
// is honoured everywhere. (In production this is Firestore.)
function initProducts() {
  const existing = load('products', null)
  if (existing) return existing
  // First run: fold in any products created via the earlier admin-only inventory store.
  const legacy = load('admin:inventory', [])
  const seedIds = new Set(seed.map((p) => p.id))
  const extras = legacy
    .filter((p) => !seedIds.has(p.id))
    .map((p) => ({
      wasPrice: null, discountPct: null, badge: 'new', freeDelivery: true,
      rating: 0, ratingsCount: 0, sold: 'New', highlights: [],
      ...p,
      inStock: (p.stock ?? 0) > 0,
      level: levelFor(p.stock ?? 0),
      image: p.image || `https://picsum.photos/seed/${p.id}/600/600`,
    }))
  return [...extras, ...seed]
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(initProducts)

  useEffect(() => save('products', products), [products])

  // Rich create/publish. Accepts the full editor payload; computes discount %, badge,
  // stock level (against the product's own low-at threshold), margin-relevant fields, etc.
  function addProduct(data) {
    const {
      name, description, category, vendor, seller, commission,
      cost, price, wasPrice, sku, stock, lowAt, image, published = true,
    } = data
    const idBase = (sku || name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const id = idBase || `sku-${Date.now()}`
    const s = Number(stock) || 0
    const low = Number(lowAt) || 10
    const sale = Number(price) || 0
    const was = Number(wasPrice) || null
    const discountPct = was && sale && was > sale ? Math.round((1 - sale / was) * 100) : null
    const product = {
      id,
      name: name || 'Untitled product',
      description: description || '',
      category: category || 'General',
      vendor: vendor || 'KASH Essentials',
      seller: seller || null,
      commission: commission != null ? Number(commission) : null,
      cost: Number(cost) || null,
      price: sale,
      wasPrice: was,
      discountPct,
      badge: discountPct ? 'discount' : 'new',
      freeDelivery: true,
      sku: sku || id.toUpperCase(),
      stock: s,
      lowAt: low,
      inStock: s > 0,
      level: levelFor(s, low),
      published,
      rating: 0,
      ratingsCount: 0,
      sold: 'New',
      highlights: description ? description.split('·').map((x) => x.trim()).filter(Boolean) : [],
      image: image || `https://picsum.photos/seed/${id}/600/600`,
    }
    setProducts((prev) => [product, ...prev.filter((p) => p.id !== id)])
    return product
  }

  function restock(id, qty) {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const stock = p.stock + qty
        return { ...p, stock, inStock: stock > 0, level: levelFor(stock, p.lowAt ?? 10) }
      }),
    )
  }

  // Edit an existing product; recompute derived fields when relevant.
  function updateProduct(id, patch) {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const next = { ...p, ...patch }
        const sale = Number(next.price) || 0
        const was = Number(next.wasPrice) || null
        next.discountPct = was && sale && was > sale ? Math.round((1 - sale / was) * 100) : null
        next.badge = next.discountPct ? 'discount' : next.badge === 'new' ? 'new' : 'discount'
        const stock = Number(next.stock) || 0
        next.stock = stock
        next.inStock = stock > 0
        next.level = levelFor(stock, next.lowAt ?? 10)
        return next
      }),
    )
  }

  function removeProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  // Decrement stock when an order is placed (guards against going below zero).
  function sell(items) {
    setProducts((prev) =>
      prev.map((p) => {
        const line = items.find((i) => i.id === p.id)
        if (!line) return p
        const stock = Math.max(0, p.stock - line.qty)
        return { ...p, stock, inStock: stock > 0, level: levelFor(stock, p.lowAt ?? 10) }
      }),
    )
  }

  const value = useMemo(() => {
    const byId = Object.fromEntries(products.map((p) => [p.id, p]))
    // Storefront only sees published products; drafts are admin-only.
    const live = products.filter((p) => p.published !== false)
    return {
      products, // all (admin)
      live,
      getProduct: (id) => byId[id],
      getByCategory: (slug) => filterByCategory(live, slug),
      search: (q) => {
        const term = (q ?? '').trim().toLowerCase()
        if (!term) return []
        return live.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term) ||
            p.vendor.toLowerCase().includes(term),
        )
      },
      addProduct,
      restock,
      updateProduct,
      removeProduct,
      sell,
    }
  }, [products])

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider')
  return ctx
}
