import { Outlet } from 'react-router-dom'
import AnnouncementBar from '../components/layout/AnnouncementBar.jsx'
import Header from '../components/layout/Header.jsx'
import MobileTabBar from '../components/layout/MobileTabBar.jsx'

// Announcement + header only (no category nav, no footer) — matches the Login and
// Dashboard mockups, which drop the nav row to keep focus on the task.
export default function AccountLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-page pb-14 lg:pb-0">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <MobileTabBar />
    </div>
  )
}
