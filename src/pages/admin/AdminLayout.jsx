import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, Star, Tag, Users, Settings, Plus } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import './Admin.css'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: Package },
  { to: '/admin/products', label: 'Products', icon: ShoppingBag },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/coupons', label: 'Coupons', icon: Tag },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

const TITLES = [
  [/^\/admin\/orders\/[^/]+$/, 'Order detail', 'Order items, tracking, payment and status.'],
  [/^\/admin\/orders$/, 'Orders', 'All store orders, newest first.'],
  [/^\/admin\/products$/, 'Products', 'Live catalogue and new products.'],
  [/^\/admin\/customers$/, 'Customers', 'Everyone who has shopped with AURAVÉ.'],
  [/^\/admin\/coupons$/, 'Coupons & discounts', 'Discount codes customers can use at checkout.'],
  [/^\/admin\/reviews$/, 'Reviews', 'Customer reviews awaiting approval.'],
  [/^\/admin\/settings$/, 'Settings', 'Store, shipping, payments and notifications.'],
  [/^\/admin$/, 'Dashboard', 'Store at a glance.'],
]

function titleFor(pathname) {
  const found = TITLES.find(([re]) => re.test(pathname))
  return found ? { title: found[1], sub: found[2] } : { title: 'Admin', sub: '' }
}

export default function AdminLayout() {
  const { isAdmin, admin, logout } = useAdmin()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  if (!isAdmin) return <Navigate to="/admin/login" replace />

  const { title, sub } = titleFor(pathname)

  const doLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="admin">
      <aside className="admin__side">
        <div className="admin__brand"><strong>✦ AURAVÉ</strong><span>Admin</span></div>
        <nav className="admin__nav" aria-label="Admin">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'is-active' : '')}>
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="admin__foot">
          <p>Signed in as</p>
          <strong>{admin?.name || 'Store Admin'}</strong>
          <p>{admin?.email || 'admin@aurave.in'}</p>
          <div className="admin__links">
            <Link to="/">View store ↗</Link>
            <button type="button" className="linklike" onClick={doLogout}>Log out</button>
          </div>
        </div>
      </aside>
      <div className="admin__main">
        <header className="admin__top">
          <div>
            <h1>{title}</h1>
            {sub && <p className="admin__sub">{sub}</p>}
          </div>
          <div className="admin__actions">
            <input className="admin__search" type="search" placeholder="Search orders, products, customers…" aria-label="Search (decorative)" />
            <Link className="btn btn--primary btn--sm" to="/admin/products"><Plus size={15} /> Add product</Link>
          </div>
        </header>
        <div className="admin__body">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
