import { useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import NotFoundPage from './NotFoundPage'
import './SimplePages.css'
import './OrdersPage.css'

// Written store policies for the demo store. Payment, shipping and returns are
// demo-only: no real money moves and no real shipment is made.
const POLICIES = {
  shipping: {
    title: 'Shipping & returns',
    sections: [
      ['Shipping', 'We ship within India only. Orders are packed within 1 business day and delivered in about 5 days. Delivery is free on orders above ₹1,999; below that, a flat ₹99 shipping fee applies. You can follow your order from My orders — the tracking timeline shows every step from Placed to Delivered.'],
      ['Returns', 'Delivered orders can be returned within 7 days of delivery. Open the order, choose Return items, and pick the pieces, a reason and a pickup slot — we collect the parcel from your door at no charge. Refunds go back to the original payment method within 3–5 business days of pickup. Items must be unworn, in their original packaging, with the AURAVÉ box and certificate.'],
      ['Cancellations', 'You can cancel an order while it is Placed or Packed, from the order detail page. Once the order is handed to the courier it can no longer be cancelled, but it can be returned after delivery.'],
      ['Damaged or wrong items', 'If your piece arrives damaged or is not what you ordered, write to hello@aurave.in within 7 days with your order ID and a photo. We will arrange a free replacement or a full refund.'],
    ],
  },
  privacy: {
    title: 'Privacy policy',
    sections: [
      ['What we collect', 'When you create an account we store your name, email and password (obscured) in this browser only. When you order, we store your delivery address, phone number and order history the same way. The bag and wishlist also live only in your browser.'],
      ['What we do not collect', 'This demo store has no server and sends nothing anywhere: there is no analytics, no advertising tracker and no email service. The newsletter form stores nothing, and the "confirmation email" mentioned after checkout is demo copy — no email is actually sent.'],
      ['Payments', 'Payments are simulated. Card and UPI details are never stored — only a masked hint (for example, "UPI · ab••@okhdfc" or "Visa •••• 4242") is kept with the order so you can recognise how you paid.'],
      ['Your choices', 'You can clear everything this store has saved by clearing your browser storage for this site. That removes your account, addresses, bag, wishlist and orders.'],
    ],
  },
  terms: {
    title: 'Terms & conditions',
    sections: [
      ['About this store', 'AURAVÉ is a frontend demonstration store. Products, prices, ratings and reviews are sample content, and no purchase can be completed: checkout, payment, tracking, returns and refunds are all simulated in your browser.'],
      ['Orders', 'Placing an order creates a demo order stored in your browser. Nothing is charged, nothing is shipped, and no confirmation email is sent. Order numbers (AUR-1001 and up) exist only on your device.'],
      ['Pricing and availability', 'Prices are shown in Indian rupees and include all taxes. A piece shown in stock may be a sample listing; availability is not guaranteed. Coupons are demo codes with the limits shown on the Coupons & offers page.'],
      ['Returns and refunds', 'The returns and refund timelines shown in your orders are part of the demo. No real refund is processed, because no real payment was taken.'],
      ['Changes', 'We may change these terms and the demo content at any time. If you have questions, write to hello@aurave.in.'],
    ],
  },
}

export default function PolicyPage() {
  const { slug } = useParams()
  const p = POLICIES[slug]
  if (!p) return <NotFoundPage />
  return (
    <div className="container">
      <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: p.title }]} />
      <section className="simple simple--left">
        <h1>{p.title}</h1>
        <div className="policy-body">
          {p.sections.map(([h, body]) => (
            <div key={h}><h2>{h}</h2><p>{body}</p></div>
          ))}
        </div>
      </section>
    </div>
  )
}
