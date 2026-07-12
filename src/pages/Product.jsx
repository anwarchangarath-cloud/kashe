import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check, ShieldCheck, RotateCcw, Truck, Heart, Minus, Plus } from 'lucide-react'
import { cn } from '../lib/cn.js'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import RatingStars from '../components/ui/RatingStars.jsx'
import ProductImage from '../components/product/ProductImage.jsx'
import ProductReviews from '../components/product/ProductReviews.jsx'
import { formatAed } from '../lib/format.js'
import { useProducts } from '../store/ProductsContext.jsx'
import { useCart } from '../store/CartContext.jsx'
import { useWishlist } from '../store/WishlistContext.jsx'
import { useToast } from '../store/ToastContext.jsx'

function TrustCell({ icon: Icon, title, sub }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 px-4 py-3 text-center">
      <span className="flex items-center gap-1.5 text-sm font-bold text-ink">
        <Icon size={16} className="text-brand" />
        {title}
      </span>
      <span className="text-xs text-ink-muted">{sub}</span>
    </div>
  )
}

export default function Product() {
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { getProduct, products } = useProducts()
  const { add } = useCart()
  const wishlist = useWishlist()
  const toast = useToast()

  const p = getProduct(id)

  if (!p) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-serif text-3xl font-medium text-ink">{t('productPage.notFound')}</h1>
        <Link to="/" className="mt-4 inline-block text-brand hover:underline">
          {t('category.home')}
        </Link>
      </div>
    )
  }

  const thumbnails = 4
  const freeDeliveryBy = 'Sunday, 12 July'
  const wished = wishlist.has(p.id)
  const inStock = p.inStock
  const lowStock = p.stock > 0 && p.stock <= 10
  const bundle = products.filter((x) => x.id !== p.id && x.inStock).slice(0, 3)
  const bundleTotal = bundle.reduce((s, i) => s + i.price, 0)

  const [activeThumb, setActiveThumb] = useState(0)
  const [qty, setQty] = useState(1)

  function addToCart() {
    add(p.id, qty)
    toast.show(t('toast.addedToCart', { name: p.name }))
  }
  function buyNow() {
    add(p.id, qty)
    navigate('/checkout')
  }
  function addBundle() {
    bundle.forEach((b) => add(b.id, 1))
    add(p.id, 1)
    toast.show(t('toast.addedToCart', { name: p.name }))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumb
        items={[
          { label: t('category.home'), to: '/' },
          { label: p.category, to: '/category/home' },
          { label: p.name },
        ]}
      />

      <div className="mt-4 grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-lg bg-surface">
            <ProductImage src={p.image} alt={p.name} />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-4">
            {Array.from({ length: thumbnails }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveThumb(i)}
                className={`aspect-square overflow-hidden rounded-lg bg-surface ${
                  i === activeThumb ? 'ring-2 ring-brand' : 'border border-border'
                }`}
                aria-label={`View image ${i + 1}`}
                aria-pressed={i === activeThumb}
              >
                <ProductImage src={p.image} alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-bold uppercase tracking-wide text-brand">{p.vendor}</p>
            <button
              onClick={() => { wishlist.toggle(p.id); toast.show(wished ? t('toast.removedFromFav') : t('toast.addedToFav')) }}
              aria-pressed={wished}
              className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border hover:text-price', wished ? 'text-price' : 'text-ink-muted')}
            >
              <Heart size={18} className={wished ? 'fill-price' : ''} />
            </button>
          </div>
          <h1 className="mt-2 font-serif text-3xl font-medium leading-tight text-ink md:text-4xl">
            {p.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            <RatingStars value={p.rating} size={16} />
            <span className="font-medium text-ink">{p.rating}</span>
            <span>·</span>
            <span>{t('productPage.ratingsCount', { count: p.ratingsCount.toLocaleString('en') })}</span>
            <span>·</span>
            <span>{p.sold}</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-4xl font-bold text-price">AED {formatAed(p.price)}</span>
            {p.wasPrice && (
              <span className="text-lg text-ink-muted line-through">AED {formatAed(p.wasPrice)}</span>
            )}
            {p.discountPct && (
              <Badge tone="price" className="px-3 py-1 text-sm">{t('productPage.save', { pct: p.discountPct })}</Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-ink-muted">{t('productPage.inclusiveVat')}</p>

          {inStock ? (
            <>
              <p className="mt-4 flex items-center gap-1.5 text-sm font-bold text-success">
                <Check size={16} />
                {t('productPage.inStock')} · {t('productPage.freeDeliveryBy', { date: freeDeliveryBy })}
              </p>
              {lowStock && (
                <p className="mt-1 text-sm font-bold text-price">
                  {t('productPage.onlyLeft', { count: p.stock })}
                </p>
              )}
            </>
          ) : (
            <p className="mt-4 text-sm font-bold text-price">{t('productPage.outOfStock')}</p>
          )}

          <div className="mt-6 flex items-center gap-3">
            <span className="text-sm text-ink-muted">{t('productPage.quantity')}</span>
            <div className="inline-flex items-center rounded border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={!inStock} className="grid h-9 w-9 place-items-center text-ink-muted hover:text-brand disabled:opacity-40" aria-label="Decrease quantity">
                <Minus size={15} />
              </button>
              <span className="w-10 text-center text-sm font-bold text-ink">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(p.stock, q + 1))} disabled={!inStock || qty >= p.stock} className="grid h-9 w-9 place-items-center text-ink-muted hover:text-brand disabled:opacity-40" aria-label="Increase quantity">
                <Plus size={15} />
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Button variant="primary" size="lg" fullWidth className="shadow-lg" onClick={addToCart} disabled={!inStock}>
              {inStock ? t('productPage.addToCart') : t('productPage.outOfStock')}
            </Button>
            <Button variant="secondary" size="lg" fullWidth onClick={buyNow} disabled={!inStock}>
              {t('productPage.buyNow')}
            </Button>
          </div>

          <Card className="mt-5 flex divide-x divide-border">
            <TrustCell icon={ShieldCheck} title={t('productPage.securePayment')} sub={t('productPage.securePaymentSub')} />
            <TrustCell icon={RotateCcw} title={t('productPage.returns')} sub={t('productPage.returnsSub')} />
            <TrustCell icon={Truck} title={t('productPage.freeDelivery')} sub={t('productPage.freeDeliverySub')} />
          </Card>

          <hr className="my-6 border-border" />

          <h2 className="font-serif text-xl font-medium text-ink">{t('productPage.highlights')}</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink">
            {p.highlights.map((h) => (
              <li key={h} className="flex gap-2">
                <span className="text-ink-muted">·</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Frequently bought together */}
      <section className="mt-14">
        <h2 className="mb-5 font-serif text-2xl font-medium text-ink">
          {t('productPage.frequentlyBought')}
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="grid grid-cols-3 gap-4">
            {bundle.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <Link to={`/product/${item.id}`} className="block aspect-square overflow-hidden bg-surface">
                  <ProductImage src={item.image} alt={item.category} />
                </Link>
                <div className="p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                    {item.category}
                  </p>
                  <p className="mt-1 font-bold text-price">AED {formatAed(item.price)}</p>
                </div>
              </Card>
            ))}
          </div>

          <Card className="flex flex-col justify-center p-6">
            <p className="text-sm text-ink-muted">{t('productPage.bundleTotal')}</p>
            <p className="mt-1 text-3xl font-bold text-price">
              AED {formatAed(bundleTotal + p.price)}
            </p>
            <Button variant="primary" size="lg" className="mt-4 self-start shadow-lg" onClick={addBundle}>
              {t('productPage.addAllToCart', { count: bundle.length + 1 })}
            </Button>
          </Card>
        </div>
      </section>

      <ProductReviews product={p} />
    </div>
  )
}
