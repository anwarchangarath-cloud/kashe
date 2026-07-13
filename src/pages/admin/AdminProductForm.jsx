import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ImagePlus, X, Video, Star, Plus } from 'lucide-react'
import { cn } from '../../lib/cn.js'
import { Panel } from '../../components/admin/AdminUi.jsx'
import Button from '../../components/ui/Button.jsx'
import { useProducts } from '../../store/ProductsContext.jsx'
import { useToast } from '../../store/ToastContext.jsx'
import { apiUpload, apiGet } from '../../lib/api.js'

const BRANDS = ['KASH Essentials', 'Vendor A', 'Vendor B']
const SELLERS = ['Vendor A', 'Vendor B', 'KASH Essentials']
const inputCls =
  'w-full rounded-lg border border-border bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-muted">{label}</span>
      {children}
    </label>
  )
}

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

const emptyForm = {
  name: '', description: '', highlights: '', category: '', brand: 'KASH Essentials',
  cost: '', sale: '', was: '', sku: '', stock: '', lowAt: '20', seller: 'Vendor A',
  commission: '12', images: [], video: '',
}

export default function AdminProductForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const { products, addProduct, updateProduct } = useProducts()
  const toast = useToast()
  const imgRef = useRef(null)
  const vidRef = useRef(null)

  const editing = products.find((p) => p.id === id)
  const [categories, setCategories] = useState([])
  const [newCat, setNewCat] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [f, setF] = useState(() =>
    editing
      ? {
          name: editing.name, description: editing.description ?? '',
          highlights: (editing.highlights ?? []).join('\n'),
          category: editing.category, brand: editing.vendor,
          cost: editing.cost ?? '', sale: editing.price ?? '', was: editing.wasPrice ?? '', sku: editing.sku ?? '',
          stock: editing.stock ?? '', lowAt: editing.lowAt ?? '20', seller: editing.seller ?? 'Vendor A',
          commission: editing.commission ?? '12',
          images: editing.images?.length ? editing.images : editing.image ? [editing.image] : [],
          video: editing.video ?? '',
        }
      : { ...emptyForm, category: '' },
  )
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  useEffect(() => {
    apiGet('/api/categories').then((c) => {
      setCategories(c)
      setF((s) => (s.category ? s : { ...s, category: c[0]?.name || '' }))
    }).catch(() => {})
  }, [])

  const cost = Number(f.cost), sale = Number(f.sale), was = Number(f.was)
  const margin = cost && sale ? (((sale - cost) / sale) * 100).toFixed(1) : null
  const discount = was && sale && was > sale ? Math.round((1 - sale / was) * 100) : null

  async function onImages(e) {
    const files = [...(e.target.files || [])]
    if (!files.length) return
    setUploading(true)
    try {
      const urls = []
      for (const file of files) { const { url } = await apiUpload(file); urls.push(url) }
      setF((s) => ({ ...s, images: [...s.images, ...urls] }))
    } catch (err) { toast.show(err.message || 'Upload failed') }
    finally { setUploading(false); e.target.value = '' }
  }
  const removeImage = (i) => setF((s) => ({ ...s, images: s.images.filter((_, idx) => idx !== i) }))
  const makeCover = (i) => setF((s) => { const imgs = [...s.images]; const [x] = imgs.splice(i, 1); return { ...s, images: [x, ...imgs] } })

  async function onVideo(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try { const { url } = await apiUpload(file); setF((s) => ({ ...s, video: url })) }
    catch (err) { toast.show(err.message || 'Upload failed') }
    finally { setUploading(false); e.target.value = '' }
  }

  async function save(published) {
    if (!f.name.trim()) { toast.show(t('admin.form.nameRequired')); return }
    const payload = {
      name: f.name, description: f.description,
      highlights: f.highlights.split('\n').map((s) => s.trim()).filter(Boolean),
      images: f.images, video: f.video || null,
      category: f.category || 'General', vendor: f.brand, seller: f.seller, commission: f.commission,
      cost: f.cost, price: f.sale, wasPrice: f.was, sku: f.sku, stock: f.stock, lowAt: f.lowAt, published,
    }
    try {
      if (editing) {
        await updateProduct(editing.id, payload)
        toast.show(t('admin.form.savedToast', { name: f.name }))
      } else {
        await addProduct(payload)
        toast.show(published ? t('admin.form.publishedToast', { name: f.name }) : t('admin.form.draftToast'))
      }
      navigate('/admin/products')
    } catch (err) {
      toast.show(err.message || 'Save failed')
    }
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
          <Button variant="primary" size="md" onClick={() => save(true)} disabled={uploading}>{editing ? t('admin.form.saveChanges') : t('admin.form.publish')}</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel className="p-6">
            <h2 className="mb-4 font-serif text-lg font-medium text-ink">{t('admin.form.details')}</h2>
            <div className="space-y-4">
              <Field label={t('admin.form.namePh')}>
                <input value={f.name} onChange={set('name')} placeholder={t('admin.form.namePh')} className={inputCls} autoFocus />
              </Field>
              <Field label={t('admin.form.description')}>
                <textarea value={f.description} onChange={set('description')} placeholder={t('admin.form.descLong')} rows={5} className={cn(inputCls, 'resize-y')} />
              </Field>
              <Field label={t('admin.form.features')}>
                <textarea value={f.highlights} onChange={set('highlights')} placeholder={t('admin.form.featuresPh')} rows={4} className={cn(inputCls, 'resize-y')} />
                <span className="mt-1 block text-xs text-ink-muted">{t('admin.form.featuresHint')}</span>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Category — pick existing or add new */}
                <Field label={t('admin.form.category')}>
                  {newCat ? (
                    <input value={f.category} onChange={set('category')} placeholder={t('admin.form.newCategoryPh')} className={inputCls} autoFocus />
                  ) : (
                    <select value={f.category} onChange={set('category')} className={inputCls}>
                      {categories.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
                    </select>
                  )}
                  <button type="button" onClick={() => { setNewCat((v) => !v); if (!newCat) setF((s) => ({ ...s, category: '' })) }} className="mt-1 text-xs font-semibold text-brand hover:underline">
                    {newCat ? t('admin.form.pickExisting') : t('admin.form.addCategory')}
                  </button>
                </Field>
                <Field label={t('admin.form.brand')}>
                  <select value={f.brand} onChange={set('brand')} className={inputCls}>
                    {BRANDS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
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
              {margin != null && discount != null ? t('admin.form.marginInfo', { margin, discount }) : <span className="font-medium text-ink-muted">{t('admin.form.marginNa')}</span>}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          {/* Images (multiple) */}
          <Panel className="p-6">
            <h2 className="mb-4 font-serif text-lg font-medium text-ink">{t('admin.form.images')}</h2>
            <input ref={imgRef} type="file" accept="image/*" multiple onChange={onImages} className="hidden" />
            {f.images.length > 0 && (
              <div className="mb-3 grid grid-cols-3 gap-2">
                {f.images.map((src, i) => (
                  <div key={src + i} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    {i === 0 && <span className="absolute start-1 top-1 rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">{t('admin.form.cover')}</span>}
                    <div className="absolute inset-x-0 bottom-0 flex justify-between bg-brand-dark/60 px-1 py-0.5 opacity-0 transition group-hover:opacity-100">
                      {i !== 0 ? <button type="button" onClick={() => makeCover(i)} className="text-white" title={t('admin.form.setCover')}><Star size={13} /></button> : <span />}
                      <button type="button" onClick={() => removeImage(i)} className="text-white" title={t('account.pages.remove')}><X size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={() => imgRef.current?.click()} disabled={uploading} className="grid w-full place-items-center rounded-lg border-2 border-dashed border-border py-6 text-ink-muted hover:border-brand hover:text-brand disabled:opacity-50">
              <span className="flex flex-col items-center gap-1.5 text-xs"><ImagePlus size={20} />{uploading ? t('admin.form.uploading') : t('admin.form.addImages')}</span>
            </button>
          </Panel>

          {/* Video (optional) */}
          <Panel className="p-6">
            <h2 className="mb-4 font-serif text-lg font-medium text-ink">{t('admin.form.video')} <span className="text-xs font-normal text-ink-muted">· {t('admin.form.optional')}</span></h2>
            <input ref={vidRef} type="file" accept="video/*" onChange={onVideo} className="hidden" />
            {f.video ? (
              <div className="relative">
                <video src={f.video} controls className="w-full rounded-lg" />
                <button type="button" onClick={() => setF((s) => ({ ...s, video: '' }))} className="absolute end-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-brand-dark/70 text-white"><X size={16} /></button>
              </div>
            ) : (
              <button type="button" onClick={() => vidRef.current?.click()} disabled={uploading} className="grid w-full place-items-center rounded-lg border-2 border-dashed border-border py-6 text-ink-muted hover:border-brand hover:text-brand disabled:opacity-50">
                <span className="flex flex-col items-center gap-1.5 text-xs"><Video size={20} />{t('admin.form.addVideo')}</span>
              </button>
            )}
          </Panel>

          {/* Inventory */}
          <Panel className="p-6">
            <h2 className="mb-4 font-serif text-lg font-medium text-ink">{t('admin.form.inventory')}</h2>
            <div className="space-y-3">
              <InlineField label={t('admin.form.sku')} value={f.sku} onChange={set('sku')} placeholder="KS-OS-320" valueClass="font-mono" wide />
              <InlineField label={t('admin.form.stock')} value={f.stock} onChange={set('stock')} placeholder="0" inputMode="numeric" valueClass="text-success font-bold" />
              <InlineField label={t('admin.form.lowAt')} value={f.lowAt} onChange={set('lowAt')} placeholder="20" inputMode="numeric" />
            </div>
          </Panel>

          {/* Vendor */}
          <Panel className="p-6">
            <h2 className="mb-4 font-serif text-lg font-medium text-ink">{t('admin.form.vendorSection')}</h2>
            <div className="space-y-3">
              <select value={f.seller} onChange={set('seller')} className={inputCls}>
                {SELLERS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <InlineField label={t('admin.form.commission')} value={f.commission} onChange={set('commission')} placeholder="12" inputMode="numeric" suffix="%" />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
