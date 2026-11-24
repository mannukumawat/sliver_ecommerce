import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import Button from '../../components/Button/Button'
import ProductImage from '../../components/ProductImage/ProductImage'
import { allProducts, readAdminProducts, removeAdminProduct, saveAdminProduct } from '../../data/products'
import { categories, colours, styles } from '../../data/categories'
import { inr } from '../../utils/format'
import { stockFor } from './adminUtils'

const PHOTO_CHOICES = [
  { value: '/images/products/halo-cluster-ring-1.jpg', label: 'Halo Cluster Ring photo' },
  { value: '/images/products/cluster-pendant-necklace-1.jpg', label: 'Cluster Pendant Necklace photo' },
  { value: '/images/products/silver-hoop-earrings-1.jpg', label: 'Silver Hoop Earrings photo' },
  { value: '/images/story/ring-night.jpg', label: 'Ring — evening styling photo' },
]

const slugify = (name) => String(name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'product'

export default function AdminProductsPage() {
  const [list, setList] = useState(() => allProducts())
  const [saved, setSaved] = useState(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', category: categories[0].slug, price: '', mrp: '',
    style: styles[0], colour: colours[0].name, desc: '', photo: PHOTO_CHOICES[0].value,
  })

  const adminIds = useMemo(() => new Set(readAdminProducts().map((p) => p.id)), [list])
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    setError('')
    setSaved(null)
    const name = form.name.trim()
    const price = Number(form.price)
    const mrp = form.mrp.trim() ? Number(form.mrp) : null
    if (!name) { setError('Enter a product name.'); return }
    if (!price || price <= 0) { setError('Enter a valid price.'); return }
    if (mrp !== null && (Number.isNaN(mrp) || mrp <= price)) { setError('MRP must be higher than the price.'); return }
    const base = slugify(name)
    let slug = base
    let n = 2
    while (allProducts().some((p) => p.slug === slug)) { slug = `${base}-${n}`; n += 1 }
    const id = Math.max(0, ...allProducts().map((p) => p.id)) + 1
    const product = {
      id, slug, name, category: form.category, price, mrp,
      style: form.style, colour: form.colour,
      art: { photos: [form.photo, form.photo] },
      rating: 4.5,
      material: 'Silver-toned jewellery (demo content)',
      desc: form.desc.trim() || 'New addition to the AURAVÉ collection.',
      size: form.category === 'rings' ? 'Sizes 6-10' : 'One size',
    }
    saveAdminProduct(product)
    setList(allProducts())
    setSaved(product)
    setForm({ name: '', category: categories[0].slug, price: '', mrp: '', style: styles[0], colour: colours[0].name, desc: '', photo: PHOTO_CHOICES[0].value })
  }

  const remove = (product) => {
    removeAdminProduct(product.id)
    setList(allProducts())
    setSaved(null)
  }

  const byCategory = useMemo(() => {
    const counts = {}
    list.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1 })
    return counts
  }, [list])

  return (
    <>
      <p className="admin__note">{list.length} products live</p>
      <section className="admin__card">
        <div className="admin__tablewrap">
          <table className="admin__table">
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th /></tr></thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td><div className="admin__cell-product">
                    <span className="admin__thumb"><ProductImage art={p.art} name={p.name} decorative /></span>
                    <Link to={`/product/${p.slug}`}>{p.name}</Link>
                  </div></td>
                  <td>{categories.find((c) => c.slug === p.category)?.name || p.category}</td>
                  <td>{inr(p.price)}</td>
                  <td>{stockFor(p)}</td>
                  <td><span className="admin__badge admin__badge--live">Live</span></td>
                  <td>{adminIds.has(p.id) && (
                    <Button size="sm" variant="secondary" onClick={() => remove(p)}><Trash2 size={14} /> Remove</Button>
                  )}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="admin__note">Only products added in this admin panel can be removed here. Stock is a demo figure, derived from each product.</p>
      </section>

      <section className="admin__card" aria-labelledby="add-product">
        <h2 id="add-product"><Plus size={20} /> Add a product</h2>
        <form className="admin__form admin__form--2col" onSubmit={submit}>
          <label className="admin__field"><span>Product name</span>
            <input value={form.name} onChange={set('name')} placeholder="New Silver Pendant" />
          </label>
          <label className="admin__field"><span>Price (₹)</span>
            <input type="number" min="1" value={form.price} onChange={set('price')} placeholder="2499" />
          </label>
          <label className="admin__field"><span>Category</span>
            <select value={form.category} onChange={set('category')}>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </label>
          <label className="admin__field"><span>MRP (₹) — optional</span>
            <input type="number" min="1" value={form.mrp} onChange={set('mrp')} placeholder="2999" />
          </label>
          <label className="admin__field"><span>Style</span>
            <select value={form.style} onChange={set('style')}>
              {styles.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="admin__field"><span>Colour</span>
            <select value={form.colour} onChange={set('colour')}>
              {colours.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </label>
          <label className="admin__field admin__field--full"><span>Photo</span>
            <select value={form.photo} onChange={set('photo')}>
              {PHOTO_CHOICES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </label>
          <label className="admin__field admin__field--full"><span>Description</span>
            <textarea value={form.desc} onChange={set('desc')} rows={3} placeholder="A delicate silver pendant on a fine chain." />
          </label>
          <div className="admin__formrow admin__field--full">
            <Button type="submit">Save product</Button>
          </div>
          {error && <p className="admin__err admin__field--full" role="alert">{error}</p>}
          {saved && <p className="admin__ok admin__field--full" role="status">“{saved.name}” is live. <Link to="/collection">See it in the collection →</Link></p>}
        </form>
        <p className="admin__note">Photos: pick from existing product photos (demo). The first photo is the cover.</p>
      </section>

      <section className="admin__card" aria-labelledby="cats">
        <h2 id="cats">Categories ({categories.length})</h2>
        <p className="admin__note">
          {categories.map((c) => `${c.name} — ${byCategory[c.slug] || 0} ${byCategory[c.slug] === 1 ? 'product' : 'products'}`).join(' · ')}
        </p>
      </section>
    </>
  )
}
