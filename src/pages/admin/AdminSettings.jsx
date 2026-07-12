import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminPage, Panel } from '../../components/admin/AdminUi.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import { useAdmin } from '../../store/AdminContext.jsx'
import { useToast } from '../../store/ToastContext.jsx'

function Section({ title, children }) {
  return (
    <Panel className="p-6">
      <h2 className="mb-4 font-serif text-lg font-medium text-ink">{title}</h2>
      {children}
    </Panel>
  )
}

export default function AdminSettings() {
  const { t } = useTranslation()
  const { settings, staff, updateSettings } = useAdmin()
  const toast = useToast()

  const [storeName, setStoreName] = useState(settings.storeName)
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail)
  const [payments, setPayments] = useState(settings.payments)

  function save() {
    updateSettings({ storeName, supportEmail, payments })
    toast.show(t('admin.toast.settingsSaved'))
  }

  const togglePay = (k) => setPayments((p) => ({ ...p, [k]: !p[k] }))

  return (
    <AdminPage
      title={t('admin.settings.title')}
      subtitle={t('admin.settings.subtitle')}
      action={<Button variant="primary" size="md" onClick={save}>{t('admin.settings.save')}</Button>}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title={t('admin.settings.storeName')}>
          <div className="space-y-4">
            <Input label={t('admin.settings.storeName')} value={storeName} onChange={(e) => setStoreName(e.target.value)} />
            <Input label={t('admin.settings.supportEmail')} value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
          </div>
        </Section>

        <Section title={t('admin.settings.payments')}>
          <div className="space-y-3">
            {['card', 'applePay', 'cod'].map((k) => (
              <label key={k} className="flex items-center gap-3 text-sm">
                <input type="checkbox" checked={payments[k]} onChange={() => togglePay(k)} className="h-4 w-4 accent-brand" />
                <span className="text-ink">{t(`admin.settings.${k}`)}</span>
              </label>
            ))}
          </div>
        </Section>

        <Section title={t('admin.settings.staff')}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-bold uppercase tracking-wide text-ink-muted">
                <th className="py-2 text-start">{t('admin.settings.colName')}</th>
                <th className="py-2 text-start">{t('admin.settings.colRole')}</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.email} className="border-b border-border last:border-0">
                  <td className="py-3">
                    <p className="font-medium text-ink">{s.name}</p>
                    <p className="text-xs text-ink-muted">{s.email}</p>
                  </td>
                  <td className="py-3">
                    <span className="rounded-full bg-brand-tint px-2 py-0.5 text-xs font-bold uppercase text-brand">{s.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title={t('admin.nav.settings')}>
          <p className="text-sm text-ink-muted">{t('admin.settings.ownerNote')}</p>
        </Section>
      </div>
    </AdminPage>
  )
}
