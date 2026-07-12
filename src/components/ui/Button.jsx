import { cn } from '../../lib/cn.js'

/*
 * Button — the single most rule-bound primitive in the system (see CLAUDE.md).
 *
 *   primary   → --action orange fill. THE ONLY place orange may appear. One per section.
 *   secondary → outlined --brand blue.
 *   danger    → outlined --price red. Never filled. Never the largest button on screen.
 *   ghost     → text only.
 */
const base =
  'inline-flex items-center justify-center gap-2 rounded font-medium ' +
  'transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

const variants = {
  primary:
    'bg-action text-white hover:brightness-95 focus-visible:outline-action',
  secondary:
    'border border-brand text-brand bg-transparent hover:bg-brand-tint ' +
    'focus-visible:outline-brand',
  danger:
    'border border-price text-price bg-transparent hover:bg-price-tint ' +
    'focus-visible:outline-price',
  ghost:
    'text-brand bg-transparent hover:bg-brand-tint focus-visible:outline-brand',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  type = 'button',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        base,
        sizes[size],
        variants[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
