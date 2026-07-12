import { useTranslation } from 'react-i18next'
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react'
import Card from '../ui/Card.jsx'

// Reassurance strip — four service promises with --brand icons on a white card.
export default function ServiceFeatures() {
  const { t } = useTranslation()
  const items = [
    { key: 'delivery', icon: Truck },
    { key: 'checkout', icon: ShieldCheck },
    { key: 'returns', icon: RotateCcw },
    { key: 'support', icon: Headphones },
  ]
  return (
    <Card className="p-6">
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ key, icon: Icon }) => (
          <li key={key} className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-tint text-brand">
              <Icon size={20} strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">{t(`features.${key}.title`)}</p>
              <p className="text-xs text-ink-muted">{t(`features.${key}.subtitle`)}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
