import { Routes, Route } from 'react-router-dom'
import StoreLayout from './layouts/StoreLayout.jsx'
import AccountLayout from './layouts/AccountLayout.jsx'
import CheckoutLayout from './layouts/CheckoutLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import RequireAdmin from './components/RequireAdmin.jsx'
import Home from './pages/Home.jsx'
import Category from './pages/Category.jsx'
import Product from './pages/Product.jsx'
import Cart from './pages/Cart.jsx'
import Search from './pages/Search.jsx'
import Favourites from './pages/Favourites.jsx'
import OrderConfirmed from './pages/OrderConfirmed.jsx'
import Checkout from './pages/Checkout.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AccountShell from './layouts/AccountShell.jsx'
import { AccountOrders, AccountAddresses, AccountPayments, AccountCoupons, AccountReturns, AccountSettings } from './pages/account/AccountPages.jsx'
import AccountOrderDetail from './pages/account/AccountOrderDetail.jsx'
import StubPage from './pages/StubPage.jsx'
import { TrackOrder, Returns, Faq, About, Careers, Sell, Contact } from './pages/ContentPages.jsx'
import { Privacy, Terms, Refunds } from './pages/Legal.jsx'
import TitleManager from './components/TitleManager.jsx'
import AdminOverview from './pages/admin/AdminOverview.jsx'
import AdminOrders from './pages/admin/AdminOrders.jsx'
import AdminProducts from './pages/admin/AdminProducts.jsx'
import AdminProductForm from './pages/admin/AdminProductForm.jsx'
import AdminInventory from './pages/admin/AdminInventory.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'

export default function App() {
  return (
    <>
      <TitleManager />
    <Routes>
      {/* Storefront: full chrome (nav + footer) */}
      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/category/:slug?" element={<Category />} />
        <Route path="/deals" element={<Category />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<Search />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/order-confirmed" element={<OrderConfirmed />} />
        {/* Informational pages */}
        <Route path="/track" element={<TrackOrder />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refunds" element={<Refunds />} />
        <Route path="*" element={<StubPage />} />
      </Route>

      {/* Account: header only */}
      <Route element={<AccountLayout />}>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <RequireAuth>
              <AccountShell />
            </RequireAuth>
          }
        >
          <Route path="/account" element={<Dashboard />} />
          <Route path="/account/orders" element={<AccountOrders />} />
          <Route path="/account/orders/:id" element={<AccountOrderDetail />} />
          <Route path="/account/addresses" element={<AccountAddresses />} />
          <Route path="/account/payments" element={<AccountPayments />} />
          <Route path="/account/coupons" element={<AccountCoupons />} />
          <Route path="/account/returns" element={<AccountReturns />} />
          <Route path="/account/settings" element={<AccountSettings />} />
        </Route>
      </Route>

      {/* Checkout: minimal chrome */}
      <Route element={<CheckoutLayout />}>
        <Route path="/checkout" element={<Checkout />} />
      </Route>

      {/* Admin: inverted palette, role-guarded */}
      <Route
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route path="/admin" element={<AdminOverview />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<AdminProductForm />} />
        <Route path="/admin/products/:id/edit" element={<AdminProductForm />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>
    </Routes>
    </>
  )
}
