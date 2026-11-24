// Shared form validation + formatting, reused by auth, checkout and address forms.
// Demo-only helpers: nothing here is a real payment or identity check.
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim())
export const isIndianPhone = (v) => /^[6-9]\d{9}$/.test(String(v || '').replace(/[\s-]/g, ''))
export const isPincode = (v) => /^\d{6}$/.test(String(v || '').trim())
export const isUpiId = (v) => /^[\w.+-]{2,}@[a-zA-Z]{2,}$/.test(String(v || '').trim())

export function luhnCheck(num) {
  const digits = String(num || '').replace(/\D/g, '')
  if (digits.length < 13 || digits.length > 19) return false
  let sum = 0
  let dbl = false
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let d = Number(digits[i])
    if (dbl) { d *= 2; if (d > 9) d -= 9 }
    sum += d
    dbl = !dbl
  }
  return sum % 10 === 0
}

export function isExpiry(v) {
  const m = String(v || '').match(/^(\d{2})\/(\d{2})$/)
  if (!m) return false
  const mm = Number(m[1])
  const yy = 2000 + Number(m[2])
  if (mm < 1 || mm > 12) return false
  const end = new Date(yy, mm, 0, 23, 59, 59)
  return end >= new Date()
}

export const formatCardNumber = (v) => String(v || '').replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
export const formatExpiry = (v) => {
  const d = String(v || '').replace(/\D/g, '').slice(0, 4)
  if (d.length <= 2) return d
  return `${d.slice(0, 2)}/${d.slice(2)}`
}
export const cardBrand = (num) => {
  const d = String(num || '').replace(/\D/g, '')
  if (/^4/.test(d)) return 'Visa'
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'Mastercard'
  if (/^3[47]/.test(d)) return 'American Express'
  if (/^6/.test(d)) return 'RuPay'
  return 'Card'
}
export const maskUpi = (id) => {
  const [user, handle] = String(id || '').split('@')
  if (!handle) return id
  return `${user.slice(0, 2)}${'•'.repeat(Math.max(1, user.length - 2))}@${handle}`
}

// Demo-only password obfuscation for localStorage (NOT real security:
// this is a frontend demo with no server; never store a real password here).
export function demoHash(str) {
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  const s = `aurave-demo:${str}`
  for (let i = 0; i < s.length; i += 1) {
    const ch = s.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (h2 >>> 0).toString(16) + (h1 >>> 0).toString(16)
}

export const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
export const addDays = (iso, days) => {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}
