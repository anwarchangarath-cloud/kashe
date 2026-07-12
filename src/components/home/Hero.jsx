import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import Button from '../ui/Button.jsx'

// Hero — --brand rounded panel. Fraunces headline, one primary (orange) CTA + ghost link.
export default function Hero() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <section className="bg-brand text-white rounded-lg overflow-hidden">
      <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-highlight">
            {t('hero.eyebrow')}
          </p>
          <h1 className="font-serif text-4xl font-medium leading-tight md:text-5xl">
            {t('hero.titleLead')}{' '}
            <span className="text-highlight">{t('hero.titleAmount')}</span>{' '}
            {t('hero.titleTrail')}
          </h1>
          <p className="mt-5 max-w-md text-sm text-white/80 md:text-base">
            {t('hero.subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Button variant="primary" size="lg" className="shadow-lg" onClick={() => navigate('/deals')}>
              {t('hero.cta')}
              <ArrowRight size={18} />
            </Button>
            <Link
              to="/new-arrivals"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white underline underline-offset-4 hover:text-highlight"
            >
              {t('hero.secondary')}
            </Link>
          </div>
        </div>

        {/* Hero image placeholder — real art drops in later. */}
        <div className="hidden md:block">
          <div className="ms-auto grid aspect-square max-w-sm place-items-center rounded-lg bg-white/10 text-sm text-white/50">
            {t('hero.imageAlt')}
          </div>
        </div>
      </div>
    </section>
  )
}
