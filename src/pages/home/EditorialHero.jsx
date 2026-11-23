import { useRef } from 'react'
import { Link } from 'react-router-dom'
import './EditorialHero.css'

export default function EditorialHero({ onExplore }) {
  const art = useRef(null)
  const move = (event) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const box = event.currentTarget.getBoundingClientRect()
    art.current?.style.setProperty('--rx', `${((event.clientY - box.top) / box.height - .5) * -4}deg`)
    art.current?.style.setProperty('--ry', `${((event.clientX - box.left) / box.width - .5) * 5}deg`)
  }
  const reset = () => { art.current?.style.setProperty('--rx', '0deg'); art.current?.style.setProperty('--ry', '0deg') }
  return (
    <section className="eh" aria-labelledby="hero-title">
      <div className="eh__copy">
        <p className="eh__eyebrow"><span /> THE ART OF EVERYDAY JEWELLERY</p>
        <h1 id="hero-title">Jewellery<br />that tells<br /><em>your story.</em></h1>
        <p className="eh__description">Some things are more than beautiful.<br />They become a part of you.</p>
        <div className="eh__actions">
          <Link className="eh__shop" to="/collection">Explore the collection <span aria-hidden="true">↗</span></Link>
          <Link className="eh__story" to="/#story">Our story <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="eh__footer"><span className="eh__star" aria-hidden="true">✳</span><p>Little details.<br /><strong>Lasting impressions.</strong></p><span className="eh__edition">THE AURAVÉ EDIT<br />01 / EVERYDAY MUSE</span></div>
      </div>
      <div className="eh__visual" onPointerMove={move} onPointerLeave={reset}>
        <div className="eh__photo" ref={art}>
          <img src="/images/campaign/ivory-muse.webp" alt="Silver pendant with a champagne-coloured stone draped over ivory travertine and silk" fetchPriority="high" />
          <div className="eh__photo-caption"><span>A STUDY IN LIGHT</span><span>THE SIGNATURE EDIT</span></div>
        </div>
        <div className="eh__seal" aria-hidden="true"><span>AURAVÉ</span><b>✧</b><span>EVERYDAY MUSE</span></div>
        <div className="eh__detail"><span className="eh__detail-line" /><p>Soft light. Silver lines.<br /><em>A little everyday extraordinary.</em></p></div>
        {onExplore && <button className="eh__explore" onClick={onExplore}>Explore the 3D atelier <span aria-hidden="true">↗</span></button>}
      </div>
    </section>
  )
}
