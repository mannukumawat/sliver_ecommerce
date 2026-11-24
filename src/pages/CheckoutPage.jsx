import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, CreditCard, Landmark, Lock, ShieldCheck, Smartphone, Tag, Truck } from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import Button from '../components/Button/Button'
import Quantity from '../components/Quantity/Quantity'
import ProductImage from '../components/ProductImage/ProductImage'
import AddressForm, { emptyAddress, validateAddress } from '../components/AddressForm/AddressForm'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'
import { useCoupons, validateCoupon } from '../context/CouponsContext'
import { useSettings } from '../context/SettingsContext'
import { useAddresses, addressLabel } from '../hooks/useAddresses'
import { useUI } from '../context/UIContext'
import { inr } from '../utils/format'
import { cardBrand, formatCardNumber, formatExpiry, isEmail, isExpiry, isUpiId, luhnCheck, maskUpi } from '../utils/validation'
import './CheckoutPage.css'

const BANKS = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank', 'Other bank']
const STEPS = ['Bag', 'Shipping', 'Payment', 'Review']

export default function CheckoutPage() {
  const { items, subtotal, setQty, remove, clear, count } = useCart()
  const { user, isLoggedIn } = useAuth()
  const { placeOrder } = useOrders()
  const { findCoupon } = useCoupons()
  const { settings } = useSettings()
  const { addresses, saveAddress, defaultAddress } = useAddresses()
  const { showToast } = useUI()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [couponCode, setCouponCode] = useState('')
  const [applied, setApplied] = useState(null) // { coupon, discount, freeShipping }
  const [couponErr, setCouponErr] = useState('')

  const [step, setStep] = useState(1)
  const [email, setEmail] = useState(user?.email || '')
  const [selectedAddrId, setSelectedAddrId] = useState(defaultAddress?.id || null)
  const [showAddrForm, setShowAddrForm] = useState(!defaultAddress)
  const [addrDraft, setAddrDraft] = useState(defaultAddress || emptyAddress)
  const [addrErrs, setAddrErrs] = useState({})
  const [method, setMethod] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [bank, setBank] = useState(BANKS[0])
  const [payErr, setPayErr] = useState('')
  const [placing, setPlacing] = useState(false)

  const selectedAddress = addresses.find((a) => a.id === selectedAddrId) || defaultAddress || null
  const discount = applied?.discount || 0
  const shipping = applied?.freeShipping || subtotal - discount >= settings.freeShippingAt || subtotal === 0 ? 0 : settings.shippingFlat
  const total = subtotal - discount + shipping

  const tryApplyCoupon = (code) => {
    const res = validateCoupon(findCoupon(code), subtotal, items)
    if (!res.ok) { setCouponErr(res.error); setApplied(null); return false }
    setApplied(res)
    setCouponCode(res.coupon.code)
    setCouponErr('')
    return true
  }

  // A coupon picked on /offers arrives as ?coupon=CODE.
  useEffect(() => {
    const code = searchParams.get('coupon')
    if (code) tryApplyCoupon(code)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Empty bag: checkout has nothing to do.
  useEffect(() => {
    if (items.length === 0) {
      showToast('Your bag is empty — add a piece first.')
      navigate('/collection', { replace: true })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const shippingOk = useMemo(() => {
    if (!isEmail(email)) return false
    return selectedAddress ? Object.keys(validateAddress(selectedAddress)).length === 0 : false
  }, [email, selectedAddress])

  const saveDraftAddress = () => {
    const errs = validateAddress(addrDraft)
    setAddrErrs(errs)
    if (Object.keys(errs).length) return null
    const saved = saveAddress({ ...addrDraft, isDefault: !addresses.length })
    setSelectedAddrId(saved.id)
    setShowAddrForm(false)
    return saved
  }

  const goToPayment = () => {
    if (!isEmail(email)) { setAddrErrs((e) => ({ ...e, email: 'Enter a valid email for order updates.' })); return }
    if (showAddrForm) { if (!saveDraftAddress()) return }
    else if (!selectedAddress) { setShowAddrForm(true); return }
    setStep(3)
    window.scrollTo({ top: 0 })
  }

  const paymentLabel = () => {
    if (method === 'upi') return `UPI · ${maskUpi(upiId)}`
    if (method === 'card') return `${cardBrand(card.number)} •••• ${card.number.replace(/\D/g, '').slice(-4)}`
    return `NetBanking · ${bank}`
  }

  const paymentValid = () => {
    if (method === 'upi') return isUpiId(upiId) ? '' : 'Enter a valid UPI ID, e.g. name@okhdfc.'
    if (method === 'card') {
      if (!luhnCheck(card.number)) return 'Enter a valid card number.'
      if (!isExpiry(card.expiry)) return 'Enter a valid expiry date (MM/YY) in the future.'
      if (!/^\d{3,4}$/.test(card.cvv)) return 'Enter the 3–4 digit CVV.'
      if (card.name.trim().length < 2) return 'Enter the name on the card.'
      return ''
    }
    return ''
  }

  const goToReview = () => {
    const err = paymentValid()
    setPayErr(err)
    if (err) return
    setStep(4)
    window.scrollTo({ top: 0 })
  }

  const placeOrderNow = () => {
    if (!shippingOk || paymentValid()) return
    setPlacing(true)
    // Demo payment: simulate a short processing delay, then create the order.
    setTimeout(() => {
      const order = placeOrder({
        items, subtotal, shipping, total,
        coupon: applied ? { code: applied.coupon.code, discount: applied.discount, freeShipping: applied.freeShipping } : null,
        discount,
        address: selectedAddress, email: email.trim().toLowerCase(),
        payment: { method: method === 'upi' ? 'UPI' : method === 'card' ? 'Card' : 'NetBanking', label: paymentLabel() },
        userEmail: isLoggedIn ? user.email : null,
      })
      clear()
      navigate(`/checkout/success?orderId=${order.id}`, { replace: true })
    }, 900)
  }

  if (items.length === 0) return null

  return (
    <div className="container checkout">
      <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: 'Bag', to: '/collection' }, { label: 'Checkout' }]} />
      <div className="checkout__head">
        <div>
          <p className="eyebrow">Secure checkout</p>
          <h1>Checkout</h1>
        </div>
        <p className="checkout__secure"><Lock size={15} /> Demo payment — no real charge</p>
      </div>

      <ol className="checkout__steps" aria-label="Checkout steps">
        {STEPS.map((label, i) => (
          <li key={label} className={step > i + 1 ? 'is-done' : step === i + 1 ? 'is-current' : ''} aria-current={step === i + 1 ? 'step' : undefined}>
            <span>{step > i + 1 ? <Check size={14} /> : i + 1}</span> {label}
          </li>
        ))}
      </ol>

      <div className="checkout__grid">
        <div className="checkout__main">
          {step === 1 && (
            <section className="co-card" aria-labelledby="co-bag">
              <h2 id="co-bag">Your bag ({count})</h2>
              <ul className="co-lines">
                {items.map(({ product, qty }) => (
                  <li key={product.id} className="co-line">
                    <Link to={`/product/${product.slug}`} className="co-line__thumb"><ProductImage art={product.art} decorative /></Link>
                    <div className="co-line__meta">
                      <Link to={`/product/${product.slug}`} className="co-line__name">{product.name}</Link>
                      <p>{inr(product.price)} each</p>
                      <div className="co-line__row">
                        <Quantity value={qty} onChange={(v) => setQty(product.id, v)} label={`Quantity for ${product.name}`} />
                        <button type="button" className="co-line__remove" onClick={() => remove(product.id)}>Remove</button>
                      </div>
                    </div>
                    <strong>{inr(product.price * qty)}</strong>
                  </li>
                ))}
              </ul>
              <div className="co-card__foot">
                <Button size="lg" onClick={() => { setStep(2); window.scrollTo({ top: 0 }) }}>Continue to shipping <ArrowRight size={16} /></Button>
                <Link to="/collection" className="link-arrow"><ArrowLeft size={15} /> Continue shopping</Link>
              </div>
              <div className="co-coupon">
                <label className="field"><span><Tag size={14} /> Coupon code</span>
                  <span className="co-coupon__row">
                    <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="WELCOME10" autoComplete="off" disabled={Boolean(applied)} />
                    {applied
                      ? <Button variant="secondary" onClick={() => { setApplied(null); setCouponCode(''); setCouponErr('') }}>Remove</Button>
                      : <Button variant="secondary" onClick={() => tryApplyCoupon(couponCode)}>Apply</Button>}
                  </span>
                </label>
                {couponErr && <p className="field__err" role="alert">{couponErr}</p>}
                {applied && <p className="field__hint">{applied.coupon.code} applied — {applied.freeShipping ? 'free shipping' : `${inr(applied.discount)} off`}. <Link to="/offers" className="link-arrow">See all offers</Link></p>}
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="co-card" aria-labelledby="co-ship">
              <h2 id="co-ship"><Truck size={20} /> Shipping details</h2>
              <label className="field"><span>Email for order updates</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(addrErrs.email)} />
                {addrErrs.email && <span className="field__err" role="alert">{addrErrs.email}</span>}
                {isLoggedIn && <span className="field__hint">Signed in as {user.email} — updates go to this email.</span>}
              </label>

              {addresses.length > 0 && !showAddrForm && (
                <>
                  <p className="co-sub">Deliver to</p>
                  <ul className="co-addr-list">
                    {addresses.map((a) => (
                      <li key={a.id}>
                        <label className={`co-addr ${selectedAddrId === a.id ? 'is-selected' : ''}`}>
                          <input type="radio" name="address" checked={selectedAddrId === a.id} onChange={() => setSelectedAddrId(a.id)} />
                          <span><strong>{a.fullName} · {a.label}{a.isDefault ? ' (Default)' : ''}</strong><br />{addressLabel(a)}<br />{a.phone}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                  <Button variant="secondary" size="sm" onClick={() => { setAddrDraft(emptyAddress); setShowAddrForm(true) }}>Add a new address</Button>
                </>
              )}

              {showAddrForm && (
                <>
                  <p className="co-sub">{addresses.length ? 'New address' : 'Shipping address'}</p>
                  <AddressForm
                    initial={addrDraft}
                    submitLabel="Save and continue"
                    onSave={(saved) => {
                      const s = saveAddress({ ...saved, isDefault: !addresses.length })
                      setSelectedAddrId(s.id); setShowAddrForm(false); setStep(3); window.scrollTo({ top: 0 })
                    }}
                  />
                  {addresses.length > 0 && <Button variant="secondary" size="sm" onClick={() => setShowAddrForm(false)}>Use a saved address</Button>}
                </>
              )}

              {!showAddrForm && (
                <div className="co-card__foot">
                  <Button size="lg" onClick={goToPayment}>Continue to payment <ArrowRight size={16} /></Button>
                  <Button variant="secondary" size="lg" onClick={() => setStep(1)}>Back to bag</Button>
                </div>
              )}
            </section>
          )}

          {step === 3 && (
            <section className="co-card" aria-labelledby="co-pay">
              <h2 id="co-pay"><Lock size={20} /> Payment</h2>
              <p className="co-note"><ShieldCheck size={16} /> Demo payment only — no real money moves. Never enter a real card here; use the test card below.</p>
              <div className="co-methods" role="radiogroup" aria-label="Payment method">
                {[
                  { id: 'upi', icon: Smartphone, label: 'UPI', hint: 'GPay, PhonePe, Paytm' },
                  { id: 'card', icon: CreditCard, label: 'Card', hint: 'Visa, Mastercard, RuPay' },
                  { id: 'netbanking', icon: Landmark, label: 'NetBanking', hint: 'All major banks' },
                ].map(({ id, icon: Icon, label, hint }) => (
                  <label key={id} className={`co-method ${method === id ? 'is-selected' : ''}`}>
                    <input type="radio" name="method" checked={method === id} onChange={() => { setMethod(id); setPayErr('') }} />
                    <Icon size={20} /><span><strong>{label}</strong><em>{hint}</em></span>
                  </label>
                ))}
              </div>

              {method === 'upi' && (
                <label className="field"><span>UPI ID</span>
                  <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="name@okhdfc" autoComplete="off" />
                  <span className="field__hint">Demo: any valid-looking UPI ID works, e.g. demo@okhdfc.</span>
                </label>
              )}
              {method === 'card' && (
                <div className="co-cardform">
                  <label className="field"><span>Card number</span>
                    <input value={card.number} onChange={(e) => setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))} inputMode="numeric" placeholder="4242 4242 4242 4242" autoComplete="cc-number" />
                  </label>
                  <label className="field"><span>Name on card</span>
                    <input value={card.name} onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))} autoComplete="cc-name" placeholder="As printed on the card" />
                  </label>
                  <label className="field"><span>Expiry (MM/YY)</span>
                    <input value={card.expiry} onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))} inputMode="numeric" placeholder="12/28" autoComplete="cc-exp" />
                  </label>
                  <label className="field"><span>CVV</span>
                    <input type="password" value={card.cvv} onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} inputMode="numeric" placeholder="123" autoComplete="cc-csc" />
                  </label>
                  <p className="field__hint">Test card: 4242 4242 4242 4242 · any future expiry · any CVV.</p>
                </div>
              )}
              {method === 'netbanking' && (
                <label className="field"><span>Choose your bank</span>
                  <select value={bank} onChange={(e) => setBank(e.target.value)}>
                    {BANKS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                  <span className="field__hint">Demo: you will not be redirected to a bank.</span>
                </label>
              )}
              {payErr && <p className="field__err" role="alert">{payErr}</p>}
              <div className="co-card__foot">
                <Button size="lg" onClick={goToReview}>Review order <ArrowRight size={16} /></Button>
                <Button variant="secondary" size="lg" onClick={() => setStep(2)}>Back to shipping</Button>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="co-card" aria-labelledby="co-review">
              <h2 id="co-review">Review your order</h2>
              <div className="co-review">
                <div>
                  <h3>Deliver to</h3>
                  <p><strong>{selectedAddress?.fullName}</strong><br />{selectedAddress && addressLabel(selectedAddress)}<br />{selectedAddress?.phone}<br />{email}</p>
                  <Button variant="secondary" size="sm" onClick={() => setStep(2)}>Change</Button>
                </div>
                <div>
                  <h3>Payment</h3>
                  <p>{paymentLabel()}</p>
                  <p className="field__hint">Demo payment — no real charge.</p>
                  <Button variant="secondary" size="sm" onClick={() => setStep(3)}>Change</Button>
                </div>
              </div>
              <ul className="co-lines">
                {items.map(({ product, qty }) => (
                  <li key={product.id} className="co-line">
                    <span className="co-line__thumb"><ProductImage art={product.art} decorative /></span>
                    <div className="co-line__meta"><span className="co-line__name">{product.name}</span><p>Qty {qty}</p></div>
                    <strong>{inr(product.price * qty)}</strong>
                  </li>
                ))}
              </ul>
              <div className="co-card__foot">
                <Button size="lg" disabled={placing} onClick={placeOrderNow}>{placing ? 'Placing order…' : `Place order · ${inr(total)}`}</Button>
                <Button variant="secondary" size="lg" onClick={() => setStep(3)}>Back to payment</Button>
              </div>
            </section>
          )}
        </div>

        <aside className="checkout__side" aria-label="Order summary">
          <div className="co-card co-summary">
            <h2>Order summary</h2>
            <dl>
              <div><dt>Subtotal ({count} {count === 1 ? 'item' : 'items'})</dt><dd>{inr(subtotal)}</dd></div>
              {discount > 0 && <div><dt>Coupon ({applied.coupon.code})</dt><dd>−{inr(discount)}</dd></div>}
              <div><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : inr(shipping)}</dd></div>
              <div className="co-summary__total"><dt>Total</dt><dd>{inr(total)}</dd></div>
            </dl>
            <p className="co-summary__note">{shipping === 0 ? 'You have complimentary shipping.' : `Add ${inr(settings.freeShippingAt - (subtotal - discount))} more for complimentary shipping.`}</p>
            <p className="co-summary__note">Cash on Delivery is not offered. Demo payment only — no real charge.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
