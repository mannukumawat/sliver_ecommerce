import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User } from 'lucide-react'
import Logo from '../Logo/Logo'
import MegaMenu from './MegaMenu'
import MobileNav from './MobileNav'
import SearchDialog from './SearchDialog'
import AccountDrawer from './AccountDrawer'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useUI } from '../../context/UIContext'
import './Header.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mega, setMega] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const { count } = useCart()
  const wish = useWishlist()
  const { openCart } = useUI()
  const loc = useLocation()

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => { setMega(false); setNavOpen(false) }, [loc.pathname, loc.search])

  const bagLabel = `Open bag, ${count} ${count === 1 ? 'item' : 'items'}`

  return (
    <header className={`hdr ${scrolled ? 'is-scrolled' : ''}`} onKeyDown={(e) => e.key === 'Escape' && setMega(false)}>
      <div className="hdr__bar container">
        <div className="hdr__left">
          <button className="hdr__icon hdr__menu" onClick={() => setNavOpen(true)} aria-label="Open menu" aria-haspopup="dialog"><Menu size={22} /></button>
          <nav className="hdr__nav" aria-label="Primary">
            <ul>
              <li><NavLink to="/" end>Home</NavLink></li>
              <li><NavLink to="/collection" end={false} className={({ isActive }) => (isActive && !loc.search ? 'active' : '')}>Shop</NavLink></li>
              <li className="hdr__has-mega" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
                <button className="hdr__navbtn" aria-expanded={mega} aria-controls="mega" onClick={() => setMega((m) => !m)}>
                  Collections <ChevronDown size={14} className={mega ? 'flip' : ''} />
                </button>
                <MegaMenu open={mega} onNavigate={() => setMega(false)} />
              </li>
              <li><Link to="/collection?new=1&sort=newest" className={loc.search.includes('new=1') ? 'active' : ''}>New Arrivals</Link></li>
              <li><Link to="/#story">About</Link></li>
            </ul>
          </nav>
        </div>

        <div className="hdr__logo"><Logo /></div>

        <div className="hdr__right">
          <button className="hdr__icon" onClick={() => setSearchOpen(true)} aria-label="Search" aria-haspopup="dialog"><Search size={21} /></button>
          <Link to="/wishlist" className="hdr__icon hdr__wish" aria-label={`Wishlist, ${wish.count} saved`}>
            <Heart size={21} />{wish.count > 0 && <span className="hdr__count" aria-hidden="true">{wish.count}</span>}
          </Link>
          <button className="hdr__icon hdr__acct" onClick={() => setAccountOpen(true)} aria-label="Account" aria-haspopup="dialog"><User size={21} /></button>
          <button className="hdr__icon" onClick={openCart} aria-label={bagLabel} aria-haspopup="dialog">
            <ShoppingBag size={21} />{count > 0 && <span className="hdr__count" aria-hidden="true">{count}</span>}
          </button>
        </div>
      </div>

      <MobileNav open={navOpen} onClose={() => setNavOpen(false)} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <AccountDrawer open={accountOpen} onClose={() => setAccountOpen(false)} />
    </header>
  )
}
