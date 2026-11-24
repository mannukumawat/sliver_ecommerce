import { useState } from 'react'
import { X } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'
import './AnnouncementBar.css'

export default function AnnouncementBar() {
  const { settings } = useSettings()
  const [open, setOpen] = useState(() => {
    try { return sessionStorage.getItem('aurave.announce') !== 'x' } catch { return true }
  })
  if (!open) return null
  const dismiss = () => {
    setOpen(false)
    try { sessionStorage.setItem('aurave.announce', 'x') } catch { /* ignore */ }
  }
  return (
    <div className="announce" role="region" aria-label="Announcement">
      <p>{settings.announcement}</p>
      <button onClick={dismiss} aria-label="Dismiss announcement"><X size={16} /></button>
    </div>
  )
}
