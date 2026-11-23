import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Star } from 'lucide-react'
import ProductImage from '../ProductImage/ProductImage'
import WishlistButton from '../WishlistButton/WishlistButton'
import Quantity from '../Quantity/Quantity'
import Button from '../Button/Button'
import Price from '../Price/Price'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'
import './ProductDetail.css'

const VIEW_NAMES = ['Front view', 'Close-up', 'Another angle']

// Gallery + buy box shared by the product page and the quick-view modal.
export default function ProductDetail({ product, compact = false, onAdded }) {
  const [view, setView] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { add } = useCart()
  const { openCart } = useUI()

  const addToBag = () => {
    add(product.id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
    onAdded?.()
    openCart()
  }

  return (
    <div className={`pdetail ${compact ? 'pdetail--compact' : ''}`}>
      <div className="pdetail__gallery">
        <div className="pdetail__thumbs" role="tablist" aria-label="Product images">
          {VIEW_NAMES.map((n, i) => (
            <button key={n} role="tab" aria-selected={view === i} aria-label={n} className={`pdetail__thumb ${view === i ? 'is-active' : ''}`} onClick={() => setView(i)}>
              <ProductImage art={product.art} view={i} decorative />
            </button>
          ))}
        </div>
        <div className="pdetail__main">
          <ProductImage art={product.art} view={view} name={product.name} />
          {product.isNew && <span className="badge badge--new pdetail__badge">New</span>}
        </div>
      </div>

      <div className="pdetail__info">
        <p className="eyebrow">{product.category}</p>
        <h1 className="pdetail__title">{product.name}</h1>
        <p className="pdetail__rating" aria-label={`Demo rating ${product.rating} out of 5`}>
          <Star size={14} fill="currentColor" /> {product.rating.toFixed(1)} <span>demo rating</span>
        </p>
        <Price product={product} size="lg" />
        <p className="pdetail__tax">Inclusive of all taxes. Demo pricing.</p>
        <p className="pdetail__desc">{product.desc}</p>

        <dl className="pdetail__meta">
          <div><dt>Material</dt><dd>{product.material}</dd></div>
          <div><dt>Size</dt><dd>{product.size}</dd></div>
          <div><dt>Style</dt><dd>{product.style}</dd></div>
          <div><dt>Colour</dt><dd>{product.colour}</dd></div>
        </dl>

        <div className="pdetail__buy">
          <Quantity value={qty} onChange={(v) => setQty(Math.max(1, Math.min(10, v)))} />
          <Button size="lg" className="pdetail__add" onClick={addToBag}>
            {added ? <><Check size={16} /> Added</> : 'Add to bag'}
          </Button>
          <WishlistButton product={product} variant="text" />
        </div>
        {compact && <Link to={`/product/${product.slug}`} className="link-arrow pdetail__full">View full details</Link>}
      </div>
    </div>
  )
}
