import { Fragment } from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../lib/cn.js'

export const TRACK_STAGES = ['ordered', 'packed', 'shipped', 'outForDelivery', 'delivered']

// Build the 5 tracker steps for a given active stage index (0–4).
export function buildTrackSteps(t, activeIndex) {
  return TRACK_STAGES.map((key, i) => ({
    label: t(`account.track.${key}`),
    state: i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'upcoming',
  }))
}

// Horizontal progress tracker. Reused on the dashboard and the public track-order page.
export default function OrderTracker({ steps }) {
  return (
    <ol className="flex items-start">
      {steps.map((s, i) => (
        <Fragment key={s.label + i}>
          <li className="flex flex-col items-center gap-2">
            <span
              className={cn(
                'grid h-6 w-6 place-items-center rounded-full',
                s.state === 'done' && 'bg-success text-white',
                s.state === 'active' && 'bg-brand text-white ring-4 ring-brand-tint',
                s.state === 'upcoming' && 'bg-surface',
              )}
            >
              {s.state === 'done' ? <Check size={14} /> : null}
            </span>
            <span className={cn('text-center text-xs font-medium', s.state === 'upcoming' ? 'text-ink-muted' : 'text-ink')}>
              {s.label}
            </span>
          </li>
          {i < steps.length - 1 && (
            <span className={cn('mt-3 h-0.5 flex-1', s.state === 'done' ? 'bg-success' : 'bg-border')} />
          )}
        </Fragment>
      ))}
    </ol>
  )
}
