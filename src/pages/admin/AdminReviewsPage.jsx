import { Star } from 'lucide-react'
import Button from '../../components/Button/Button'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { formatDate } from '../../utils/validation'
import { SAMPLE_REVIEWS } from './adminUtils'

const REVIEWS_KEY = 'aurave-reviews-v1'

const stars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating)

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useLocalStorage(REVIEWS_KEY, SAMPLE_REVIEWS)

  const toggle = (id) => setReviews((cur) => cur.map((r) => (r.id === id ? { ...r, approved: !r.approved } : r)))
  const remove = (id) => setReviews((cur) => cur.filter((r) => r.id !== id))

  const approved = reviews.filter((r) => r.approved).length

  return (
    <>
      <p className="admin__note">
        <span className="admin__badge admin__badge--sample">Sample data</span> {reviews.length} reviews · {approved} approved · {reviews.length - approved} hidden.
        Reviews are demo content stored in this browser only.
      </p>
      <section className="admin__card">
        {reviews.length === 0 ? (
          <p className="admin__note">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <article key={r.id} className="admin__review">
              <div className="admin__review-head">
                <strong>{r.product}</strong>
                <span className="admin__stars" aria-label={`${r.rating} out of 5 stars`}>{stars(r.rating)}</span>
              </div>
              <p className="admin__note">{r.text}</p>
              <div className="admin__formrow" style={{ justifyContent: 'space-between' }}>
                <span className="admin__note">{r.customer} · {formatDate(`${r.date}T00:00:00`)} · {r.approved ? <span className="admin__badge admin__badge--active">Approved</span> : <span className="admin__badge admin__badge--warn">Hidden</span>}</span>
                <span className="admin__formrow">
                  <Button size="sm" variant="secondary" onClick={() => toggle(r.id)}>{r.approved ? 'Hide' : 'Approve'}</Button>
                  <Button size="sm" variant="secondary" onClick={() => remove(r.id)}>Delete</Button>
                </span>
              </div>
            </article>
          ))
        )}
      </section>
      <p className="admin__note"><Star size={14} /> Approved reviews are the ones shown on product pages in a live store. In this demo they are managed here only.</p>
    </>
  )
}
