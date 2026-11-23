import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from '../context/CartContext'
import { WishlistProvider } from '../context/WishlistContext'
import { UIProvider } from '../context/UIContext'
import Layout from './Layout'
import HomePage from '../pages/HomePage'
import CollectionPage from '../pages/CollectionPage'
import ProductPage from '../pages/ProductPage'
import WishlistPage from '../pages/WishlistPage'
import PolicyPage from '../pages/PolicyPage'
import NotFoundPage from '../pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <UIProvider>
        <WishlistProvider>
          <CartProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="collection" element={<CollectionPage />} />
                <Route path="product/:slug" element={<ProductPage />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="policy/:slug" element={<PolicyPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </CartProvider>
        </WishlistProvider>
      </UIProvider>
    </BrowserRouter>
  )
}
