import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [ids, setIds] = useLocalStorage('aurave.wishlist', [])
  const toggle = useCallback((id) => setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])), [setIds])
  const value = useMemo(() => ({ ids, count: ids.length, has: (id) => ids.includes(id), toggle }), [ids, toggle])
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export const useWishlist = () => useContext(WishlistContext)
