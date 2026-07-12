import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/cn.js'
import Card from '../ui/Card.jsx'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import ProductImage from './ProductImage.jsx'
import { formatAed } from '../../lib/format.js'
import { useCart } from '../../store/CartContext.jsx'
import { useWishlist } from '../../store/WishlistContext.jsx'
import { useToast } from '../../store/ToastContext.jsx'

/*
 * ProductCard — fixed anatomy from CLAUDE.md. Appears on 3 screens; do not rearrange.
 *
 *   [-75%]      image  ♡   discount badge top-start (--price) · wishlist top-end
 *   Product name           2 lines max, --ink
 *   AED 7.92  31.99        --price, strikethrough --ink-muted
 *   Free delivery · Stock  --success
 *   [   Add to cart   ]    full width, --action (the one orange element per card)
 */
export default function ProductCard({ product }) {
  const { t } = useTranslation()
  const { add } = useCart()
  const wishlist = useWishlist()
  const toast = useToast()
  const { category, name, price, wasPrice, discountPct, badge, freeDelivery, inStock } = product

  const wished = wishlist.has(product.id)

  function addToCart() {
    add(product.id, 1)
    toast.show(t('toast.addedToCart', { name }))
  }

  function toggleWish() {
    wishlist.toggle(product.id)
    toast.show(wished ? t('toast.removedFromFav') : t('toast.addedToFav'))
  }

  return (
    <Card className="flex h-full flex-col">
      {/* Image + overlays */}
      <div className="relative">
        <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-surface">
          <ProductImage src={product.image} alt={name} />
        </Link>

        <div className="absolute start-2 top-2">
          {badge === 'new' ? (
            <Badge tone="success">{t('product.new')}</Badge>
          ) : discountPct ? (
            <Badge tone="price">−{discountPct}%</Badge>
          ) : null}
        </div>

        <button
          type="button"
          onClick={toggleWish}
          aria-label={t('product.wishlist')}
          aria-pressed={wished}
          className={cn(
            'absolute end-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-canvas/90 shadow-sm transition-colors hover:text-price',
            wished ? 'text-price' : 'text-ink-muted',
          )}
        >
          <Heart size={16} className={wished ? 'fill-price' : ''} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{category}</p>

        <h3 className="min-h-10 text-sm font-medium text-ink">
          <Link to={`/product/${product.id}`} className="line-clamp-2 hover:text-brand">
            {name}
          </Link>
        </h3>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-price">AED {formatAed(price)}</span>
          {wasPrice ? (
            <span className="text-sm text-ink-muted line-through">{formatAed(wasPrice)}</span>
          ) : null}
        </div>

        {inStock ? (
          <p className="text-xs font-medium text-success">
            {freeDelivery ? `${t('product.freeDelivery')} · ` : ''}
            {t('product.inStock')}
          </p>
        ) : (
          <p className="text-xs font-bold text-price">{t('product.outOfStock')}</p>
        )}

        <Button variant="primary" size="sm" fullWidth className="mt-auto" onClick={addToCart} disabled={!inStock}>
          {inStock ? t('product.addToCart') : t('product.outOfStock')}
        </Button>
      </div>
    </Card>
  )
}
