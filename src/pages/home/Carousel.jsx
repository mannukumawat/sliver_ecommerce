import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '../../components/ProductCard/ProductCard'

export default function Carousel({ products, label }) {
  const ref = useRef(null)
  const go = (dir) => {
    const el = ref.current
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' })
  }
  return (
    <div className="car">
      <div className="car__ctrl">
        <button onClick={() => go(-1)} aria-label={`Previous ${label}`}><ChevronLeft size={20} /></button>
        <button onClick={() => go(1)} aria-label={`Next ${label}`}><ChevronRight size={20} /></button>
      </div>
      <ul className="car__track" ref={ref} tabIndex={0} aria-label={label}>
        {products.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
      </ul>
    </div>
  )
}
