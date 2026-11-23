import ProductCard from '../ProductCard/ProductCard'
import './ProductGrid.css'

export default function ProductGrid({ products, cols = 4 }) {
  return (
    <ul className={`pgrid pgrid--${cols}`}>
      {products.map((p) => (
        <li key={p.id}><ProductCard product={p} /></li>
      ))}
    </ul>
  )
}
