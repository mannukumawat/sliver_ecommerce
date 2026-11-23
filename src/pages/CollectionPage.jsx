import { useEffect, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import ProductGrid from '../components/ProductGrid/ProductGrid'
import FilterSidebar from '../components/FilterSidebar/FilterSidebar'
import MobileFilterDrawer from '../components/MobileFilterDrawer/MobileFilterDrawer'
import Button from '../components/Button/Button'
import ProductImage from '../components/ProductImage/ProductImage'
import { categories, colours, priceRanges } from '../data/categories'
import { SORTS, useCollectionFilters } from '../hooks/useCollectionFilters'
import './CollectionPage.css'

const PAGE = 12

function heading(filters) {
  if (filters.category.length === 1) {
    const c = categories.find((x) => x.slug === filters.category[0])
    return { title: c.name, blurb: `${c.blurb}. Silver pieces designed for everyday wear.`, art: c.art }
  }
  if (filters.onlyNew) return { title: 'New Arrivals', blurb: 'The latest designs from the studio.', art: { photos: ['/images/story/ring-night.jpg', '/images/story/necklace-night.jpg'] } }
  return { title: 'All Jewellery', blurb: 'Rings, necklaces, earrings and more: modern silver, made to be worn every day.', art: { photos: ['/images/story/ring-night.jpg', '/images/story/bracelet-night.jpg'] } }
}

export default function CollectionPage() {
  const f = useCollectionFilters()
  const [shown, setShown] = useState(PAGE)
  const [drawer, setDrawer] = useState(false)
  const head = heading(f.filters)
  const total = f.results.length

  // restart pagination whenever the result set changes
  const key = `${f.sort}|${JSON.stringify(f.filters)}`
  useEffect(() => { setShown(PAGE) }, [key])

  const chips = [
    ...f.filters.category.map((v) => ({ k: 'category', v, label: categories.find((c) => c.slug === v)?.name })),
    ...f.filters.price.map((v) => ({ k: 'price', v, label: priceRanges.find((r) => r.id === v)?.label })),
    ...f.filters.style.map((v) => ({ k: 'style', v, label: v })),
    ...f.filters.colour.map((v) => ({ k: 'colour', v, label: colours.find((c) => c.name === v)?.name })),
  ]
  const panel = { filters: f.filters, toggle: f.toggle, setOnlyNew: f.setOnlyNew }

  return (
    <>
      <section className="cbanner" aria-labelledby="coll-title">
        <div className="cbanner__text container">
          <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: 'Collection', to: '/collection' }, ...(head.title !== 'All Jewellery' ? [{ label: head.title }] : [])]} />
          <p className="eyebrow">AURAVÉ</p>
          <h1 id="coll-title">{head.title}</h1>
          <p>{head.blurb}</p>
        </div>
        <div className="cbanner__art" aria-hidden="true"><ProductImage art={head.art} view={2} decorative eager /></div>
      </section>

      <div className="container coll">
        <FilterSidebar activeCount={f.activeCount} onClear={f.clear} {...panel} />

        <div className="coll__main">
          <div className="coll__bar">
            <p className="coll__count" aria-live="polite">{total} {total === 1 ? 'product' : 'products'}</p>
            <button className="coll__filterbtn" onClick={() => setDrawer(true)} aria-haspopup="dialog">
              <SlidersHorizontal size={17} /> Filters{f.activeCount > 0 && <span className="coll__badge">{f.activeCount}</span>}
            </button>
            <label className="coll__sort">
              <span>Sort by</span>
              <select value={f.sort} onChange={(e) => f.setSort(e.target.value)}>
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
          </div>

          {(chips.length > 0 || f.filters.onlyNew) && (
            <ul className="coll__chips" aria-label="Active filters">
              {f.filters.onlyNew && <li><button onClick={() => f.setOnlyNew(false)}>New arrivals <X size={13} aria-label="Remove" /></button></li>}
              {chips.map((c) => (
                <li key={c.k + c.v}><button onClick={() => f.toggle(c.k, c.v)} aria-label={`Remove filter ${c.label}`}>{c.label} <X size={13} aria-hidden="true" /></button></li>
              ))}
              <li><button className="coll__clearall" onClick={f.clear}>Clear all</button></li>
            </ul>
          )}

          {total === 0 ? (
            <div className="coll__empty" role="status">
              <h2>No pieces match these filters</h2>
              <p>Try removing a filter or two to see more of the collection.</p>
              <Button onClick={f.clear}>Clear all filters</Button>
            </div>
          ) : (
            <>
              <ProductGrid products={f.results.slice(0, shown)} cols={3} />
              <div className="coll__more">
                <p>Showing {Math.min(shown, total)} of {total}</p>
                <div className="coll__progress" aria-hidden="true"><span style={{ width: `${(Math.min(shown, total) / total) * 100}%` }} /></div>
                {shown < total && <Button variant="secondary" onClick={() => setShown((s) => s + PAGE)}>Load more</Button>}
              </div>
            </>
          )}
        </div>
      </div>

      <MobileFilterDrawer open={drawer} onClose={() => setDrawer(false)} total={total} activeCount={f.activeCount} onClear={f.clear} {...panel} />
    </>
  )
}
