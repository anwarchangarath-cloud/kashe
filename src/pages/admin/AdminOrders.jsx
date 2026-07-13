import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/cn.js'
import { AdminPage, Panel, PaymentBadge } from '../../components/admin/AdminUi.jsx'
import { formatAed } from '../../lib/format.js'
import { useOrders } from '../../store/OrdersContext.jsx'
import { useToast } from '../../store/ToastContext.jsx'

const FILTERS = ['all', 'pending', 'packing', 'shipped', 'delivered', 'returned']

const statusStyle = {
  pending: 'bg-highlight text-highlight-ink',
  packing: 'bg-highlight text-highlight-ink',
  shipped: 'bg-brand text-white',
  delivered: 'bg-success text-white',
  returned: 'bg-price text-white',
}

// Colored status dropdown — changing it updates the order (and payment) live.
function StatusSelect({ order, onChange }) {
  const { t } = useTranslation()
  return (
    <select
      value={order.status}
      onChange={(e) => onChange(order.id, e.target.value)}
      className={cn('cursor-pointer rounded-full px-3 py-1 text-xs font-bold focus:outline-none', statusStyle[order.status])}
      aria-label={t('admin.orders.colStatus')}
    >
      {['pending', 'packing', 'shipped', 'delivered', 'returned'].map((s) => (
        <option key={s} value={s} className="bg-canvas text-ink">
          {t(`admin.status.${s}`)}
        </option>
      ))}
    </select>
  )
}

export default function AdminOrders() {
  const { t } = useTranslation()
  const { allOrders: orders, setOrderStatus } = useOrders()
  const toast = useToast()
  const [filter, setFilter] = useState('all')

  const rows = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  function change(id, status) {
    setOrderStatus(id, status)
    toast.show(t('admin.toast.statusChanged', { id, status: t(`admin.status.${status}`) }))
  }

  return (
    <AdminPage title={t('admin.orders.title')} subtitle={t('admin.orders.subtitle', { count: orders.length })}>
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              filter === f ? 'bg-brand text-white' : 'bg-canvas text-ink-muted hover:bg-brand-tint',
            )}
          >
            {f === 'all' ? t('admin.orders.all') : t(`admin.status.${f}`)}
          </button>
        ))}
      </div>

      <Panel className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-bold uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3 text-start">{t('admin.orders.colOrder')}</th>
              <th className="px-4 py-3 text-start">{t('admin.orders.colCustomer')}</th>
              <th className="px-4 py-3 text-start">{t('admin.orders.colDate')}</th>
              <th className="px-4 py-3 text-end">{t('admin.orders.colItems')}</th>
              <th className="px-4 py-3 text-end">{t('admin.orders.colTotal')}</th>
              <th className="px-4 py-3 text-start">{t('admin.orders.colPayment')}</th>
              <th className="px-4 py-3 text-end">{t('admin.orders.colStatus')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className={cn('border-b border-border last:border-0', o.status === 'returned' && 'bg-price-tint')}>
                <td className="px-4 py-3 font-bold text-brand">{o.id}</td>
                <td className="px-4 py-3 text-ink">{o.customer}</td>
                <td className="px-4 py-3 text-ink-muted">{o.date}</td>
                <td className="px-4 py-3 text-end text-ink">{o.items}</td>
                <td className="px-4 py-3 text-end font-bold text-ink">AED {formatAed(o.total)}</td>
                <td className="px-4 py-3"><PaymentBadge state={o.payment} /></td>
                <td className="px-4 py-3 text-end"><StatusSelect order={o} onChange={change} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </AdminPage>
  )
}
