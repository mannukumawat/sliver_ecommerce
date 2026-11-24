import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { addDays } from '../utils/validation'
import { deriveStatus, orderTimeline, returnWindow } from '../utils/orderStatus'

export { deriveStatus, orderTimeline }

const ORDERS_KEY = 'aurave-orders-v1'
const SEQ_KEY = 'aurave-order-seq-v1'
const DELIVERY_DAYS = 5

const OrdersContext = createContext(null)

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useLocalStorage(ORDERS_KEY, [])

  const placeOrder = useCallback(({ items, subtotal, shipping, total, address, email, payment, userEmail, coupon = null, discount = 0 }) => {
    let seq = 1001
    try { seq = Number(localStorage.getItem(SEQ_KEY)) || 1001 } catch { /* ignore */ }
    const id = `AUR-${seq}`
    try { localStorage.setItem(SEQ_KEY, String(seq + 1)) } catch { /* ignore */ }
    const order = {
      id,
      placedAt: new Date().toISOString(),
      estimatedDelivery: addDays(new Date().toISOString(), DELIVERY_DAYS),
      items: items.map(({ product, qty }) => ({
        slug: product.slug, name: product.name, price: product.price, qty,
        image: product.art?.photos?.[0] || '',
      })),
      subtotal, shipping, total,
      coupon, discount, // applied demo coupon, e.g. { code: 'WELCOME10', discount: 330 }
      address: { ...address },
      email: email || userEmail || '',
      userEmail: userEmail || null,
      payment, // { method: 'UPI'|'Card'|'NetBanking', label: display-only, e.g. 'UPI · ab••@okhdfc' / 'Visa •••• 4242' }
      status: 'Placed',
    }
    setOrders((cur) => [order, ...cur])
    return order
  }, [setOrders])

  const cancelOrder = useCallback((id, reason = '', note = '') => {
    setOrders((cur) => cur.map((o) => {
      const status = deriveStatus(o)
      if (o.id !== id || (status !== 'Placed' && status !== 'Packed')) return o
      return { ...o, status: 'Cancelled', cancelledAt: new Date().toISOString(), cancelReason: reason, cancelNote: note }
    }))
  }, [setOrders])

  // Demo return: only for delivered orders inside the 7-day return window.
  const requestReturn = useCallback((id, payload) => {
    const target = orders.find((o) => o.id === id)
    if (!target || deriveStatus(target) !== 'Delivered' || !returnWindow(target).open || target.returnRequest) return false
    setOrders((cur) => cur.map((o) => (o.id === id
      ? { ...o, returnRequest: { ...payload, requestedAt: new Date().toISOString() } }
      : o)))
    return true
  }, [orders, setOrders])

  // Return the order with its live (day-derived) status, not the stored one.
  const getOrder = useCallback((id) => {
    const found = orders.find((o) => o.id === id)
    return found ? { ...found, status: deriveStatus(found) } : null
  }, [orders])

  // Admin override: set the order status manually (stored as manualStatus,
  // which deriveStatus returns before the day-based logic). 'Cancelled' also
  // records cancelledAt so the refund timeline works.
  const setManualStatus = useCallback((id, status) => {
    setOrders((cur) => cur.map((o) => {
      if (o.id !== id) return o
      if (status === 'Cancelled') {
        return { ...o, manualStatus: 'Cancelled', status: 'Cancelled', cancelledAt: o.cancelledAt || new Date().toISOString() }
      }
      return { ...o, manualStatus: status, status, cancelledAt: null, cancelReason: undefined }
    }))
  }, [setOrders])

  const value = useMemo(() => ({
    orders: orders.map((o) => ({ ...o, status: deriveStatus(o) })),
    placeOrder, cancelOrder, requestReturn, getOrder, setManualStatus,
  }), [orders, placeOrder, cancelOrder, requestReturn, getOrder, setManualStatus])

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export const useOrders = () => useContext(OrdersContext)
