import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './CustomCursor.css'

export default function CustomCursor() {
  const cursor = useRef(null)
  const dot = useRef(null)

  useEffect(() => {
    // React detaches refs before passive cleanup (including StrictMode replay).
    // Keep the mounted nodes for this effect's handlers and cleanup.
    const cursorNode = cursor.current
    const dotNode = dot.current
    if (!cursorNode || !dotNode) return
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    const root = document.documentElement
    let frame = 0
    let visible = false
    let x = 0, y = 0, rx = 0, ry = 0, previousTime = 0
    const hide = () => {
      visible = false
      root.classList.remove('has-custom-cursor')
      cursorNode.dataset.visible = 'false'
      dotNode.dataset.visible = 'false'
      cursorNode.dataset.pressed = 'false'
      cancelAnimationFrame(frame)
      frame = 0
    }
    const tick = (time) => {
      const step = 1 - Math.exp(-18 * Math.min((time - previousTime) / 1000, 0.05))
      previousTime = time
      rx += (x - rx) * step
      ry += (y - ry) * step
      cursorNode.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      if (Math.abs(x - rx) + Math.abs(y - ry) > 0.1) frame = requestAnimationFrame(tick)
      else frame = 0
    }
    const move = (event) => {
      const target = event.target instanceof Element ? event.target : null
      // Native text/select cursors and top-layer dialogs keep their OS cursor.
      if (!media.matches || event.pointerType !== 'mouse' || target?.closest('input, textarea, select, [contenteditable="true"], dialog, iframe')) {
        hide()
        return
      }
      x = event.clientX
      y = event.clientY
      if (!visible) {
        rx = x; ry = y
        visible = true
        cursorNode.style.transform = `translate3d(${x}px, ${y}px, 0)`
        cursorNode.dataset.visible = 'true'
        dotNode.dataset.visible = 'true'
        root.classList.add('has-custom-cursor')
      }
      dotNode.style.transform = `translate3d(${x}px, ${y}px, 0)`
      const drag = target?.closest('.insp__drag, .zp')
      cursorNode.dataset.mode = drag ? 'drag' : target?.closest('a, button, [role="button"]') ? 'link' : 'default'
      if (!frame) { previousTime = performance.now(); frame = requestAnimationFrame(tick) }
    }
    const press = () => { cursorNode.dataset.pressed = 'true' }
    const release = () => { cursorNode.dataset.pressed = 'false' }
    const key = (event) => { if (event.key === 'Tab') hide() }
    const visibility = () => { if (document.hidden) hide() }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', press, { passive: true })
    window.addEventListener('pointerup', release, { passive: true })
    window.addEventListener('pointercancel', hide)
    window.addEventListener('blur', hide)
    window.addEventListener('keydown', key)
    document.documentElement.addEventListener('pointerleave', hide)
    document.addEventListener('visibilitychange', visibility)
    media.addEventListener('change', hide)
    return () => {
      hide()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', hide)
      window.removeEventListener('blur', hide)
      window.removeEventListener('keydown', key)
      document.documentElement.removeEventListener('pointerleave', hide)
      document.removeEventListener('visibilitychange', visibility)
      media.removeEventListener('change', hide)
    }
  }, [])

  return createPortal(<>
    <div ref={dot} className="custom-cursor-dot" aria-hidden="true"><i /></div>
    <div ref={cursor} className="custom-cursor" aria-hidden="true"><div className="custom-cursor__ring"><span>DRAG</span></div></div>
  </>, document.body)
}
