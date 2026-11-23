import { Link } from 'react-router-dom'
import { AtSign, Mail, MapPin, Phone, Play, Share2 } from 'lucide-react'
import Logo from '../Logo/Logo'
import { categories } from '../../data/categories'
import './Footer.css'

const socials = [
  { icon: AtSign, label: 'Instagram (placeholder)' },
  { icon: Share2, label: 'Facebook (placeholder)' },
  { icon: Play, label: 'YouTube (placeholder)' },
]

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="container ftr__grid">
        <div className="ftr__brand">
          <Logo light />
          <p>Pure Silver. Lasting Stories. Timeless silver jewellery designed for everyday elegance. This is a frontend demo store.</p>
          <ul className="ftr__social">
            {socials.map(({ icon: Icon, label }) => (
              <li key={label}><a href="#top" onClick={(e) => e.preventDefault()} aria-label={label}><Icon size={18} /></a></li>
            ))}
          </ul>
        </div>

        <nav aria-label="Shop">
          <h2>Shop</h2>
          <ul>
            {categories.map((c) => <li key={c.slug}><Link to={`/collection?category=${c.slug}`}>{c.name}</Link></li>)}
          </ul>
        </nav>

        <nav aria-label="About">
          <h2>About</h2>
          <ul>
            <li><Link to="/#story">Our story</Link></li>
            <li><Link to="/#craft">Craftsmanship</Link></li>
            <li><Link to="/collection?new=1&sort=newest">New arrivals</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
          </ul>
        </nav>

        <nav aria-label="Help">
          <h2>Help</h2>
          <ul>
            <li><Link to="/policy/shipping">Shipping &amp; returns</Link></li>
            <li><Link to="/policy/privacy">Privacy policy</Link></li>
            <li><Link to="/policy/terms">Terms &amp; conditions</Link></li>
          </ul>
        </nav>

        <div>
          <h2>Contact</h2>
          <ul className="ftr__contact">
            <li><Mail size={15} /> hello@aurave.example</li>
            <li><Phone size={15} /> +91 00000 00000</li>
            <li><MapPin size={15} /> Studio address placeholder, India</li>
          </ul>
        </div>
      </div>
      <div className="ftr__base">
        <div className="container">
          <p>© {new Date().getFullYear()} AURAVÉ. Demo project; not a real store.</p>
          <p>Product copy, prices and reviews are sample content.</p>
        </div>
      </div>
    </footer>
  )
}
