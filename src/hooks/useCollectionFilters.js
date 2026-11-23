import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { products } from '../data/products'
import { priceRanges } from '../data/categories'

export const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
]

const LIST_KEYS = ['category', 'price', 'style', 'colour']
const list = (sp, k) => (sp.get(k) ? sp.get(k).split(',').filter(Boolean) : [])

const SORT_FN = {
  featured: (a, b) => Number(Boolean(b.bestseller)) - Number(Boolean(a.bestseller)) || a.id - b.id,
  newest: (a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) || b.id - a.id,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
}

// Filter + sort state lives in the URL so views are shareable and the back button works.
export function useCollectionFilters() {
  const [sp, setSp] = useSearchParams()

  const filters = useMemo(() => ({
    category: list(sp, 'category'),
    price: list(sp, 'price'),
    style: list(sp, 'style'),
    colour: list(sp, 'colour'),
    onlyNew: sp.get('new') === '1',
  }), [sp])
  const sort = SORT_FN[sp.get('sort')] ? sp.get('sort') : 'featured'

  const update = useCallback((fn) => {
    setSp((prev) => { const n = new URLSearchParams(prev); fn(n); return n }, { replace: true })
  }, [setSp])

  const toggle = useCallback((key, value) => update((n) => {
    const cur = list(n, key)
    const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]
    next.length ? n.set(key, next.join(',')) : n.delete(key)
  }), [update])

  const setOnlyNew = useCallback((on) => update((n) => (on ? n.set('new', '1') : n.delete('new'))), [update])
  const setSort = useCallback((s) => update((n) => (s === 'featured' ? n.delete('sort') : n.set('sort', s))), [update])
  const clear = useCallback(() => update((n) => { [...LIST_KEYS, 'new'].forEach((k) => n.delete(k)) }), [update])

  const activeCount = LIST_KEYS.reduce((c, k) => c + filters[k].length, 0) + (filters.onlyNew ? 1 : 0)

  const results = useMemo(() => {
    const ranges = filters.price.map((id) => priceRanges.find((r) => r.id === id)).filter(Boolean)
    return products
      .filter((p) => !filters.category.length || filters.category.includes(p.category))
      .filter((p) => !ranges.length || ranges.some((r) => p.price >= r.min && p.price <= r.max))
      .filter((p) => !filters.style.length || filters.style.includes(p.style))
      .filter((p) => !filters.colour.length || filters.colour.includes(p.colour))
      .filter((p) => !filters.onlyNew || p.isNew)
      .sort(SORT_FN[sort])
  }, [filters, sort])

  return { filters, sort, results, activeCount, toggle, setOnlyNew, setSort, clear }
}
