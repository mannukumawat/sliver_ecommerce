import { Link } from 'react-router-dom'
import { Heart, LogOut, MapPin, Package, User } from 'lucide-react'
import Drawer from '../Drawer/Drawer'
import AuthForm from '../AuthForm/AuthForm'
import Button from '../Button/Button'
import { useAuth } from '../../context/AuthContext'

export default function AccountDrawer({ open, onClose }) {
  const { user, isLoggedIn, logout } = useAuth()

  return (
    <Drawer open={open} onClose={onClose} title="Account">
      <div className="acct">
        {isLoggedIn ? (
          <>
            <div className="acct__who">
              <span className="acct__avatar" aria-hidden="true">{user.name.charAt(0).toUpperCase()}</span>
              <div><h3>{user.name}</h3><p>{user.email}</p></div>
            </div>
            <ul className="acct__links">
              <li><Link to="/account/orders" onClick={onClose}><Package size={17} /> My orders</Link></li>
              <li><Link to="/account" onClick={onClose}><MapPin size={17} /> My addresses</Link></li>
              <li><Link to="/wishlist" onClick={onClose}><Heart size={17} /> My wishlist</Link></li>
              <li><Link to="/account" onClick={onClose}><User size={17} /> Profile</Link></li>
            </ul>
            <Button variant="secondary" onClick={() => { logout(); onClose() }}><LogOut size={16} /> Logout</Button>
            <p className="auth__note">Signed in on this device only — demo login, stored in this browser.</p>
          </>
        ) : (
          <AuthForm onDone={onClose} />
        )}
      </div>
    </Drawer>
  )
}
