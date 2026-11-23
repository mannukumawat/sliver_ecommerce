import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button/Button'
import HeroExperience from '../three/HeroExperience'
import InspectOverlay from './InspectOverlay'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { PIECES, SEL0, clamp01, smooth, snapIdx } from './pieces'
import { inr } from '../utils/format'
import './experience.css'
import './signature.css'

const N = PIECES.length
// trapezoid: 0 -> 1 between a..b, hold to c, 1 -> 0 between c..d
const band = (p, a, b, c, d) => (p < a || p > d ? 0 : p < b ? (p - a) / (b - a) : p <= c ? 1 : 1 - (p - c) / (d - c))
const HERO_PANELS = [[-1, -1, 0.08, 0.15], [0.15, 0.19, 0.245, 0.29]]
const two = (n) => String(n + 1).padStart(2, '0')

/*
 * Pinned scrollytelling: zoom-through hero -> six pieces on a ruler -> inspect (3D / 2D).
 * Scroll progress is held in refs and written straight to the DOM / canvas (no re-render per frame).
 */
export default function ScrollExperience() {
  const root = useRef(null)
  const panels = useRef([])
  const hud = useRef(null)
  const bar = useRef(null)
  const cue = useRef(null)
  const giantHero = useRef(null)
  const giants = useRef([])
  const chapter = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })
  const inspectRef = useRef(null)
  const lastActive = useRef(0)
  const [active, setActive] = useState(0)
  const [inspect, setInspect] = useState(null)

  const progress = useScrollProgress(root, (p) => {
    panels.current.forEach((el, i) => {
      if (!el) return
      const o = i === 0 && p < 0.08 ? 1 : band(p, ...HERO_PANELS[i])
      el.style.opacity = o
      el.style.transform = `translateY(${(1 - o) * 16 * (p > 0.2 ? -1 : 1)}px)`
      el.style.pointerEvents = o > 0.5 ? 'auto' : 'none'
      el.setAttribute('aria-hidden', o < 0.5)
      el.classList.toggle('is-on', o > 0.45)
    })
    const idxF = snapIdx(clamp01((p - SEL0) / (1 - SEL0)) * (N - 1))
    if (giantHero.current) {
      giantHero.current.style.opacity = (1 - smooth(0.12, 0.3, p)) * 0.9
      giantHero.current.style.transform = `translate3d(${-p * 160}vw, 0, 0) scale(${1 + p * 1.4})`
    }
    giants.current.forEach((el, i) => {
      if (!el) return
      const d = i - idxF
      el.style.opacity = smooth(0.33, 0.42, p) * Math.max(0, 1 - Math.abs(d) * 2)
      el.style.transform = `translate3d(${d * -38}vw, 0, 0)`
    })
    if (chapter.current) chapter.current.textContent = p < 0.3 ? 'I · Arrival' : p < 0.36 ? 'II · The Atelier' : 'III · The Pieces'
    const sel = smooth(0.33, 0.41, p)
    if (hud.current) { hud.current.style.opacity = sel; hud.current.style.pointerEvents = sel > 0.5 ? 'auto' : 'none' }
    if (bar.current) bar.current.style.transform = `scaleY(${p})`
    if (cue.current) cue.current.style.opacity = Math.max(0, 1 - p * 10)
    const i = Math.round(clamp01((p - SEL0) / (1 - SEL0)) * (N - 1))
    if (i !== lastActive.current) { lastActive.current = i; setActive(i) }
  })

  useEffect(() => {
    const on = (e) => { pointer.current = { x: (e.clientX / innerWidth) * 2 - 1, y: (e.clientY / innerHeight) * 2 - 1 } }
    window.addEventListener('pointermove', on, { passive: true })
    return () => window.removeEventListener('pointermove', on)
  }, [])

  const open = useCallback((i) => {
    inspectRef.current = { i, rx: 0, ry: 0, zoom: 1, drag: false }
    setInspect(i)
  }, [])
  const close = useCallback(() => { inspectRef.current = null; setInspect(null) }, [])

  const goTo = (i) => {
    const el = root.current
    const top = el.getBoundingClientRect().top + window.scrollY
    const y = top + (SEL0 + (i / (N - 1)) * (1 - SEL0)) * (el.offsetHeight - window.innerHeight)
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.4 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  const rig = { progress, pointer, inspect: inspectRef }
  const pc = PIECES[active]

  return (
    <section className="sx" ref={root} aria-labelledby="atelier-title">
      <div className="sx__pin">
        {/* giant editorial type sits BEHIND the (transparent) canvas */}
        <div className="sx__giants" aria-hidden="true">
          <span className="sx__giant sx__giant--hero" ref={giantHero}>AURAVÉ</span>
          {PIECES.map((p, i) => <span key={p.slug} className="sx__giant" ref={(el) => (giants.current[i] = el)} style={{ opacity: 0 }}>{p.name}</span>)}
        </div>
        <HeroExperience rig={rig} />
        <p className="sx__chapter" ref={chapter} aria-hidden="true">I · Arrival</p>

        {/* chapter 1: hero copy */}
        <div className="sx__panels container">
          <div className="sx__panel sx__panel--signature" ref={(el) => (panels.current[0] = el)}>
            <p className="eyebrow">THE SIGNATURE EDIT <span /> AURAVÉ</p>
            <h1 id="atelier-title" className="sx__title">
              <span className="ln"><span style={{ '--i': 0 }}>Jewellery</span></span>
              <span className="ln"><span style={{ '--i': 1 }}>That Tells</span></span>
              <span className="ln"><span style={{ '--i': 1 }}><em>Your Story.</em></span></span>
            </h1>
            <p className="sx__copy">For the moments you keep close.<br />Silver, light, and a little piece of you.</p>
            <div className="sx__cta">
              <Button to="/collection" size="lg" variant="light">Explore Collection</Button>
              <button className="sx__discover" onClick={() => goTo(1)}>Discover in 3D <span aria-hidden="true">↗</span></button>
            </div>
            <p className="sx__signature-note">DESIGNED IN INDIA <span>✦</span> MADE TO BE YOURS</p>
          </div>
          <div className="sx__panel" ref={(el) => (panels.current[1] = el)} style={{ opacity: 0 }} aria-hidden="true">
            <p className="eyebrow">The Atelier Edit</p>
            <h2 className="sx__h2">
              <span className="ln"><span style={{ '--i': 0 }}>Light, caught</span></span>
              <span className="ln"><span style={{ '--i': 1 }}><em>in silver.</em></span></span>
            </h2>
            <p className="sx__copy">Every facet, every polished link. Scroll to meet the pieces.</p>
          </div>
        </div>

        <div className="sx__cue" ref={cue} aria-hidden="true"><span>Scroll</span><i /></div>
        <div className="sx__track" aria-hidden="true"><b ref={bar} /></div>

        {/* chapter 2: piece selector */}
        <div className={`sx__hud ${inspect != null ? 'is-hidden' : ''}`} ref={hud} style={{ opacity: 0, pointerEvents: 'none' }}>
          <div className="sx__info" key={pc.slug}>
            <p className="sx__count"><b>{two(active)}</b> / {two(N - 1)}</p>
            <p className="eyebrow">The collection</p>
            <h2 className="sx__name">{pc.name}</h2>
            <p className="sx__blurb">{pc.blurb}</p>
            <ul className="sx__stats">
              <li><span>Designs</span><b>{pc.count}</b></li>
              <li><span>New</span><b>{pc.newCount}</b></li>
              <li><span>From</span><b>{inr(pc.from)}</b></li>
            </ul>
            <div className="sx__actions">
              <Button variant="light" onClick={() => open(active)}>Inspect in 3D</Button>
              <Link to={`/collection?category=${pc.slug}`} className="sx__link">Shop {pc.name}</Link>
            </div>
          </div>

          <button className="sx__hit" tabIndex={-1} aria-hidden="true" onClick={() => open(active)} />

          <nav className="sx__ruler" aria-label="Pieces">
            <ol>
              {PIECES.map((p, i) => (
                <li key={p.slug}>
                  <button className={i === active ? 'is-active' : ''} onClick={() => goTo(i)} aria-label={`Go to ${p.name}`} aria-current={i === active}>
                    <span className="sx__tn">{p.name}</span><span className="sx__num">{two(i)}</span><i />
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <p className="sx__hint">Scroll to change piece · tap the piece to inspect it</p>
        </div>

        {inspect != null && <InspectOverlay key={inspect} piece={PIECES[inspect]} index={inspect} inspectRef={inspectRef} onClose={close} />}
      </div>
    </section>
  )
}
