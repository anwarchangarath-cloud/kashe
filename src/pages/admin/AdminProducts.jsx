import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { cn } from '../../lib/cn.js'
import { AdminPage, Panel } from '../../components/admin/AdminUi.jsx'
import Button from '../../components/ui/Button.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { formatAed } from '../../lib/format.js'
import { useProducts } from '../../store/ProductsContext.jsx'
import { useToast } from '../../store/ToastContext.jsx'

const stockTone = { ok: 'text-success', low: 'text-highlight-ink', out: 'text-price' }

export default function AdminProducts() {
  const { t } = useTranslation()
  const { products: inventory, removeProduct } = useProducts()
  const toast = useToast()
  const [toDelete, setToDelete] = useState(null)

  function confirmDelete() {
    removeProduct(toDelete.id)
    toast.show(t('admin.products.deleted', { name: toDelete.name }))
    setToDelete(null)
  }

  return (
    <AdminPage
      title={t('admin.products.title')}
      subtitle={t('admin.products.subtitle', { count: inventory.length })}
      action={
        <Link to="/admin/products/new">
          <Button variant="primary" size="md"><Plus size={16} /> {t('admin.products.add')}</Button>
        </Link>
      }
    >
      <Panel className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-bold uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3 text-start">{t('admin.products.colProduct')}</th>
              <th className="px-4 py-3 text-start">{t('admin.products.colCategory')}</th>
              <th className="px-4 py-3 text-start">{t('admin.products.colVendor')}</th>
              <th className="px-4 py-3 text-end">{t('admin.products.colPrice')}</th>
              <th className="px-4 py-3 text-end">{t('admin.products.colStock')}</th>
              <th className="px-4 py-3 text-end"></th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-ink">
                  {p.name}
                  {p.published === false && (
                    <span className="ms-2 rounded bg-surface px-1.5 py-0.5 text-xs font-bold uppercase text-ink-muted">{t('admin.products.draft')}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-ink-muted">{p.category}</td>
                <td className="px-4 py-3 text-ink-muted">{p.vendor}</td>
                <td className="px-4 py-3 text-end font-bold text-ink">AED {formatAed(p.price)}</td>
                <td className="px-4 py-3 text-end">
                  <span className="text-ink">{p.stock}</span>{' '}
                  <span className={cn('text-xs font-bold', stockTone[p.level])}>
                    · {p.level === 'out' ? t('admin.products.outOfStock') : p.level === 'low' ? t('admin.products.lowStock') : t('admin.products.inStock')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/admin/products/${p.id}/edit`} className="grid h-8 w-8 place-items-center rounded text-ink-muted hover:bg-brand-tint hover:text-brand" aria-label={t('admin.products.edit')}>
                      <Pencil size={16} />
                    </Link>
                    <button onClick={() => setToDelete(p)} className="grid h-8 w-8 place-items-center rounded text-ink-muted hover:bg-price-tint hover:text-price" aria-label={t('admin.products.delete')}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title={t('admin.products.deleteTitle')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setToDelete(null)}>{t('admin.modal.cancel')}</Button>
            <Button variant="danger" onClick={confirmDelete}>{t('admin.products.delete')}</Button>
          </>
        }
      >
        {toDelete && <p className="text-sm text-ink">{t('admin.products.deleteConfirm', { name: toDelete.name })}</p>}
      </Modal>
    </AdminPage>
  )
}
