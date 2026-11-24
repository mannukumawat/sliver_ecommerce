import { Link, useNavigate } from 'react-router-dom'
import { BadgePercent, Gift, Tag } from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import Button from '../components/Button/Button'
import { useCoupons } from '../context/CouponsContext'
import { formatDate } from '../utils/validation'
import './CheckoutPage.css'
import './OrdersPage.css'

export default function OffersPage() {
  const { coupons } = useCoupons()
  const navigate = useNavigate()
  const active = coupons.filter((c) => c.active && new Date(c.validTill + 'T23:59:59') >= new Date())
  const expired = coupons.filter((c) => !active.includes(c))

  return (
    <div className="container orders-page">
      <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: 'Coupons & offers' }]} />
      <div className="wl-head">
        <h1>Coupons &amp; offers</h1>
        <p>Apply a coupon at checkout. One coupon per order. Demo coupons — no real money moves.</p>
      </div>
      <ul className="offers-grid">
        {active.map((c) => (
          <li key={c.code} className="co-card offer-card">
            <div>
              <p className="offer-code"><Tag size={18} /> {c.code}</p>
              <p>{c.desc} · Min. order ₹{c.minOrder.toLocaleString('en-IN')} · Valid till {formatDate(c.validTill)}</p>
            </div>
            <Button variant="secondary" onClick={() => navigate(`/checkout?coupon=${c.code}`)}>Apply at checkout</Button>
          </li>
        ))}
        {expired.map((c) => (
          <li key={c.code} className="co-card offer-card is-expired">
            <div>
              <p className="offer-code"><Tag size={18} /> {c.code}</p>
              <p>{c.desc} · Expired {formatDate(c.validTill)}</p>
            </div>
            <span className="status-pill st-cancelled">Expired</span>
          </li>
        ))}
      </ul>
      <section className="co-card trk-card" aria-labelledby="offers-today">
        <h2 id="offers-today"><Gift size={20} /> Today&rsquo;s offers</h2>
        <ul className="offers-list">
          <li><BadgePercent size={16} /> Buy 2, get 10% off earrings</li>
          <li><BadgePercent size={16} /> Free gift box on orders above ₹2,999</li>
          <li><BadgePercent size={16} /> Extra 5% off on prepaid UPI orders</li>
        </ul>
        <p className="field__hint">Offers apply automatically at checkout where eligible. <Link to="/collection" className="link-arrow">Shop the collection</Link></p>
      </section>
    </div>
  )
}
