import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Star } from 'lucide-react'
import { cn } from '../../lib/cn.js'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import RatingStars from '../ui/RatingStars.jsx'
import { useReviews } from '../../store/ReviewsContext.jsx'
import { useAuth } from '../../store/AuthContext.jsx'
import { useToast } from '../../store/ToastContext.jsx'

// Clickable 1–5 star input.
function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <span className="inline-flex" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} onMouseEnter={() => setHover(n)} aria-label={`${n} stars`} className="p-0.5">
          <Star size={22} className={cn((hover || value) >= n ? 'fill-highlight text-highlight' : 'text-border')} strokeWidth={1.5} />
        </button>
      ))}
    </span>
  )
}

export default function ProductReviews({ product }) {
  const { t } = useTranslation()
  const { getReviews, addReview } = useReviews()
  const { isAuthed, user } = useAuth()
  const toast = useToast()
  const reviews = getReviews(product.id)

  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!rating) return
    addReview(product.id, { rating, text, author: user?.fullName })
    toast.show(t('reviews.thanks'))
    setRating(0)
    setText('')
  }

  return (
    <section className="mt-14">
      <div className="mb-5 flex flex-wrap items-baseline gap-3">
        <h2 className="font-serif text-2xl font-medium text-ink">{t('reviews.title')}</h2>
        <span className="flex items-center gap-2 text-sm text-ink-muted">
          <RatingStars value={product.rating} size={16} />
          <span className="font-medium text-ink">{product.rating}</span>
          <span>· {t('productPage.ratingsCount', { count: product.ratingsCount.toLocaleString('en') })}</span>
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Write a review */}
        <Card className="h-fit p-6">
          <h3 className="mb-3 font-bold text-ink">{t('reviews.writeCta')}</h3>
          {isAuthed ? (
            <form onSubmit={submit} className="space-y-3">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-muted">{t('reviews.yourRating')}</p>
                <StarInput value={rating} onChange={setRating} />
              </div>
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder={t('reviews.placeholder')} className="w-full resize-none rounded border border-border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
              <Button type="submit" variant="primary" size="md" fullWidth disabled={!rating}>{t('reviews.submit')}</Button>
            </form>
          ) : (
            <p className="text-sm text-ink-muted">
              <Link to="/login" className="font-semibold text-brand hover:underline">{t('header.signIn')}</Link> {t('reviews.signInPrompt')}
            </p>
          )}
        </Card>

        {/* List */}
        <div className="lg:col-span-2">
          {reviews.length === 0 ? (
            <Card className="py-12 text-center text-sm text-ink-muted">{t('reviews.empty')}</Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((r, i) => (
                <Card key={i} className="p-5">
                  <div className="flex items-center justify-between">
                    <RatingStars value={r.rating} size={15} />
                    <span className="text-xs text-ink-muted">{r.date}</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-ink">{r.author}</p>
                  {r.text && <p className="mt-1 text-sm text-ink">{r.text}</p>}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
