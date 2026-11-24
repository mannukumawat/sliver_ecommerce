import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button'
import { useSettings } from '../../context/SettingsContext'
import { isEmail } from '../../utils/validation'

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useSettings()
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Keep the form in sync if settings change elsewhere.
  useEffect(() => { setForm(settings) }, [settings])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    setError('')
    setSaved(false)
    if (!form.storeName.trim()) { setError('Enter a store name.'); return }
    if (!isEmail(form.contactEmail)) { setError('Enter a valid contact email.'); return }
    const freeShippingAt = Number(form.freeShippingAt)
    const shippingFlat = Number(form.shippingFlat)
    if (Number.isNaN(freeShippingAt) || freeShippingAt < 0) { setError('Free shipping threshold must be 0 or more.'); return }
    if (Number.isNaN(shippingFlat) || shippingFlat < 0) { setError('Flat shipping fee must be 0 or more.'); return }
    updateSettings({
      storeName: form.storeName.trim(),
      announcement: form.announcement.trim(),
      freeShippingAt,
      shippingFlat,
      contactEmail: form.contactEmail.trim(),
      contactPhone: form.contactPhone.trim(),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <>
      <p className="admin__note">Store, shipping, payments and notifications.</p>
      <form className="admin__form" onSubmit={submit}>
        <section className="admin__card" aria-labelledby="store-details">
          <h2 id="store-details">Store details</h2>
          <div className="admin__form admin__form--2col">
            <label className="admin__field"><span>Store name</span>
              <input value={form.storeName} onChange={set('storeName')} />
            </label>
            <label className="admin__field"><span>Support email</span>
              <input type="email" value={form.contactEmail} onChange={set('contactEmail')} />
            </label>
            <label className="admin__field"><span>Support phone</span>
              <input value={form.contactPhone} onChange={set('contactPhone')} />
            </label>
            <label className="admin__field"><span>Currency</span>
              <select value="INR" disabled><option value="INR">INR (₹) — Indian Rupee</option></select>
            </label>
            <label className="admin__field admin__field--full"><span>Announcement bar text</span>
              <input value={form.announcement} onChange={set('announcement')} placeholder="Complimentary Shipping on Orders Above ₹1,999" />
            </label>
          </div>
          <p className="admin__note">The announcement bar text is used live by the storefront — save here and it updates on the shop immediately.</p>
        </section>

        <section className="admin__card" aria-labelledby="shipping">
          <h2 id="shipping">Shipping</h2>
          <div className="admin__form admin__form--2col">
            <label className="admin__field"><span>Free shipping above (₹)</span>
              <input type="number" min="0" value={form.freeShippingAt} onChange={set('freeShippingAt')} />
            </label>
            <label className="admin__field"><span>Standard shipping fee (₹)</span>
              <input type="number" min="0" value={form.shippingFlat} onChange={set('shippingFlat')} />
            </label>
          </div>
          <p className="admin__note">Delivery in 3–5 days across India. Ships in 24 hours. These shipping values are used live by the storefront at checkout.</p>
        </section>

        <section className="admin__card" aria-labelledby="payments">
          <h2 id="payments">Payments (demo)</h2>
          <p className="admin__note">
            <span className="admin__badge admin__badge--active">On</span> UPI &nbsp;
            <span className="admin__badge admin__badge--active">On</span> Credit / Debit Cards &nbsp;
            <span className="admin__badge admin__badge--active">On</span> NetBanking &nbsp;
            <span className="admin__badge admin__badge--bad">Off</span> Cash on Delivery (not offered)
          </p>
          <p className="admin__note">Payment gateway: demo mode. No real charges in this demo.</p>
        </section>

        <section className="admin__card" aria-labelledby="notifications">
          <h2 id="notifications">Notifications</h2>
          <div className="admin__formrow">
            <label className="admin__check"><input type="checkbox" defaultChecked /> Email on every new order</label>
            <label className="admin__check"><input type="checkbox" defaultChecked /> SMS on shipment</label>
            <label className="admin__check"><input type="checkbox" /> Weekly sales report</label>
          </div>
          <div className="admin__formrow">
            <Button type="submit">Save settings</Button>
            {saved && <p className="admin__ok" role="status">Settings saved.</p>}
            {error && <p className="admin__err" role="alert">{error}</p>}
          </div>
        </section>
      </form>
    </>
  )
}
