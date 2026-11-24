import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../Button/Button'
import { useAuth } from '../../context/AuthContext'
import { isEmail } from '../../utils/validation'
import './AuthForm.css'

// Shared login / signup form — used in the account drawer and on account pages.
export default function AuthForm({ defaultMode = 'login', onDone }) {
  const { login, signup, demoEmail, demoPassword } = useAuth()
  const [mode, setMode] = useState(defaultMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setError('')
    if (!isEmail(email)) return setError('Enter a valid email address.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (mode === 'signup' && name.trim().length < 2) return setError('Please enter your name.')
    const res = mode === 'signup' ? signup(name, email, password) : login(email, password)
    if (!res.ok) return setError(res.error)
    setDone(true)
    onDone?.()
  }

  const fillDemo = () => { setEmail(demoEmail); setPassword(demoPassword); setError('') }

  if (done) return <p className="auth__ok">Welcome back — you are signed in.</p>

  return (
    <div className="auth">
      <div className="auth__tabs" role="tablist" aria-label="Account">
        <button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'is-active' : ''} onClick={() => { setMode('login'); setError('') }}>Login</button>
        <button type="button" role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'is-active' : ''} onClick={() => { setMode('signup'); setError('') }}>Create account</button>
      </div>
      <form onSubmit={submit} noValidate>
        {mode === 'signup' && (
          <label className="field"><span>Full name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your name" />
          </label>
        )}
        <label className="field"><span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" />
        </label>
        <label className="field"><span>Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} placeholder="At least 6 characters" />
        </label>
        {error && <p className="field__err" role="alert">{error}</p>}
        <Button block size="lg" type="submit">{mode === 'signup' ? 'Create account' : 'Login'}</Button>
      </form>
      {mode === 'login' && <p className="auth__note"><Link to="/forgot-password" className="link-arrow">Forgot your password?</Link></p>}
      <p className="auth__demo">
        Demo account — <button type="button" onClick={fillDemo}>fill it in</button><br />
        <code>{demoEmail}</code> · <code>{demoPassword}</code>
      </p>
      <p className="auth__note">Demo login only — accounts are stored in this browser, not on a server. Never use a real password here.</p>
    </div>
  )
}
