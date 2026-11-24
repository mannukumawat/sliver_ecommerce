import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import Button from '../components/Button/Button'
import { useOrders } from '../context/OrdersContext'
import { inr } from '../utils/format'
import { formatDate as fmtDate } from '../utils/validation'
import './SimplePages.css'

export default function OrderSuccessPage() {
  const [params] = useSearchParams()
  const orderId = params.get('orderId')
  const { getOrder } = useOrders()
  const order = orderId ? getOrder(orderId) : null

  return (
    <div className="container">
      <div className="simple">
        <CheckCircle2 size={56} strokeWidth={1.2} color="var(--royal)" aria-hidden="true" />
        <p className="eyebrow">Order placed</p>
        <h1>Thank you — your order is confirmed</h1>
        {order ? (
          <>
            <p>Order <strong>{order.id}</strong> · {inr(order.total)} · estimated delivery by <strong>{fmtDate(order.estimatedDelivery)}</strong>.</p>
            <p>A confirmation has been sent to {order.email}. Demo order — no payment was taken.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button to={`/account/orders/${order.id}`}>View order</Button>
              <Button to="/collection" variant="secondary">Continue shopping</Button>
            </div>
          </>
        ) : (
          <>
            <p>Your order was placed. You can find it in your orders.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button to="/account/orders">View my orders</Button>
              <Button to="/collection" variant="secondary">Continue shopping</Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
