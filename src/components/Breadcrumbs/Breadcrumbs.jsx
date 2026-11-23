import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import './Breadcrumbs.css'

export default function Breadcrumbs({ trail }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {trail.map((t, i) => (
          <li key={t.label}>
            {t.to && i < trail.length - 1 ? <Link to={t.to}>{t.label}</Link> : <span aria-current="page">{t.label}</span>}
            {i < trail.length - 1 && <ChevronRight size={13} aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </nav>
  )
}
