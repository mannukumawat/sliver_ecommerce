import Button from '../components/Button/Button'
import './SimplePages.css'

export default function NotFoundPage() {
  return (
    <section className="simple container">
      <p className="eyebrow">Error 404</p>
      <h1>This page has wandered off</h1>
      <p>The link may be old, or the piece you want has moved.</p>
      <Button to="/collection">Back to the collection</Button>
    </section>
  )
}
