import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import { readUsers } from '../../context/AuthContext'
import { useOrders } from '../../context/OrdersContext'
import { inr } from '../../utils/format'
import { formatDate } from '../../utils/validation'
import { SAMPLE_CUSTOMERS, customerNameFromOrder } from './adminUtils'

export default function AdminCustomersPage() {
  const { orders } = useOrders()

  const customers = useMemo(() => {
    const byEmail = new Map()
    // Registered accounts first (name + email).
    readUsers().forEach((u) => {
      if (!u.email) return
      byEmail.set(u.email.toLowerCase(), { name: u.name || u.email, email: u.email, orders: [], firstAt: null })
    })
    // Then every order customer (guests included).
    orders.forEach((o) => {
      const email = (o.userEmail || o.email || '').toLowerCase()
      if (!email) return
      const entry = byEmail.get(email) || { name: customerNameFromOrder(o), email, orders: [], firstAt: null }
      entry.orders.push(o)
      if (!entry.name || entry.name === email) entry.name = customerNameFromOrder(o)
      const t = new Date(o.placedAt).getTime()
      if (!entry.firstAt || t < new Date(entry.firstAt).getTime()) entry.firstAt = o.placedAt
      byEmail.set(email, entry)
    })
    return [...byEmail.values()]
      .map((c) => ({
        ...c,
        count: c.orders.length,
        spent: c.orders.filter((o) => o.status !== 'Cancelled').reduce((n, o) => n + (o.total || 0), 0),
      }))
      .sort((a, b) => b.spent - a.spent)
  }, [orders])

  const hasReal = customers.length > 0
  const repeat = customers.filter((c) => c.count > 1).length
  const avgValue = customers.length ? Math.round(customers.reduce((n, c) => n + c.spent, 0) / customers.length) : 0

  return (
    <>
      {!hasReal && (
        <p className="admin__note"><span className="admin__badge admin__badge--sample">Sample data</span> No customers yet — rows below are sample data for this demo panel.</p>
      )}
      <section className="admin__stats" aria-label="Customer statistics">
        <div className="admin__stat"><span>Total customers</span><strong>{hasReal ? customers.length : 1240}</strong><em>{hasReal ? 'Registered + guest shoppers' : '+86 this month · Sample data'}</em></div>
        <div className="admin__stat"><span>Repeat buyers</span><strong>{hasReal ? repeat : 312}</strong><em>{hasReal ? `${customers.length ? Math.round((repeat / customers.length) * 100) : 0}% of total` : '25% of total · Sample data'}</em></div>
        <div className="admin__stat"><span>Avg. lifetime value</span><strong>{inr(hasReal ? avgValue : 4180)}</strong><em>{hasReal ? 'Across all customers' : '↑ 9% · Sample data'}</em></div>
        <div className="admin__stat"><span>New this week</span><strong>{hasReal ? customers.filter((c) => c.firstAt && Date.now() - new Date(c.firstAt).getTime() < 7 * 86400000).length : 24}</strong><em>{hasReal ? 'First order in the last 7 days' : '+6 vs last week · Sample data'}</em></div>
      </section>

      <section className="admin__card">
        {hasReal ? (
          <div className="admin__tablewrap">
            <table className="admin__table">
              <thead><tr><th>Customer</th><th>Email</th><th className="num">Orders</th><th className="num">Spent</th><th>First order</th><th /></tr></thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.email}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.email}</td>
                    <td className="num">{c.count}</td>
                    <td className="num">{inr(c.spent)}</td>
                    <td>{c.firstAt ? formatDate(c.firstAt) : '—'}</td>
                    <td><Link to="/admin/orders">View orders</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin__tablewrap">
            <table className="admin__table">
              <thead><tr><th>Customer</th><th>Email</th><th className="num">Orders</th><th className="num">Spent</th><th>Joined</th></tr></thead>
              <tbody>
                {SAMPLE_CUSTOMERS.map((c) => (
                  <tr key={c.email}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.email}</td>
                    <td className="num">{c.orders}</td>
                    <td className="num">{inr(c.spent)}</td>
                    <td>{c.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {customers.length === 0 && (
          <div className="admin__empty"><Users size={40} strokeWidth={1.2} /><h2>No customers yet</h2><p className="admin__note">Customers appear here once someone creates an account or places an order.</p></div>
        )}
      </section>
    </>
  )
}
