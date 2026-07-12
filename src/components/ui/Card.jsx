import { cn } from '../../lib/cn.js'

// Card — white surface on the off-white page, hairline border, large radius.
export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-canvas border border-border rounded-lg overflow-hidden',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
