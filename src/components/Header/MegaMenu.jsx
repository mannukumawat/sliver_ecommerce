import { Link } from 'react-router-dom'
import { categories } from '../../data/categories'
import ProductImage from '../ProductImage/ProductImage'

export default function MegaMenu({ open, onNavigate }) {
  return (
    <div id="mega" className={`mega ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="mega__inner container">
        <div>
          <p className="eyebrow">Shop by category</p>
          <ul className="mega__list">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/collection?category=${c.slug}`} onClick={onNavigate} tabIndex={open ? 0 : -1}>
                  {c.name}<span>{c.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link to="/collection?sort=newest" onClick={onNavigate} tabIndex={open ? 0 : -1} className="mega__feature">
          <div className="mega__img"><ProductImage art={{ photos: ['/images/story/necklace-night.jpg'] }} name="Featured: new arrivals" eager /></div>
          <div>
            <p className="eyebrow">Just in</p>
            <h3>The New Arrivals</h3>
            <span className="link-arrow">Explore</span>
          </div>
        </Link>
      </div>
    </div>
  )
}
