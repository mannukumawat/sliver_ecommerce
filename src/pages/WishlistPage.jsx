import { products } from '../data/products'
import { useWishlist } from '../context/WishlistContext'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import ProductGrid from '../components/ProductGrid/ProductGrid'
import Button from '../components/Button/Button'
import './SimplePages.css'

export default function WishlistPage() {
  const { ids } = useWishlist()
  const saved = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean)
  return (
    <div className="container">
      <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
      <div className="wl-head">
        <h1>Your wishlist</h1>
        <p>{saved.length} saved {saved.length === 1 ? 'piece' : 'pieces'} · stored in this browser only</p>
      </div>
      {saved.length ? (
        <div className="wl-body"><ProductGrid products={saved} /></div>
      ) : (
        <div className="simple">
          <h2>Nothing saved yet</h2>
          <p>Tap the heart on any piece to keep it here.</p>
          <Button to="/collection">Explore the collection</Button>
        </div>
      )}
    </div>
  )
}
