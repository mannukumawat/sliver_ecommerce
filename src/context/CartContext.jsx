import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { products } from '../data/products'

const CartContext = createContext(null)
const MAX_QTY = 10

export function CartProvider({ children }) {
  const [lines, setLines] = useLocalStorage('aurave.cart', [])

  const add = useCallback((id, qty = 1) => {
    setLines((cur) => {
      const found = cur.find((l) => l.id === id)
      if (found) return cur.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l))
      return [...cur, { id, qty: Math.min(MAX_QTY, qty) }]
    })
  }, [setLines])

  const setQty = useCallback((id, qty) => {
    setLines((cur) => (qty <= 0 ? cur.filter((l) => l.id !== id) : cur.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, qty) } : l))))
  }, [setLines])

  const remove = useCallback((id) => setLines((cur) => cur.filter((l) => l.id !== id)), [setLines])
  const clear = useCallback(() => setLines([]), [setLines])

  const value = useMemo(() => {
    const items = lines
      .map((l) => ({ ...l, product: products.find((p) => p.id === l.id) }))
      .filter((l) => l.product)
    return {
      items,
      count: items.reduce((n, l) => n + l.qty, 0),
      subtotal: items.reduce((n, l) => n + l.qty * l.product.price, 0),
      add, setQty, remove, clear, MAX_QTY,
    }
  }, [lines, add, setQty, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
