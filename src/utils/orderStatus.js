// Shared order status / tracking / refund / return helpers (frontend demo only).
// Everything is derived from the order's placed date — no server, no real courier.
// Keep the day-based delivery logic in ONE place: Placed (day 0) -> Packed (day 1)
// -> Shipped (days 2-3) -> Delivered (day 4+), estimated delivery +5 days.
import { addDays, formatDate } from './validation'

export const DELIVERY_DAYS = 5
export const RETURN_WINDOW_DAYS = 7
export const COURIER_NAME = 'Delhivery (demo)'

export const CANCEL_REASONS = [
  'Changed my mind',
  'Ordered the wrong item',
  'Delivery is taking too long',
  'Found a better price elsewhere',
  'Other',
]

export const RETURN_REASONS = [
  'Wrong size',
  'Not as expected',
  'Damaged on arrival',
  'Defective item',
  'Changed my mind',
]

export const REFUND_METHODS = [
  { id: 'original', label: 'Original payment method (demo)' },
  { id: 'wallet', label: 'AURAVÉ wallet credit' },
]

export const daysSince = (iso) => Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)

// Demo status: advances one step per day from the order date, no server needed.
// An admin-set manualStatus always wins: it overrides the day-based logic
// (and 'Cancelled' means cancelled, with cancelledAt set by the caller).
export function deriveStatus(order) {
  if (order.manualStatus) return order.manualStatus
  if (order.status === 'Cancelled') return 'Cancelled'
  const days = daysSince(order.placedAt)
  if (days <= 0) return 'Placed'
  if (days === 1) return 'Packed'
  if (days <= 3) return 'Shipped'
  return 'Delivered'
}

export function orderTimeline(order) {
  const steps = [
    { key: 'Placed', date: order.placedAt },
    { key: 'Packed', date: addDays(order.placedAt, 1) },
    { key: 'Shipped', date: addDays(order.placedAt, 2) },
    { key: 'Delivered', date: addDays(order.placedAt, DELIVERY_DAYS) },
  ]
  const current = deriveStatus(order)
  const orderOf = { Placed: 0, Packed: 1, Shipped: 2, Delivered: 3 }
  return steps.map((s) => ({ ...s, done: order.status !== 'Cancelled' && orderOf[s.key] <= orderOf[current] }))
}

// Deterministic demo tracking ID from the order number, e.g. AUR-1001 -> AURV8472019365.
export function trackingIdFor(order) {
  const id = String(order.id || 'AUR-0')
  let h = 2166136261
  for (let i = 0; i < id.length; i += 1) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const digits = String(Math.abs(h)).padStart(10, '0').slice(0, 10)
  return `AURV${digits}`
}

// Courier tracking events, one per day, consistent with deriveStatus.
// An event is done once its date has passed; later events show as "Expected".
export function trackingEvents(order) {
  const city = order.address?.city || 'your city'
  const defs = [
    { key: 'placed', label: 'Order placed', location: 'AURAVÉ studio, Jaipur', day: 0 },
    { key: 'packed', label: 'Packed', location: 'AURAVÉ studio, Jaipur', day: 1 },
    { key: 'shipped', label: 'Handed to courier', location: 'Delhivery hub, Jaipur', day: 2 },
    { key: 'transit', label: 'In transit', location: 'Delhi sorting hub', day: 3 },
    { key: 'out', label: 'Out for delivery', location: city, day: 4 },
    { key: 'delivered', label: 'Delivered', location: city, day: DELIVERY_DAYS },
  ]
  const now = Date.now()
  return defs.map((d) => {
    const date = addDays(order.placedAt, d.day)
    return { ...d, date, done: new Date(date).getTime() <= now }
  })
}

// Refund after a cancellation: Initiated (day 0) -> Processing (day 1) -> Refunded (day 2+).
export function refundStatus(order) {
  if (!order.cancelledAt) return null
  const days = daysSince(order.cancelledAt)
  const status = days <= 0 ? 'Initiated' : days === 1 ? 'Processing' : 'Refunded'
  const steps = [
    { key: 'Initiated', date: order.cancelledAt },
    { key: 'Processing', date: addDays(order.cancelledAt, 1) },
    { key: 'Refunded', date: addDays(order.cancelledAt, 2) },
  ]
  const orderOf = { Initiated: 0, Processing: 1, Refunded: 2 }
  return {
    status,
    steps: steps.map((s) => ({ ...s, done: orderOf[s.key] <= orderOf[status] })),
  }
}

// Returns are open for 7 days after delivery (delivery = estimated delivery date).
export function returnWindow(order) {
  const deliveredAt = order.estimatedDelivery || addDays(order.placedAt, DELIVERY_DAYS)
  const closesAt = addDays(deliveredAt, RETURN_WINDOW_DAYS)
  const open = deriveStatus(order) === 'Delivered' && Date.now() <= new Date(closesAt).getTime()
  return { deliveredAt, closesAt, open }
}

// Return progress: Requested (day 0) -> Pickup scheduled (day 1) -> Picked up (day 2)
// -> Refund processed (day 3+).
export function returnTimeline(returnRequest) {
  const steps = [
    { key: 'Return requested', date: returnRequest.requestedAt },
    { key: 'Pickup scheduled', date: addDays(returnRequest.requestedAt, 1) },
    { key: 'Picked up', date: addDays(returnRequest.requestedAt, 2) },
    { key: 'Refund processed', date: addDays(returnRequest.requestedAt, 3) },
  ]
  const days = daysSince(returnRequest.requestedAt)
  const current = days <= 0 ? 0 : days === 1 ? 1 : days === 2 ? 2 : 3
  return {
    currentLabel: steps[current].key,
    steps: steps.map((s, i) => ({ ...s, done: i <= current })),
  }
}

export function returnBadge(order) {
  if (!order.returnRequest) return null
  return returnTimeline(order.returnRequest).currentLabel === 'Refund processed' ? 'Returned' : 'Return requested'
}

// Pickup slots for a return: tomorrow and the day after, two windows each.
export function pickupSlots() {
  const slots = []
  ;[1, 2].forEach((offset) => {
    const day = addDays(new Date().toISOString(), offset)
    const label = offset === 1 ? 'Tomorrow' : formatDate(day)
    slots.push({ id: `${offset}-am`, label: `${label} · 10 AM – 1 PM` })
    slots.push({ id: `${offset}-pm`, label: `${label} · 2 PM – 5 PM` })
  })
  return slots
}
