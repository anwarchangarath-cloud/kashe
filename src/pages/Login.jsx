import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Zap, Package, Heart, Gift } from 'lucide-react'
import { cn } from '../lib/cn.js'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../store/AuthContext.jsx'

function Benefit({ icon: Icon, children }) {
  return (
    <li className="flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/10 text-highlight">
        <Icon size={18} />
      </span>
      <span className="text-sm text-white/90">{children}</span>
    </li>
  )
}

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { signInWithEmail, signUp } = useAuth()

  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const redirectTo = location.state?.from ?? '/account'

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const res = mode === 'signin'
      ? await signInWithEmail(email, password)
      : await signUp({ name, email, password })
    setBusy(false)
    if (!res.ok) {
      setError(t(res.errorKey))
      return
    }
    navigate(res.account.role === 'customer' ? redirectTo : '/admin', { replace: true })
  }

  return (
    <div className="grid flex-1 md:grid-cols-2">
      {/* Brand panel */}
      <div className="relative overflow-hidden bg-brand px-6 py-12 text-white md:px-12 md:py-16">
        <div className="absolute -top-16 end-0 h-72 w-72 rounded-full bg-white/5" aria-hidden="true" />
        <div className="absolute -bottom-24 -start-16 h-80 w-80 rounded-full bg-white/5" aria-hidden="true" />
        <div className="relative max-w-md">
          <p className="text-sm font-bold uppercase tracking-widest text-highlight">{t('login.welcomeBack')}</p>
          <h1 className="mt-4 font-serif text-4xl font-medium leading-tight md:text-5xl">{t('login.heroTitle')}</h1>
          <p className="mt-5 text-white/80">{t('login.heroSub')}</p>
          <ul className="mt-10 space-y-4">
            <Benefit icon={Zap}>{t('login.benefitOneTap')}</Benefit>
            <Benefit icon={Package}>{t('login.benefitTracking')}</Benefit>
            <Benefit icon={Heart}>{t('login.benefitWishlist')}</Benefit>
            <Benefit icon={Gift}>{t('login.benefitDeals')}</Benefit>
          </ul>
          <p className="mt-16 text-sm text-white/50">{t('login.footerTag')}</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-12 md:px-12">
        <div className="w-full max-w-md">
          <h2 className="font-serif text-3xl font-medium text-ink">{t('login.title')}</h2>
          <p className="mt-3 text-sm text-ink-muted">{t('login.subtitleEmail')}</p>

          {/* Sign in / Create account toggle */}
          <div className="mt-6 flex rounded-lg bg-surface p-1">
            {[
              { id: 'signin', label: t('login.signInTab') },
              { id: 'signup', label: t('login.createTab') },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => { setMode(opt.id); setError('') }}
                className={cn('flex-1 rounded-md py-2.5 text-sm font-bold transition-colors', mode === opt.id ? 'bg-canvas text-ink shadow-sm' : 'text-ink-muted')}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            {mode === 'signup' && (
              <Input label={t('login.nameLabel')} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            )}
            <Input label={t('login.tabEmail')} type="email" placeholder="name@email.com" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} autoComplete="email" />
            <Input label={t('login.passwordLabel')} type="password" placeholder="••••••••" value={password} onChange={(e) => { setPassword(e.target.value); setError('') }} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} />
            {error && <p className="text-sm font-medium text-price">{error}</p>}
            <Button type="submit" variant="primary" size="lg" fullWidth className="shadow-lg" disabled={busy}>
              {busy ? '…' : mode === 'signin' ? t('login.signInCta') : t('login.createCta')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-muted">
            {t('login.termsLead')}{' '}
            <Link to="/terms" className="font-bold text-brand hover:underline">{t('login.terms')}</Link>{' '}
            {t('login.and')}{' '}
            <Link to="/privacy" className="font-bold text-brand hover:underline">{t('login.privacy')}</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
