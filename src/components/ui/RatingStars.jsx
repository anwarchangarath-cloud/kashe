import { Star } from 'lucide-react'
import { cn } from '../../lib/cn.js'

// RatingStars — 5 stars, filled up to `value`. Amber (--highlight) is the review accent.
export default function RatingStars({ value = 0, size = 16, className }) {
  return (
    <span className={cn('inline-flex items-center', className)} aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(value)
        return (
          <Star
            key={i}
            size={size}
            className={filled ? 'fill-highlight text-highlight' : 'text-border'}
            strokeWidth={1.5}
          />
        )
      })}
    </span>
  )
}
