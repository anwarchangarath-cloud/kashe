import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/cn.js'

// Page header: title + subtitle + optional single primary action (the one --action per screen).
export function AdminPage({ title, subtitle, action, children }) {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-medium text-ink">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

// Card wrapper for admin tables/panels (white on the grey ops surface).
export function Panel({ className, children }) {
  return <div className={cn('rounded-lg border border-border bg-canvas', className)}>{children}</div>
}

// Payment state pill. In admin, --price means a problem (unpaid, refund due),
// --success means settled, --highlight means awaiting (on delivery).
const paymentTone = {
  paid: 'text-success',
  unpaid: 'text-price',
  'on-delivery': 'text-highlight-ink',
  'refund-due': 'text-price',
}

export function PaymentBadge({ state }) {
  const { t } = useTranslation()
  return (
    <span className={cn('text-xs font-bold', paymentTone[state] ?? 'text-ink-muted')}>
      {t(`admin.payment.${state}`)}
    </span>
  )
}
