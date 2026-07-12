import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, Heart, ShoppingCart, ChevronDown } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { useCart } from '../../store/CartContext.jsx'
import { useAuth } from '../../store/AuthContext.jsx'
import { useWishlist } from '../../store/WishlistContext.jsx'

// Primary header — --brand blue. Logo · search · account actions.
export default function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { count: cartCount } = useCart()
  const { count: favCount } = useWishlist()
  const { user, isAuthed, isAdmin, signOut } = useAuth()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  function onSearch(e) {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  return (
    <header className="bg-brand text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link to="/" className="text-2xl font-bold tracking-tight text-white">
          {t('brand')}
          <span className="text-highlight">.</span>
        </Link>

        {/* Search — the header's single primary action lives here (orange). */}
        <form
          role="search"
          className="order-3 w-full md:order-none md:w-auto md:flex-1"
          onSubmit={onSearch}
        >
          <div className="flex items-stretch overflow-hidden rounded bg-canvas">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('header.searchPlaceholder')}
              aria-label={t('header.search')}
              className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
            />
            <Button type="submit" variant="primary" size="md" className="m-1 rounded-sm">
              <Search size={16} className="md:hidden" />
              <span className="hidden md:inline">{t('header.search')}</span>
            </Button>
          </div>
        </form>

        <nav className="ms-auto flex items-center gap-5 text-sm md:ms-0">
          {isAuthed ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-1.5 hover:text-highlight"
              >
                {t('header.greeting', { name: user.name })}
                <ChevronDown size={14} />
              </button>
              {menuOpen && (
                <div
                  className="absolute end-0 top-full z-40 mt-2 w-44 overflow-hidden rounded-lg bg-canvas py-1 text-ink shadow-lg"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <Link to="/account" className="block px-4 py-2 text-sm hover:bg-surface" onClick={() => setMenuOpen(false)}>
                    {t('account.nav.overview')}
                  </Link>
                  <Link to="/account" className="block px-4 py-2 text-sm hover:bg-surface" onClick={() => setMenuOpen(false)}>
                    {t('account.nav.myOrders')}
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-sm font-semibold text-brand hover:bg-surface" onClick={() => setMenuOpen(false)}>
                      {t('header.adminPanel')}
                    </Link>
                  )}
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); navigate('/') }}
                    className="block w-full px-4 py-2 text-start text-sm text-ink-muted hover:bg-surface"
                  >
                    {t('account.nav.signOut')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:text-highlight">
              {t('header.signIn')}
            </Link>
          )}

          <Link to="/favourites" className="relative hidden items-center gap-1.5 hover:text-highlight sm:flex">
            <Heart size={16} />
            {t('header.favourites')}
            {favCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-highlight px-1 text-xs font-bold text-highlight-ink">
                {favCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="flex items-center gap-1.5 hover:text-highlight">
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">{t('header.cart')}</span>
            {cartCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-highlight px-1 text-xs font-bold text-highlight-ink">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
