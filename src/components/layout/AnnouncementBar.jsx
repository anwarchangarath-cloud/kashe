import { useTranslation } from 'react-i18next'

// Thin promo strip above the header. --brand-dark bg; the code is emphasised in --highlight.
export default function AnnouncementBar() {
  const { t } = useTranslation()
  return (
    <div className="bg-brand-dark text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-2 text-center text-xs">
        <span>{t('announce.delivery')}</span>
        <span className="text-white/40" aria-hidden="true">·</span>
        <span>
          {t('announce.firstOrder')}{' '}
          <span className="font-bold text-highlight">{t('announce.code')}</span>
        </span>
      </div>
    </div>
  )
}
