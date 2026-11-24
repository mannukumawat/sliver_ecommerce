import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Package } from 'lucide-react'
import { useOrders } from '../../context/OrdersContext'
import { allProducts } from '../../data/products'
import { inr } from '../../utils/format'
import { formatDate } from '../../utils/validation'
import { StatusPill } from '../OrdersListPage'
import {
  SAMPLE_AVG, SAMPLE_DAILY_ORDERS, SAMPLE_ORDERS, SAMPLE_RECENT_ORDERS,
  SAMPLE_REVENUE, SAMPLE_TOP_PRODUCTS, SAMPLE_VISITORS,
  customerNameFromOrder, shortName, stockFor,
} from './adminUtils'

const DAY = 86400000

function last14Days(orders) {
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 13; i >= 0; i -= 1) {
    const start = today.getTime() - i * DAY
    const count = orders.filter((o) => {
      const t = new Date(o.placedAt).getTime()
      return t >= start && t < start + DAY
    }).length
    days.push({ label: formatDate(new Date(start).toISOString()), count })
  }
  return days
}

export default function AdminDashboardPage() {
  const { orders } = useOrders()
  const products = useMemo(() => allProducts(), [])
  const hasReal = orders.length > 0

  const now = new Date()
  const monthOrders = orders.filter((o) => {
    const d = new Date(o.placedAt)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const billable = monthOrders.filter((o) => o.status !== 'Cancelled')
  const revenue = billable.reduce((n, o) => n + (o.total || 0), 0)
  const avg = billable.length ? Math.round(revenue / billable.length) : 0

  const chartDays = useMemo(
    () => (hasReal ? last14Days(orders) : SAMPLE_DAILY_ORDERS.map((count, i) => ({ label: `Day ${i + 1}`, count }))),
    [hasReal, orders],
  )
  const maxCount = Math.max(1, ...chartDays.map((d) => d.count))
  const bestDay = chartDays.reduce((best, d) => (d.count > best.count ? d : best), chartDays[0])

  const recent = hasReal ? orders.slice(0, 5) : null
  const lowStock = products.filter((p) => stockFor(p) < 5)

  const topProducts = useMemo(() => {
    if (!hasReal) return SAMPLE_TOP_PRODUCTS
    const sold = {}
    orders.forEach((o) => {
      if (o.status === 'Cancelled') return
      o.items.forEach((item) => { sold[item.name] = (sold[item.name] || 0) + item.qty })
    })
    return Object.entries(sold).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name, qty]) => ({ name, sold: qty }))
  }, [hasReal, orders])

  const monthLabel = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  return (
    <>
      {!hasReal && (
        <p className="admin__note"><span className="admin__badge admin__badge--sample">Sample data</span> No orders placed in this browser yet — figures below are sample data for this demo panel.</p>
      )}
      <section className="admin__stats" aria-label="Store statistics">
        <div className="admin__stat"><span>Revenue ({monthLabel})</span><strong>{inr(hasReal ? revenue : SAMPLE_REVENUE)}</strong><em>↑ 18% vs last month</em></div>
        <div className="admin__stat"><span>Orders</span><strong>{hasReal ? billable.length : SAMPLE_ORDERS}</strong><em>↑ 12% vs last month</em></div>
        <div className="admin__stat"><span>Avg. order value</span><strong>{inr(hasReal ? avg : SAMPLE_AVG)}</strong><em>↑ 4% vs last month</em></div>
        <div className="admin__stat"><span>Visitors</span><strong>{hasReal ? '—' : SAMPLE_VISITORS.toLocaleString('en-IN')}</strong><em>{hasReal ? 'Not tracked in this demo' : '↓ 3% vs last month · Sample data'}</em></div>
      </section>

      <section className="admin__card" aria-labelledby="sales-chart">
        <h2 id="sales-chart">Sales — last 14 days</h2>
        <div className="admin__chart" role="img" aria-label={`Orders per day for the last 14 days. Best day: ${bestDay.label}, ${bestDay.count} orders.`}>
          {chartDays.map((d) => (
            <div key={d.label} className="admin__bar" style={{ height: `${Math.max(4, (d.count / maxCount) * 100)}%` }} title={`${d.label}: ${d.count} orders`} />
          ))}
        </div>
        <p className="admin__note">
          {hasReal ? 'Orders per day, last 14 days' : 'Sample bars'} · Best day: {bestDay.label} ({bestDay.count} orders)
        </p>
      </section>

      <div className="admin__grid2">
        <section className="admin__card" aria-labelledby="recent-orders">
          <h2 id="recent-orders">Recent orders</h2>
          <div className="admin__tablewrap">
            <table className="admin__table">
              <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th /></tr></thead>
              <tbody>
                {hasReal ? recent.map((o) => (
                  <tr key={o.id}>
                    <td><strong>{o.id}</strong></td>
                    <td>{shortName(customerNameFromOrder(o))}</td>
                    <td>{inr(o.total)}</td>
                    <td><StatusPill status={o.status} /></td>
                    <td><Link to={`/admin/orders/${o.id}`}>View</Link></td>
                  </tr>
                )) : SAMPLE_RECENT_ORDERS.map((o) => (
                  <tr key={o.id}>
                    <td><strong>{o.id}</strong></td>
                    <td>{o.customer}</td>
                    <td>{inr(o.total)}</td>
                    <td>{o.status === 'Refunded'
                      ? <span className="admin__badge admin__badge--bad">Refunded</span>
                      : <StatusPill status={o.status} />}</td>
                    <td><Link to="/admin/orders">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="admin__note"><Link to="/admin/orders">View all orders →</Link></p>
        </section>

        <div style={{ display: 'grid', gap: 20, alignContent: 'start' }}>
          <section className="admin__card" aria-labelledby="low-stock">
            <h2 id="low-stock">Low stock</h2>
            {lowStock.length === 0 ? (
              <p className="admin__note">No products are low on stock right now.</p>
            ) : (
              <ul className="admin__list">
                {lowStock.map((p) => (
                  <li key={p.id}><AlertTriangle size={15} /> {p.name} — <strong>{stockFor(p)} left</strong></li>
                ))}
              </ul>
            )}
            <p className="admin__note">Stock is a demo figure, derived from each product.</p>
          </section>
          <section className="admin__card" aria-labelledby="top-products">
            <h2 id="top-products">Top products</h2>
            {topProducts.length === 0 ? (
              <p className="admin__note">No sales yet.</p>
            ) : (
              <ol className="admin__list">
                {topProducts.map((p, i) => (
                  <li key={p.name}><span>{i + 1}.</span> {p.name} — <strong>{p.sold} sold</strong></li>
                ))}
              </ol>
            )}
            {!hasReal && <p className="admin__note">Sample data</p>}
          </section>
        </div>
      </div>
      {hasReal && orders.length === 0 && <p className="admin__note"><Package size={14} /> No orders yet.</p>}
    </>
  )
}
