import { useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import NotFoundPage from './NotFoundPage'
import './SimplePages.css'

const POLICIES = {
  shipping: { title: 'Shipping & returns', body: 'Placeholder policy for the demo. Orders above ₹1,999 would ship free; returns would be accepted within a set window. Final terms to be written before launch.' },
  privacy: { title: 'Privacy policy', body: 'Placeholder. This demo collects no data: the bag and wishlist live only in your browser, and the newsletter form sends nothing.' },
  terms: { title: 'Terms & conditions', body: 'Placeholder terms for a frontend prototype. Not a real store; no purchases can be made.' },
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
        <p>{p.body}</p>
      </section>
    </div>
  )
}
