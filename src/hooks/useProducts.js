import { useCallback, useEffect, useState } from 'react'
import { allProducts } from '../data/products'

// Reactive product list: built-in catalogue + admin-added products from localStorage.
export function useProducts() {
  const [list, setList] = useState(() => allProducts())
  useEffect(() => {
    const refresh = () => setList(allProducts())
    window.addEventListener('aurave:products-changed', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('aurave:products-changed', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])
  const refresh = useCallback(() => setList(allProducts()), [])
  return { products: list, refresh }
}
