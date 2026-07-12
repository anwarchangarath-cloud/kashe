import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from '../components/ui/Button.jsx'

// Placeholder for routes not built this pass, so nav/footer links never dead-end.
export default function StubPage() {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <p className="font-serif text-3xl font-medium text-ink">Coming soon</p>
      <p className="text-sm text-ink-muted">
        <code className="rounded bg-surface px-2 py-1">{pathname}</code> is not part of
        this build yet.
      </p>
      <Link to="/">
        <Button variant="secondary">{t('brand')} home</Button>
      </Link>
    </div>
  )
}
