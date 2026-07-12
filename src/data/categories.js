import {
  Smartphone,
  Shirt,
  House,
  Sparkles,
  ShoppingBasket,
  Dumbbell,
  Baby,
  Tag,
} from 'lucide-react'

// The 8 category circles from the homepage mockup. `active` marks the highlighted one.
// i18nKey resolves against common.json → categories.*
export const categoryCircles = [
  { id: 'mobiles', i18nKey: 'mobiles', icon: Smartphone, to: '/category/mobiles' },
  { id: 'fashion', i18nKey: 'fashion', icon: Shirt, to: '/category/fashion' },
  { id: 'home', i18nKey: 'home', icon: House, to: '/category/home' },
  { id: 'beauty', i18nKey: 'beauty', icon: Sparkles, to: '/category/beauty' },
  { id: 'grocery', i18nKey: 'grocery', icon: ShoppingBasket, to: '/category/grocery' },
  { id: 'sports', i18nKey: 'sports', icon: Dumbbell, to: '/category/sports' },
  { id: 'kids', i18nKey: 'kids', icon: Baby, to: '/category/kids' },
  { id: 'deals', i18nKey: 'deals', icon: Tag, to: '/deals', active: true },
]

// Top nav categories (the second row under the search bar).
export const navCategories = [
  { i18nKey: 'electronics', to: '/category/electronics' },
  { i18nKey: 'home', to: '/category/home' },
  { i18nKey: 'fashion', to: '/category/fashion' },
  { i18nKey: 'beauty', to: '/category/beauty' },
  { i18nKey: 'grocery', to: '/category/grocery' },
  { i18nKey: 'kidsToys', to: '/category/kids-toys' },
  { i18nKey: 'todaysDeals', to: '/deals', highlight: true },
]
