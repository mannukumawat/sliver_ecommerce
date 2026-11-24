// Shared admin helpers: deterministic demo stock + sample data used when the
// store has no real orders / customers / reviews yet. Sample rows are always
// labelled "Sample data" where they appear.

export const stockFor = (product) => ((product.id * 37) % 15) + 2

export const SAMPLE_REVENUE = 184200
export const SAMPLE_ORDERS = 132
export const SAMPLE_AVG = 1395
export const SAMPLE_VISITORS = 8412

// Last-14-days sample orders-per-day (used for the dashboard chart when empty).
export const SAMPLE_DAILY_ORDERS = [6, 8, 7, 10, 9, 12, 11, 13, 12, 15, 14, 16, 15, 18]

// Sample recent orders (board screen 25), shown only when aurave-orders-v1 is empty.
export const SAMPLE_RECENT_ORDERS = [
  { id: 'AUR-1041', customer: 'Ananya S.', total: 3299, status: 'Placed' },
  { id: 'AUR-1040', customer: 'Rohan M.', total: 4599, status: 'Shipped' },
  { id: 'AUR-1039', customer: 'Priya K.', total: 1799, status: 'Delivered' },
  { id: 'AUR-1038', customer: 'Vikram T.', total: 2199, status: 'Delivered' },
  { id: 'AUR-1037', customer: 'Meera J.', total: 5499, status: 'Refunded' },
]

export const SAMPLE_TOP_PRODUCTS = [
  { name: 'Halo Cluster Ring', sold: 18 },
  { name: 'Turquoise Choker Set', sold: 14 },
  { name: 'Silver Hoop Earrings', sold: 12 },
]

// Sample customers (board screen 28), shown only when there are no real customers.
export const SAMPLE_CUSTOMERS = [
  { name: 'Ananya Sharma', email: 'ananya@example.com', orders: 6, spent: 18400, joined: 'Mar 2026' },
  { name: 'Rohan Mehta', email: 'rohan@example.com', orders: 4, spent: 12750, joined: 'May 2026' },
  { name: 'Priya Kapoor', email: 'priya@example.com', orders: 5, spent: 9300, joined: 'Jan 2026' },
  { name: 'Vikram Tiwari', email: 'vikram@example.com', orders: 3, spent: 6100, joined: 'Aug 2026' },
  { name: 'Meera Joshi', email: 'meera@example.com', orders: 7, spent: 21900, joined: 'Nov 2025' },
  { name: 'Sana Khan', email: 'sana@example.com', orders: 2, spent: 5200, joined: 'Oct 2026' },
]

export const SAMPLE_REVIEWS = [
  { id: 1, product: 'Halo Cluster Ring', customer: 'Ananya S.', rating: 5, text: 'Beautiful ring, the stones catch the light so well. Arrived in lovely gift packaging.', date: '2026-11-22', approved: true },
  { id: 2, product: 'Silver Hoop Earrings', customer: 'Rohan M.', rating: 5, text: 'Bought these as a gift — my wife wears them every day. Light and comfortable.', date: '2026-11-20', approved: true },
  { id: 3, product: 'Cluster Pendant Necklace', customer: 'Priya K.', rating: 4, text: 'Elegant and delicate. The chain is a little shorter than I expected, but it looks lovely.', date: '2026-11-18', approved: true },
  { id: 4, product: 'Emerald Crystal Set', customer: 'Meera J.', rating: 5, text: 'Stunning set, perfect for festive evenings. The green stones are exactly as pictured.', date: '2026-11-15', approved: true },
  { id: 5, product: 'Cable Chain Bracelet', customer: 'Vikram T.', rating: 3, text: 'Good quality chain, but the clasp feels a bit stiff. Hope it loosens with wear.', date: '2026-11-12', approved: false },
]

export const customerNameFromOrder = (order) => {
  if (order.address?.fullName) return order.address.fullName
  const email = order.userEmail || order.email || ''
  const local = email.split('@')[0] || 'Guest'
  return local.replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export const shortName = (name) => {
  const parts = String(name || '').trim().split(/\s+/)
  if (parts.length < 2) return parts[0] || 'Guest'
  return `${parts[0]} ${parts[parts.length - 1][0]}.`
}
