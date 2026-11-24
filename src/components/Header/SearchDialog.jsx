import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import Drawer from '../Drawer/Drawer'
import ProductImage from '../ProductImage/ProductImage'
import { useProducts } from '../../hooks/useProducts'
import { matchesQuery } from '../../utils/search'
import { inr } from '../../utils/format'

export default function SearchDialog({ open, onClose }) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const { products } = useProducts()
  const goToResults = () => {
    if (!q.trim()) return
    const query = q.trim()
    setQ('')
    onClose()
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }
  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return products.filter((p) => p.bestseller).slice(0, 4)
    return products.filter((p) => matchesQuery(p, s)).slice(0, 6)
  }, [q, products])

  return (
    <Drawer open={open} onClose={onClose} side="center" title="Search" hideHead className="search">
      <div className="search__body">
        <label className="search__field">
          <Search size={20} aria-hidden="true" />
          <span className="sr-only">Search jewellery</span>
          <input data-autofocus type="search" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') goToResults() }} placeholder="Search rings, pearls, blue stone…" autoComplete="off" />
        </label>
        <p className="eyebrow search__h">{q.trim() ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Popular right now'}</p>
        {q.trim() && (
          <p><Link to={`/search?q=${encodeURIComponent(q.trim())}`} onClick={() => { setQ(''); onClose() }} className="link-arrow">See all results for “{q.trim()}”</Link></p>
        )}
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
