import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu } from 'lucide-react'
import { cn } from '../../lib/cn.js'
import { navCategories } from '../../data/categories.js'

// Category nav row — --brand blue, sits directly under the header.
export default function Nav() {
  const { t } = useTranslation()
  return (
    <nav className="bg-brand text-white/90">
      <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-2.5 text-sm">
        <Link to="/category" className="flex shrink-0 items-center gap-2 font-medium text-white">
          <Menu size={18} />
          {t('nav.allCategories')}
        </Link>
        {navCategories.map((c) => (
          <Link
            key={c.i18nKey}
            to={c.to}
            className={cn(
              'shrink-0 whitespace-nowrap hover:text-white',
              c.highlight && 'font-semibold text-highlight hover:text-highlight',
            )}
          >
            {t(`nav.${c.i18nKey}`)}
          </Link>
        ))}
      </div>
    </nav>
  )
}
