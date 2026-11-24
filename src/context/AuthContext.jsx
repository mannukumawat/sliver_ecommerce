import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { demoHash } from '../utils/validation'

const USERS_KEY = 'aurave-users-v1'
const AUTH_KEY = 'aurave-auth-v1'
const DEMO_USER = { name: 'Demo Customer', email: 'demo@aurave.in' }
const DEMO_PASSWORD = 'demo1234'

const AuthContext = createContext(null)

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    const users = raw ? JSON.parse(raw) : []
    if (!users.some((u) => u.email === DEMO_USER.email)) {
      users.push({ ...DEMO_USER, pass: demoHash(DEMO_PASSWORD) })
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }
    return users
  } catch {
    return [{ ...DEMO_USER, pass: demoHash(DEMO_PASSWORD) }]
  }
}

export function readUsers() {
  return loadUsers()
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  useEffect(() => {
    try {
      if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user))
      else localStorage.removeItem(AUTH_KEY)
    } catch { /* storage unavailable */ }
  }, [user])

  const signup = useCallback((name, email, password) => {
    const cleanEmail = email.trim().toLowerCase()
    const users = loadUsers()
    if (users.some((u) => u.email === cleanEmail)) return { ok: false, error: 'An account with this email already exists. Try logging in.' }
    const account = { name: name.trim(), email: cleanEmail, pass: demoHash(password) }
    try { localStorage.setItem(USERS_KEY, JSON.stringify([...users, account])) } catch { /* ignore */ }
    setUser({ name: account.name, email: account.email })
    return { ok: true }
  }, [])

  const login = useCallback((email, password) => {
    const cleanEmail = email.trim().toLowerCase()
    const users = loadUsers()
    const found = users.find((u) => u.email === cleanEmail)
    if (!found || found.pass !== demoHash(password)) {
      return { ok: false, error: 'Email or password did not match. Check the demo account below.' }
    }
    setUser({ name: found.name, email: found.email })
    return { ok: true }
  }, [])

  const logout = useCallback(() => setUser(null), [])

  // Demo password reset (OTP step happens on the forgot-password page).
  const resetPassword = useCallback((email, password) => {
    const cleanEmail = email.trim().toLowerCase()
    const users = loadUsers()
    if (!users.some((u) => u.email === cleanEmail)) return { ok: false, error: 'No account exists for this email.' }
    const next = users.map((u) => (u.email === cleanEmail ? { ...u, pass: demoHash(password) } : u))
    try { localStorage.setItem(USERS_KEY, JSON.stringify(next)) } catch { /* ignore */ }
    return { ok: true }
  }, [])

  const updateName = useCallback((name) => {
    const clean = name.trim()
    if (!clean) return
    setUser((cur) => {
      if (!cur) return cur
      const users = loadUsers().map((u) => (u.email === cur.email ? { ...u, name: clean } : u))
      try { localStorage.setItem(USERS_KEY, JSON.stringify(users)) } catch { /* ignore */ }
      return { ...cur, name: clean }
    })
  }, [])

  const value = useMemo(() => ({
    user, isLoggedIn: Boolean(user), signup, login, logout, updateName, resetPassword,
    demoEmail: DEMO_USER.email, demoPassword: DEMO_PASSWORD,
  }), [user, signup, login, logout, updateName, resetPassword])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
