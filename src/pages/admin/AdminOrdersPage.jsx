import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, Package, Truck } from 'lucide-react'
import Button from '../../components/Button/Button'
import ProductImage from '../../components/ProductImage/ProductImage'
import { useOrders } from '../../context/OrdersContext'
import { inr } from '../../utils/format'
import { formatDate } from '../../utils/validation'
import { addressLabel } from '../../hooks/useAddresses'
import {
  COURIER_NAME, orderTimeline as buildTimeline, refundStatus, returnBadge,
  returnTimeline, trackingIdFor,
} from '../../utils/orderStatus'
import { StatusPill } from '../OrdersListPage'
import NotFoundPage from '../NotFoundPage'
import { customerNameFromOrder } from './adminUtils'

const MANUAL_STATUSES = ['Placed', 'Packed', 'Shipped', 'Delivered', 'Cancelled']
const FILTERS = ['All', 'Placed', 'Packed', 'Shipped', 'Delivered', 'Cancelled']

function AdminOrderDetail({ order }) {
  const { setManualStatus } = useOrders()
  const [saved, setSaved] = useState(false)
  const timeline = buildTimeline(order)
  const refund = order.status === 'Cancelled' ? refundStatus(order) : null
  const ret = order.returnRequest ? returnTimeline(order.returnRequest) : null

  const changeStatus = (next) => {
    setManualStatus(order.id, next)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <>
      <section className="admin__card" aria-labelledby="od-head">
        <div className="admin__formrow" style={{ justifyContent: 'space-between' }}>
          <h2 id="od-head">Order detail — {order.id}</h2>
          <StatusPill status={order.status} />
        </div>
        <dl className="admin__kv">
          <div><dt>Customer</dt><dd><strong>{customerNameFromOrder(order)}</strong> · {order.email} · {order.address?.phone || '—'}</dd></div>
          <div><dt>Placed</dt><dd>{formatDate(order.placedAt)} · Estimated delivery {formatDate(order.estimatedDelivery)}</dd></div>
          <div><dt>Ship to</dt><dd>{order.address ? `${order.address.fullName}, ${addressLabel(order.address)}` : '—'}</dd></div>
          <div><dt>Payment</dt><dd>{order.payment?.label || '—'} · Paid {inr(order.total)} (demo — no real charge)</dd></div>
          <div><dt>Tracking</dt><dd>{order.status === 'Cancelled' ? '—' : `${trackingIdFor(order)} · ${COURIER_NAME}`}</dd></div>
          {order.coupon && <div><dt>Coupon</dt><dd>{order.coupon.code} · −{inr(order.discount || 0)}</dd></div>}
          {order.cancelReason && <div><dt>Cancel reason</dt><dd>{order.cancelReason}</dd></div>}
          {returnBadge(order) && <div><dt>Return</dt><dd>{returnBadge(order)} · {order.returnRequest.reason} · Pickup: {order.returnRequest.pickupSlot}</dd></div>}
        </dl>
        <label className="admin__field" style={{ maxWidth: 320 }}><span>Change order status</span>
          <select value={order.status} onChange={(e) => changeStatus(e.target.value)}>
            {MANUAL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        {saved && <p className="admin__ok" role="status">Status updated.</p>}
        <p className="admin__note">Changing the status here overrides the automatic day-based status for this order.</p>
      </section>

      <section className="admin__card" aria-labelledby="od-items">
        <h2 id="od-items"><Package size={20} /> Items ({order.items.reduce((n, i) => n + i.qty, 0)})</h2>
        <div className="admin__tablewrap">
          <table className="admin__table">
            <thead><tr><th>Item</th><th>Price</th><th className="num">Qty</th><th className="num">Total</th></tr></thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.slug}>
                  <td><div className="admin__cell-product">
                    <span className="admin__thumb"><ProductImage art={{ photos: [item.image] }} decorative /></span>
                    <Link to={`/product/${item.slug}`}>{item.name}</Link>
                  </div></td>
                  <td>{inr(item.price)}</td>
                  <td className="num">{item.qty}</td>
                  <td className="num"><strong>{inr(item.price * item.qty)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <dl className="admin__kv">
          <div><dt>Subtotal</dt><dd>{inr(order.subtotal)}</dd></div>
          {order.discount > 0 && <div><dt>Coupon discount</dt><dd>−{inr(order.discount)}</dd></div>}
          <div><dt>Shipping</dt><dd>{order.shipping === 0 ? 'Free' : inr(order.shipping)}</dd></div>
          <div><dt>Total</dt><dd><strong>{inr(order.total)}</strong></dd></div>
        </dl>
      </section>

      {order.status !== 'Cancelled' && (
        <section className="admin__card" aria-labelledby="od-timeline">
          <h2 id="od-timeline"><Truck size={20} /> Delivery timeline</h2>
          <ol className="admin__timeline">
            {timeline.map((s) => (
              <li key={s.key} className={s.done ? 'is-done' : ''}>
                <span className="timeline__dot">{s.done ? <Check size={13} /> : ''}</span>
                <strong>{s.key}</strong>
                <em>{s.done ? formatDate(s.date) : `Expected ${formatDate(s.date)}`}</em>
              </li>
            ))}
          </ol>
        </section>
      )}

      {refund && (
        <section className="admin__card" aria-labelledby="od-refund">
          <h2 id="od-refund">Refund — {refund.status}</h2>
          <p className="admin__note">Refund of {inr(order.total)} to the original payment method (demo) — 3–5 business days. No real money moves in this demo.</p>
          <ol className="admin__timeline">
            {refund.steps.map((s) => (
              <li key={s.key} className={s.done ? 'is-done' : ''}>
                <span className="timeline__dot">{s.done ? <Check size={13} /> : ''}</span>
                <strong>{s.key}</strong>
                <em>{s.done ? formatDate(s.date) : `Expected ${formatDate(s.date)}`}</em>
              </li>
            ))}
          </ol>
        </section>
      )}

      {order.returnRequest && ret && (
        <section className="admin__card" aria-labelledby="od-return">
          <h2 id="od-return">Return — {ret.currentLabel}</h2>
          <p className="admin__note">
            {order.returnRequest.items.map((i) => `${i.name} × ${i.qty}`).join(' · ')} · Reason: {order.returnRequest.reason} ·
            Pickup: {order.returnRequest.pickupSlot} · Refund to {order.returnRequest.refundMethod === 'wallet' ? 'AURAVÉ wallet credit' : 'original payment method (demo)'}.
          </p>
          <ol className="admin__timeline">
            {ret.steps.map((s) => (
              <li key={s.key} className={s.done ? 'is-done' : ''}>
                <span className="timeline__dot">{s.done ? <Check size={13} /> : ''}</span>
                <strong>{s.key}</strong>
                <em>{s.done ? formatDate(s.date) : `Expected ${formatDate(s.date)}`}</em>
              </li>
            ))}
          </ol>
        </section>
      )}
      <p><Link to="/admin/orders">← Back to all orders</Link></p>
    </>
  )
}

export default function AdminOrdersPage() {
  const { id } = useParams()
  const { orders, getOrder } = useOrders()
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')

  // All hooks must run before any early return (same component renders both
  // the list and the detail — fewer hooks on one render crashes React).
  const counts = useMemo(() => {
    const c = { All: orders.length }
    FILTERS.slice(1).forEach((s) => { c[s] = orders.filter((o) => o.status === s).length })
    return c
  }, [orders])

  // Detail route: /admin/orders/:id
  if (id) {
    const order = getOrder(id)
    if (!order) return <NotFoundPage />
    return <AdminOrderDetail key={order.id} order={order} />
  }

  const list = orders.filter((o) => {
    if (filter !== 'All' && o.status !== filter) return false
    if (!query.trim()) return true
    const q = query.trim().toLowerCase()
    return o.id.toLowerCase().includes(q)
      || (o.email || '').toLowerCase().includes(q)
      || customerNameFromOrder(o).toLowerCase().includes(q)
  })

  return (
    <>
      <p className="admin__note">{orders.length} {orders.length === 1 ? 'order' : 'orders'} · stored in this browser only</p>
      <div className="admin__formrow" role="group" aria-label="Filter by status">
        {FILTERS.map((f) => (
          <Button key={f} size="sm" variant={filter === f ? 'primary' : 'secondary'} onClick={() => setFilter(f)}>
            {f} ({counts[f] || 0})
          </Button>
        ))}
        <input className="admin__search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by order ID, name or email…" aria-label="Search orders" />
      </div>
      {orders.length === 0 ? (
        <section className="admin__card"><div className="admin__empty">
          <Package size={40} strokeWidth={1.2} />
          <h2>No orders yet</h2>
          <p className="admin__note">Orders placed in the store (checkout) will appear here.</p>
          <Button to="/collection">View the store</Button>
        </div></section>
      ) : list.length === 0 ? (
        <section className="admin__card"><p className="admin__note">No orders match this filter.</p></section>
      ) : (
        <section className="admin__card">
          <div className="admin__tablewrap">
            <table className="admin__table">
              <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th /></tr></thead>
              <tbody>
                {list.map((o) => (
                  <tr key={o.id}>
                    <td><strong>{o.id}</strong></td>
                    <td>{customerNameFromOrder(o)}<br /><span className="admin__note">{o.email}</span></td>
                    <td>{formatDate(o.placedAt)}</td>
                    <td>{inr(o.total)}</td>
                    <td><StatusPill status={o.status} />{returnBadge(o) && <><br /><span className="admin__badge admin__badge--warn">{returnBadge(o)}</span></>}</td>
                    <td><Link to={`/admin/orders/${o.id}`}>View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  )
}
