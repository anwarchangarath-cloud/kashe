import { cn } from '../../lib/cn.js'

/*
 * Badge — small status/label pill.
 *   price     → discount badge (−75%). --price is allowed here (prices + discount badges).
 *   success   → "New", in-stock affirmations.
 *   brand     → neutral informational.
 *   highlight → sale emphasis.
 */
const tones = {
  price: 'bg-price text-white',
  success: 'bg-success text-white',
  brand: 'bg-brand text-white',
  highlight: 'bg-highlight text-highlight-ink',
}

export default function Badge({ tone = 'brand', className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-bold leading-none',
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
