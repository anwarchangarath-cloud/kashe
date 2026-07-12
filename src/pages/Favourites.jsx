import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import ProductCard from '../components/product/ProductCard.jsx'
import { useProducts } from '../store/ProductsContext.jsx'
import { useWishlist } from '../store/WishlistContext.jsx'

export default function Favourites() {
  const { t } = useTranslation()
  const { getProduct } = useProducts()
  const { ids } = useWishlist()
  const products = ids.map(getProduct).filter(Boolean)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 font-serif text-3xl font-medium text-ink">{t('favourites.title')}</h1>

      {products.length === 0 ? (
        <div className="py-20 text-center">
          <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-surface text-ink-muted">
            <Heart size={28} />
          </span>
          <p className="font-serif text-2xl font-medium text-ink">{t('favourites.emptyTitle')}</p>
          <p className="mt-2 text-sm text-ink-muted">{t('favourites.emptySub')}</p>
          <Link to="/" className="mt-6 inline-block">
            <Button variant="primary" size="lg">{t('cart.continueShopping')}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
