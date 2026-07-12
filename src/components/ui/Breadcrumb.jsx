import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

/*
 * Breadcrumb — trail of links; the last item is the current page (no link).
 * items: [{ label, to? }]. The chevron is a logical icon that flips under RTL.
 */
export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm">
      {items.map((item, i) => {
        const last = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1.5">
            {last || !item.to ? (
              <span className={last ? 'font-semibold text-brand' : 'text-ink-muted'}>
                {item.label}
              </span>
            ) : (
              <Link to={item.to} className="text-ink-muted hover:text-brand">
                {item.label}
              </Link>
            )}
            {!last && (
              <ChevronRight size={14} className="text-ink-muted rtl:rotate-180" aria-hidden="true" />
            )}
          </span>
        )
      })}
    </nav>
  )
}
