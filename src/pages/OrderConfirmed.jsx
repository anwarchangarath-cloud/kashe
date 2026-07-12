import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import { formatAed } from '../lib/format.js'

export default function OrderConfirmed() {
  const { t } = useTranslation()
  const { state } = useLocation()
  const orderId = state?.orderId ?? 'SQ-10493'
  const total = state?.total

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <span className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-success-tint text-success">
        <Check size={40} />
      </span>
      <h1 className="font-serif text-3xl font-medium text-ink">{t('confirmed.title')}</h1>
      <p className="mt-2 text-sm text-ink-muted">{t('confirmed.sub')}</p>

      <Card className="mt-8 p-6 text-start">
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-muted">{t('confirmed.orderNumber')}</span>
          <span className="font-bold text-brand">#{orderId}</span>
        </div>
        {total != null && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-ink-muted">{t('checkout.total')}</span>
            <span className="font-bold text-price">AED {formatAed(total)}</span>
          </div>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-ink-muted">{t('confirmed.delivery')}</span>
          <span className="font-bold text-success">{t('checkout.arrives', { date: 'Sunday, 12 July' })}</span>
        </div>
      </Card>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/account">
          <Button variant="primary" size="lg">{t('confirmed.track')}</Button>
        </Link>
        <Link to="/">
          <Button variant="secondary" size="lg">{t('cart.continueShopping')}</Button>
        </Link>
      </div>
    </div>
  )
}
