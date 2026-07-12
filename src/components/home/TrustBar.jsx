import { useTranslation } from 'react-i18next'

// Trust strip under the hero. Neutral text; the metric leads are --ink for weight.
export default function TrustBar() {
  const { t } = useTranslation()
  const items = [
    { lead: t('trust.orders'), label: t('trust.ordersLabel') },
    { lead: t('trust.rating'), label: t('trust.ratingLabel') },
    { lead: t('trust.returns'), label: t('trust.returnsLabel') },
    { lead: t('trust.cod'), label: t('trust.codLabel') },
  ]
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-5 text-sm text-ink-muted">
      {items.map((it) => (
        <span key={it.label}>
          <span className="font-bold text-ink">{it.lead}</span> {it.label}
        </span>
      ))}
    </div>
  )
}
