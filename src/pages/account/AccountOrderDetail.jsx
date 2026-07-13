import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import OrderTracker, { buildTrackSteps } from '../../components/account/OrderTracker.jsx'
import ProductImage from '../../components/product/ProductImage.jsx'
import { formatAed } from '../../lib/format.js'
import { apiGet } from '../../lib/api.js'
import { useProducts } from '../../store/ProductsContext.jsx'

const STAGE = { pending: 0, packing: 1, shipped: 3, delivered: 4, returned: 4 }
const PAYMENT_LABEL = { paid: 'Paid', unpaid: 'Cash on delivery', 'on-delivery': 'Cash on delivery', 'refund-due': 'Refund due' }

export default function AccountOrderDetail() {
  const { id } = useParams()
  const { t } = useTranslation()
  const { getProduct } = useProducts()
  const [order, setOrder] = useState(undefined) // undefined = loading, null = not found

  useEffect(() => {
    apiGet(`/api/orders/${id}`, { withAuth: true }).then(setOrder).catch(() => setOrder(null))
  }, [id])

  if (order === undefined) return <Card className="py-16 text-center text-sm text-ink-muted">…</Card>
  if (!order) {
    return (
      <Card className="py-16 text-center">
        <p className="font-serif text-xl font-medium text-ink">{t('account.pages.orderNotFound')}</p>
        <Link to="/account/orders" className="mt-4 inline-block"><Button variant="secondary">{t('account.pages.backToOrders')}</Button></Link>
      </Card>
    )
  }

  const subtotal = order.subtotal ?? order.total
  const showBreakdown = order.subtotal != null

  return (
    <div className="space-y-6">
      <Link to="/account/orders" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-brand">
        <ArrowLeft size={16} className="rtl:rotate-180" /> {t('account.pages.backToOrders')}
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-medium text-ink">{t('account.pages.orderTitle', { id: order.id })}</h1>
          <p className="mt-1 text-sm text-ink-muted">{t('account.pages.placedOn', { date: order.date })}</p>
        </div>
        <StatusBadge status={order.status}>{t(`admin.status.${order.status}`)}</StatusBadge>
      </div>

      {order.status !== 'returned' && (
        <Card className="p-6">
          <OrderTracker steps={buildTrackSteps(t, STAGE[order.status] ?? 1)} />
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="mb-4 font-serif text-lg font-medium text-ink">{t('account.pages.itemsHeading')}</h2>
          {order.lines?.length ? (
            <div className="divide-y divide-border">
              {order.lines.map((l) => (
                <div key={l.id} className="flex items-center gap-4 py-3">
                  <Link to={`/product/${l.id}`} className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                    <ProductImage src={getProduct(l.id)?.image} alt={l.name} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${l.id}`} className="font-medium text-ink hover:text-brand">{l.name}</Link>
                    <p className="text-xs text-ink-muted">{t('account.pages.qtyEach', { qty: l.qty, price: formatAed(l.price) })}</p>
                  </div>
                  <span className="font-bold text-ink">AED {formatAed(l.price * l.qty)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-muted">{t('account.itemCount', { count: order.items })}</p>
          )}
        </Card>

        {/* Summary + address */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-2 text-sm">
              {showBreakdown && (
                <>
                  <div className="flex justify-between"><span className="text-ink-muted">{t('cart.subtotal')}</span><span className="text-ink">AED {formatAed(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-ink-muted">{t('checkout.delivery')}</span>{order.deliveryFee ? <span className="text-ink">AED {formatAed(order.deliveryFee)}</span> : <span className="font-bold text-success">{t('checkout.free')}</span>}</div>
                  {order.discount > 0 && <div className="flex justify-between"><span className="text-ink-muted">{t('checkout.discount')}</span><span className="font-bold text-success">−AED {formatAed(order.discount)}</span></div>}
                  <hr className="my-2 border-border" />
                </>
              )}
              <div className="flex justify-between"><span className="text-base font-bold text-ink">{t('checkout.total')}</span><span className="text-lg font-bold text-price">AED {formatAed(order.total)}</span></div>
              <p className="pt-1 text-xs text-ink-muted">{t('account.pages.paymentMethod')}: {PAYMENT_LABEL[order.payment] ?? order.payment}</p>
            </div>
          </Card>

          {order.address && (
            <Card className="p-6">
              <h2 className="mb-2 font-serif text-lg font-medium text-ink">{t('account.pages.deliverTo')}</h2>
              <p className="font-bold text-ink">{order.address.label}</p>
              <p className="text-sm text-ink-muted">{order.address.name} · {order.address.phone}</p>
              <p className="text-sm text-ink-muted">{order.address.line}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
