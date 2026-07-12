import { AuthProvider } from './AuthContext.jsx'
import { ProductsProvider } from './ProductsContext.jsx'
import { CartProvider } from './CartContext.jsx'
import { WishlistProvider } from './WishlistContext.jsx'
import { ToastProvider } from './ToastContext.jsx'
import { AdminProvider } from './AdminContext.jsx'
import { OrdersProvider } from './OrdersContext.jsx'
import { AddressesProvider } from './AddressesContext.jsx'
import { ReviewsProvider } from './ReviewsContext.jsx'

// Single wrapper for all client-side stores. Products is high in the tree because Cart and
// Admin both read from it (one shared catalog for storefront + admin).
export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <AddressesProvider>
          <ProductsProvider>
            <CartProvider>
              <AdminProvider>
                <OrdersProvider>
                  <ReviewsProvider>
                    <ToastProvider>{children}</ToastProvider>
                  </ReviewsProvider>
                </OrdersProvider>
              </AdminProvider>
            </CartProvider>
          </ProductsProvider>
        </AddressesProvider>
      </WishlistProvider>
    </AuthProvider>
  )
}
