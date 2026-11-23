import { useRef, useState } from 'react'
import { ArrowLeft, Box, Image } from 'lucide-react'
import ProductImage from '../components/ProductImage/ProductImage'
import Button from '../components/Button/Button'
import ZoomPan from './ZoomPan'
import { useDialog } from '../hooks/useDialog'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { inr } from '../utils/format'

// Transparent layer over the canvas: drag rotates the active piece, wheel / pinch zooms.
function Drag3D({ inspectRef }) {
  const pts = useRef(new Map())
  const pinch = useRef(0)
  const down = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (inspectRef.current) inspectRef.current.drag = true
  }
  const move = (e) => {
    const ins = inspectRef.current
    const prev = pts.current.get(e.pointerId)
    if (!ins || !prev) return
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pts.current.size === 2) {
      const [a, b] = [...pts.current.values()]
      const d = Math.hypot(a.x - b.x, a.y - b.y)
      if (pinch.current) ins.zoom = Math.min(2.2, Math.max(0.7, ins.zoom * (d / pinch.current)))
      pinch.current = d
    } else {
      ins.ry += (e.clientX - prev.x) * 0.009
      ins.rx = Math.min(0.9, Math.max(-0.9, ins.rx + (e.clientY - prev.y) * 0.006))
    }
  }
  const up = (e) => {
    pts.current.delete(e.pointerId)
    pinch.current = 0
    if (!pts.current.size && inspectRef.current) inspectRef.current.drag = false
  }
  const wheel = (e) => {
    const ins = inspectRef.current
    if (ins) ins.zoom = Math.min(2.2, Math.max(0.7, ins.zoom * Math.exp(-e.deltaY * 0.0012)))
  }
  return <div className="insp__drag" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onWheel={wheel} aria-label="Drag to rotate, scroll to zoom" role="application" />
}

export default function InspectOverlay({ piece, index, inspectRef, onClose }) {
  const [mode, setMode] = useState('3d')
  const [view, setView] = useState(0)
  const ref = useDialog(true, onClose)
  const { add } = useCart()
  const { openCart } = useUI()
  const p = piece.rep

  return (
    <div className={`insp insp--${mode}`} ref={ref} role="dialog" aria-modal="true" aria-label={`Inspect ${p.name}`}>
      {mode === '3d' && <Drag3D inspectRef={inspectRef} />}

      <aside className="insp__panel">
        <button className="insp__back" onClick={onClose} data-autofocus><ArrowLeft size={15} /> Back to pieces</button>
        <p className="insp__eyebrow">{piece.name} · piece {String(index + 1).padStart(2, '0')}</p>
        <h2>{p.name}</h2>
        <p className="insp__price">{inr(p.price)}{p.mrp && <s>{inr(p.mrp)}</s>}</p>
        <dl>
          <div><dt>Style</dt><dd>{p.style}</dd></div>
          <div><dt>Colour</dt><dd>{p.colour}</dd></div>
          <div><dt>Material</dt><dd>{p.material}</dd></div>
          <div><dt>Size</dt><dd>{p.size}</dd></div>
        </dl>
        <p className="insp__hint">
          {mode === '3d' ? 'Drag to rotate · scroll or pinch to zoom. Illustrative 3D model.' : 'Scroll, pinch or double-click to zoom · drag to pan.'}
        </p>
        <div className="insp__actions">
          <Button variant="light" onClick={() => { add(p.id, 1); onClose(); setTimeout(openCart, 250) }}>Add to bag</Button>
          <Button variant="outline-light" to={`/product/${p.slug}`}>Full details</Button>
        </div>
      </aside>

      {mode === '2d' && (
        <div className="insp__card">
          <ZoomPan key={view}><ProductImage art={p.art} view={view} name={p.name} eager /></ZoomPan>
          <div className="insp__thumbs" role="tablist" aria-label="Views">
            {[0, 1, 2].map((v) => (
              <button key={v} role="tab" aria-selected={view === v} aria-label={['Front', 'Close-up', 'Another angle'][v]} className={view === v ? 'is-active' : ''} onClick={() => setView(v)}>
                <ProductImage art={p.art} view={v} decorative eager />
              </button>
            ))}
          </div>
        </div>
      )}

      <button className="insp__toggle" onClick={() => setMode((m) => (m === '3d' ? '2d' : '3d'))}>
        {mode === '3d' ? <><Image size={15} /> View in 2D</> : <><Box size={15} /> View in 3D</>}
      </button>
    </div>
  )
}
