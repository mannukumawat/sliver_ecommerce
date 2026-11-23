import { useEffect } from 'react'
import { useUI } from '../../context/UIContext'
import './Toast.css'

export default function Toast() {
  const { toast, clearToast } = useUI()
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(clearToast, 2600)
    return () => clearTimeout(t)
  }, [toast, clearToast])
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && <p key={toast.key} className="toast">{toast.msg}</p>}
    </div>
  )
}
