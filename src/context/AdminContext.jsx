import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

// Demo admin auth (localStorage only, no server). This is a frontend demo:
// the credentials below are public demo credentials, never real ones.
const ADMIN_AUTH_KEY = 'aurave-admin-auth-v1'

export const ADMIN_EMAIL = 'admin@aurave.in'
export const ADMIN_PASSWORD = 'admin1234'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useLocalStorage(ADMIN_AUTH_KEY, null)

  const login = useCallback((email, password) => {
    const cleanEmail = String(email || '').trim().toLowerCase()
    if (cleanEmail !== ADMIN_EMAIL || String(password || '') !== ADMIN_PASSWORD) {
      return { ok: false, error: 'Email or password did not match. Use the demo credentials below.' }
    }
    setAdmin({ name: 'Store Admin', email: ADMIN_EMAIL })
    return { ok: true }
  }, [setAdmin])

  const logout = useCallback(() => setAdmin(null), [setAdmin])

  const value = useMemo(() => ({
    admin, isAdmin: Boolean(admin), login, logout,
    demoEmail: ADMIN_EMAIL, demoPassword: ADMIN_PASSWORD,
  }), [admin, login, logout])

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export const useAdmin = () => useContext(AdminContext)
