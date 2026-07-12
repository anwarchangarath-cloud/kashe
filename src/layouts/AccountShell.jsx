import { Outlet } from 'react-router-dom'
import AccountSidebar from '../components/account/AccountSidebar.jsx'

// Two-column account area: persistent sidebar + routed content.
export default function AccountShell() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
      <aside className="lg:w-64 lg:shrink-0">
        <AccountSidebar />
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}
