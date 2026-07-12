import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutGrid, ShoppingBag, Package, Boxes, Settings, ArrowLeft, LogOut } from 'lucide-react'
import { cn } from '../lib/cn.js'
import { useAuth } from '../store/AuthContext.jsx'

const nav = [
  { to: '/admin', key: 'overview', icon: LayoutGrid, end: true },
  { to: '/admin/orders', key: 'orders', icon: ShoppingBag },
  { to: '/admin/products', key: 'products', icon: Package },
  { to: '/admin/inventory', key: 'inventory', icon: Boxes },
  { to: '/admin/settings', key: 'settings', icon: Settings },
]

/*
 * AdminLayout — the palette INVERTS here (CLAUDE.md). Colour means status, not sales:
 * sidebar is --brand-dark; the active nav item is --brand. Operators scan dozens of rows
 * a minute, so problems must be findable by peripheral vision.
 */
export default function AdminLayout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col bg-brand-dark text-white">
        <div className="px-5 py-5">
          <Link to="/admin" className="text-xl font-bold tracking-tight">
            {t('brand')}<span className="text-highlight">.</span>{' '}
            <span className="text-sm font-medium text-white/60">{t('admin.label')}</span>
          </Link>
        </div>

        <nav className="flex-1 px-3">
          {nav.map(({ to, key, icon: Icon, end }) => (
            <NavLink
              key={key}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-brand text-white' : 'text-white/70 hover:bg-white/10 hover:text-white',
                )
              }
            >
              <Icon size={18} />
              {t(`admin.nav.${key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white">
            <ArrowLeft size={18} className="rtl:rotate-180" />
            {t('admin.backToStore')}
          </Link>
          <button
            onClick={() => { signOut(); navigate('/') }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
            {t('account.nav.signOut')}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-canvas px-6 py-3">
          <span className="text-sm text-ink-muted">{t('admin.opsConsole')}</span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-ink">{user?.fullName ?? 'Store owner'}</span>
            <span className="rounded-full bg-brand-tint px-2 py-0.5 text-xs font-bold uppercase text-brand">
              {user?.role ?? 'owner'}
            </span>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
