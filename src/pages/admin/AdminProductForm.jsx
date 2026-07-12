import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ImagePlus, X } from 'lucide-react'
import { cn } from '../../lib/cn.js'
import { Panel } from '../../components/admin/AdminUi.jsx'
import Button from '../../components/ui/Button.jsx'
import { useProducts } from '../../store/ProductsContext.jsx'
import { useToast } from '../../store/ToastContext.jsx'

const CATEGORIES = ['Home & Kitchen', 'Electronics', 'Fashion', 'Beauty', 'Grocery', 'Sports', 'Kids & Toys', 'Kitchen', 'Wellness', 'Tech', 'Cookware', 'Appliances']
const BRANDS = ['KASH Essentials', 'Vendor A', 'Vendor B']
const SELLERS = ['Vendor A', 'Vendor B', 'KASH Essentials']

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-muted">{label}</span>
      {children}
    </label>
  )
}

const inputCls = 'w-full rounded-lg border border-border bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'

function InlineField({ label, value, onChange, placeholder, prefix, suffix, valueClass, inputMode, wide }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-canvas px-4 py-2.5 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
      <span className="text-sm text-ink-muted">{label}</span>
      <div className="ms-auto flex items-center gap-1.5">
        {prefix && <span className="text-sm text-ink-muted">{prefix}</span>}
        <input inputMode={inputMode} value={value} onChange={onChange} placeholder={placeholder} className={cn('bg-transparent text-end text-sm font-medium text-ink placeholder:text-ink-muted focus:outline-none', wide ? 'w-32' : 'w-24', valueClass)} />
        {suffix && <span className="text-sm text-ink-muted">{suffix}</span>}
      </div>
    </div>
  )
}

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={onChange} className={inputCls}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

