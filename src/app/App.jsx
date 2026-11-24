import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from '../context/CartContext'
import { WishlistProvider } from '../context/WishlistContext'
import { UIProvider } from '../context/UIContext'
import { AuthProvider } from '../context/AuthContext'
import { OrdersProvider } from '../context/OrdersContext'
import { SettingsProvider } from '../context/SettingsContext'
import { CouponsProvider } from '../context/CouponsContext'
import { AdminProvider } from '../context/AdminContext'
import AdminLayout from '../pages/admin/AdminLayout'
import AdminLoginPage from '../pages/admin/AdminLoginPage'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminOrdersPage from '../pages/admin/AdminOrdersPage'
import AdminProductsPage from '../pages/admin/AdminProductsPage'
import AdminCustomersPage from '../pages/admin/AdminCustomersPage'
import AdminCouponsPage from '../pages/admin/AdminCouponsPage'
import AdminReviewsPage from '../pages/admin/AdminReviewsPage'
import AdminSettingsPage from '../pages/admin/AdminSettingsPage'
import Layout from './Layout'
import HomePage from '../pages/HomePage'
import CollectionPage from '../pages/CollectionPage'
import ProductPage from '../pages/ProductPage'
import WishlistPage from '../pages/WishlistPage'
import PolicyPage from '../pages/PolicyPage'
import NotFoundPage from '../pages/NotFoundPage'
import CheckoutPage from '../pages/CheckoutPage'
import OrderSuccessPage from '../pages/OrderSuccessPage'
import AccountPage from '../pages/AccountPage'
import OrdersListPage from '../pages/OrdersListPage'
import OrderDetailPage from '../pages/OrderDetailPage'
import SearchPage from '../pages/SearchPage'
import CartPage from '../pages/CartPage'
import OffersPage from '../pages/OffersPage'
import HelpPage from '../pages/HelpPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'

export default function App() {
  return (
    <BrowserRouter>
      <UIProvider>
        <SettingsProvider>
          <AuthProvider>
            <CouponsProvider>
              <WishlistProvider>
                <CartProvider>
                  <OrdersProvider>
                    <AdminProvider>
                    <Routes>
                      <Route element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="collection" element={<CollectionPage />} />
                        <Route path="product/:slug" element={<ProductPage />} />
                        <Route path="wishlist" element={<WishlistPage />} />
                        <Route path="search" element={<SearchPage />} />
                        <Route path="cart" element={<CartPage />} />
                        <Route path="offers" element={<OffersPage />} />
                        <Route path="help" element={<HelpPage />} />
                        <Route path="forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="checkout" element={<CheckoutPage />} />
                        <Route path="checkout/success" element={<OrderSuccessPage />} />
                        <Route path="account" element={<AccountPage />} />
                        <Route path="account/orders" element={<OrdersListPage />} />
                        <Route path="account/orders/:id" element={<OrderDetailPage />} />
                        <Route path="policy/:slug" element={<PolicyPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                      </Route>
                      {/* Admin has its own layout (no store header/footer). */}
                      <Route path="admin/login" element={<AdminLoginPage />} />
                      <Route path="admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboardPage />} />
                        <Route path="orders" element={<AdminOrdersPage />} />
                        <Route path="orders/:id" element={<AdminOrdersPage />} />
                        <Route path="products" element={<AdminProductsPage />} />
                        <Route path="customers" element={<AdminCustomersPage />} />
                        <Route path="coupons" element={<AdminCouponsPage />} />
                        <Route path="reviews" element={<AdminReviewsPage />} />
                        <Route path="settings" element={<AdminSettingsPage />} />
                      </Route>
                    </Routes>
                    </AdminProvider>
                  </OrdersProvider>
                </CartProvider>
              </WishlistProvider>
            </CouponsProvider>
          </AuthProvider>
        </SettingsProvider>
      </UIProvider>
    </BrowserRouter>
  )
}
