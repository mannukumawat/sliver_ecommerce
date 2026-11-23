import { Link } from 'react-router-dom'
import './Logo.css'

export function Sparkle({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1.5l2.3 8.2 8.2 2.3-8.2 2.3L12 22.5l-2.3-8.2L1.5 12l8.2-2.3z" fill="currentColor" />
    </svg>
  )
}

export default function Logo({ light = false }) {
  return (
    <Link to="/" className={`logo ${light ? 'logo--light' : ''}`} aria-label="AURAVÉ home">
      <Sparkle size={16} />
      <span className="logo__word">AURAVÉ</span>
    </Link>
  )
}
