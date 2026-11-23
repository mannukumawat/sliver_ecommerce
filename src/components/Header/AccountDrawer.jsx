import { Link } from 'react-router-dom'
import Drawer from '../Drawer/Drawer'

export default function AccountDrawer({ open, onClose }) {
  return (
    <Drawer open={open} onClose={onClose} title="Account">
      <div className="acct">
        <h3>Sign in is not available</h3>
        <p>This is a frontend-only prototype: there is no server, login or order history. Your bag and wishlist are saved in this browser only.</p>
        <ul>
          <li><Link to="/wishlist" onClick={onClose}>View your wishlist</Link></li>
          <li><Link to="/collection" onClick={onClose}>Continue shopping</Link></li>
        </ul>
      </div>
    </Drawer>
  )
}
