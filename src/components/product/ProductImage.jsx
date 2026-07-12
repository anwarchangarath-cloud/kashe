import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/cn.js'

/*
 * ProductImage — fills its (sized) parent with the product photo, cropped to cover.
 * Falls back to the neutral "image" placeholder if the photo fails to load (offline /
 * blocked), so the layout never breaks. Parent should set the aspect ratio.
 */
export default function ProductImage({ src, alt, className, rounded }) {
  const { t } = useTranslation()
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className={cn('grid h-full w-full place-items-center bg-surface text-sm text-ink-muted', rounded, className)}>
        {t('product.imagePlaceholder')}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn('h-full w-full object-cover', rounded, className)}
    />
  )
}
