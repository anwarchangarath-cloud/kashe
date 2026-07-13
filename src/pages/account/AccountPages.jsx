import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, Undo2, Copy, CreditCard } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import Modal from '../../components/ui/Modal.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { formatAed } from '../../lib/format.js'
import { useToast } from '../../store/ToastContext.jsx'
import { useAuth } from '../../store/AuthContext.jsx'
import { useOrders } from '../../store/OrdersContext.jsx'
import { useAddresses } from '../../store/AddressesContext.jsx'
import { cards as seedCards, coupons } from '../../data/account.js'

function PageTitle({ title, sub, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-serif text-2xl font-medium text-ink">{title}</h1>
        {sub && <p className="mt-1 text-sm text-ink-muted">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

export function AccountOrders() {
  const { t } = useTranslation()
  const { myOrders: orders } = useOrders()
  return (
    <>
      <PageTitle title={t('account.pages.ordersTitle')} sub={t('account.pages.ordersSub', { count: orders.length })} />
      <Card className="divide-y divide-border">
        {orders.map((o) => (
          <Link key={o.id} to={`/account/orders/${o.id}`} className="flex items-center gap-4 p-4 hover:bg-surface">
            <div className="h-14 w-14 shrink-0 rounded-lg bg-surface" />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-brand">#{o.id}</p>
              <p className="text-sm text-ink-muted">{o.date} · {t('account.itemCount', { count: o.items })}</p>
            </div>
            <StatusBadge status={o.status}>{t(`admin.status.${o.status}`)}</StatusBadge>
            <span className="ms-2 font-bold text-ink">AED {formatAed(o.total)}</span>
          </Link>
        ))}
      </Card>
    </>
  )
}

export function AccountAddresses() {
  const { t } = useTranslation()
  const toast = useToast()
  const { addresses: list, addAddress, removeAddress, setDefault } = useAddresses()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ label: '', name: '', phone: '', line: '' })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  function add(e) {
    e.preventDefault()
    if (!form.line.trim()) return
    addAddress(form)
    toast.show(t('account.pages.addressAdded'))
    setForm({ label: '', name: '', phone: '', line: '' })
    setOpen(false)
  }
  function makeDefault(id) {
    setDefault(id)
    toast.show(t('account.pages.defaultSet'))
  }
  function remove(id) {
    removeAddress(id)
    toast.show(t('account.pages.addressRemoved'))
  }

  return (
    <>
      <PageTitle
        title={t('account.pages.addressesTitle')}
        action={<Button variant="primary" size="md" onClick={() => setOpen(true)}><Plus size={16} /> {t('account.pages.addAddress')}</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((a) => (
          <Card key={a.id} className="p-5">
            <p className="flex items-center gap-2 font-bold text-ink">
              {a.label}
              {a.isDefault && <span className="rounded bg-brand-tint px-2 py-0.5 text-xs font-bold text-brand">{t('account.default')}</span>}
            </p>
            <p className="mt-2 text-sm text-ink-muted">{a.name} · {a.phone}</p>
            <p className="text-sm text-ink-muted">{a.line}</p>
            <div className="mt-4 flex gap-4 text-sm">
              {!a.isDefault && <button onClick={() => makeDefault(a.id)} className="font-semibold text-brand hover:underline">{t('account.pages.makeDefault')}</button>}
              <button onClick={() => remove(a.id)} className="inline-flex items-center gap-1 text-price hover:underline">
                <Trash2 size={14} /> {t('account.pages.remove')}
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t('account.pages.addAddress')}
        footer={<>
          <Button variant="ghost" onClick={() => setOpen(false)}>{t('admin.modal.cancel')}</Button>
          <Button variant="primary" onClick={add}>{t('account.pages.addAddress')}</Button>
        </>}
      >
        <form className="space-y-3" onSubmit={add}>
          <Input label={t('account.pages.label')} value={form.label} onChange={set('label')} autoFocus />
          <Input label={t('account.pages.name')} value={form.name} onChange={set('name')} />
          <Input label={t('account.pages.phone')} value={form.phone} onChange={set('phone')} />
          <Input label={t('account.pages.line')} value={form.line} onChange={set('line')} />
        </form>
      </Modal>
    </>
  )
}

export function AccountPayments() {
  const { t } = useTranslation()
  const toast = useToast()
  const [list, setList] = useState(seedCards)

  function addCard() {
    const brands = ['Visa', 'Mastercard']
    const last4 = String(Math.floor(1000 + Math.random() * 9000))
    setList((l) => [...l, { id: `c${Date.now()}`, brand: brands[l.length % 2], last4, exp: '05/29' }])
    toast.show(t('account.pages.cardAdded'))
  }
  function remove(id) {
    setList((l) => l.filter((c) => c.id !== id))
    toast.show(t('account.pages.cardRemoved'))
  }

  return (
    <>
      <PageTitle
        title={t('account.pages.paymentsTitle')}
        action={<Button variant="primary" size="md" onClick={addCard}><Plus size={16} /> {t('account.pages.addCard')}</Button>}
      />
      <div className="space-y-3">
        {list.map((c) => (
          <Card key={c.id} className="flex items-center gap-4 p-4">
            <span className="grid h-10 w-14 place-items-center rounded bg-brand-tint text-brand"><CreditCard size={18} /></span>
            <div className="flex-1">
              <p className="font-bold text-ink">{c.brand} ···· {c.last4}</p>
              <p className="text-xs text-ink-muted">{t('account.pages.expires', { exp: c.exp })}</p>
            </div>
            <button onClick={() => remove(c.id)} className="text-ink-muted hover:text-price" aria-label={t('account.pages.remove')}>
              <Trash2 size={18} />
            </button>
          </Card>
        ))}
      </div>
    </>
  )
}

export function AccountCoupons() {
  const { t } = useTranslation()
  const toast = useToast()

  function copy(code) {
    navigator.clipboard?.writeText(code).catch(() => {})
    toast.show(t('account.pages.copied'))
  }

  return (
    <>
      <PageTitle title={t('account.pages.couponsTitle')} />
      <div className="space-y-3">
        {coupons.map((c) => (
          <Card key={c.code} className="flex items-center gap-4 p-4">
            <span className="rounded bg-highlight-tint px-3 py-1.5 font-bold text-highlight-ink">{c.code}</span>
            <div className="flex-1">
              <p className="text-sm text-ink">{c.desc}</p>
              <p className="text-xs text-ink-muted">{t('account.exp', { date: c.exp })}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => copy(c.code)}>
              <Copy size={14} /> {t('account.pages.copy')}
            </Button>
          </Card>
        ))}
      </div>
    </>
  )
}

export function AccountReturns() {
  const { t } = useTranslation()
  return (
    <>
      <PageTitle title={t('account.pages.returnsTitle')} />
      <Card className="py-16 text-center">
        <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-surface text-ink-muted"><Undo2 size={26} /></span>
        <p className="font-serif text-xl font-medium text-ink">{t('account.pages.noReturns')}</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">{t('account.pages.noReturnsSub')}</p>
        <Link to="/account/orders" className="mt-5 inline-block"><Button variant="secondary">{t('account.pages.viewOrders')}</Button></Link>
      </Card>
    </>
  )
}

export function AccountSettings() {
  const { t, i18n } = useTranslation()
  const toast = useToast()
  const { user } = useAuth()
  const [name, setName] = useState(user?.fullName ?? 'Anwar C.')
  const [phone, setPhone] = useState(user?.phone ?? '+971 5X XXX XX42')
  const [email, setEmail] = useState(user?.email ?? 'demo@kash.ae')

  function save(e) {
    e.preventDefault()
    toast.show(t('account.pages.saved'))
  }

  return (
    <>
      <PageTitle
        title={t('account.pages.settingsTitle')}
        action={<Button variant="primary" size="md" onClick={save}>{t('account.pages.save')}</Button>}
      />
      <Card className="max-w-lg p-6">
        <form className="space-y-4" onSubmit={save}>
          <Input label={t('account.pages.name')} value={name} onChange={(e) => setName(e.target.value)} />
          <Input label={t('account.pages.phone')} value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label={t('account.pages.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-muted">{t('account.pages.language')}</span>
            <select
              value={i18n.resolvedLanguage}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="w-full rounded border border-border bg-canvas px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </label>
        </form>
      </Card>
    </>
  )
}
