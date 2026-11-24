import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Mail, MessageCircle, Phone } from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import Button from '../components/Button/Button'
import './CheckoutPage.css'
import './OrdersPage.css'

const FAQS = [
  { q: 'How do I track my order?', a: 'Go to My orders and open the order — the tracking timeline shows every step from Placed to Delivered, with a demo tracking ID and courier name. Guest orders can be found with the order ID and email used at checkout.' },
  { q: 'How do returns work?', a: 'Delivered orders can be returned within 7 days of delivery. Open the order, choose Return items, pick the pieces and a pickup slot — we collect it from your door and refund the original payment method (demo) after pickup.' },
  { q: 'Can I cancel my order?', a: 'Yes, while it is Placed or Packed. Open the order, choose Cancel order and tell us why. The refund is initiated at once and completes in 3–5 business days (demo — no real money moves).' },
  { q: 'Which payment methods do you accept?', a: 'UPI, credit/debit cards and NetBanking — demo payments only, no real charge. Cash on Delivery is not offered.' },
  { q: 'When will my order arrive?', a: 'Orders are delivered in about 5 days. Shipping is complimentary above ₹1,999, otherwise ₹99.' },
  { q: 'Do you ship outside India?', a: 'This demo store ships within India only. International shipping is not available yet.' },
]

export default function HelpPage() {
  const [open, setOpen] = useState(0)
  return (
    <div className="container orders-page">
      <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: 'Help' }]} />
      <div className="wl-head">
        <h1>Help &amp; support</h1>
        <p>Answers to the questions we hear most, and how to reach us.</p>
      </div>
      <div className="checkout__grid">
        <div className="checkout__main">
          <section className="co-card" aria-labelledby="faq-title">
            <h2 id="faq-title">Frequently asked questions</h2>
            <ul className="faq-list">
              {FAQS.map((f, i) => (
                <li key={f.q}>
                  <button type="button" className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                    {f.q} <ChevronDown size={16} className={open === i ? 'is-open' : ''} />
                  </button>
                  {open === i && <p className="faq-a">{f.a}</p>}
                </li>
              ))}
            </ul>
          </section>
        </div>
        <aside className="checkout__side">
          <div className="co-card co-summary">
            <h2>Contact us</h2>
            <p className="co-summary__note"><Mail size={15} /> hello@aurave.in</p>
            <p className="co-summary__note"><Phone size={15} /> +91 98765 43210</p>
            <p className="co-summary__note"><MessageCircle size={15} /> We reply within one business day.</p>
            <Button block to="/account/orders">Track your order</Button>
            <p className="co-summary__note">Policies: <Link to="/policy/shipping" className="link-arrow">Shipping &amp; returns</Link> · <Link to="/policy/privacy" className="link-arrow">Privacy</Link> · <Link to="/policy/terms" className="link-arrow">Terms</Link></p>
          </div>
        </aside>
      </div>
    </div>
  )
}
