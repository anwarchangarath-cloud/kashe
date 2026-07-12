import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, LayoutGrid, ShoppingCart, User } from 'lucide-react'
import { cn } from '../../lib/cn.js'
import { useCart } from '../../store/CartContext.jsx'
import { useAuth } from '../../store/AuthContext.jsx'

// Bottom tab bar for phones (hidden on lg+). Home · Categories · Cart · Account.
export default function MobileTabBar() {
  const { t } = useTranslation()
  const { count } = useCart()
  const { isAuthed } = useAuth()

  const items = [
    { to: '/', icon: Home, label: t('tabbar.home'), end: true },
    { to: '/category/home', icon: LayoutGrid, label: t('tabbar.categories') },
    { to: '/cart', icon: ShoppingCart, label: t('tabbar.cart'), badge: count },
    { to: isAuthed ? '/account' : '/login', icon: User, label: t('tabbar.account') },
  ]

  return (
    <nav className="fixed inset-inline-0 bottom-0 z-40 border-t border-border bg-canvas lg:hidden">
      <ul className="mx-auto flex max-w-md items-stretch">
        {items.map(({ to, icon: Icon, label, end, badge }) => (
          <li key={label} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn('flex flex-col items-center gap-0.5 py-2 text-xs', isActive ? 'text-brand' : 'text-ink-muted')
              }
            >
              <span className="relative">
                <Icon size={20} />
                {badge > 0 && (
                  <span className="absolute -end-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-highlight px-1 text-[10px] font-bold text-highlight-ink">
                    {badge}
                  </span>
                )}
              </span>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
