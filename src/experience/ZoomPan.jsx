import { useCallback, useRef, useState } from 'react'

const MAX = 5

// Wheel / pinch / double-click zoom + drag pan for a single child.
export default function ZoomPan({ children }) {
  const box = useRef(null)
  const pts = useRef(new Map())
  const last = useRef({ d: 0, x: 0, y: 0 })
  const [t, setT] = useState({ s: 1, x: 0, y: 0 })

  const clampT = useCallback((n) => {
    const r = box.current?.getBoundingClientRect()
    const s = Math.min(MAX, Math.max(1, n.s))
    const mx = r ? ((s - 1) * r.width) / 2 : 0
    const my = r ? ((s - 1) * r.height) / 2 : 0
    return { s, x: Math.min(mx, Math.max(-mx, n.x)), y: Math.min(my, Math.max(-my, n.y)) }
  }, [])

  const onWheel = (e) => setT((c) => clampT({ ...c, s: c.s * Math.exp(-e.deltaY * 0.0018) }))
  const onDouble = () => setT((c) => (c.s > 1.2 ? { s: 1, x: 0, y: 0 } : clampT({ s: 2.4, x: 0, y: 0 })))

  const onDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    last.current = { d: 0, x: e.clientX, y: e.clientY }
  }
  const onMove = (e) => {
    if (!pts.current.has(e.pointerId)) return
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const list = [...pts.current.values()]
    if (list.length === 2) {
      const d = Math.hypot(list[0].x - list[1].x, list[0].y - list[1].y)
      if (last.current.d) setT((c) => clampT({ ...c, s: (c.s * d) / last.current.d }))
      last.current.d = d
    } else {
      const dx = e.clientX - last.current.x, dy = e.clientY - last.current.y
      last.current.x = e.clientX; last.current.y = e.clientY
      setT((c) => (c.s > 1 ? clampT({ ...c, x: c.x + dx, y: c.y + dy }) : c))
    }
  }
  const onUp = (e) => { pts.current.delete(e.pointerId); last.current.d = 0 }

  return (
    <div
      ref={box}
      className="zp"
      onWheel={onWheel}
      onDoubleClick={onDouble}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      style={{ cursor: t.s > 1 ? 'grab' : 'zoom-in' }}
    >
      <div className="zp__inner" style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${t.s})` }}>{children}</div>
    </div>
  )
}
