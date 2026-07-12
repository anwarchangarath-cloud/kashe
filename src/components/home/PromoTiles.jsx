import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'

/*
 * Three promo tiles. Each carries its identity through an approved *tint* surface
 * (brand / action / success tint) — tints are surface tokens. Headings stay --ink and
 * the "Shop now" links are --brand, because the saturated --action (buttons only) and
 * --success (stock/delivery only) may not be used as decorative text (CLAUDE.md).
 */
const tiles = [
  { key: 'electronics', to: '/category/electronics', bg: 'bg-brand-tint' },
  { key: 'homeLiving', to: '/category/home', bg: 'bg-action-tint' },
  { key: 'beauty', to: '/category/beauty', bg: 'bg-success-tint' },
]

export default function PromoTiles() {
  const { t } = useTranslation()
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {tiles.map(({ key, to, bg }) => (
        <div key={key} className={`rounded-lg p-6 ${bg}`}>
          <h3 className="font-serif text-xl font-medium text-ink">
            {t(`promo.${key}.title`)}
          </h3>
          <p className="mt-1 text-sm text-ink-muted">{t(`promo.${key}.subtitle`)}</p>
          <Link
            to={to}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-brand hover:underline"
          >
            {t('promo.shopNow')}
            <ArrowRight size={14} />
          </Link>
        </div>
      ))}
    </section>
  )
}
