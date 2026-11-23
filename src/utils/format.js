const fmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
export const inr = (n) => fmt.format(n)
export const discountPct = (p) => (p.mrp ? Math.round((1 - p.price / p.mrp) * 100) : 0)
export const FREE_SHIPPING_AT = 1999
