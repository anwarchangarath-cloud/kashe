import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'

// Editorial banner — --brand-dark panel, Fraunces headline, outlined light CTA.
export default function EditBanner() {
  const { t } = useTranslation()
  return (
    <section className="grid overflow-hidden rounded-lg bg-brand-dark text-white md:grid-cols-2">
      <div className="p-8 md:p-12">
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-highlight">
          {t('edit.eyebrow')}
        </p>
        <h2 className="font-serif text-3xl font-medium leading-tight md:text-4xl">
          {t('edit.title')}
        </h2>
        <p className="mt-5 max-w-md text-sm text-white/75">{t('edit.subtitle')}</p>
        <Link
          to="/edit"
          className="mt-8 inline-flex items-center gap-2 rounded border border-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
        >
          {t('edit.cta')}
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Lifestyle image placeholder. */}
      <div className="hidden items-center justify-center bg-white/5 p-12 text-sm text-white/40 md:flex">
        {t('edit.imageAlt')}
      </div>
    </section>
  )
}
