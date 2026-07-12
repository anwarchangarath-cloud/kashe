import { cn } from '../../lib/cn.js'

/*
 * Input — form field primitive. Optional leading label and start adornment.
 * Uses logical padding so it mirrors under dir="rtl".
 */
export default function Input({ label, id, adornment, className, ...props }) {
  const field = (
    <div
      className={cn(
        'flex items-center rounded border border-border bg-canvas',
        'focus-within:border-brand focus-within:ring-1 focus-within:ring-brand',
      )}
    >
      {adornment ? (
        <span className="ps-3 text-sm text-ink-muted">{adornment}</span>
      ) : null}
      <input
        id={id}
        className={cn(
          'min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-ink',
          'placeholder:text-ink-muted focus:outline-none',
          className,
        )}
        {...props}
      />
    </div>
  )

  if (!label) return field

  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-muted">
        {label}
      </span>
      {field}
    </label>
  )
}
