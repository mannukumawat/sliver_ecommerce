import { useState } from 'react'
import { Tag } from 'lucide-react'
import Button from '../../components/Button/Button'
import { useCoupons } from '../../context/CouponsContext'
import { formatDate } from '../../utils/validation'

const isExpired = (c) => new Date(`${c.validTill}T23:59:59`) < new Date()

function couponPill(c) {
  if (isExpired(c)) return <span className="admin__badge admin__badge--bad">Expired</span>
  if (!c.active) return <span className="admin__badge admin__badge--warn">Disabled</span>
  return <span className="admin__badge admin__badge--active">Active</span>
}

function couponLine(c) {
  if (c.kind === 'shipping') return 'Free shipping'
  return `${c.value}% off`
}

export default function AdminCouponsPage() {
  const { coupons, addCoupon, setCouponActive } = useCoupons()
  const [saved, setSaved] = useState(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ code: '', value: '', minOrder: '', validFrom: '', validTill: '' })
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const activeCount = coupons.filter((c) => c.active && !isExpired(c)).length

  const submit = (e) => {
    e.preventDefault()
    setError('')
    setSaved(null)
    const code = form.code.trim().toUpperCase()
    const value = Number(form.value)
    const minOrder = Number(form.minOrder || 0)
    if (!code) { setError('Enter a coupon code.'); return }
    if (!value || value <= 0 || value > 90) { setError('Discount must be between 1% and 90%.'); return }
    if (minOrder < 0) { setError('Minimum order cannot be negative.'); return }
    if (!form.validTill) { setError('Pick a “valid till” date.'); return }
    if (form.validFrom && form.validFrom > form.validTill) { setError('“Valid from” must be before “valid till”.'); return }
    const clean = addCoupon({
      code, kind: 'percent', value, minOrder,
      validFrom: form.validFrom || undefined, validTill: form.validTill,
      desc: `${value}% off`,
    })
    setSaved(clean)
    setForm({ code: '', value: '', minOrder: '', validFrom: '', validTill: '' })
  }

  return (
    <>
      <p className="admin__note">{activeCount} active {activeCount === 1 ? 'coupon' : 'coupons'} · {coupons.length} total</p>
      <section className="admin__coupons" aria-label="Coupons">
        {coupons.map((c) => (
          <article key={c.code} className={`admin__coupon ${c.active && !isExpired(c) ? '' : 'admin__coupon--off'}`}>
            <div className="admin__coupon-head"><strong>{c.code}</strong>{couponPill(c)}</div>
            <p className="admin__note">
              {couponLine(c)}{c.desc && c.desc !== `${c.value}% off` ? ` — ${c.desc}` : ''} · Min ₹{Number(c.minOrder || 0).toLocaleString('en-IN')} ·
              Used {c.used || 0} times · Till {formatDate(`${c.validTill}T00:00:00`)}
            </p>
            <div className="admin__formrow">
              <Button size="sm" variant="secondary" onClick={() => setCouponActive(c.code, !c.active)}>
                {c.active ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </article>
        ))}
        {coupons.length === 0 && <p className="admin__note">No coupons yet — create one below.</p>}
      </section>

      <section className="admin__card" aria-labelledby="create-coupon">
        <h2 id="create-coupon"><Tag size={20} /> Create a coupon</h2>
        <form className="admin__form admin__form--2col" onSubmit={submit}>
          <label className="admin__field"><span>Coupon code</span>
            <input value={form.code} onChange={set('code')} placeholder="NEWYEAR10" style={{ textTransform: 'uppercase' }} />
          </label>
          <label className="admin__field"><span>Discount %</span>
            <input type="number" min="1" max="90" value={form.value} onChange={set('value')} placeholder="10" />
          </label>
          <label className="admin__field"><span>Min. order (₹)</span>
            <input type="number" min="0" value={form.minOrder} onChange={set('minOrder')} placeholder="1499" />
          </label>
          <label className="admin__field"><span>Valid till</span>
            <input type="date" value={form.validTill} onChange={set('validTill')} />
          </label>
          <label className="admin__field admin__field--full"><span>Valid from (optional — stored, only “valid till” is enforced at checkout)</span>
            <input type="date" value={form.validFrom} onChange={set('validFrom')} />
          </label>
          <div className="admin__formrow admin__field--full">
            <Button type="submit">Create coupon</Button>
          </div>
          {error && <p className="admin__err admin__field--full" role="alert">{error}</p>}
          {saved && <p className="admin__ok admin__field--full" role="status">Coupon {saved.code} created and active.</p>}
        </form>
      </section>
    </>
  )
}
