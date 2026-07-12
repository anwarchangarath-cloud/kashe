import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import ProductImage from '../components/product/ProductImage.jsx'
import { formatAed } from '../lib/format.js'
import { deliveryFeeFor } from '../lib/coupons.js'
import { useCart } from '../store/CartContext.jsx'

function QtyStepper({ qty, max, onDec, onInc }) {
  const atMax = max != null && qty >= max
  return (
    <div className="inline-flex items-center rounded border border-border">
      <button onClick={onDec} className="grid h-8 w-8 place-items-center text-ink-muted hover:text-brand" aria-label="Decrease quantity">
        <Minus size={14} />
      </button>
      <span className="w-8 text-center text-sm font-bold text-ink">{qty}</span>
      <button onClick={onInc} disabled={atMax} className="grid h-8 w-8 place-items-center text-ink-muted hover:text-brand disabled:opacity-30" aria-label="Increase quantity">
        <Plus size={14} />
      </button>
    </div>
  )
}

export default function Cart() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lines, subtotal, setQty, remove, count } = useCart()
  const deliveryFee = deliveryFeeFor(subtotal)
  const total = subtotal + deliveryFee

  if (count === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-surface text-ink-muted">
          <ShoppingCart size={28} />
        </span>
        <h1 className="font-serif text-3xl font-medium text-ink">{t('cart.emptyTitle')}</h1>
        <p className="mt-2 text-sm text-ink-muted">{t('cart.emptySub')}</p>
        <Link to="/" className="mt-6 inline-block">
          <Button variant="primary" size="lg">{t('cart.continueShopping')}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 font-serif text-3xl font-medium text-ink">
        {t('cart.title')} <span className="text-lg text-ink-muted">({t('cart.itemCount', { count })})</span>
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {lines.map((line) => (
            <Card key={line.id} className="flex gap-4 p-4">
              <Link to={`/product/${line.id}`} className="block h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface">
                <ProductImage src={line.product.image} alt={line.product.name} />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{line.product.category}</p>
                <Link to={`/product/${line.id}`} className="font-medium text-ink hover:text-brand">
                  {line.product.name}
                </Link>
                <p className="mt-1 text-xs font-medium text-success">{t('product.freeDelivery')} · {t('product.inStock')}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <QtyStepper qty={line.qty} max={line.product.stock} onDec={() => setQty(line.id, line.qty - 1)} onInc={() => setQty(line.id, Math.min(line.product.stock ?? Infinity, line.qty + 1))} />
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-price">AED {formatAed(line.lineTotal)}</span>
                    <button onClick={() => remove(line.id)} className="text-ink-muted hover:text-price" aria-label={t('cart.remove')}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card className="h-fit p-6">
          <h2 className="mb-4 font-serif text-2xl font-medium text-ink">{t('cart.summary')}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-muted">{t('cart.subtotal')}</span>
              <span className="text-ink">AED {formatAed(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">{t('checkout.delivery')}</span>
              {deliveryFee === 0 ? <span className="font-bold text-success">{t('checkout.free')}</span> : <span className="text-ink">AED {formatAed(deliveryFee)}</span>}
            </div>
          </div>
          <hr className="my-4 border-border" />
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-ink">{t('checkout.total')}</span>
            <span className="text-xl font-bold text-price">AED {formatAed(total)}</span>
          </div>
          <Button variant="primary" size="lg" fullWidth className="mt-5 shadow-lg" onClick={() => navigate('/checkout')}>
            {t('cart.checkout')}
          </Button>
          <Link to="/" className="mt-3 block text-center text-sm text-brand hover:underline">
            {t('cart.continueShopping')}
          </Link>
        </Card>
      </div>
    </div>
  )
}
