import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

// Demo coupons (localStorage only). One coupon per order. Discounts are demo-only:
// no real money moves at checkout.
const COUPONS_KEY = 'aurave-coupons-v1'

export const DEFAULT_COUPONS = [
  { code: 'WELCOME10', kind: 'percent', value: 10, minOrder: 1499, validTill: '2026-12-31', desc: '10% off your first order', active: true, used: 214 },
  { code: 'FESTIVE15', kind: 'percent', value: 15, minOrder: 2999, validTill: '2026-12-15', desc: '15% off sets & bestsellers', active: true, used: 96, onlyEligible: true },
  { code: 'SILVER5', kind: 'shipping', value: 0, minOrder: 0, validTill: '2027-01-31', desc: 'Free shipping, no minimum order', active: true, used: 301 },
  { code: 'DIWALI20', kind: 'percent', value: 20, minOrder: 1999, validTill: '2026-11-05', desc: '20% off', active: false, used: 188 },
]

const isEligible = (p) => p.category === 'sets' || p.bestseller

export function validateCoupon(coupon, subtotal, items = []) {
  if (!coupon) return { ok: false, error: 'Enter a coupon code.' }
  if (!coupon.active) return { ok: false, error: `${coupon.code} is no longer active.` }
  if (new Date(coupon.validTill + 'T23:59:59') < new Date()) return { ok: false, error: `${coupon.code} expired on ${coupon.validTill}.` }
  if (subtotal < coupon.minOrder) return { ok: false, error: `${coupon.code} needs a minimum order of ₹${coupon.minOrder.toLocaleString('en-IN')}.` }
  if (coupon.onlyEligible && !items.some(({ product }) => isEligible(product))) {
    return { ok: false, error: `${coupon.code} applies to sets & bestsellers only.` }
  }
  if (coupon.kind === 'shipping') return { ok: true, coupon, discount: 0, freeShipping: true }
  const base = coupon.onlyEligible
    ? items.filter(({ product }) => isEligible(product)).reduce((n, { product, qty }) => n + product.price * qty, 0)
    : subtotal
  return { ok: true, coupon, discount: Math.round((base * coupon.value) / 100), freeShipping: false }
}

const CouponsContext = createContext(null)

export function CouponsProvider({ children }) {
  const [coupons, setCoupons] = useLocalStorage(COUPONS_KEY, DEFAULT_COUPONS)

  const findCoupon = useCallback((code) => {
    const clean = String(code || '').trim().toUpperCase()
    return (coupons || []).find((c) => c.code.toUpperCase() === clean) || null
  }, [coupons])

  const addCoupon = useCallback((coupon) => {
    const clean = { ...coupon, code: String(coupon.code || '').trim().toUpperCase(), active: true, used: 0 }
    setCoupons((cur) => [...(cur || []), clean])
    return clean
  }, [setCoupons])

  const setCouponActive = useCallback((code, active) => {
    setCoupons((cur) => (cur || []).map((c) => (c.code === code ? { ...c, active } : c)))
  }, [setCoupons])

  const value = useMemo(() => ({ coupons: coupons || [], findCoupon, addCoupon, setCouponActive }), [coupons, findCoupon, addCoupon, setCouponActive])
  return <CouponsContext.Provider value={value}>{children}</CouponsContext.Provider>
}

export const useCoupons = () => useContext(CouponsContext)
