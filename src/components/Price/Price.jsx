import { discountPct, inr } from '../../utils/format'
import './Price.css'

export default function Price({ product, size = 'md' }) {
  const off = discountPct(product)
  return (
    <p className={`price price--${size}`}>
      <span className="price__now">{inr(product.price)}</span>
      {product.mrp && (
        <>
          <s className="price__mrp"><span className="sr-only">Original price </span>{inr(product.mrp)}</s>
          <span className="price__off">{off}% off</span>
        </>
      )}
    </p>
  )
}
