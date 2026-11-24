import { useLocalStorage } from './useLocalStorage'

// Saved shipping addresses, stored in this browser only (demo, no server).
// Address shape: { id, label, fullName, phone, line1, city, state, pincode, isDefault }
const KEY = 'aurave-addresses-v1'

export function useAddresses() {
  const [addresses, setAddresses] = useLocalStorage(KEY, [])

  const saveAddress = (addr) => {
    const id = addr.id || `addr-${Date.now()}`
    const next = { ...addr, id }
    setAddresses((cur) => {
      const rest = cur.filter((a) => a.id !== id)
      const withDefault = next.isDefault ? rest.map((a) => ({ ...a, isDefault: false })) : rest
      const list = [...withDefault, next]
      // First address becomes the default automatically.
      if (list.length === 1) list[0].isDefault = true
      return list
    })
    return next
  }

  const removeAddress = (id) => setAddresses((cur) => {
    const list = cur.filter((a) => a.id !== id)
    if (list.length && !list.some((a) => a.isDefault)) list[0].isDefault = true
    return list
  })

  const setDefault = (id) => setAddresses((cur) => cur.map((a) => ({ ...a, isDefault: a.id === id })))

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0] || null
  return { addresses, saveAddress, removeAddress, setDefault, defaultAddress }
}

export const addressLabel = (a) => [a.line1, a.city, a.state, a.pincode].filter(Boolean).join(', ')
