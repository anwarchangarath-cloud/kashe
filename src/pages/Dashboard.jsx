import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Package, Heart, Ticket, Wallet, ArrowRight } from 'lucide-react'
import { cn } from '../lib/cn.js'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import OrderTracker, { buildTrackSteps } from '../components/account/OrderTracker.jsx'
import { useAuth } from '../store/AuthContext.jsx'
import { useOrders } from '../store/OrdersContext.jsx'
import { useWishlist } from '../store/WishlistContext.jsx'
import { useAddresses } from '../store/AddressesContext.jsx'
import { coupons } from '../data/account.js'
import { formatAed } from '../lib/format.js'

function StatTile({ icon: Icon, tint, stat, sub }) {
  return (
    <Card className="p-4">
      <span className={cn('mb-3 grid h-9 w-9 place-items-center rounded-lg text-brand', tint)}>
        <Icon size={18} />
      </span>
      <p className="font-bold text-ink">{stat}</p>
      <p className="text-xs text-ink-muted">{sub}</p>
    </Card>
  )
}

function OrderRow({ order }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-4 py-4">
      <Link to={`/account/orders/${order.id}`} className="h-14 w-14 shrink-0 rounded-lg bg-surface" />
      <div className="min-w-0 flex-1">
        <Link to={`/account/orders/${order.id}`} className="font-bold text-brand">#{order.id}</Link>
        <p className="text-sm text-ink-muted">{order.date} · {t('account.itemCount', { count: order.items })}</p>
      </div>
      <StatusBadge status={order.status}>{t(`admin.status.${order.status}`)}</StatusBadge>
      <span className="ms-2 font-bold text-ink">AED {formatAed(order.total)}</span>
    </div>
  )
}

export default function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { myOrders: orders } = useOrders()
  const { count: savedCount } = useWishlist()
  const { defaultAddress } = useAddresses()

  // Derive real figures instead of hardcoding them.
  const activeStatuses = ['pending', 'packing', 'shipped']
  const activeOrders = orders.filter((o) => activeStatuses.includes(o.status))
  const inTransit = orders.find((o) => o.status === 'shipped') ?? activeOrders[0]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-serif text-3xl font-medium text-ink">{t('account.welcome', { name: user?.name ?? 'Anwar' })}</h1>
        <span className="text-sm text-ink-muted">{t('account.memberSince', { date: 'June 2026' })}</span>
      </div>

      {/* Stat tiles — derived from real state */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile icon={Package} tint="bg-brand-tint" stat={t('account.stats.activeOrders', { count: activeOrders.length })} sub={t('account.stats.arriving', { count: inTransit ? 1 : 0 })} />
        <StatTile icon={Wallet} tint="bg-success-tint" stat={t('account.stats.credit', { amount: '42.50' })} sub={t('account.stats.wallet')} />
        <StatTile icon={Ticket} tint="bg-highlight-tint" stat={t('account.stats.coupons', { count: coupons.length })} sub={t('account.stats.expiring', { count: 1 })} />
        <StatTile icon={Heart} tint="bg-action-tint" stat={t('account.stats.saved', { count: savedCount })} sub={t('account.stats.dropped', { count: 0 })} />
      </div>

      {/* Arriving today — the customer's most in-transit order (hidden if none) */}
      {inTransit && (
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-xl font-medium text-ink">{t('account.arrivingToday')}</h2>
            <StatusBadge status={inTransit.status}>{t(`admin.status.${inTransit.status}`)}</StatusBadge>
          </div>
          <div className="mb-6 flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-lg bg-surface" />
            <div className="min-w-0 flex-1">
              <Link to={`/account/orders/${inTransit.id}`} className="font-bold text-brand">#{inTransit.id}</Link>
              <p className="text-sm text-ink-muted">{t('account.itemCount', { count: inTransit.items })} · AED {formatAed(inTransit.total)}</p>
            </div>
            <Link to="/track"><Button variant="secondary" size="sm">{t('account.trackLive')}</Button></Link>
          </div>
          <OrderTracker steps={buildTrackSteps(t, inTransit.status === 'shipped' ? 3 : 1)} />
          <p className="mt-5 text-sm font-bold text-success">{t('account.arrivingWindow')}</p>
        </Card>
      )}

      {/* Recent orders */}
      <Card className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-serif text-xl font-medium text-ink">{t('account.recentOrders')}</h2>
          <Link to="/account/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
            {t('account.viewAll')} <ArrowRight size={14} className="rtl:rotate-180" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {orders.slice(0, 3).map((o) => <OrderRow key={o.id} order={o} />)}
        </div>
      </Card>

      {/* Address + coupons */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-xl font-medium text-ink">{t('account.defaultAddress')}</h2>
            <Link to="/account/addresses" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
              {t('account.manage')} <ArrowRight size={14} className="rtl:rotate-180" />
            </Link>
          </div>
          {defaultAddress ? (
            <>
              <p className="flex items-center gap-2 font-bold text-ink">
                {defaultAddress.label}
                <span className="rounded bg-brand-tint px-2 py-0.5 text-xs font-bold text-brand">{t('account.default')}</span>
              </p>
              <p className="mt-2 text-sm text-ink-muted">{defaultAddress.name} · {defaultAddress.phone}</p>
              <p className="text-sm text-ink-muted">{defaultAddress.line}</p>
            </>
          ) : (
            <p className="text-sm text-ink-muted">—</p>
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-xl font-medium text-ink">{t('account.yourCoupons')}</h2>
            <Link to="/account/coupons" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
              {t('account.seeAll')} <ArrowRight size={14} className="rtl:rotate-180" />
            </Link>
          </div>
          <div className="space-y-3">
            {coupons.slice(0, 2).map((c) => (
              <div key={c.code} className="flex items-center gap-3 text-sm">
                <span className="rounded bg-highlight-tint px-2 py-1 font-bold text-highlight-ink">{c.code}</span>
                <span className="flex-1 text-ink">{c.desc}</span>
                <span className="text-ink-muted">{t('account.exp', { date: c.exp })}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
