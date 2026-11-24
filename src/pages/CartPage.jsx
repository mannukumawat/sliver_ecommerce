import { Link } from 'react-router-dom'
import { ShoppingBag, Tag } from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import Button from '../components/Button/Button'
import Quantity from '../components/Quantity/Quantity'
import ProductImage from '../components/ProductImage/ProductImage'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'
import { inr } from '../utils/format'
import './CheckoutPage.css'
import './OrdersPage.css'

export default function CartPage() {
  const { items, subtotal, setQty, remove, count } = useCart()
  const { settings } = useSettings()
  const left = Math.max(0, settings.freeShippingAt - subtotal)
  const pct = Math.min(100, (subtotal / settings.freeShippingAt) * 100)
  const shipping = subtotal === 0 || subtotal >= settings.freeShippingAt ? 0 : settings.shippingFlat

  return (
    <div className="container orders-page">
      <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: 'Your bag' }]} />
      <div className="wl-head"><h1>Your bag ({count})</h1><p>Review your pieces before checkout. Saved in this browser only.</p></div>

      {items.length === 0 ? (
        <div className="simple">
          <ShoppingBag size={40} strokeWidth={1.2} />
          <h2>Your bag is empty</h2>
          <p>Add a piece you love and it will wait for you here.</p>
          <Button to="/collection">Shop the collection</Button>
        </div>
      ) : (
        <div className="checkout__grid">
          <div className="checkout__main">
            <section className="co-card" aria-labelledby="cart-items">
              <h2 id="cart-items">Items ({count})</h2>
              <div className="cart__ship">
                <p>{left > 0 ? <>Add <strong>{inr(left)}</strong> more for complimentary shipping</> : <>You have <strong>complimentary shipping</strong></>}</p>
                <div className="cart__bar" aria-hidden="true"><span style={{ width: `${pct}%` }} /></div>
              </div>
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
                <Link to="/collection" className="link-arrow">Continue shopping</Link>
              </div>
            </section>
          </div>
          <aside className="checkout__side">
            <div className="co-card co-summary">
              <h2>Order summary</h2>
              <dl>
                <div><dt>Subtotal ({count} {count === 1 ? 'item' : 'items'})</dt><dd>{inr(subtotal)}</dd></div>
                <div><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : inr(shipping)}</dd></div>
                <div className="co-summary__total"><dt>Total</dt><dd>{inr(subtotal + shipping)}</dd></div>
              </dl>
              <p className="co-summary__note"><Tag size={14} /> Have a coupon? Apply it at checkout, or <Link to="/offers" className="link-arrow">see all offers</Link>.</p>
              <p className="co-summary__note">Demo checkout — no payment is taken. Cash on Delivery is not offered.</p>
              <Button block size="lg" to="/checkout">Proceed to checkout</Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