export default function AdminProductForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const { products, addProduct, updateProduct } = useProducts()
  const toast = useToast()
  const fileRef = useRef(null)

  const editing = products.find((p) => p.id === id)

  const [f, setF] = useState(() =>
    editing
      ? {
          name: editing.name, description: editing.description ?? '', category: editing.category, brand: editing.vendor,
          cost: editing.cost ?? '', sale: editing.price ?? '', was: editing.wasPrice ?? '', sku: editing.sku ?? '',
          stock: editing.stock ?? '', lowAt: editing.lowAt ?? '20', seller: editing.seller ?? 'Vendor A',
          commission: editing.commission ?? '12', image: editing.image ?? '',
        }
      : { name: '', description: '', category: 'Home & Kitchen', brand: 'KASH Essentials', cost: '', sale: '', was: '', sku: '', stock: '', lowAt: '20', seller: 'Vendor A', commission: '12', image: '' },
  )
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  const cost = Number(f.cost), sale = Number(f.sale), was = Number(f.was)
  const margin = cost && sale ? (((sale - cost) / sale) * 100).toFixed(1) : null
  const discount = was && sale && was > sale ? Math.round((1 - sale / was) * 100) : null

  function onFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setF((s) => ({ ...s, image: reader.result }))
    reader.readAsDataURL(file)
  }

  function save(published) {
    if (!f.name.trim()) { toast.show(t('admin.form.nameRequired')); return }
    const payload = {
      name: f.name, description: f.description, category: f.category, vendor: f.brand, seller: f.seller,
      commission: f.commission, cost: f.cost, price: f.sale, wasPrice: f.was, sku: f.sku, stock: f.stock,
      lowAt: f.lowAt, image: f.image || undefined, published,
    }
    if (editing) {
      updateProduct(editing.id, { ...payload, wasPrice: f.was ? Number(f.was) : null, price: Number(f.sale) || 0 })
      toast.show(t('admin.form.savedToast', { name: f.name }))
    } else {
      addProduct(payload)
      toast.show(published ? t('admin.form.publishedToast', { name: f.name }) : t('admin.form.draftToast'))
    }
    navigate('/admin/products')
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-medium text-ink">{editing ? t('admin.form.editTitle') : t('admin.form.title')}</h1>
          <p className="mt-1 text-sm text-ink-muted">{editing ? (editing.published === false ? t('admin.form.draftLabel') : t('admin.form.publishedLabel')) : t('admin.form.draftLabel')}</p>
        </div>
        <div className="flex gap-3">
          {!editing && <Button variant="secondary" size="md" onClick={() => save(false)}>{t('admin.form.saveDraft')}</Button>}
          <Button variant="primary" size="md" onClick={() => save(true)}>{editing ? t('admin.form.saveChanges') : t('admin.form.publish')}</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel className="p-6">
            <h2 className="mb-4 font-serif text-lg font-medium text-ink">{t('admin.form.details')}</h2>
            <div className="space-y-4">
              <input value={f.name} onChange={set('name')} placeholder={t('admin.form.namePh')} className={inputCls} autoFocus />
              <textarea value={f.description} onChange={set('description')} placeholder={t('admin.form.descPh')} rows={3} className={cn(inputCls, 'resize-none')} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t('admin.form.category')}><Select value={f.category} onChange={set('category')} options={CATEGORIES} /></Field>
                <Field label={t('admin.form.brand')}><Select value={f.brand} onChange={set('brand')} options={BRANDS} /></Field>
              </div>
            </div>
          </Panel>

          <Panel className="p-6">
            <h2 className="mb-4 font-serif text-lg font-medium text-ink">{t('admin.form.pricing')}</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <InlineField label={t('admin.form.cost')} prefix="AED" value={f.cost} onChange={set('cost')} placeholder="0.00" inputMode="decimal" />
              <InlineField label={t('admin.form.sale')} prefix="AED" value={f.sale} onChange={set('sale')} placeholder="0.00" inputMode="decimal" valueClass="text-price font-bold" />
              <InlineField label={t('admin.form.was')} prefix="AED" value={f.was} onChange={set('was')} placeholder="0.00" inputMode="decimal" />
            </div>
            <div className="mt-3 rounded-lg bg-success-tint px-4 py-3 text-sm font-bold text-success">
              {margin != null && discount != null
                ? t('admin.form.marginInfo', { margin, discount })
                : <span className="font-medium text-ink-muted">{t('admin.form.marginNa')}</span>}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel className="p-6">
            <h2 className="mb-4 font-serif text-lg font-medium text-ink">{t('admin.form.images')}</h2>
            <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
            {f.image ? (
              <div className="relative">
                <img src={f.image} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" />
                <button type="button" onClick={() => setF((s) => ({ ...s, image: '' }))} className="absolute end-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-brand-dark/70 text-white" aria-label="Remove image">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} className="grid aspect-[4/3] w-full place-items-center rounded-lg border-2 border-dashed border-border text-ink-muted hover:border-brand hover:text-brand">
                <span className="flex flex-col items-center gap-2 text-xs"><ImagePlus size={22} />{t('admin.form.uploadHint')}</span>
              </button>
            )}
            <input value={f.image?.startsWith('data:') ? '' : f.image} onChange={set('image')} placeholder={t('admin.form.imageUrl')} className={cn(inputCls, 'mt-3')} />
          </Panel>

          <Panel className="p-6">
            <h2 className="mb-4 font-serif text-lg font-medium text-ink">{t('admin.form.inventory')}</h2>
            <div className="space-y-3">
              <InlineField label={t('admin.form.sku')} value={f.sku} onChange={set('sku')} placeholder="KS-OS-320" valueClass="font-mono" wide />
              <InlineField label={t('admin.form.stock')} value={f.stock} onChange={set('stock')} placeholder="0" inputMode="numeric" valueClass="text-success font-bold" />
              <InlineField label={t('admin.form.lowAt')} value={f.lowAt} onChange={set('lowAt')} placeholder="20" inputMode="numeric" />
            </div>
          </Panel>

          <Panel className="p-6">
            <h2 className="mb-4 font-serif text-lg font-medium text-ink">{t('admin.form.vendorSection')}</h2>
            <div className="space-y-3">
              <Select value={f.seller} onChange={set('seller')} options={SELLERS} />
              <InlineField label={t('admin.form.commission')} value={f.commission} onChange={set('commission')} placeholder="12" inputMode="numeric" suffix="%" />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
