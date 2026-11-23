import { Link } from 'react-router-dom'
import './Button.css'

export default function Button({ to, href, variant = 'primary', size = 'md', block, className = '', children, ...rest }) {
  const cls = `btn btn--${variant} btn--${size} ${block ? 'btn--block' : ''} ${className}`
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>
  return <button type="button" className={cls} {...rest}>{children}</button>
}
