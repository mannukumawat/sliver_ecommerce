import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, RotateCcw, Search } from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import Button from '../components/Button/Button'
import AuthForm from '../components/AuthForm/AuthForm'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'
import { useCart } from '../context/CartContext'
import { getProduct } from '../data/products'
import { inr } from '../utils/format'
import { formatDate } from '../utils/validation'
import { COURIER_NAME, refundStatus, returnBadge, trackingIdFor } from '../utils/orderStatus'
import './OrdersPage.css'

export const STATUS_CLASS = { Placed: 'st-placed', Packed: 'st-packed', Shipped: 'st-shipped', Delivered: 'st-delivered', Cancelled: 'st-cancelled' }

export function StatusPill({ status }) {
  return <span className={`status-pill ${STATUS_CLASS[status] || ''}`}>{status}</span>
}

export default function OrdersListPage() {
  const { user, isLoggedIn } = useAuth()
  const { orders } = useOrders()
  const { add } = useCart()
  const [lookupId, setLookupId] = useState('')
  const [lookupEmail, setLookupEmail] = useState('')
  const [lookupResult, setLookupResult] = useState(null) // 'found' | 'not-found' | null
  const [boughtAgain, setBoughtAgain] = useState(null)

  // Logged-in customers see their own orders; guests can look one up by ID + email.
  const mine = isLoggedIn ? orders.filter((o) => o.userEmail === user.email || o.email === user.email) : []
  const lookedUp = lookupResult === 'found' ? orders.find((o) => o.id.toUpperCase() === lookupId.trim().toUpperCase()) : null
  const list = isLoggedIn ? mine : (lookedUp ? [lookedUp] : [])

  const findOrder = (e) => {
    e.preventDefault()
    const found = orders.find((o) => o.id.toUpperCase() === lookupId.trim().toUpperCase() && o.email.toLowerCase() === lookupEmail.trim().toLowerCase())
    setLookupResult(found ? 'found' : 'not-found')
  }

  const buyAgain = (order) => {
    order.items.forEach((item) => {
      const p = getProduct(item.slug)
      if (p) add(p.id, item.qty)
    })
    setBoughtAgain(order.id)
    setTimeout(() => setBoughtAgain(null), 2500)
  }

  return (
    <div className="container orders-page">
      <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: 'Account', to: '/account' }, { label: 'My orders' }]} />
      <div className="wl-head"><h1>My orders</h1><p>{isLoggedIn ? `${list.length} ${list.length === 1 ? 'order' : 'orders'} · stored in this browser only` : 'Login to see your orders, or find a guest order below.'}</p></div>

      {!isLoggedIn && (
        <section className="co-card orders-lookup" aria-labelledby="find-order">
          <h2 id="find-order"><Search size={20} /> Find your order</h2>
          <p className="field__hint">Placed an order as a guest? Enter its order ID and the email you used at checkout.</p>
          <form onSubmit={findOrder} className="orders-lookup__form">
            <label className="field"><span>Order ID</span><input value={lookupId} onChange={(e) => setLookupId(e.target.value)} placeholder="AUR-1001" /></label>
            <label className="field"><span>Email</span><input type="email" value={lookupEmail} onChange={(e) => setLookupEmail(e.target.value)} placeholder="you@example.com" /></label>
            <Button type="submit">Find order</Button>
          </form>
          {lookupResult === 'not-found' && <p className="field__err" role="alert">No order matched that ID and email. Check the details and try again.</p>}
          <p className="auth__note">Or <strong>login</strong> to see all your orders:</p>
          <AuthForm defaultMode="login" />
        </section>
      )}

      {isLoggedIn && list.length === 0 && (
        <div className="simple">
          <Package size={40} strokeWidth={1.2} />
          <h2>No orders yet</h2>
          <p>When you place an order, it will appear here with live demo tracking.</p>
          <Button to="/collection">Explore the collection</Button>
        </div>
      )}

      {list.length > 0 && (
        <ul className="orders-list">
          {list.map((o) => (
            <li key={o.id} className="co-card order-card">
              <div className="order-card__head">
                <div><strong>{o.id}</strong><span>Placed {formatDate(o.placedAt)}</span></div>
                <StatusPill status={o.status} />
              </div>
              <p className="order-card__items">{o.items.map((i) => `${i.name} × ${i.qty}`).join(' · ')}</p>
              {o.status !== 'Cancelled' && (
                <p className="order-card__track">Tracking {trackingIdFor(o)} · {COURIER_NAME}</p>
              )}
              {o.status === 'Cancelled' && refundStatus(o) && (
                <p className="order-card__track">Refund {refundStatus(o).status} · {inr(o.total)} to original payment method (demo)</p>
              )}
              {returnBadge(o) && <p className="order-card__track">{returnBadge(o)} · {o.returnRequest?.reason}</p>}
              <div className="order-card__foot">
                <span>Total <strong>{inr(o.total)}</strong></span>
                <span className="order-card__actions">
                  <Button size="sm" variant="secondary" onClick={() => buyAgain(o)}><RotateCcw size={14} /> {boughtAgain === o.id ? 'Added to bag' : 'Buy again'}</Button>
                  <Button size="sm" to={`/account/orders/${o.id}`}>View details</Button>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!isLoggedIn && lookedUp && <p className="field__hint">Showing the order you looked up. <Link to="/account" className="link-arrow">Login</Link> to keep all your orders in one place.</p>}
    </div>
  )
}
