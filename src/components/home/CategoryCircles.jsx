import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/cn.js'
import { categoryCircles } from '../../data/categories.js'

// Category shortcuts — circular --brand icons. The active one gets a soft --action-tint
// fill (a surface tint, not the saturated orange, which stays buttons-only).
export default function CategoryCircles() {
  const { t } = useTranslation()
  return (
    <section aria-label={t('categories.title')} className="py-2">
      <ul className="flex justify-between gap-3 overflow-x-auto">
        {categoryCircles.map(({ id, i18nKey, icon: Icon, to, active }) => (
          <li key={id} className="shrink-0">
            <Link to={to} className="group flex w-16 flex-col items-center gap-2 sm:w-20">
              <span
                className={cn(
                  'grid h-16 w-16 place-items-center rounded-full border transition-colors sm:h-18 sm:w-18',
                  active
                    ? 'border-action-tint bg-action-tint'
                    : 'border-border bg-canvas group-hover:border-brand',
                )}
              >
                <Icon size={24} className="text-brand" strokeWidth={1.75} />
              </span>
              <span
                className={cn(
                  'text-center text-xs',
                  active ? 'font-semibold text-ink' : 'text-ink-muted',
                )}
              >
                {t(`categories.${i18nKey}`)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
