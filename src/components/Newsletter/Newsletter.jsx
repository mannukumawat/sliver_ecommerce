import { useState } from 'react'
import { Check } from 'lucide-react'
import Button from '../Button/Button'
import './Newsletter.css'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function Newsletter({ dark = false }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!EMAIL.test(email.trim())) return setError('Please enter a valid email address.')
    setError('')
    setDone(true)
  }

  return (
    <section className={`news ${dark ? 'news--dark' : ''}`} aria-labelledby="news-title">
      <div className="container news__inner">
        <div>
          <p className="eyebrow">The AURAVÉ letter</p>
          <h2 id="news-title">First look at every new design</h2>
          <p className="news__copy">Early access to new arrivals and quiet, occasional notes. Demo form: nothing is sent or stored.</p>
        </div>
        {done ? (
          <p className="news__ok" role="status"><Check size={20} /> Thank you. This is a frontend demo, so no email was actually subscribed.</p>
        ) : (
          <form onSubmit={submit} noValidate className="news__form">
            <label htmlFor="news-email" className="sr-only">Email address</label>
            <div className="news__row">
              <input id="news-email" type="email" inputMode="email" autoComplete="email" placeholder="Your email address" value={email}
                onChange={(e) => { setEmail(e.target.value); if (error) setError('') }}
                aria-invalid={Boolean(error)} aria-describedby={error ? 'news-err' : undefined} />
              <Button type="submit" variant={dark ? 'light' : 'primary'}>Subscribe</Button>
            </div>
            {error && <p id="news-err" className="news__err" role="alert">{error}</p>}
          </form>
        )}
      </div>
    </section>
  )
}
