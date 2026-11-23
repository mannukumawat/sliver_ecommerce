import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false)
  const [quickViewId, setQuickViewId] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((msg) => {
    setToast({ msg, key: Date.now() })
  }, [])

  const value = useMemo(() => ({
    cartOpen, openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false),
    quickViewId, openQuickView: setQuickViewId, closeQuickView: () => setQuickViewId(null),
    toast, showToast, clearToast: () => setToast(null),
  }), [cartOpen, quickViewId, toast, showToast])

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export const useUI = () => useContext(UIContext)
