import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingBag, TrendingUp, Clock, Undo2, Boxes, ArrowRight } from 'lucide-react'
import { cn } from '../../lib/cn.js'
import { AdminPage, Panel, PaymentBadge } from '../../components/admin/AdminUi.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { formatAed } from '../../lib/format.js'
import { useOrders } from '../../store/OrdersContext.jsx'
import { useProducts } from '../../store/ProductsContext.jsx'

function Kpi({ icon: Icon, label, value, accent }) {
  return (
    <Panel className="p-4">
      <div className="flex items-center gap-3">
        <span className={cn('grid h-10 w-10 place-items-center rounded-lg', accent)}>
          <Icon size={18} />
        </span>
        <div>
          <p className="text-xl font-bold text-ink">{value}</p>
          <p className="text-xs text-ink-muted">{label}</p>
        </div>
      </div>
    </Panel>
  )
}

export default function AdminOverview() {
  const { t } = useTranslation()
  const { allOrders: orders } = useOrders()
  const { products } = useProducts()
  const lowStock = products.filter((p) => p.level !== 'ok').length
  const revenue = orders.filter((o) => o.payment === 'paid').reduce((s, o) => s + o.total, 0)
  const attention = orders.filter((o) => ['pending', 'packing', 'returned'].includes(o.status))
  const kpis = {
    ordersToday: orders.length,
    pending: orders.filter((o) => o.status === 'pending' || o.status === 'packing').length,
    returns: orders.filter((o) => o.status === 'returned').length,
  }

  return (
    <AdminPage title={t('admin.overview.title')} subtitle={t('admin.overview.subtitle')}>
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Kpi icon={ShoppingBag} label={t('admin.overview.ordersToday')} value={kpis.ordersToday} accent="bg-brand-tint text-brand" />
        <Kpi icon={TrendingUp} label={t('admin.overview.revenue')} value={`AED ${formatAed(revenue)}`} accent="bg-success-tint text-success" />
        <Kpi icon={Clock} label={t('admin.overview.pending')} value={kpis.pending} accent="bg-highlight-tint text-highlight-ink" />
        <Kpi icon={Undo2} label={t('admin.overview.returns')} value={kpis.returns} accent="bg-price-tint text-price" />
        <Kpi icon={Boxes} label={t('admin.overview.lowStock')} value={lowStock} accent="bg-price-tint text-price" />
      </div>

      {/* Needs attention */}
      <h2 className="mt-8 mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">
        {t('admin.overview.needsAttention')}
      </h2>
      <Panel className="overflow-hidden">
        {attention.length === 0 ? (
          <p className="p-6 text-sm text-ink-muted">{t('admin.overview.allClear')}</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {attention.map((o) => (
                <tr key={o.id} className={cn('border-b border-border last:border-0', o.status === 'returned' && 'bg-price-tint')}>
                  <td className="px-4 py-3 font-bold text-brand">{o.id}</td>
                  <td className="px-4 py-3 text-ink">{o.customer}</td>
                  <td className="px-4 py-3"><PaymentBadge state={o.payment} /></td>
                  <td className="px-4 py-3 text-end">
                    <StatusBadge status={o.status} variant="solid">{t(`admin.status.${o.status}`)}</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      <div className="mt-4">
        <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
          {t('admin.overview.viewAll')} <ArrowRight size={14} className="rtl:rotate-180" />
        </Link>
      </div>
    </AdminPage>
  )
}
