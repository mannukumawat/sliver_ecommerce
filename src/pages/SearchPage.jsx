import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import ProductGrid from '../components/ProductGrid/ProductGrid'
import Button from '../components/Button/Button'
import { useProducts } from '../hooks/useProducts'
import { categories, priceRanges } from '../data/categories'
import { SORTS } from '../hooks/useCollectionFilters'
import { matchesQuery } from '../utils/search'
import './CollectionPage.css'
import './SimplePages.css'

const SORT_FN = {
  featured: (a, b) => Number(Boolean(b.bestseller)) - Number(Boolean(a.bestseller)) || a.id - b.id,
  newest: (a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) || b.id - a.id,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
}

export default function SearchPage() {
  const [sp, setSp] = useSearchParams()
  const { products } = useProducts()
  const q = sp.get('q') || ''
  const [query, setQuery] = useState(q)
  const [category, setCategory] = useState('all')
  const [price, setPrice] = useState('all')
  const [sort, setSort] = useState('featured')

  const results = useMemo(() => {
    const range = priceRanges.find((r) => r.id === price)
    return products
      .filter((p) => matchesQuery(p, q))
      .filter((p) => category === 'all' || p.category === category)
      .filter((p) => !range || (p.price >= range.min && p.price <= range.max))
      .sort(SORT_FN[sort] || SORT_FN.featured)
  }, [products, q, category, price, sort])

  const submit = (e) => {
    e.preventDefault()
    setSp(query.trim() ? { q: query.trim() } : {}, { replace: true })
  }

  return (
    <div className="container orders-page">
      <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />
      <div className="wl-head">
        <h1>{q ? `Results for “${q}”` : 'Search'}</h1>
        <p>{results.length} {results.length === 1 ? 'product' : 'products'} found · across rings, necklaces, earrings, bracelets, anklets and sets.</p>
      </div>
      <form onSubmit={submit} className="orders-lookup__form" role="search">
        <label className="field"><span>Search jewellery</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search rings, pearls, blue stone…" autoComplete="off" />
        </label>
        <label className="field"><span>Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </label>
        <label className="field"><span>Price</span>
          <select value={price} onChange={(e) => setPrice(e.target.value)}>
            <option value="all">Any price</option>
            {priceRanges.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </label>
        <label className="field"><span>Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
        <Button type="submit"><Search size={16} /> Search</Button>
      </form>

      {results.length === 0 ? (
        <div className="simple">
          <Search size={40} strokeWidth={1.2} />
          <h2>Nothing matched{q ? ` “${q}”` : ''}</h2>
          <p>Try “ring”, “pearl” or “blue”, or browse the full collection.</p>
          <Button to="/collection">Explore the collection</Button>
        </div>
      ) : (
        <div className="wl-body"><ProductGrid products={results} cols={3} /></div>
      )}
    </div>
  )
}
