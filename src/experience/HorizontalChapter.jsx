import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductImage from '../components/ProductImage/ProductImage'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { getProduct } from '../data/products'

const MOMENTS = [
  { tab: 'Morning light', line: 'A single stone for the first coffee.', slug: 'halo-cluster-ring', view: 0 },
  { tab: 'The long walk', line: 'Light enough to forget, bright enough to notice.', slug: 'cluster-pendant-necklace', view: 0 },
  { tab: 'Evening gathers', line: 'Pearls that catch the room when it fills.', slug: 'oxidised-jhumka-earrings', view: 0 },
  { tab: 'Unwind', line: 'Chains that sit softly through the slow hours.', slug: 'cable-chain-bracelet', view: 0 },
  { tab: 'Together', line: 'Matching pieces, made to be given.', slug: 'turquoise-choker-set', view: 0 },
]

/*
 * Pinned horizontal chapter: vertical scroll drives a sideways track of arch-framed pieces,
 * on a light background so the page changes mood after the dark 3D chapters.
 */
export default function HorizontalChapter() {
  const root = useRef(null)
  const track = useRef(null)
  const fill = useRef(null)
  const [active, setActive] = useState(0)
  const last = useRef(0)

  useScrollProgress(root, (p) => {
    const t = track.current
    if (!t) return
    const max = Math.max(0, t.scrollWidth - window.innerWidth)
    t.style.transform = `translate3d(${-p * max}px, 0, 0)`
    if (fill.current) fill.current.style.transform = `scaleX(${p})`
    const i = Math.min(MOMENTS.length - 1, Math.round(p * (MOMENTS.length - 1)))
    if (i !== last.current) { last.current = i; setActive(i) }
  })

  return (
    <section className="hz" ref={root} aria-labelledby="hz-title">
      <div className="hz__pin">
        <div className="hz__track" ref={track}>
          <div className="hz__intro">
            <p className="eyebrow">A day with AURAVÉ</p>
            <h2 id="hz-title">Wear it<br /><em>everywhere.</em></h2>
            <p>Five small moments, five pieces. Keep scrolling.</p>
          </div>
          {MOMENTS.map((m, i) => {
            const p = getProduct(m.slug)
            return (
              <article key={m.slug} className="hz__card">
                <p className="hz__no">0{i + 1} — {m.tab}</p>
                <Link to={`/product/${p.slug}`} className="hz__arch" aria-label={p.name}>
                  <ProductImage art={p.art} view={m.view} name={p.name} />
                </Link>
                <p className="hz__line">{m.line}</p>
              </article>
            )
          })}
          <div className="hz__outro">
            <h3>Find yours.</h3>
            <Link to="/collection" className="link-arrow">Explore the collection</Link>
          </div>
        </div>

        <div className="hz__tabs" aria-hidden="true">
          {MOMENTS.map((m, i) => <span key={m.tab} className={i === active ? 'is-active' : ''}>0{i + 1} {m.tab}</span>)}
          <i><b ref={fill} /></i>
        </div>
      </div>
    </section>
  )
}
