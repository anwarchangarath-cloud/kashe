import { Outlet } from 'react-router-dom'
import AnnouncementBar from '../components/layout/AnnouncementBar.jsx'
import Header from '../components/layout/Header.jsx'
import Nav from '../components/layout/Nav.jsx'
import Footer from '../components/layout/Footer.jsx'
import MobileTabBar from '../components/layout/MobileTabBar.jsx'

// Full storefront chrome: announcement + header + category nav + footer.
// Used for Home, Category and Product pages.
export default function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-page pb-14 lg:pb-0">
      <AnnouncementBar />
      <Header />
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  )
}
