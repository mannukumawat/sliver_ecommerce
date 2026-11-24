import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import Button from '../../components/Button/Button'
import { useAdmin } from '../../context/AdminContext'
import { isEmail } from '../../utils/validation'
import './Admin.css'

export default function AdminLoginPage() {
  const { isAdmin, login, demoEmail, demoPassword } = useAdmin()
  const navigate = useNavigate()
  const [email, setEmail] = useState(demoEmail)
  const [password, setPassword] = useState(demoPassword)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [forgotNote, setForgotNote] = useState('')

  if (isAdmin) return <Navigate to="/admin" replace />

  const submit = (e) => {
    e.preventDefault()
    setError('')
    if (!isEmail(email)) { setError('Enter a valid email address.'); return }
    const res = login(email, password)
    if (!res.ok) { setError(res.error); return }
    navigate('/admin')
  }

  return (
    <div className="admin-login">
      <section className="admin-login__panel">
        <div className="admin__brand"><strong>✦ AURAVÉ</strong><span>Admin</span></div>
        <h1>Manage your store in one place.</h1>
        <p>Orders, products, customers, coupons and settings — the AURAVÉ admin panel.</p>
        <ul className="admin-login__stats">
          <li><Check size={16} /> 132 orders this month</li>
          <li><Check size={16} /> 24 products live</li>
          <li><Check size={16} /> 4.8★ average rating</li>
        </ul>
      </section>
      <section className="admin-login__formwrap">
        <div>
          <h2>Admin log in</h2>
          <p className="admin__note">For store staff only. Demo panel — sample data.</p>
          <form className="admin__form" onSubmit={submit}>
            <label className="admin__field"><span>Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@aurave.in" autoComplete="email" />
            </label>
            <label className="admin__field"><span>Password</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your admin password" autoComplete="current-password" />
            </label>
            <div className="admin-login__row">
              <label className="admin__check"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me</label>
              <button type="button" className="linklike" onClick={() => setForgotNote('Password reset is disabled in this demo — use the demo credentials below.')}>Forgot password?</button>
            </div>
            {error && <p className="admin__err" role="alert">{error}</p>}
            {forgotNote && <p className="admin__note" role="status">{forgotNote}</p>}
            <Button type="submit" block>Log in to admin</Button>
          </form>
          <p className="admin-login__demo">Demo: <strong>{demoEmail} / {demoPassword}</strong></p>
        </div>
      </section>
    </div>
  )
}
