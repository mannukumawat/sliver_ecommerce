import { useState } from 'react'
import Button from '../Button/Button'
import { isIndianPhone, isPincode } from '../../utils/validation'

// Shared shipping-address form (checkout + account page).
// `initial` is an address object or null; onSave receives the cleaned address.
export const emptyAddress = { fullName: '', phone: '', line1: '', city: '', state: '', pincode: '', label: 'Home' }

export function validateAddress(a) {
  const errs = {}
  if ((a.fullName || '').trim().length < 2) errs.fullName = 'Enter the recipient’s full name.'
  if (!isIndianPhone(a.phone)) errs.phone = 'Enter a valid 10-digit Indian mobile number.'
  if ((a.line1 || '').trim().length < 5) errs.line1 = 'Enter the full street address.'
  if ((a.city || '').trim().length < 2) errs.city = 'Enter the city.'
  if ((a.state || '').trim().length < 2) errs.state = 'Enter the state.'
  if (!isPincode(a.pincode)) errs.pincode = 'Enter a valid 6-digit pincode.'
  return errs
}

export default function AddressForm({ initial = emptyAddress, submitLabel = 'Save address', onSave, onCancel }) {
  const [a, setA] = useState({ ...emptyAddress, ...initial })
  const [errs, setErrs] = useState({})
  const set = (k) => (e) => setA((cur) => ({ ...cur, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const found = validateAddress(a)
    setErrs(found)
    if (Object.keys(found).length) return
    onSave({ ...a, fullName: a.fullName.trim(), phone: a.phone.replace(/[\s-]/g, ''), line1: a.line1.trim(), city: a.city.trim(), state: a.state.trim(), pincode: a.pincode.trim() })
  }

  const err = (k) => errs[k] && <span className="field__err" role="alert">{errs[k]}</span>

  return (
    <form className="addr-form" onSubmit={submit} noValidate>
      <div className="addr-form__grid">
        <label className="field"><span>Full name</span>
          <input value={a.fullName} onChange={set('fullName')} autoComplete="name" aria-invalid={Boolean(errs.fullName)} />
          {err('fullName')}
        </label>
        <label className="field"><span>Phone</span>
          <input value={a.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" aria-invalid={Boolean(errs.phone)} />
          {err('phone')}
        </label>
        <label className="field addr-form__wide"><span>Address (house, street, area)</span>
          <textarea value={a.line1} onChange={set('line1')} autoComplete="street-address" rows={2} aria-invalid={Boolean(errs.line1)} />
          {err('line1')}
        </label>
        <label className="field"><span>City</span>
          <input value={a.city} onChange={set('city')} autoComplete="address-level2" aria-invalid={Boolean(errs.city)} />
          {err('city')}
        </label>
        <label className="field"><span>State</span>
          <input value={a.state} onChange={set('state')} autoComplete="address-level1" aria-invalid={Boolean(errs.state)} />
          {err('state')}
        </label>
        <label className="field"><span>Pincode</span>
          <input value={a.pincode} onChange={set('pincode')} inputMode="numeric" autoComplete="postal-code" placeholder="6 digits" aria-invalid={Boolean(errs.pincode)} />
          {err('pincode')}
        </label>
        <label className="field"><span>Label</span>
          <select value={a.label} onChange={set('label')}>
            <option>Home</option><option>Work</option><option>Other</option>
          </select>
        </label>
      </div>
      <div className="addr-form__actions">
        <Button size="lg" type="submit">{submitLabel}</Button>
        {onCancel && <Button size="lg" variant="secondary" type="button" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  )
}
