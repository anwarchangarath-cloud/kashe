import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/cn.js'
import { AdminPage, Panel } from '../../components/admin/AdminUi.jsx'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { useProducts } from '../../store/ProductsContext.jsx'
import { useToast } from '../../store/ToastContext.jsx'

const rowTint = { out: 'bg-price-tint', low: 'bg-highlight-tint', ok: '' }
const flagTone = { out: 'text-price', low: 'text-highlight-ink', ok: 'text-success' }
const order = { out: 0, low: 1, ok: 2 }

export default function AdminInventory() {
  const { t } = useTranslation()
  const { products: inventory, restock } = useProducts()
  const toast = useToast()
  const [target, setTarget] = useState(null) // product being restocked
  const [qty, setQty] = useState('25')

  const rows = [...inventory].sort((a, b) => order[a.level] - order[b.level])

  function flag(level) {
    if (level === 'out') return t('admin.inventory.flagOut')
    if (level === 'low') return t('admin.inventory.flagLow')
    return t('admin.inventory.healthy')
  }

  function confirmRestock() {
    const n = Number(qty)
    if (!target || !n) return
    restock(target.id, n)
    toast.show(t('admin.toast.restocked', { name: target.name, qty: n }))
    setTarget(null)
    setQty('25')
  }

  return (
    <AdminPage title={t('admin.inventory.title')} subtitle={t('admin.inventory.subtitle')}>
      <Panel className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-bold uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3 text-start">{t('admin.products.colProduct')}</th>
              <th className="px-4 py-3 text-start">{t('admin.products.colCategory')}</th>
              <th className="px-4 py-3 text-end">{t('admin.products.colStock')}</th>
              <th className="px-4 py-3 text-start">{t('admin.orders.colStatus')}</th>
              <th className="px-4 py-3 text-end"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className={cn('border-b border-border last:border-0', rowTint[p.level])}>
                <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
                <td className="px-4 py-3 text-ink-muted">{p.category}</td>
                <td className="px-4 py-3 text-end text-ink">{t('admin.inventory.units', { count: p.stock })}</td>
                <td className={cn('px-4 py-3 text-xs font-bold', flagTone[p.level])}>{flag(p.level)}</td>
                <td className="px-4 py-3 text-end">
                  <Button variant="secondary" size="sm" onClick={() => { setTarget(p); setQty('25') }}>
                    {t('admin.inventory.restock')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Modal
        open={!!target}
        onClose={() => setTarget(null)}
        title={t('admin.inventory.restock')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setTarget(null)}>{t('admin.modal.cancel')}</Button>
            <Button variant="primary" onClick={confirmRestock}>{t('admin.inventory.restock')}</Button>
          </>
        }
      >
        {target && (
          <div className="space-y-4">
            <p className="text-sm text-ink">
              {target.name} — <span className="text-ink-muted">{t('admin.inventory.units', { count: target.stock })}</span>
            </p>
            <Input
              label={t('admin.inventory.addUnits')}
              type="number"
              inputMode="numeric"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              autoFocus
            />
          </div>
        )}
      </Modal>
    </AdminPage>
  )
}
