import { cn } from '../../lib/cn.js'

/*
 * StatusBadge — order/fulfilment status pill.
 * Colour means status, not sales (CLAUDE.md · StatusBadge contract):
 *   pending / packing   → --highlight  (awaiting action)
 *   shipped / delivery  → --brand      (in motion)
 *   delivered / paid    → --success    (done)
 *   returned / problem  → --price       (something wrong)
 *
 * variant="soft"  → tinted pill (storefront)
 * variant="solid" → filled pill (admin, where status must be readable at a glance)
 */
const soft = {
  pending: 'bg-highlight-tint text-highlight-ink',
  packing: 'bg-highlight-tint text-highlight-ink',
  shipped: 'bg-brand-tint text-brand',
  delivery: 'bg-brand-tint text-brand',
  delivered: 'bg-success-tint text-success',
  paid: 'bg-success-tint text-success',
  returned: 'bg-price-tint text-price',
}

const solid = {
  pending: 'bg-highlight text-highlight-ink',
  packing: 'bg-highlight text-highlight-ink',
  shipped: 'bg-brand text-white',
  delivery: 'bg-brand text-white',
  delivered: 'bg-success text-white',
  paid: 'bg-success text-white',
  returned: 'bg-price text-white',
}

export default function StatusBadge({ status = 'pending', variant = 'soft', className, children }) {
  const map = variant === 'solid' ? solid : soft
  const fallback = variant === 'solid' ? 'bg-surface text-ink' : 'bg-surface text-ink-muted'
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold',
        map[status] ?? fallback,
        className,
      )}
    >
      {children}
    </span>
  )
}
