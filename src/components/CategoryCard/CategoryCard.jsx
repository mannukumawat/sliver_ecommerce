import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import ProductImage from '../ProductImage/ProductImage'
import './CategoryCard.css'

export default function CategoryCard({ category }) {
  return (
    <Link to={`/collection?category=${category.slug}`} className="ccard">
      <div className="ccard__media">
        <ProductImage art={category.art} name={`${category.name} collection`} className="ccard__img" />
      </div>
      <div className="ccard__label">
        <div>
          <h3>{category.name}</h3>
          <p>{category.blurb}</p>
        </div>
        <ArrowUpRight size={20} aria-hidden="true" />
      </div>
    </Link>
  )
}
