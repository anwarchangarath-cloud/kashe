import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import ProductCard from '../product/ProductCard.jsx'
import { useProducts } from '../../store/ProductsContext.jsx'

// "Deals of the day" — section heading + a 5-up ProductCard grid.
export default function DealsOfTheDay() {
  const { t } = useTranslation()
  const { live } = useProducts()
  const dealsOfTheDay = live.slice(0, 5)
  return (
    <section className="py-4">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 className="font-serif text-2xl font-medium text-ink">{t('deals.title')}</h2>
          <span className="text-sm text-ink-muted">{t('deals.subtitle')}</span>
        </div>
        <Link
          to="/deals"
          className="inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-brand hover:underline"
        >
          {t('deals.seeAll')}
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {dealsOfTheDay.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
