import { Link } from 'react-router-dom'
import { ShoppingBag, Trash2 } from 'lucide-react'
import Drawer from '../Drawer/Drawer'
import Button from '../Button/Button'
import Quantity from '../Quantity/Quantity'
import ProductImage from '../ProductImage/ProductImage'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'
import { FREE_SHIPPING_AT, inr } from '../../utils/format'
import './CartDrawer.css'

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUI()
  const { items, subtotal, setQty, remove, clear, count } = useCart()
  const left = Math.max(0, FREE_SHIPPING_AT - subtotal)
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100)

  return (
    <Drawer open={cartOpen} onClose={closeCart} title={`Your bag (${count})`}>
      {items.length === 0 ? (
        <div className="cart__empty">
          <ShoppingBag size={36} strokeWidth={1.2} />
          <h3>Your bag is empty</h3>
          <p>Add a piece you love and it will wait for you here.</p>
          <Button to="/collection" onClick={closeCart}>Shop the collection</Button>
        </div>
      ) : (
        <>
          <div className="cart__ship">
            <p>{left > 0 ? <>Add <strong>{inr(left)}</strong> more for complimentary shipping</> : <>You have <strong>complimentary shipping</strong></>}</p>
            <div className="cart__bar" aria-hidden="true"><span style={{ width: `${pct}%` }} /></div>
          </div>
          <ul className="cart__list">
            {items.map(({ product, qty }) => (
              <li key={product.id} className="cart__line">
                <Link to={`/product/${product.slug}`} onClick={closeCart} className="cart__thumb" aria-label={product.name}>
                  <ProductImage art={product.art} decorative />
                </Link>
                <div className="cart__meta">
                  <Link to={`/product/${product.slug}`} onClick={closeCart} className="cart__name">{product.name}</Link>
                  <p className="cart__price">{inr(product.price)}</p>
                  <div className="cart__row">
                    <Quantity value={qty} onChange={(v) => setQty(product.id, v)} label={`Quantity for ${product.name}`} />
                    <button className="cart__remove" onClick={() => remove(product.id)} aria-label={`Remove ${product.name}`}><Trash2 size={17} /></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart__foot">
            <p className="cart__sub"><span>Subtotal</span><strong>{inr(subtotal)}</strong></p>
            <p className="cart__note">Frontend demo. Checkout is not connected.</p>
            <Button block size="lg" onClick={() => { clear(); closeCart() }}>Demo checkout</Button>
          </div>
        </>
      )}
    </Drawer>
  )
}
