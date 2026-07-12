import { Link, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShieldCheck } from 'lucide-react'

// Minimal checkout chrome — brand bar with just the wordmark and a "Secure checkout"
// reassurance. No nav, search or footer: nothing to distract from completing the order.
export default function CheckoutLayout() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <header className="bg-brand text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            {t('brand')}
            <span className="text-highlight">.</span>
          </Link>
          <span className="flex items-center gap-2 text-sm">
            <ShieldCheck size={18} />
            {t('checkout.secure')}
          </span>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
