import { Link } from 'react-router-dom'
import Drawer from '../Drawer/Drawer'
import { Sparkle } from '../Logo/Logo'
import { categories } from '../../data/categories'

export default function MobileNav({ open, onClose }) {
  return (
    <Drawer open={open} onClose={onClose} side="left" title="Menu" className="mnav">
      <nav aria-label="Mobile" className="mnav__body">
        <ul className="mnav__main">
          <li><Link to="/" onClick={onClose}>Home</Link></li>
          <li><Link to="/collection" onClick={onClose}>Shop all</Link></li>
          <li><Link to="/collection?new=1&sort=newest" onClick={onClose}>New Arrivals</Link></li>
          <li><Link to="/#story" onClick={onClose}>About</Link></li>
          <li><Link to="/wishlist" onClick={onClose}>Wishlist</Link></li>
        </ul>
        <p className="eyebrow mnav__h"><Sparkle size={10} /> Collections</p>
        <ul className="mnav__cats">
          {categories.map((c) => (
            <li key={c.slug}><Link to={`/collection?category=${c.slug}`} onClick={onClose}>{c.name}</Link></li>
          ))}
        </ul>
      </nav>
    </Drawer>
  )
}
