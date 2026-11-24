import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

// Store settings (demo, localStorage only). Admin edits these; the storefront reads them.
const SETTINGS_KEY = 'aurave-settings-v1'

export const DEFAULT_SETTINGS = {
  storeName: 'AURAVÉ',
  announcement: 'Complimentary Shipping on Orders Above ₹1,999',
  freeShippingAt: 1999,
  shippingFlat: 99,
  contactEmail: 'hello@aurave.in',
  contactPhone: '+91 98765 43210',
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage(SETTINGS_KEY, DEFAULT_SETTINGS)
  const merged = { ...DEFAULT_SETTINGS, ...(settings || {}) }

  const updateSettings = useCallback((patch) => {
    setSettings((cur) => ({ ...DEFAULT_SETTINGS, ...(cur || {}), ...patch }))
  }, [setSettings])

  const value = useMemo(() => ({ settings: merged, updateSettings }), [merged, updateSettings])
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export const useSettings = () => useContext(SettingsContext)
