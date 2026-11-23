import { useEffect } from 'react'
import Lenis from 'lenis'

// Inertial page scroll (Lenis). Skipped for reduced-motion users.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 })
    window.__lenis = lenis
    let id = requestAnimationFrame(function raf(t) {
      lenis.raf(t)
      id = requestAnimationFrame(raf)
    })
    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
      delete window.__lenis
    }
  }, [])
  return null
}
