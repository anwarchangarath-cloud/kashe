import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function FooterColumn({ title, children }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold text-white">{title}</h3>
      <ul className="space-y-2 text-sm text-white/70">{children}</ul>
    </div>
  )
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="hover:text-white">
        {children}
      </Link>
    </li>
  )
}

// Site footer — --brand-dark. Brand + tagline, then Shop / Help / Company / Pay columns.
export default function Footer() {
  const { t } = useTranslation()
  const L = (k) => t(`footer.links.${k}`)

  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2">
            <p className="text-2xl font-bold">
              {t('brand')}
              <span className="text-highlight">.</span>
            </p>
            <p className="mt-3 max-w-xs text-sm text-white/70">{t('footer.tagline')}</p>
          </div>

          <FooterColumn title={t('footer.shop')}>
            <FooterLink to="/category/electronics">{L('electronics')}</FooterLink>
            <FooterLink to="/category/fashion">{L('fashion')}</FooterLink>
            <FooterLink to="/category/home">{L('homeLiving')}</FooterLink>
            <FooterLink to="/deals">{L('todaysDeals')}</FooterLink>
          </FooterColumn>

          <FooterColumn title={t('footer.help')}>
            <FooterLink to="/contact">{L('contact')}</FooterLink>
            <FooterLink to="/track">{L('track')}</FooterLink>
            <FooterLink to="/returns">{L('returns')}</FooterLink>
            <FooterLink to="/faq">{L('faq')}</FooterLink>
          </FooterColumn>

          <FooterColumn title={t('footer.company')}>
            <FooterLink to="/about">{L('about')}</FooterLink>
            <FooterLink to="/careers">{L('careers')}</FooterLink>
            <FooterLink to="/sell">{L('sell')}</FooterLink>
          </FooterColumn>

          <FooterColumn title={t('footer.payWith')}>
            <li>{t('footer.pay.cardApple')}</li>
            <li>{t('footer.pay.cod')}</li>
          </FooterColumn>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50">
          <span>{t('footer.copyright')}</span>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/privacy" className="hover:text-white">{t('footer.privacy')}</Link>
            <Link to="/terms" className="hover:text-white">{t('footer.terms')}</Link>
            <Link to="/refunds" className="hover:text-white">{t('footer.refunds')}</Link>
            <span>{t('footer.vat')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
