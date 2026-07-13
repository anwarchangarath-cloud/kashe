import { Fragment, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check, ShoppingCart, Tag, MapPin } from 'lucide-react'
import { cn } from '../lib/cn.js'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import { formatAed } from '../lib/format.js'
import { applyCoupon, deliveryFeeFor } from '../lib/coupons.js'
import { useCart } from '../store/CartContext.jsx'
import { useOrders } from '../store/OrdersContext.jsx'
import { useAuth } from '../store/AuthContext.jsx'
import { useAddresses } from '../store/AddressesContext.jsx'
import { useProducts } from '../store/ProductsContext.jsx'

function Stepper({ steps }) {
  return (
    <ol className="flex items-start">
      {steps.map((s, i) => (
        <Fragment key={s.label}>
          <li className="flex flex-col items-center gap-2">
            <span className={cn('grid h-7 w-7 place-items-center rounded-full text-white', s.state === 'done' && 'bg-success', s.state === 'active' && 'bg-brand', s.state === 'upcoming' && 'bg-surface text-ink-muted')}>
              {s.state === 'done' ? <Check size={16} /> : null}
            </span>
            <span className={cn('text-xs font-bold', s.state === 'upcoming' ? 'text-ink-muted' : 'text-ink')}>{s.label}</span>
          </li>
          {i < steps.length - 1 && <span className={cn('mt-3.5 h-0.5 flex-1', s.state === 'done' ? 'bg-success' : 'bg-border')} />}
        </Fragment>
      ))}
    </ol>
  )
}

function Option({ selected, onSelect, children }) {
  return (
    <button type="button" onClick={onSelect} className={cn('flex w-full items-center justify-between gap-2 rounded-lg border px-4 py-3.5 text-start', selected ? 'border-brand ring-1 ring-brand' : 'border-border hover:border-brand')}>
      {children}
      {selected && <Check size={18} className="shrink-0 text-brand" />}
    </button>
  )
}

