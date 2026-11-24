import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, KeyRound, Mail, ShieldCheck } from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import Button from '../components/Button/Button'
import { useAuth } from '../context/AuthContext'
import { isEmail } from '../utils/validation'
import './CheckoutPage.css'
import './OrdersPage.css'

// Demo forgot-password: no email is ever sent. The 6-digit code is shown on screen.
const DEMO_OTP = '123456'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const sendCode = (e) => {
    e.preventDefault()
    if (!isEmail(email)) return setError('Enter a valid email address.')
    setError('')
    setStep(2)
  }

  const verifyCode = (e) => {
    e.preventDefault()
    if (otp.trim() !== DEMO_OTP) return setError('That code did not match. The demo code is 123456.')
    setError('')
    setStep(3)
  }

  const reset = (e) => {
    e.preventDefault()
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (password !== confirm) return setError('The two passwords do not match.')
    const res = resetPassword(email, password)
    if (!res.ok) return setError(res.error)
    setDone(true)
  }

  return (
    <div className="container orders-page">
      <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: 'Reset your password' }]} />
      <div className="wl-head">
        <h1>Reset your password</h1>
        <p>We will send a 6-digit code to your email. Demo flow — no real email is sent.</p>
      </div>
      <ol className="checkout__steps" aria-label="Reset steps">
        {['Email', 'OTP', 'New password'].map((label, i) => (
          <li key={label} className={step > i + 1 || done ? 'is-done' : step === i + 1 ? 'is-current' : ''}>
            <span>{step > i + 1 || done ? <Check size={14} /> : i + 1}</span> {label}
          </li>
        ))}
      </ol>

      {done ? (
        <section className="co-card trk-card" aria-labelledby="fp-done">
          <h2 id="fp-done"><ShieldCheck size={20} /> Password updated</h2>
          <p className="field__hint">Your password has been reset. Sign in with the new one.</p>
          <div className="co-card__foot"><Button onClick={() => navigate('/account')}>Go to login</Button></div>
        </section>
      ) : (
        <section className="co-card trk-card" aria-labelledby="fp-form">
          {step === 1 && (
            <form onSubmit={sendCode} className="trk-reasons">
              <h2 id="fp-form"><Mail size={20} /> Enter your email</h2>
              <label className="field"><span>Email</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
              </label>
              {error && <p className="field__err" role="alert">{error}</p>}
              <Button type="submit" size="lg">Send code</Button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={verifyCode} className="trk-reasons">
              <h2 id="fp-form"><KeyRound size={20} /> Enter the 6-digit code</h2>
              <p className="field__hint">Code sent to {email} (demo). Demo code: <strong>{DEMO_OTP}</strong></p>
              <label className="field"><span>Code</span>
                <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="123456" autoComplete="one-time-code" />
              </label>
              {error && <p className="field__err" role="alert">{error}</p>}
              <div className="co-card__foot">
                <Button type="submit" size="lg">Verify code</Button>
                <Button variant="secondary" onClick={() => setStep(1)}>Change email</Button>
              </div>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={reset} className="trk-reasons">
              <h2 id="fp-form"><ShieldCheck size={20} /> Choose a new password</h2>
              <label className="field"><span>New password</span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete="new-password" />
              </label>
              <label className="field"><span>Confirm new password</span>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat the new password" autoComplete="new-password" />
              </label>
              {error && <p className="field__err" role="alert">{error}</p>}
              <Button type="submit" size="lg">Reset password</Button>
            </form>
          )}
          <p className="field__hint"><Link to="/account" className="link-arrow">Back to log in</Link></p>
        </section>
      )}
    </div>
  )
}
