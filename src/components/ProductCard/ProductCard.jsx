import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import ProductImage from '../ProductImage/ProductImage'
import WishlistButton from '../WishlistButton/WishlistButton'
import Price from '../Price/Price'
import { useUI } from '../../context/UIContext'
import './ProductCard.css'

function ProductCard({ product }) {
  const { openQuickView } = useUI()
  return (
    <article className="pcard">
      <div className="pcard__media">
        <Link to={`/product/${product.slug}`} className="pcard__link" aria-label={product.name}>
          <ProductImage art={product.art} name={product.name} className="pcard__img pcard__img--a" />
          <ProductImage art={product.art} view={2} decorative className="pcard__img pcard__img--b" />
        </Link>
        <div className="pcard__badges">
          {product.isNew && <span className="badge badge--new">New</span>}
          {product.mrp && !product.isNew && <span className="badge">Sale</span>}
        </div>
        <WishlistButton product={product} className="pcard__wish" />
        <button type="button" className="pcard__quick" onClick={() => openQuickView(product.id)} aria-label={`Quick view ${product.name}`}>
          <Eye size={16} /> Quick view
        </button>
      </div>
      <div className="pcard__info">
        <h3 className="pcard__name"><Link to={`/product/${product.slug}`}>{product.name}</Link></h3>
        <Price product={product} />
      </div>
    </article>
  )
}

export default memo(ProductCard)
