import { useEffect, useRef } from 'react'

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'

// Escape to close, focus trap, scroll lock, focus restore.
export function useDialog(open, onClose) {
  const ref = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    const el = ref.current
    const lenis = window.__lenis
    if (lenis) lenis.stop()
    else document.body.style.overflow = 'hidden'
    const first = el?.querySelector('[data-autofocus]') || el?.querySelector(FOCUSABLE)
    first?.focus({ preventScroll: true })
    const onKey = (e) => {
      if (e.key === 'Escape') return closeRef.current()
      if (e.key !== 'Tab' || !el) return
      const items = [...el.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null)
      if (!items.length) return
      const a = items[0], z = items[items.length - 1]
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus() }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (lenis) lenis.start()
      else document.body.style.overflow = ''
      prev?.focus?.({ preventScroll: true })
    }
  }, [open])
  return ref
}
