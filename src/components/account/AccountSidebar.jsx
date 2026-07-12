import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutGrid, Package, Heart, MapPin, CreditCard, Ticket, Undo2, Settings, Globe, LogOut,
} from 'lucide-react'
import { cn } from '../../lib/cn.js'
import Card from '../ui/Card.jsx'
import { useAuth } from '../../store/AuthContext.jsx'

const items = [
  { to: '/account', key: 'overview', icon: LayoutGrid, end: true },
  { to: '/account/orders', key: 'myOrders', icon: Package, badge: '2 active' },
  { to: '/favourites', key: 'wishlist', icon: Heart },
  { to: '/account/addresses', key: 'addresses', icon: MapPin },
  { to: '/account/payments', key: 'paymentMethods', icon: CreditCard },
  { to: '/account/coupons', key: 'coupons', icon: Ticket },
  { to: '/account/returns', key: 'returns', icon: Undo2 },
  { to: '/account/settings', key: 'settings', icon: Settings },
]

export default function AccountSidebar() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const link = ({ isActive }) =>
    cn(
      'flex items-center gap-3 border-s-2 px-5 py-2.5 text-sm',
      isActive ? 'border-action bg-brand-tint font-bold text-brand' : 'border-transparent text-ink hover:bg-surface',
    )

  return (
    <Card className="h-fit">
      <div className="flex items-center gap-3 p-5">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-brand text-lg font-bold text-white">AC</span>
        <div>
          <p className="font-bold text-ink">{user?.fullName ?? 'Anwar C.'}</p>
          <p className="text-sm text-ink-muted">{user?.phone ?? '+971 5X ··· XX42'}</p>
        </div>
      </div>

      <nav className="pb-2">
        {items.map(({ to, key, icon: Icon, end, badge }) => (
          <NavLink key={key} to={to} end={end} className={link}>
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-brand' : 'text-ink-muted'} />
                <span className="flex-1 text-start">{t(`account.nav.${key}`)}</span>
                {badge && (
                  <span className="rounded-full bg-highlight-tint px-2 py-0.5 text-xs font-bold text-highlight-ink">{badge}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
        <button
          onClick={() => i18n.changeLanguage(i18n.resolvedLanguage === 'ar' ? 'en' : 'ar')}
          className="flex w-full items-center gap-3 border-s-2 border-transparent px-5 py-2.5 text-sm text-ink hover:bg-surface"
        >
          <Globe size={18} className="text-brand" />
          <span className="flex-1 text-start">{t('account.nav.arabic')}</span>
        </button>
        <div className="my-2 border-t border-border" />
        <button
          onClick={() => { signOut(); navigate('/') }}
          className="flex w-full items-center gap-3 border-s-2 border-transparent px-5 py-2.5 text-sm text-ink-muted hover:bg-surface"
        >
          <LogOut size={18} />
          <span className="flex-1 text-start">{t('account.nav.signOut')}</span>
        </button>
      </nav>
    </Card>
  )
}
