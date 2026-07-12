import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SearchX } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import ProductCard from '../components/product/ProductCard.jsx'
import { useProducts } from '../store/ProductsContext.jsx'

export default function Search() {
  const { t } = useTranslation()
  const { search } = useProducts()
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const results = search(q)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-serif text-3xl font-medium text-ink">
        {t('search.title')}
      </h1>
      {q && (
        <p className="mt-1 text-sm text-ink-muted">
          {t('search.resultsFor', { count: results.length, query: q })}
        </p>
      )}

      {results.length === 0 ? (
        <div className="py-20 text-center">
          <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-surface text-ink-muted">
            <SearchX size={28} />
          </span>
          <p className="font-serif text-2xl font-medium text-ink">{t('search.noResults')}</p>
          <p className="mt-2 text-sm text-ink-muted">{t('search.noResultsSub')}</p>
          <Link to="/" className="mt-6 inline-block">
            <Button variant="secondary">{t('cart.continueShopping')}</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
