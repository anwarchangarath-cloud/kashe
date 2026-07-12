import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en/common.json'
import ar from './locales/ar/common.json'

// EN + AR. The store is a language toggle, not a second codebase — the RTL layout works
// via logical properties, and <html dir> flips automatically on language change.
export const languages = {
  en: { dir: 'ltr', label: 'English' },
  ar: { dir: 'rtl', label: 'العربية' },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { common: en }, ar: { common: ar } },
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: { order: ['querystring', 'localStorage', 'navigator'] },
  })

function applyDir(lng) {
  const dir = languages[lng]?.dir ?? 'ltr'
  document.documentElement.setAttribute('dir', dir)
  document.documentElement.setAttribute('lang', lng)
}

applyDir(i18n.resolvedLanguage || 'en')
i18n.on('languageChanged', applyDir)

export default i18n
