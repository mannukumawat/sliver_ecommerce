import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, LogOut, MapPin, Package, Pencil, Plus, Trash2, User } from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import Button from '../components/Button/Button'
import AuthForm from '../components/AuthForm/AuthForm'
import AddressForm, { emptyAddress } from '../components/AddressForm/AddressForm'
import { useAuth } from '../context/AuthContext'
import { useAddresses, addressLabel } from '../hooks/useAddresses'
import { useOrders } from '../context/OrdersContext'
import { useWishlist } from '../context/WishlistContext'
import './AccountPage.css'

export default function AccountPage() {
  const { user, isLoggedIn, logout, updateName } = useAuth()
  const { addresses, saveAddress, removeAddress, setDefault } = useAddresses()
  const { orders } = useOrders()
  const { count: wishCount } = useWishlist()
  const [editing, setEditing] = useState(null) // address object or 'new'
  const [name, setName] = useState(user?.name || '')
  const [nameSaved, setNameSaved] = useState(false)

  if (!isLoggedIn) {
    return (
      <div className="container account-page">
        <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: 'Account' }]} />
        <div className="wl-head"><h1>Your account</h1><p>Login to see your profile, addresses and orders.</p></div>
        <div className="account__login"><AuthForm defaultMode="login" /></div>
      </div>
    )
  }

  const myOrders = orders.filter((o) => o.userEmail === user.email || o.email === user.email)
  const saveName = (e) => {
    e.preventDefault()
    updateName(name)
    setNameSaved(true)
    setTimeout(() => setNameSaved(false), 2000)
  }

  return (
    <div className="container account-page">
      <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: 'Account' }]} />
      <div className="wl-head"><h1>Hello, {user.name}</h1><p>{user.email} · Demo account, stored in this browser only</p></div>

      <div className="account__quick">
        <Link to="/account/orders" className="account__tile"><Package size={22} /><strong>{myOrders.length} orders</strong><span>Track, view &amp; buy again</span></Link>
        <Link to="/wishlist" className="account__tile"><Heart size={22} /><strong>{wishCount} saved</strong><span>Your wishlist</span></Link>
        <button type="button" className="account__tile" onClick={() => setEditing('new')}><MapPin size={22} /><strong>{addresses.length} addresses</strong><span>Add or manage</span></button>
      </div>

      <div className="account__grid">
        <section className="co-card" aria-labelledby="acc-profile">
          <h2 id="acc-profile"><User size={20} /> Profile</h2>
          <form onSubmit={saveName} className="account__form">
            <label className="field"><span>Full name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="field"><span>Email</span>
              <input value={user.email} disabled />
              <span className="field__hint">Email cannot be changed in this demo.</span>
            </label>
            <Button size="lg" type="submit">{nameSaved ? 'Saved' : 'Save name'}</Button>
          </form>
          <Button variant="secondary" onClick={logout}><LogOut size={15} /> Logout</Button>
        </section>

        <section className="co-card" aria-labelledby="acc-addr">
          <h2 id="acc-addr"><MapPin size={20} /> Saved addresses</h2>
          {addresses.length === 0 && !editing && <p className="field__hint">No addresses saved yet. Add one — it will be offered at checkout.</p>}
          <ul className="account__addrs">
            {addresses.map((a) => (
              <li key={a.id} className="account__addr">
                <div><strong>{a.fullName} · {a.label}{a.isDefault ? ' (Default)' : ''}</strong><br />{addressLabel(a)}<br />{a.phone}</div>
                <div className="account__addr-actions">
                  {!a.isDefault && <button type="button" onClick={() => setDefault(a.id)}>Set default</button>}
                  <button type="button" aria-label={`Edit address for ${a.fullName}`} onClick={() => setEditing(a)}><Pencil size={16} /></button>
                  <button type="button" aria-label={`Delete address for ${a.fullName}`} onClick={() => removeAddress(a.id)}><Trash2 size={16} /></button>
                </div>
              </li>
            ))}
          </ul>
          {editing ? (
            <AddressForm
              initial={editing === 'new' ? emptyAddress : editing}
              submitLabel={editing === 'new' ? 'Add address' : 'Save changes'}
              onSave={(saved) => { saveAddress(saved); setEditing(null) }}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <Button variant="secondary" size="sm" onClick={() => setEditing('new')}><Plus size={15} /> Add address</Button>
          )}
        </section>
      </div>
    </div>
  )
}
