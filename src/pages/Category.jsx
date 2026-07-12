import { useMemo, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import Card from '../components/ui/Card.jsx'
import RatingStars from '../components/ui/RatingStars.jsx'
import ProductCard from '../components/product/ProductCard.jsx'
import { categoryTitle, SORTS } from '../data/catalog.js'
import { useProducts } from '../store/ProductsContext.jsx'

const TOTAL = 1284
const PAGES = 161
const VENDORS = ['KASH Essentials', 'Vendor A', 'Vendor B']

function FilterGroup({ title, children }) {
  return (
    <div className="border-t border-border py-4 first:border-t-0 first:pt-0">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-muted">{title}</h3>
      {children}
    </div>
  )
}

export default function Category() {
  const { slug } = useParams()
  const location = useLocation()
  const { t } = useTranslation()
  const { getByCategory } = useProducts()
  const [sort, setSort] = useState('relevance')

  // Filter state
  const [priceMax, setPriceMax] = useState(200)
  const [minRating, setMinRating] = useState(0)
  const [discountMin, setDiscountMin] = useState(0)
  const [vendors, setVendors] = useState(() => new Set())
  const [freeOnly, setFreeOnly] = useState(false)

  const isDeals = location.pathname === '/deals'
  const title = isDeals ? categoryTitle('deals') : categoryTitle(slug)

  const products = useMemo(() => {
    return getByCategory(slug)
      .filter((p) => p.price <= priceMax)
      .filter((p) => minRating === 0 || (p.rating ?? 0) >= minRating)
      .filter((p) => (p.discountPct ?? 0) >= discountMin)
      .filter((p) => vendors.size === 0 || vendors.has(p.vendor))
      .filter((p) => !freeOnly || p.freeDelivery)
      .sort(SORTS[sort])
  }, [getByCategory, slug, sort, priceMax, minRating, discountMin, vendors, freeOnly])

  function toggleVendor(v) {
    setVendors((prev) => {
      const next = new Set(prev)
      next.has(v) ? next.delete(v) : next.add(v)
      return next
    })
  }

  const anyFilter = priceMax < 200 || minRating > 0 || discountMin > 0 || vendors.size > 0 || freeOnly
  function clearAll() {
    setPriceMax(200); setMinRating(0); setDiscountMin(0); setVendors(new Set()); setFreeOnly(false)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumb items={[{ label: t('category.home'), to: '/' }, { label: title }]} />

      <div className="mt-3 mb-6 flex flex-wrap items-baseline gap-3">
        <h1 className="font-serif text-3xl font-medium text-ink">{title}</h1>
        <span className="text-sm text-ink-muted">{t('category.productsCount', { count: TOTAL.toLocaleString('en') })}</span>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Filters */}
        <aside className="lg:w-64 lg:shrink-0">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-medium text-ink">{t('category.filters')}</h2>
              {anyFilter && (
                <button onClick={clearAll} className="text-xs font-semibold text-brand hover:underline">
                  {t('category.clear')}
                </button>
              )}
            </div>

            <FilterGroup title={t('category.price')}>
              <input type="range" min="0" max="200" value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="w-full accent-brand" aria-label={t('category.price')} />
              <p className="mt-1 text-sm text-ink-muted">AED 0 – {priceMax}</p>
            </FilterGroup>

            <FilterGroup title={t('category.rating')}>
              {[4, 3].map((r) => (
                <label key={r} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
                  <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} className="h-4 w-4 accent-brand" />
                  <RatingStars value={r} size={15} />
                  <span className="text-ink-muted">{t('category.andUp')}</span>
                </label>
              ))}
            </FilterGroup>

            <FilterGroup title={t('category.delivery')}>
              <label className="flex cursor-pointer items-center gap-2 py-1 text-sm">
                <input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} className="h-4 w-4 accent-brand" />
                <span className="font-medium text-success">{t('category.freeDelivery')}</span>
              </label>
            </FilterGroup>

            <FilterGroup title={t('category.discount')}>
              <label className="flex cursor-pointer items-center gap-2 py-1 text-sm">
                <input type="radio" name="discount" checked={discountMin === 50} onChange={() => setDiscountMin(50)} className="h-4 w-4 accent-brand" />
                <span className="text-ink">{t('category.discount50')}</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 py-1 text-sm">
                <input type="radio" name="discount" checked={discountMin === 70} onChange={() => setDiscountMin(70)} className="h-4 w-4 accent-brand" />
                <span className="text-ink">{t('category.discount70')}</span>
              </label>
            </FilterGroup>

            <FilterGroup title={t('category.vendor')}>
              {VENDORS.map((v) => (
                <label key={v} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
                  <input type="checkbox" checked={vendors.has(v)} onChange={() => toggleVendor(v)} className="h-4 w-4 accent-brand" />
                  <span className="text-ink">{v}</span>
                </label>
              ))}
            </FilterGroup>
          </Card>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-muted">
              {t('category.showing', { from: products.length ? 1 : 0, to: products.length, total: TOTAL.toLocaleString('en') })}
            </p>
            <label className="flex items-center gap-2 rounded border border-border bg-canvas px-3 py-2 text-sm">
              <span className="text-ink-muted">{t('category.sort')}:</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent font-medium text-ink focus:outline-none">
                <option value="relevance">{t('category.sortBestSellers')}</option>
                <option value="priceLow">{t('category.sortPriceLow')}</option>
                <option value="priceHigh">{t('category.sortPriceHigh')}</option>
                <option value="discount">{t('category.sortDiscount')}</option>
                <option value="rating">{t('category.sortRating')}</option>
              </select>
            </label>
          </div>

          {products.length === 0 ? (
            <div className="rounded-lg border border-border bg-canvas py-20 text-center">
              <p className="font-serif text-xl font-medium text-ink">{t('category.noMatch')}</p>
              <button onClick={clearAll} className="mt-3 text-sm font-semibold text-brand hover:underline">{t('category.clear')}</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <nav className="mt-8 flex items-center justify-center gap-2 text-sm" aria-label="Pagination">
            {[1, 2, 3].map((p) => (
              <button key={p} className={p === 1 ? 'grid h-9 w-9 place-items-center rounded bg-brand font-bold text-white' : 'grid h-9 w-9 place-items-center rounded font-medium text-brand hover:bg-brand-tint'}>
                {p}
              </button>
            ))}
            <span className="px-1 text-ink-muted">…</span>
            <button className="grid h-9 min-w-9 place-items-center rounded px-2 font-medium text-brand hover:bg-brand-tint">{PAGES}</button>
            <button className="grid h-9 w-9 place-items-center rounded text-brand hover:bg-brand-tint" aria-label="Next page">
              <ArrowRight size={16} className="rtl:rotate-180" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}