export default function Checkout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lines, subtotal, count, clear } = useCart()
  const { placeOrder: submitOrder } = useOrders()
  const { user } = useAuth()
  const { addresses, defaultAddress } = useAddresses()
  const { reload: reloadProducts } = useProducts()

  const [payment, setPayment] = useState('card')
  const [addressId, setAddressId] = useState(defaultAddress?.id)
  const [couponInput, setCouponInput] = useState('')
  const [coupon, setCoupon] = useState(null) // { code, discount, freeDelivery, label }
  const [couponError, setCouponError] = useState('')
  const [placing, setPlacing] = useState(false)
  const [orderError, setOrderError] = useState('')

  if (count === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-surface text-ink-muted"><ShoppingCart size={28} /></span>
        <h1 className="font-serif text-3xl font-medium text-ink">{t('cart.emptyTitle')}</h1>
        <p className="mt-2 text-sm text-ink-muted">{t('cart.emptySub')}</p>
        <Link to="/" className="mt-6 inline-block"><Button variant="primary" size="lg">{t('cart.continueShopping')}</Button></Link>
      </div>
    )
  }

  const baseDelivery = deliveryFeeFor(subtotal)
  const freeDelivery = baseDelivery === 0 || coupon?.freeDelivery
  const deliveryFee = freeDelivery ? 0 : baseDelivery
  const discount = coupon?.discount ?? 0
  const total = Math.max(0, subtotal - discount + deliveryFee)
  const selectedAddress = addresses.find((a) => a.id === addressId) ?? defaultAddress

  function onApplyCoupon(e) {
    e.preventDefault()
    const res = applyCoupon(couponInput, subtotal, baseDelivery)
    if (!res.ok) {
      setCoupon(null)
      setCouponError(res.error === 'min' ? t('checkout.couponMin', { min: res.min }) : t('checkout.couponInvalid'))
      return
    }
    setCoupon(res)
    setCouponError('')
  }

  const steps = [
    { label: t('checkout.steps.cart'), state: 'done' },
    { label: t('checkout.steps.delivery'), state: 'active' },
    { label: t('checkout.steps.payment'), state: 'upcoming' },
    { label: t('checkout.steps.confirm'), state: 'upcoming' },
  ]

  async function placeOrder() {
    setOrderError('')
    setPlacing(true)
    try {
      // Server recomputes totals from DB prices and decrements stock in a transaction.
      const order = await submitOrder({
        items: lines.map((l) => ({ id: l.id, qty: l.qty })),
        coupon: coupon?.code ?? null,
        payment,
        address: selectedAddress ?? null,
        customer: user?.fullName,
      })
      clear()
      reloadProducts() // refresh stock on the storefront
      navigate('/order-confirmed', { state: { orderId: order.id, total: order.total, payment } })
    } catch (e) {
      setOrderError(e.message || t('auth.generic'))
      setPlacing(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mx-auto mb-8 max-w-2xl"><Stepper steps={steps} /></div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          {/* Delivery address — pick a saved one */}
          <h2 className="mb-4 font-serif text-2xl font-medium text-ink">{t('checkout.deliveryAddress')}</h2>
          {addresses.length === 0 ? (
            <Link to="/account/addresses" className="text-sm font-semibold text-brand hover:underline">
              + {t('account.pages.addAddress')}
            </Link>
          ) : (
            <div className="space-y-3">
              {addresses.map((a) => (
                <Option key={a.id} selected={addressId === a.id} onSelect={() => setAddressId(a.id)}>
                  <span className="flex items-start gap-3">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-ink-muted" />
                    <span>
                      <span className="block text-sm font-bold text-ink">{a.label}</span>
                      <span className="block text-xs text-ink-muted">{a.name} · {a.line}</span>
                    </span>
                  </span>
                </Option>
              ))}
            </div>
          )}

          {/* Payment */}
          <h2 className="mt-8 mb-4 font-serif text-2xl font-medium text-ink">{t('checkout.paymentMethod')}</h2>
          <div className="space-y-3">
            <Option selected={payment === 'card'} onSelect={() => setPayment('card')}>
              <span className={cn('text-sm', payment === 'card' ? 'font-bold text-ink' : 'text-ink-muted')}>{t('checkout.cardEnding', { last4: '4242' })}</span>
            </Option>
            <Option selected={payment === 'applepay'} onSelect={() => setPayment('applepay')}>
              <span className={cn('text-sm', payment === 'applepay' ? 'font-bold text-ink' : 'text-ink-muted')}>{t('checkout.applePay')}</span>
            </Option>
            <Option selected={payment === 'cod'} onSelect={() => setPayment('cod')}>
              <span className={cn('text-sm', payment === 'cod' ? 'font-bold text-ink' : 'text-ink-muted')}>{t('checkout.cod')}</span>
            </Option>
          </div>
        </Card>

        {/* Summary */}
        <Card className="h-fit p-6">
          <h2 className="mb-4 font-serif text-2xl font-medium text-ink">{t('checkout.orderSummary')}</h2>

          {/* Coupon */}
          <form onSubmit={onApplyCoupon} className="mb-4 flex gap-2">
            <div className="flex flex-1 items-center gap-2 rounded border border-border bg-canvas px-3">
              <Tag size={15} className="text-ink-muted" />
              <input value={couponInput} onChange={(e) => { setCouponInput(e.target.value); setCouponError('') }} placeholder={t('checkout.couponPh')} className="min-w-0 flex-1 bg-transparent py-2 text-sm uppercase text-ink placeholder:normal-case placeholder:text-ink-muted focus:outline-none" />
            </div>
            <Button type="submit" variant="secondary" size="md">{t('checkout.applyCoupon')}</Button>
          </form>
          {couponError && <p className="mb-3 text-xs font-medium text-price">{couponError}</p>}
          {coupon && <p className="mb-3 text-xs font-bold text-success">✓ {coupon.code} · {coupon.label}</p>}

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">{t('checkout.items', { count })}</span>
              <span className="text-ink">AED {formatAed(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">{t('checkout.delivery')}</span>
              {freeDelivery ? <span className="font-bold text-success">{t('checkout.free')}</span> : <span className="text-ink">AED {formatAed(deliveryFee)}</span>}
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">{t('checkout.discount')}</span>
                <span className="font-bold text-success">−AED {formatAed(discount)}</span>
              </div>
            )}
          </div>

          <hr className="my-4 border-border" />

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-ink">{t('checkout.total')}</span>
            <span className="text-xl font-bold text-price">AED {formatAed(total)}</span>
          </div>

          {orderError && <p className="mt-3 text-sm font-medium text-price">{orderError}</p>}
          <Button variant="primary" size="lg" fullWidth className="mt-5 shadow-lg" onClick={placeOrder} disabled={placing}>
            {placing ? '…' : t('checkout.placeOrder')}
          </Button>
          <p className="mt-4 text-center text-sm font-bold text-success">{t('checkout.arrives', { date: 'Sunday, 12 July' })}</p>
        </Card>
      </div>
    </div>
  )
}
