import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const BRAND = 'KASH'
const HOME_TITLE = "KASH — The UAE's everyday marketplace"

const EXACT = {
  '/': HOME_TITLE,
  '/cart': 'Cart',
  '/checkout': 'Checkout',
  '/search': 'Search',
  '/favourites': 'Favourites',
  '/login': 'Sign in',
  '/order-confirmed': 'Order confirmed',
  '/track': 'Track order',
  '/returns': 'Returns',
  '/faq': 'Help',
  '/about': 'About',
  '/contact': 'Contact',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms',
  '/refunds': 'Returns & refunds',
}

function titleFor(path) {
  if (EXACT[path]) return path === '/' ? HOME_TITLE : `${EXACT[path]} · ${BRAND}`
  if (path.startsWith('/admin')) return `Admin · ${BRAND}`
  if (path.startsWith('/account')) return `My account · ${BRAND}`
  if (path.startsWith('/product/')) return `Product · ${BRAND}`
  if (path.startsWith('/category') || path === '/deals') return `Shop · ${BRAND}`
  return HOME_TITLE
}

// Sets document.title on every route change (basic SEO / tab clarity).
export default function TitleManager() {
  const { pathname } = useLocation()
  useEffect(() => {
    document.title = titleFor(pathname)
  }, [pathname])
  return null
}
