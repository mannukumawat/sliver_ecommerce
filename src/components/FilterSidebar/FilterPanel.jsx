import { Check } from 'lucide-react'
import { categories, colours, priceRanges, styles } from '../../data/categories'
import { products } from '../../data/products'
import './FilterSidebar.css'

const countBy = (key, val) => products.filter((p) => p[key] === val).length

function Group({ legend, children }) {
  return (
    <fieldset className="fgroup">
      <legend>{legend}</legend>
      <div className="fgroup__body">{children}</div>
    </fieldset>
  )
}

function Option({ checked, onChange, label, count }) {
  return (
    <label className="fopt">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="fopt__box" aria-hidden="true"><Check size={12} strokeWidth={3} /></span>
      <span className="fopt__label">{label}</span>
      {count != null && <span className="fopt__count">{count}</span>}
    </label>
  )
}

export default function FilterPanel({ filters, toggle, setOnlyNew }) {
  return (
    <div className="fpanel">
      <Group legend="Category">
        {categories.map((c) => (
          <Option key={c.slug} label={c.name} count={countBy('category', c.slug)} checked={filters.category.includes(c.slug)} onChange={() => toggle('category', c.slug)} />
        ))}
      </Group>
      <Group legend="Price">
        {priceRanges.map((r) => (
          <Option key={r.id} label={r.label} checked={filters.price.includes(r.id)} onChange={() => toggle('price', r.id)} />
        ))}
      </Group>
      <Group legend="Style">
        {styles.map((s) => (
          <Option key={s} label={s} count={countBy('style', s)} checked={filters.style.includes(s)} onChange={() => toggle('style', s)} />
        ))}
      </Group>
      <Group legend="Colour">
        <div className="fswatches">
          {colours.map((c) => (
            <label key={c.name} className="fswatch">
              <input type="checkbox" checked={filters.colour.includes(c.name)} onChange={() => toggle('colour', c.name)} />
              <span className="fswatch__dot" style={{ background: c.hex }} aria-hidden="true" />
              <span>{c.name}</span>
            </label>
          ))}
        </div>
      </Group>
      <Group legend="Availability">
        <Option label="New arrivals only" checked={filters.onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} />
      </Group>
    </div>
  )
}
