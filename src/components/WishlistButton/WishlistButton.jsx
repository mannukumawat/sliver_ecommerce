import { Heart } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext'
import { useUI } from '../../context/UIContext'
import './WishlistButton.css'

export default function WishlistButton({ product, variant = 'icon', className = '' }) {
  const { has, toggle } = useWishlist()
  const { showToast } = useUI()
  const on = has(product.id)
  const click = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(product.id)
    showToast(on ? `Removed ${product.name} from wishlist` : `Saved ${product.name} to wishlist`)
  }
  return (
    <button
      type="button"
      className={`wish wish--${variant} ${on ? 'is-on' : ''} ${className}`}
      aria-pressed={on}
      aria-label={on ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      onClick={click}
    >
      <Heart size={19} fill={on ? 'currentColor' : 'none'} />
      {variant === 'text' && <span>{on ? 'Saved' : 'Save'}</span>}
    </button>
  )
}
