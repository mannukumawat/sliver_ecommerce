import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import Drawer from '../Drawer/Drawer'
import ProductImage from '../ProductImage/ProductImage'
import { products } from '../../data/products'
import { inr } from '../../utils/format'

export default function SearchDialog({ open, onClose }) {
  const [q, setQ] = useState('')
  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return products.filter((p) => p.bestseller).slice(0, 4)
    return products.filter((p) => `${p.name} ${p.category} ${p.style} ${p.colour}`.toLowerCase().includes(s)).slice(0, 6)
  }, [q])

  return (
    <Drawer open={open} onClose={onClose} side="center" title="Search" hideHead className="search">
      <div className="search__body">
        <label className="search__field">
          <Search size={20} aria-hidden="true" />
          <span className="sr-only">Search jewellery</span>
          <input data-autofocus type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search rings, pearls, blue stone…" autoComplete="off" />
        </label>
        <p className="eyebrow search__h">{q.trim() ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Popular right now'}</p>
        {results.length === 0 ? (
          <p className="search__none">Nothing matched “{q}”. Try “ring”, “pearl” or “blue”.</p>
        ) : (
          <ul className="search__list">
            {results.map((p) => (
              <li key={p.id}>
                <Link to={`/product/${p.slug}`} onClick={() => { setQ(''); onClose() }}>
                  <span className="search__thumb"><ProductImage art={p.art} decorative /></span>
                  <span><strong>{p.name}</strong><em>{inr(p.price)}</em></span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Drawer>
  )
}
