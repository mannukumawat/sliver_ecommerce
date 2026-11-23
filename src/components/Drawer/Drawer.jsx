import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useDialog } from '../../hooks/useDialog'
import './Drawer.css'

/*
 * Shared accessible panel: side="right" | "left" | "bottom" | "center".
 * Stays mounted briefly after close so the exit transition can play.
 */
export default function Drawer({ open, onClose, side = 'right', title, labelledBy, children, className = '', hideHead = false }) {
  const [mounted, setMounted] = useState(open)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      const r = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
      return () => cancelAnimationFrame(r)
    }
    setShown(false)
    const t = setTimeout(() => setMounted(false), 320)
    return () => clearTimeout(t)
  }, [open])

  const ref = useDialog(open, onClose)
  if (!mounted && !open) return null

  return createPortal(
    <div className={`drawer drawer--${side} ${shown ? 'is-open' : ''}`}>
      <div className="drawer__scrim" onClick={onClose} />
      <div ref={ref} className={`drawer__panel ${className}`} role="dialog" aria-modal="true" aria-label={labelledBy ? undefined : title} aria-labelledby={labelledBy}>
        {!hideHead && (
          <div className="drawer__head">
            <h2 className="drawer__title">{title}</h2>
            <button className="drawer__close" onClick={onClose} aria-label={`Close ${title}`}><X size={22} /></button>
          </div>
        )}
        {hideHead && <button className="drawer__close drawer__close--float" onClick={onClose} aria-label="Close"><X size={22} /></button>}
        {children}
      </div>
    </div>,
    document.body,
  )
}
