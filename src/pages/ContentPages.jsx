import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Card from '../components/ui/Card.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import OrderTracker, { buildTrackSteps } from '../components/account/OrderTracker.jsx'

// Shared shell for the informational/marketing pages so nav + footer links never dead-end.
function ContentShell({ title, sub, children, wide }) {
  return (
    <div className={`mx-auto px-4 py-12 ${wide ? 'max-w-4xl' : 'max-w-3xl'}`}>
      <h1 className="font-serif text-4xl font-medium text-ink">{title}</h1>
      {sub && <p className="mt-3 text-ink-muted">{sub}</p>}
      <div className="mt-8">{children}</div>
    </div>
  )
}

export function TrackOrder() {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [result, setResult] = useState(null)

  function lookup(e) {
    e.preventDefault()
    const id = value.trim()
    if (!id) return
    // Demo: any number resolves to an in-transit order (stage 3 of 5).
    setResult({ id: id.toUpperCase().replace(/^#/, ''), stage: 3 })
  }

  return (
    <ContentShell title={t('content.trackTitle')} sub={t('content.trackSub')}>
      <Card className="p-6">
        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={lookup}>
          <div className="flex-1">
            <Input
              placeholder={t('content.trackPlaceholder')}
              aria-label={t('content.trackTitle')}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <Button variant="primary" size="lg">{t('content.trackCta')}</Button>
        </form>
      </Card>

      {result && (
        <Card className="mt-6 p-6">
          <div className="mb-6 flex items-center justify-between">
            <p className="font-bold text-brand">#{result.id}</p>
            <span className="rounded-full bg-brand-tint px-2.5 py-1 text-xs font-bold text-brand">
              {t('account.outForDelivery')}
            </span>
          </div>
          <OrderTracker steps={buildTrackSteps(t, result.stage)} />
          <p className="mt-5 text-sm font-bold text-success">{t('account.arrivingWindow')}</p>
        </Card>
      )}
    </ContentShell>
  )
}

export function Faq() {
  const { t } = useTranslation()
  const items = t('content.faq', { returnObjects: true })
  const [open, setOpen] = useState(0)
  return (
    <ContentShell title={t('content.faqTitle')}>
      <div className="space-y-3">
        {(Array.isArray(items) ? items : []).map((item, i) => (
          <Card key={i} className="p-0">
            <button
              className="flex w-full items-center justify-between gap-4 p-5 text-start"
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
            >
              <span className="font-bold text-ink">{item.q}</span>
              <span className="text-ink-muted">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <p className="px-5 pb-5 text-sm text-ink-muted">{item.a}</p>}
          </Card>
        ))}
      </div>
    </ContentShell>
  )
}

// Generic info page for Returns / About / Careers / Sell / Contact.
function InfoPage({ titleKey, bodyKey, cta }) {
  const { t } = useTranslation()
  return (
    <ContentShell title={t(titleKey)}>
      <p className="text-ink">{t(bodyKey)}</p>
      {cta && (
        <div className="mt-6">
          <Button variant="primary">{t(cta)}</Button>
        </div>
      )}
      <Link to="/" className="mt-8 inline-block text-sm text-brand hover:underline">
        ← {t('content.backHome')}
      </Link>
    </ContentShell>
  )
}

export const Returns = () => <InfoPage titleKey="content.returnsTitle" bodyKey="content.returnsBody" />
export const About = () => <InfoPage titleKey="content.aboutTitle" bodyKey="content.aboutBody" />
export const Careers = () => <InfoPage titleKey="content.careersTitle" bodyKey="content.careersBody" />
export const Sell = () => <InfoPage titleKey="content.sellTitle" bodyKey="content.sellBody" cta="content.notifyCta" />
export const Contact = () => <InfoPage titleKey="content.contactTitle" bodyKey="content.contactBody" />
