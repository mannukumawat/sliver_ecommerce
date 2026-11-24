import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Check, Copy, Package, RotateCcw, Truck, Undo2, X } from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import Button from '../components/Button/Button'
import Quantity from '../components/Quantity/Quantity'
import ProductImage from '../components/ProductImage/ProductImage'
import { useOrders, orderTimeline } from '../context/OrdersContext'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { getProduct } from '../data/products'
import { inr } from '../utils/format'
import { formatDate } from '../utils/validation'
import { addressLabel } from '../hooks/useAddresses'
import {
  CANCEL_REASONS, COURIER_NAME, REFUND_METHODS, RETURN_REASONS,
  pickupSlots, refundStatus, returnTimeline, returnWindow, trackingEvents, trackingIdFor,
} from '../utils/orderStatus'
import NotFoundPage from './NotFoundPage'
import { StatusPill } from './OrdersListPage'
import './OrdersPage.css'

export default function OrderDetailPage() {
  const { id } = useParams()
  const { getOrder, cancelOrder, requestReturn } = useOrders()
  const { add } = useCart()
  const { showToast } = useUI()
  const navigate = useNavigate()
  const [cancelled, setCancelled] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [cancelReason, setCancelReason] = useState(CANCEL_REASONS[0])
  const [cancelNote, setCancelNote] = useState('')
  const [copied, setCopied] = useState(false)
  const [showReturn, setShowReturn] = useState(false)
  const [returnQty, setReturnQty] = useState({})
  const [returnReason, setReturnReason] = useState(RETURN_REASONS[0])
  const [pickupAddress, setPickupAddress] = useState('')
  const [pickupSlot, setPickupSlot] = useState('')
  const [refundMethod, setRefundMethod] = useState(REFUND_METHODS[0].id)
  const [returnErr, setReturnErr] = useState('')
  const [returnDone, setReturnDone] = useState(false)

  const order = getOrder(id)
  const slots = useMemo(() => pickupSlots(), [])
  if (!order) return <NotFoundPage />
  const timeline = orderTimeline(order)
  const events = trackingEvents(order)
  const trackingId = trackingIdFor(order)
  const refund = order.status === 'Cancelled' ? refundStatus(order) : null
  const win = returnWindow(order)
  const canCancel = order.status === 'Placed' || order.status === 'Packed'
  const canReturn = order.status === 'Delivered' && win.open && !order.returnRequest
  const ret = order.returnRequest ? returnTimeline(order.returnRequest) : null
  const defaultSlot = slots[0]?.id || ''

  const copyTracking = async () => {
    try { await navigator.clipboard.writeText(trackingId); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    catch { showToast(`Tracking ID: ${trackingId}`) }
  }

  const doCancel = () => {
    cancelOrder(order.id, cancelReason, cancelNote.trim())
    setCancelled(true)
    setShowCancel(false)
    showToast(`Order ${order.id} cancelled. Refund initiated (demo).`)
  }

  const openReturn = () => {
    setReturnQty(Object.fromEntries(order.items.map((i) => [i.slug, 0])))
    setPickupAddress(`${order.address.fullName}\n${addressLabel(order.address)}\n${order.address.phone}`)
    setPickupSlot(defaultSlot)
    setRefundMethod(REFUND_METHODS[0].id)
    setReturnErr('')
    setShowReturn(true)
  }

  const submitReturn = () => {
    const items = order.items
      .filter((i) => (returnQty[i.slug] || 0) > 0)
      .map((i) => ({ slug: i.slug, name: i.name, price: i.price, qty: returnQty[i.slug] }))
    if (!items.length) { setReturnErr('Select at least one item to return.'); return }
    if (!pickupAddress.trim()) { setReturnErr('Enter a pickup address.'); return }
    const slot = slots.find((s) => s.id === pickupSlot) || slots[0]
    const ok = requestReturn(order.id, {
      items, reason: returnReason, pickupAddress: pickupAddress.trim(),
      pickupSlot: slot.label, refundMethod,
    })
    if (!ok) { setReturnErr('This order can no longer be returned.'); return }
    setShowReturn(false)
    setReturnDone(true)
    showToast('Return requested. Pickup will be scheduled (demo).')
  }

  const buyAgain = () => {
    order.items.forEach((item) => { const p = getProduct(item.slug); if (p) add(p.id, item.qty) })
    showToast('Items added back to your bag.')
    navigate('/collection')
  }

  return (
    <div className="container orders-page">
      <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: 'My orders', to: '/account/orders' }, { label: order.id }]} />
      <div className="order-detail__head">
        <div>
          <p className="eyebrow">Order {order.id}</p>
          <h1>Placed {formatDate(order.placedAt)}</h1>
        </div>
        <StatusPill status={cancelled ? 'Cancelled' : order.status} />
      </div>

      {order.status === 'Cancelled' && (
        <p className="co-note"><X size={16} /> This order was cancelled{order.cancelledAt ? ` on ${formatDate(order.cancelledAt)}` : ''}{order.cancelReason ? ` — reason: ${order.cancelReason}` : ''}. No payment was taken (demo order).</p>
      )}
      {order.status !== 'Cancelled' && (
        <ol className="timeline" aria-label="Delivery timeline">
          {timeline.map((s) => (
            <li key={s.key} className={s.done ? 'is-done' : ''}>
              <span className="timeline__dot">{s.done ? <Check size={13} /> : ''}</span>
              <strong>{s.key}</strong>
              <em>{s.done ? formatDate(s.date) : `Expected ${formatDate(s.date)}`}</em>
            </li>
          ))}
        </ol>
      )}
      <p className="field__hint">Estimated delivery by {formatDate(order.estimatedDelivery)}. Demo tracking — status advances one step per day.</p>

      {/* Courier tracking */}
      {order.status !== 'Cancelled' && (
        <section className="co-card trk-card" aria-labelledby="trk-title">
          <h2 id="trk-title"><Truck size={20} /> Track your order</h2>
          <p className="field__hint">Demo courier tracking — no real shipment. Events appear as their dates pass.</p>
          <p className="trk-id">Tracking ID <strong>{trackingId}</strong>
            <Button size="sm" variant="secondary" onClick={copyTracking}><Copy size={14} /> {copied ? 'Copied' : 'Copy'}</Button>
          </p>
          <p className="field__hint">Courier: {COURIER_NAME} · Free shipping above ₹1,999.</p>
          <ol className="trk-events">
            {events.map((e) => (
              <li key={e.key} className={e.done ? 'is-done' : 'is-next'}>
                <span className="timeline__dot">{e.done ? <Check size={13} /> : ''}</span>
                <div><strong>{e.label}</strong><span>{e.location}</span></div>
                <em>{e.done ? formatDate(e.date) : `Expected ${formatDate(e.date)}`}</em>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Refund status after cancellation */}
      {refund && (
        <section className="co-card trk-card" aria-labelledby="rf-title">
          <h2 id="rf-title"><Undo2 size={20} /> Refund — {refund.status}</h2>
          <p className="field__hint">Refund of {inr(order.total)} to your original payment method (demo) — 3–5 business days. No real money moves in this demo.</p>
          <ol className="timeline" aria-label="Refund timeline">
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

      {/* Return status */}
      {order.returnRequest && ret && (
        <section className="co-card trk-card" aria-labelledby="ret-title">
          <h2 id="ret-title"><Undo2 size={20} /> Return — {ret.currentLabel}</h2>
          <p className="field__hint">
            {order.returnRequest.items.map((i) => `${i.name} × ${i.qty}`).join(' · ')} · Reason: {order.returnRequest.reason} ·
            Pickup: {order.returnRequest.pickupSlot} · Refund to {order.returnRequest.refundMethod === 'wallet' ? 'AURAVÉ wallet credit' : 'original payment method (demo)'}.
          </p>
          <ol className="timeline" aria-label="Return timeline">
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
      {returnDone && !order.returnRequest && <p className="co-note"><Check size={16} /> Return requested — refresh to see its status timeline.</p>}

      <div className="checkout__grid">
        <div className="checkout__main">
          <section className="co-card" aria-labelledby="od-items">
            <h2 id="od-items"><Package size={20} /> Items ({order.items.reduce((n, i) => n + i.qty, 0)})</h2>
            <ul className="co-lines">
              {order.items.map((item) => (
                <li key={item.slug} className="co-line">
                  <Link to={`/product/${item.slug}`} className="co-line__thumb"><ProductImage art={{ photos: [item.image] }} decorative /></Link>
                  <div className="co-line__meta">
                    <Link to={`/product/${item.slug}`} className="co-line__name">{item.name}</Link>
                    <p>{inr(item.price)} × {item.qty}</p>
                  </div>
                  <strong>{inr(item.price * item.qty)}</strong>
                </li>
              ))}
            </ul>
            <div className="co-card__foot">
              <Button variant="secondary" onClick={buyAgain}><RotateCcw size={15} /> Buy again</Button>
              {canCancel && !cancelled && !showCancel && <Button variant="secondary" onClick={() => setShowCancel(true)}>Cancel order</Button>}
              {canReturn && !showReturn && <Button variant="secondary" onClick={openReturn}><Undo2 size={15} /> Return items</Button>}
              {order.status === 'Delivered' && !win.open && !order.returnRequest && (
                <span className="field__hint">Return window closed on {formatDate(win.closesAt)} (7 days after delivery on {formatDate(win.deliveredAt)}).</span>
              )}
              {order.status === 'Delivered' && win.open && !order.returnRequest && (
                <span className="field__hint">Returnable until {formatDate(win.closesAt)} — 7 days after delivery.</span>
              )}
            </div>
          </section>

          {/* Cancel with reason */}
          {showCancel && canCancel && (
            <section className="co-card trk-card" aria-labelledby="cnc-title">
              <h2 id="cnc-title"><X size={20} /> Cancel this order?</h2>
              <p className="field__hint">Tell us why — it helps us do better. Your refund (demo) goes back to your original payment method in 3–5 business days.</p>
              <div className="trk-reasons" role="radiogroup" aria-label="Cancellation reason">
                {CANCEL_REASONS.map((r) => (
                  <label key={r} className="trk-reason">
                    <input type="radio" name="cancel-reason" checked={cancelReason === r} onChange={() => setCancelReason(r)} /> {r}
                  </label>
                ))}
              </div>
              <label className="trk-field"><span>Anything else? (optional)</span>
                <textarea value={cancelNote} onChange={(e) => setCancelNote(e.target.value)} placeholder="Tell us more…" rows={2} />
              </label>
              <div className="co-card__foot">
                <Button variant="secondary" onClick={doCancel}>Confirm cancellation</Button>
                <Button variant="secondary" onClick={() => setShowCancel(false)}>Keep my order</Button>
              </div>
            </section>
          )}

          {/* Return request form */}
          {showReturn && canReturn && (
            <section className="co-card trk-card" aria-labelledby="ret-form-title">
              <h2 id="ret-form-title"><Undo2 size={20} /> Return items</h2>
              <p className="field__hint">Free pickup within 7 days of delivery. Refund (demo) is processed after pickup.</p>
              <ul className="ret-items">
                {order.items.map((item) => (
                  <li key={item.slug} className="ret-item">
                    <span className="ret-item__thumb"><ProductImage art={{ photos: [item.image] }} decorative /></span>
                    <div className="ret-item__meta"><strong>{item.name}</strong><span>{inr(item.price)} × {item.qty} in order</span></div>
                    <Quantity value={returnQty[item.slug] || 0} min={0} max={item.qty} onChange={(v) => setReturnQty((q) => ({ ...q, [item.slug]: v }))} label={`Return quantity for ${item.name}`} />
                  </li>
                ))}
              </ul>
              <label className="trk-field"><span>Reason for return</span>
                <select value={returnReason} onChange={(e) => setReturnReason(e.target.value)}>
                  {RETURN_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </label>
              <label className="trk-field"><span>Pickup address</span>
                <textarea value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} rows={3} />
              </label>
              <fieldset className="trk-fieldset"><legend>Pickup slot</legend>
                <div className="trk-reasons">
                  {slots.map((s) => (
                    <label key={s.id} className="trk-reason">
                      <input type="radio" name="pickup-slot" checked={pickupSlot === s.id} onChange={() => setPickupSlot(s.id)} /> {s.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="trk-fieldset"><legend>Refund to</legend>
                <div className="trk-reasons">
                  {REFUND_METHODS.map((m) => (
                    <label key={m.id} className="trk-reason">
                      <input type="radio" name="refund-method" checked={refundMethod === m.id} onChange={() => setRefundMethod(m.id)} /> {m.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              {returnErr && <p className="field__err" role="alert">{returnErr}</p>}
              <div className="co-card__foot">
                <Button onClick={submitReturn}>Submit return request</Button>
                <Button variant="secondary" onClick={() => setShowReturn(false)}>Cancel</Button>
              </div>
            </section>
          )}
        </div>
        <aside className="checkout__side">
          <div className="co-card co-summary">
            <h2>Summary</h2>
            <dl>
              <div><dt>Subtotal</dt><dd>{inr(order.subtotal)}</dd></div>
              {order.discount > 0 && <div><dt>Coupon ({order.coupon?.code})</dt><dd>−{inr(order.discount)}</dd></div>}
              <div><dt>Shipping</dt><dd>{order.shipping === 0 ? 'Free' : inr(order.shipping)}</dd></div>
              <div className="co-summary__total"><dt>Total</dt><dd>{inr(order.total)}</dd></div>
            </dl>
            <h3>Deliver to</h3>
            <p className="co-summary__note"><strong>{order.address.fullName}</strong><br />{addressLabel(order.address)}<br />{order.address.phone}</p>
            <h3>Payment</h3>
            <p className="co-summary__note">{order.payment.label} · Demo payment — no real charge.</p>
            <p className="co-summary__note">Order updates go to {order.email}.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
