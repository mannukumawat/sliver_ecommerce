import { useEffect, useRef } from 'react'

// 0..1 progress of scrolling through a tall element. Stored in a ref (no re-renders);
// onUpdate lets callers write styles directly.
export function useScrollProgress(ref, onUpdate) {
  const p = useRef(0)
  const cb = useRef(onUpdate)
  cb.current = onUpdate
  useEffect(() => {
    let raf = 0
    const calc = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const max = r.height - window.innerHeight
      p.current = max > 0 ? Math.min(1, Math.max(0, -r.top / max)) : 0
      cb.current?.(p.current)
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(calc) }
    calc()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
      cancelAnimationFrame(raf)
    }
  }, [ref])
  return p
}
